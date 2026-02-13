import React from "react";
import Link from "next/link";
import Image from "next/image";

function CommonProductCard({ product }) {
  return (
    <div className="p-4 space-y-3 h-auto w-auto hover:shadow-xl transition-all rounded-2xl">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={product.images?.[0]?.url}
          alt={product.title}
          height={300}
          width={300}
        />
      </Link>

      <div className="text-center">
        <h3 className="font-semibold text-xl">{product.title}</h3>
        <div className="flex gap-3 justify-center">
          <p className="text-berce-orange text-lg">
            Rs. {product.discountedPrice}
          </p>
          <p className="line-through decoration-red-500 decoration-2 text-md">
            Rs. {product.mrp}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CommonProductCard;
