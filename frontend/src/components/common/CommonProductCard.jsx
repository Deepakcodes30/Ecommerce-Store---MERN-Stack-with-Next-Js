import React from "react";
import Link from "next/link";

function CommonProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 space-y-3 h-auto w-auto">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.title}
          className="h-auto w-auto object-contain rounded"
        />
      </Link>

      <div>
        <h3 className="font-semibold">{product.title}</h3>
        <div className="flex gap-0.5">
          <p>₹{product.discountedPrice}</p>
          <p className="line-through">₹{product.mrp}</p>
        </div>
      </div>
    </div>
  );
}

export default CommonProductCard;
