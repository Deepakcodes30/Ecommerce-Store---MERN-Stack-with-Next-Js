"use client";

import { useEffect, useState } from "react";
import CommonProductCard from "@/components/common/CommonProductCard.jsx";
import { getAllProducts, getProductsByCategory } from "@/services/products.api";

export default function Page() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);

  // UI states
  const [priceFilterOpen, setPriceFilterOpen] = useState(false);
  const [colorFilterOpen, setColorFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Get unique colors from products
  const availableColors = [
    ...new Set(
      allProducts.flatMap((product) =>
        product.variants?.map((v) => v.color).filter(Boolean)
      )
    ),
  ];

  // Fetch products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProducts();
        setAllProducts(fetchedProducts || []);
        setFilteredProducts(fetchedProducts || []);
      } catch (error) {
        console.log("Error while fetching products by category", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Apply filters and sorting whenever they change
  useEffect(() => {
    let result = [...allProducts];

    // Filter by stock
    if (inStockOnly) {
      result = result.filter((product) => product.stock > 0);
    }

    // Filter by price range
    if (minPrice) {
      result = result.filter(
        (product) => product.discountedPrice >= Number(minPrice)
      );
    }
    if (maxPrice) {
      result = result.filter(
        (product) => product.discountedPrice <= Number(maxPrice)
      );
    }

    // Filter by color
    if (selectedColors.length > 0) {
      result = result.filter((product) =>
        product.variants?.some((variant) =>
          selectedColors.includes(variant.color)
        )
      );
    }

    // Sort
    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "price_high":
        result.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "name_asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name_desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredProducts(result);
  }, [inStockOnly, minPrice, maxPrice, selectedColors, sortBy, allProducts]);

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setSelectedColors([]);
    setSortBy("newest");
  };

  return (
    <div className="m-10 flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline">
            Clear All
          </button>
        </div>

        <div className="space-y-4">
          {/* In Stock Filter */}
          <div className="py-3 border-t">
            <label className="flex items-center justify-between cursor-pointer">
              <span>In Stock Only</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4"
              />
            </label>
          </div>

          {/* Price Filter */}
          <div className="py-3 border-t">
            <button
              onClick={() => setPriceFilterOpen(!priceFilterOpen)}
              className="flex justify-between w-full items-center">
              <span className="font-medium">Price</span>
              <span>{priceFilterOpen ? "−" : "+"}</span>
            </button>

            {priceFilterOpen && (
              <div className="mt-3 space-y-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div className="py-3 border-t">
            <button
              onClick={() => setColorFilterOpen(!colorFilterOpen)}
              className="flex justify-between w-full items-center">
              <span className="font-medium">Color</span>
              <span>{colorFilterOpen ? "−" : "+"}</span>
            </button>

            {colorFilterOpen && (
              <div className="mt-3 space-y-2">
                {availableColors.length > 0 ? (
                  availableColors.map((color) => (
                    <label
                      key={color}
                      className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => handleColorToggle(color)}
                        className="w-4 h-4"
                      />
                      <span>{color}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No colors available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1">
        {/* Sort Dropdown */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 border px-4 py-2 rounded">
              <span className="font-medium">Sort by:</span>
              <span>
                {sortBy === "newest" && "Newest"}
                {sortBy === "price_low" && "Price: Low to High"}
                {sortBy === "price_high" && "Price: High to Low"}
                {sortBy === "name_asc" && "Name: A-Z"}
                {sortBy === "name_desc" && "Name: Z-A"}
              </span>
              <span>{sortOpen ? "▲" : "▼"}</span>
            </button>

            {sortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-10">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "price_low", label: "Price: Low to High" },
                  { value: "price_high", label: "Price: High to Low" },
                  { value: "name_asc", label: "Name: A-Z" },
                  { value: "name_desc", label: "Name: Z-A" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      sortBy === option.value ? "bg-gray-50 font-medium" : ""
                    }`}>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <CommonProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-gray-600 mb-4">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:underline">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
