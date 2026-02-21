"use client";

import { useState, useEffect } from "react";
import FilterSection from "@/app/components/products/filtreSection";
import CategorySeparator from "@/app/components/product/category";
import FiltreList from "@/app/components/products/filtreList";

export default function Agriculture() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/inventoryDefault?category=agriculture");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto px-6">
      {/* Header categorie */}
      <div className="text-left mt-2 mb-6 px-6 md:px-0">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight">
          Agriculture Equipment
        </h1>
        <p className="mt-2 text-lg md:text-xl text-[#555] leading-relaxed">
          Discover our extensive selection of agriculture equipment, including tractors, attachments, and machinery designed specifically to enhance productivity, efficiency, and reliability on your farm. Everything you need to cultivate, harvest, and manage your fields with confidence.
        </p>
      </div>

      <FilterSection products={products} category="agriculture" />
      <CategorySeparator category="agriculture" />
      <FiltreList products={products} />
    </div>
  );
}