"use client";

import CommonProductCard from "@/components/common/CommonProductCard";
import { getAllProducts } from "@/services/products.api";
import { useEffect, useState } from "react";

function page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const products = await getAllProducts();
      setProducts(products);
      setLoading(false);
    } catch (error) {
      console.log("Issue occurred while fetching product", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);
  return (
    <div>
      <h2>All Products</h2>
      <div className="grid grid-cols-3">
        {products.map((product) => (
          <CommonProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default page;
