"use client";

import CommonProductCard from "@/components/common/CommonProductCard.jsx";
import { getProductsByCategory } from "@/services/products.api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function page({}) {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getProductsByCategory(slug);
      setProducts(fetchedProducts || []);
      setLoading(false);
    } catch (error) {
      console.log("Error while fetching products by category", error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProductsByCategory();
    }
  }, [slug]);

  return (
    <div>
      <h1>All Products</h1>
      <div className="ml-5">
        {loading ? (
          <div>Fetching Products....</div>
        ) : products.length ? (
          products.map((product) => (
            <CommonProductCard key={product._id} product={product} />
          ))
        ) : (
          <div>
            <h1>No products</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
