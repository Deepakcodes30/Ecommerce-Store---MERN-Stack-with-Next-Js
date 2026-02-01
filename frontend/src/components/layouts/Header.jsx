"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { getActiveCategories } from "@/services/categories.api.js";
import { getProductsByCategory } from "@/services/products.api.js";
import { getCurrentUser, logoutUser } from "@/services/users.api.js";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [productsCache, setProductsCache] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getActiveCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Category fetch error:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser ?? null);
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    fetchUser();
  }, []);

  const handleCategoryHover = async (category) => {
    setActiveCategory(category);

    if (productsCache[category._id]) {
      setCategoryProducts(productsCache[category._id]);
      return;
    }

    setLoadingProducts(true);
    try {
      const products = await getProductsByCategory(category.slug);
      setCategoryProducts(products || []);
      setProductsCache((prev) => ({
        ...prev,
        [category._id]: products || [],
      }));
    } catch (err) {
      console.error("Products fetch error:", err);
      setCategoryProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setProfileOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <Link href="/" className="font-bold text-xl">
        Logo
      </Link>

      <ul className="flex gap-6 relative">
        <li>
          <Link href="/">Home</Link>
        </li>

        {categories.map((category) => (
          <li
            key={category.slug}
            className="relative"
            onMouseEnter={() => handleCategoryHover(category)}
            onMouseLeave={() => {
              setActiveCategory(null);
            }}>
            <Link
              href={`/products/${category.slug}`}
              className="cursor-pointer">
              {category.name}
            </Link>

            {activeCategory?._id === category._id && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white border shadow-lg rounded z-50">
                {loadingProducts ? (
                  <p className="p-4 text-sm">Loading...</p>
                ) : (
                  <>
                    <div className="px-4 py-2 border-b text-sm font-semibold">
                      <Link href={`/products/${category.slug}`}>
                        View all {category.name}
                      </Link>
                    </div>

                    {categoryProducts.length ? (
                      <ul className="max-h-64 overflow-y-auto">
                        {categoryProducts.map((product) => (
                          <li
                            key={product._id}
                            className="px-4 py-2 hover:bg-gray-100">
                            <Link href={`/product/${product.slug}`}>
                              {product.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-4 text-sm text-gray-500">
                        No products found
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </li>
        ))}

        <li>
          <Link href="/our-story">Our Story</Link>
        </li>
      </ul>

      <div className="relative flex items-center gap-4">
        <span className="cursor-pointer">Search</span>

        <button
          className="cursor-pointer"
          onClick={() => setProfileOpen((prev) => !prev)}>
          Profile
        </button>

        {profileOpen && authChecked && (
          <div className="absolute right-0 top-10 bg-white border shadow p-4 rounded z-50 min-w-[160px]">
            {user ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-500 truncate">
                  {user.fullName}
                </p>
                <hr />

                {user.isAdmin && (
                  <Link
                    className="cursor-pointer"
                    href="/admin"
                    onClick={() => setProfileOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  className="cursor-pointer"
                  href="/profile"
                  onClick={() => setProfileOpen(false)}>
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  className="cursor-pointer"
                  href="/login"
                  onClick={() => setProfileOpen(false)}>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="cursor-pointer"
                  onClick={() => setProfileOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

        <span className="cursor-pointer">Cart</span>
      </div>
    </header>
  );
}
