"use client";

import { useState, useEffect } from "react";
import FilterSection from "@/app/components/products/filtreSection";
import CategorySeparator from "@/app/components/product/category";
import FiltreList from "@/app/components/products/filtreList";

const LIMIT = 6;

export default function Agriculture() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "agriculture",
  });
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProducts(filters, 0, true);
  }, []);

  const fetchProducts = async (activeFilters, currentSkip, reset = false) => {
    try {
      const params = new URLSearchParams({
        ...activeFilters,
        limit: LIMIT,
        skip: currentSkip,
      });

      const res = await fetch(`/api/products/filter?${params.toString()}`);
      const data = await res.json();
      const received = data.products || [];

      if (reset) {
        setProducts(received);
      } else {
        setProducts((prev) => [...prev, ...received]);
      }

      setSkip(currentSkip + received.length);
      setHasMore(received.length === LIMIT);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilter = async (newFilters) => {
    setFilters(newFilters);
    setSkip(0);
    setHasMore(true);
    await fetchProducts(newFilters, 0, true);
  };

  const handleLoadMore = async () => {
    if (!hasMore) return;
    await fetchProducts(filters, skip, false);
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-6">
      <div className="text-left mt-2 mb-6 px-6 md:px-0">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight">
          Agriculture Equipment
        </h1>
        <p className="mt-2 text-lg md:text-xl text-[#555] leading-relaxed">
          Discover our extensive selection of agriculture equipment, including tractors, attachments, and machinery designed specifically to enhance productivity, efficiency, and reliability on your farm. Everything you need to cultivate, harvest, and manage your fields with confidence.
        </p>
      </div>

      <FilterSection
        defaultCategory="agriculture"
        onFilter={handleFilter}
      />

      <CategorySeparator category="agriculture" />

      <FiltreList products={products} />

      {hasMore && (
        <div className="text-center my-8">
          <button
            onClick={handleLoadMore}
            className="bg-[#c9a227] text-black font-bold px-6 py-3 rounded hover:opacity-90 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}