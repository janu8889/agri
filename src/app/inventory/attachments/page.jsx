"use client";

import { useState, useEffect } from "react";
import FilterSection from "@/app/components/products/filtreSection";
import CategorySeparator from "@/app/components/product/category";
import FiltreList from "@/app/components/products/filtreList";

const LIMIT = 6;

export default function Attachments() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "attachments",
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
      {/* Header categorie cu descriere */}
      <div className="text-left mt-2 mb-6 px-6 md:px-0">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight">
          Attachments & Implements
        </h1>
        <p className="mt-2 text-lg md:text-xl text-[#555] leading-relaxed">
          Explore our high-quality tractor and machinery attachments, including buckets, plows, harrows, and other implements designed for agriculture and construction. Enhance the versatility, efficiency, and performance of your equipment with our premium selection of attachments to tackle any task with confidence.
        </p>
      </div>

     <FilterSection
        defaultCategory="attachments"
        onFilter={handleFilter}
      />

      <CategorySeparator category="attachments" />

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