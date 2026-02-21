"use client";

import { useState, useEffect } from "react";
import Carousel from "./components/homepage/carousel";
import Inventory from "./components/homepage/inventory";
import ProductsSection from "./components/homepage/products";
import Info from "./components/homepage/info";

export default function Home() {
  const [products, setProducts] = useState([]);
  const images = ["/imgs/1.jpg", "/imgs/2.jpg", "/imgs/3.jpg", "/imgs/4.jpg"];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/random");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <Carousel images={images} />
      <Inventory />
      <ProductsSection products={products} />
      <Info />
    </div>
  );
}