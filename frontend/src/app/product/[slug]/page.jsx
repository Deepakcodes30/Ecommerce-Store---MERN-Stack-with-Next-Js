"use client";

import { useEffect, useState } from "react";
import { getProductBySlug } from "@/services/products.api";
import { addToCart } from "@/services/carts.api";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Left - Product Image */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images?.[0]?.url || "/placeholder.png"}
              alt={product.title}
              className="w-full h-[550px] object-cover"
            />
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="space-y-5">
          <h1 className="text-3xl font-semibold tracking-tight">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-center gap-4 ">
            <p className="text-2xl font-semibold text-berce-orange">
              Rs. {product.discountedPrice}
            </p>
            <p className="text-lg text-gray-400 line-through">
              Rs. {product.mrp}
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Tax included.
            <Link href="/shipping-delivery-policy" className="underline">
              Shipping
            </Link>
            calculated at checkout.
          </p>

          {/* Variant Selector */}
          {product.variants?.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3 uppercase tracking-wide">
                Color: {selectedVariant?.color}
              </p>
              <div className="flex gap-3 flex-wrap">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm border transition cursor-pointer ${
                      selectedVariant?.color === variant.color
                        ? "bg-black text-white border-black"
                        : "border-gray-300 hover:border-black"
                    }`}>
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <p className="text-sm font-medium mb-3 uppercase tracking-wide">
              Quantity
            </p>
            <div className="flex items-center border rounded-2xl w-fit">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 cursor-pointer">
                –
              </button>
              <span className="px-6">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(maxStock, prev + 1))
                }
                className="px-4 py-2 cursor-pointer">
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">{maxStock} in stock</p>
          </div>

          {/* Add to Cart */}
          <div className="space-y-3 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={cartLoading || maxStock === 0}
              className="w-full bg-berce-ivory text-berce-black py-3 cursor-pointer rounded-md font-medium transition hover:opacity-90 disabled:opacity-50">
              {cartLoading ? "Adding..." : "Add to Cart"}
            </button>

            <button
              onClick={() => router.push("/checkout")}
              className="bg-berce-black text-berce-white w-full border border-black py-3 cursor-pointer rounded-md font-medium hover:bg-berce-white hover:text-berce-black transition">
              Buy it now
            </button>
          </div>

          {/* Description */}
          <div className="pt-6 border-t text-sm leading-relaxed text-gray-700">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
}
