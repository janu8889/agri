"use client";

import { useState, useEffect } from "react";

export default function Carousel({ images }) {
  const [current, setCurrent] = useState(0);

  const len = images?.length || 0;

  useEffect(() => {
    if (len === 0) return; // nu face nimic dacă nu există imagini

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % len);
    }, 4000);

    return () => clearInterval(interval);
  }, [len]);

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
    {images?.map((img, index) => (
      <div
        key={index}
        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
          index === current ? "opacity-100" : "opacity-0"
        }`}
      >
        <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        {/* Text */}
        <div className="absolute inset-0 flex items-end justify-start p-6 md:p-12">
          <div className="text-white max-w-md">
            <h1 className="text-2xl md:text-5xl font-extrabold leading-tight drop-shadow-xl">
              Premium Machinery for Agriculture & Construction
            </h1>
            <p className="mt-2 text-sm md:text-lg font-medium drop-shadow-lg">
              Reliable, high-performance equipment to empower your business
            </p>
          </div>
        </div>
      </div>
))}
    </div>
  );
}
