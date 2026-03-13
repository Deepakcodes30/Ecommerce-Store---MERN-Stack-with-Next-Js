"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "@/services/products.api";

export default function page() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductBySlug(slug).then(setProduct);
  }, [id]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("stock", product.stock);

    await updateProduct(id, formData);
    alert("Product updated");
  };

  const handleDelete = async () => {
    await deleteProduct(id);
    router.push("/admin/products");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <input
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        className="border p-2 w-full"
      />

      <input
        type="number"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        className="border p-2 w-full"
      />

      <input
        type="number"
        value={product.stock}
        onChange={(e) => setProduct({ ...product, stock: e.target.value })}
        className="border p-2 w-full"
      />

      <div className="flex gap-3">
        <button
          onClick={handleUpdate}
          className="bg-black text-white px-4 py-2">
          Save
        </button>

        <button onClick={handleDelete} className="text-red-600">
          Delete
        </button>
      </div>
    </div>
  );
}
