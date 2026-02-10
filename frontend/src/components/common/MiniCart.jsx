"use client";

import Link from "next/link";
import { removeCartItem } from "@/services/carts.api";

function MiniCart({ cart, onRefresh }) {
  if (!cart?.items?.length) {
    return <div className="p-4 text-sm text-gray-500">Your cart is empty</div>;
  }

  return (
    <div className="w-80">
      <ul className="max-h-72 overflow-y-auto divide-y">
        {cart.items.map((item) => (
          <li key={item._id} className="p-3 flex gap-3">
            <img
              src={item.product.images?.[0]?.url}
              className="w-14 h-16 object-cover rounded"
            />

            <div className="flex-1">
              <p className="text-sm font-medium">{item.product.title}</p>

              {item.variant && (
                <p className="text-xs text-gray-500">Color: {item.variant}</p>
              )}

              <div className="flex justify-between items-center mt-1">
                <span className="text-sm">Qty: {item.quantity}</span>

                <button
                  onClick={async () => {
                    await removeCartItem(item._id);
                    onRefresh();
                  }}
                  className="text-xs text-red-500">
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="p-3 border-t flex flex-col gap-2">
        <Link href="/cart" className="border text-center py-2 text-sm rounded">
          View Cart
        </Link>

        <Link
          href="/checkout"
          className="bg-black text-white text-center py-2 text-sm rounded">
          Checkout
        </Link>
      </div>
    </div>
  );
}

export default MiniCart;
