"use client";

import { useEffect, useState } from "react";
import { getProductBySlug } from "@/services/products.api";
import { addToCart } from "@/services/carts.api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState(null);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setPageLoading(true);
        const data = await getProductBySlug(slug);
        setProduct(data);
        setSelectedVariant(data?.variants?.[0] || null);
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setCartLoading(true);

      await addToCart({
        productId: product._id,
        quantity,
        variant: selectedVariant?.color || null,
      });
    } catch (err) {
      setError(err.message || "Failed to add product to cart");
    } finally {
      setCartLoading(false);
    }
  };

  if (pageLoading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return null;

  const maxStock = selectedVariant?.stock ?? product.stock;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image */}
      <div>
        <img
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.title}
          className="w-full h-[400px] object-cover rounded"
        />
      </div>

      {/* Info */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{product.title}</h1>

        <div className="flex items-center gap-3">
          <p className="text-xl font-medium">₹{product.discountedPrice}</p>
          <p className="text-sm line-through text-gray-500">₹{product.mrp}</p>
        </div>

        <p className="text-sm text-gray-600">
          Tax included.{" "}
          <Link href="/shipping-delivery-policy" className="underline">
            Shipping
          </Link>{" "}
          calculated at checkout.
        </p>

        {/* Variants */}
        {product.variants?.length > 0 && (
          <div>
            <p className="font-medium mb-1">Color</p>
            <div className="flex gap-2">
              {product.variants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setQuantity(1);
                  }}
                  className={`border px-3 py-1 rounded text-sm ${
                    selectedVariant?.color === variant.color
                      ? "border-black"
                      : "border-gray-300"
                  }`}>
                  {variant.color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <p className="font-medium mb-1">Quantity</p>
          <input
            type="number"
            min={1}
            max={maxStock}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.min(maxStock, Math.max(1, Number(e.target.value)))
              )
            }
            className="border px-3 py-1 w-20"
          />
          <p className="text-xs text-gray-500 mt-1">{maxStock} in stock</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={cartLoading || maxStock === 0}
            className="border px-6 py-2 rounded disabled:opacity-50">
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            onClick={() => router.push("/checkout")}
            className="bg-black text-white px-6 py-2 rounded">
            Buy it now
          </button>
        </div>

        <p className="text-sm text-gray-700">{product.description}</p>
      </div>
    </div>
  );
}
