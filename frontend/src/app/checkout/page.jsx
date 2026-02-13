"use client";

import { useEffect, useState } from "react";
import { getCart, clearCart } from "@/services/carts.api";
import { createOrder } from "@/services/orders.api";
import { useRouter } from "next/navigation";

export const metadata = {
  title: "Checkout",
};

export default function Page() {
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // 🔹 Fetch cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔹 Place order
  const handlePlaceOrder = async () => {
    if (!cart?.items?.length) return alert("Cart is empty");

    try {
      setPlacingOrder(true);

      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
      }));

      const order = await createOrder({
        orderItems,
        shippingAddress,
        paymentMethod,
      });

      await clearCart();

      router.push(`/orders/${order._id}`);
    } catch (error) {
      console.error("Error placing order", error);
      alert(error.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div>Loading checkout...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT — Shipping */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shipping Address</h2>

        {Object.keys(shippingAddress).map((field) => (
          <input
            key={field}
            placeholder={field}
            value={shippingAddress[field]}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                [field]: e.target.value,
              })
            }
            className="w-full border p-2 rounded"
          />
        ))}

        <div>
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 rounded w-full">
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment</option>
          </select>
        </div>
      </div>

      {/* RIGHT — Order Summary */}
      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-semibold">Order Summary</h2>

        {cart?.items?.map((item) => (
          <div key={item._id} className="flex justify-between text-sm">
            <span>
              {item.product.title} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <hr />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{cart?.totalPrice}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90">
          {placingOrder ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
