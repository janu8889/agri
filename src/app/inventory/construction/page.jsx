"use client";

import { useState, useEffect } from "react";
import FilterSection from "@/app/components/products/filtreSection";
import CategorySeparator from "@/app/components/product/category";
import FiltreList from "@/app/components/products/filtreList";

const LIMIT = 6;

export default function Construction() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: "construction",
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
    <div className="max-w-screen-2xl mx-auto">
      <div className="text-left mt-2 mb-6 px-6 md:px-0">
        {/* ---------------- Decorative Header / Border for About Us ---------------- */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
        {/* Background Image */}
        <img
          src="/imgs/2.jpg"
          alt="Decorative border"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Darker Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/30 to-[#f5f5f5]/50"></div>

        {/* Optional: Text or Page Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
            Construction Equipment

          </h1>
        </div>

        {/* Decorative cut at bottom (triangle effect) */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-6 md:h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 V60 Q600,120 1200,60 V0 H0 Z"
              fill="#f5f5f5" // culoarea fundalului paginii / footer
            />
          </svg>
        </div>
      </div>

        <p className="mt-2 text-lg md:text-xl text-[#555] leading-relaxed">
          Browse our premium selection of construction machinery and attachments, including excavators, loaders, backhoes, and other heavy equipment. Built for durability, efficiency, and performance, our construction equipment helps you tackle any project with confidence and precision.
        </p>
      </div>

      <FilterSection
        defaultCategory="construction"
        onFilter={handleFilter}
      />

      <CategorySeparator category="construction" />

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