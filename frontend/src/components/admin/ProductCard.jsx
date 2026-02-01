"use client";

import { useState } from "react";
import Link from "next/link";
import {
  updateProductStock,
  toggleProductStatus,
} from "@/services/products.api.js";

export default function ProductCard({ product, onRefresh }) {
  const [stock, setStock] = useState(product.stock);
  const [loading, setLoading] = useState(false);

  const handleStockUpdate = async () => {
    try {
      setLoading(true);
      await updateProductStock(product._id, Number(stock));
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    await toggleProductStatus(product._id);
    onRefresh();
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <Link href={`/admin/products/${product._id}`}>
        <img
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.title}
          className="h-auto w-full object-fit rounded"
        />
      </Link>

      <div>
        <h3 className="font-semibold">{product.title}</h3>
        <p>discounted price: ₹{product.discountedPrice}</p>
        <p>mrp: ₹{product.mrp}</p>
        <p className="text-sm">
          Status:{" "}
          <span
            className={product.isActive ? "text-green-600" : "text-red-500"}>
            {product.isActive ? "Active" : "Inactive"}
          </span>
        </p>
      </div>

      {/* Stock Update */}
      <div className="flex gap-2">
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border px-2 py-1 w-20"
        />
        <button
          onClick={handleStockUpdate}
          disabled={loading}
          className="border px-3 py-1">
          Update
        </button>
      </div>

      <button onClick={handleToggleStatus} className="text-sm underline">
        Toggle Status
      </button>
    </div>
  );
}
