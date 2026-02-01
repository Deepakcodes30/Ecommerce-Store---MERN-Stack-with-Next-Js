"use client";

import { useEffect, useState } from "react";
import { createProduct } from "@/services/products.api";
import { getActiveCategories } from "@/services/categories.api";
import { useRouter } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    mrp: "",
    discountedPrice: "",
    stock: "",
    sku: "",
    category: "",
    tags: "",
  });

  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getActiveCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  const addVariant = () => {
    setVariants([...variants, { color: "", stock: "" }]);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (form.tags) {
        formData.append("tags", JSON.stringify(form.tags.split(",")));
      }

      if (variants.length) {
        variants.forEach((variant, index) => {
          formData.append(`variants[${index}][color]`, variant.color);
          formData.append(`variants[${index}][stock]`, variant.stock);
        });
      }

      images.forEach((img) => {
        formData.append("images", img);
      });

      await createProduct(formData);
      alert("Product created successfully");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <input name="slug" placeholder="Slug" onChange={handleChange} />
        <input name="sku" placeholder="SKU" onChange={handleChange} required />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="discountedPrice"
            placeholder="Discounted Price"
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="border p-2 rounded">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <input
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={handleChange}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImages}
          required
        />

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Variants</h3>
            <button
              type="button"
              onClick={addVariant}
              className="text-blue-600">
              + Add Variant
            </button>
          </div>

          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                placeholder="Color"
                value={v.color}
                onChange={(e) => updateVariant(i, "color", e.target.value)}
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) => updateVariant(i, "stock", e.target.value)}
              />
              <button type="button" onClick={() => removeVariant(i)}>
                X
              </button>
            </div>
          ))}
        </div>

        <button
          disabled={loading}
          onClick={() => router.push("/admin/products/all-products")}
          className="bg-black text-white px-6 py-2 rounded">
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
