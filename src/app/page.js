"use client"; 

import Carousel from "./components/homepage/carousel";
import Inventory from "./components/homepage/inventory";
import ProductsSection from "./components/homepage/products";
import Info from "./components/homepage/info";

export default function Home() {
   const images = [
    "/imgs/1.jpg",
    "/imgs/2.jpg",
    "/imgs/3.jpg",
    "/imgs/4.jpg",
  ];

  return (
    <div>
      <Carousel images={images} />
      <Inventory />
      <ProductsSection />
      <Info />
    </div>
  );
}
