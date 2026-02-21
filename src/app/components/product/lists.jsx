"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaClock, FaTimes } from "react-icons/fa";
import { TbEngine } from "react-icons/tb";
import Link from "next/link";

export default function ProductsSection({ products }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    }
    if (modalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);

  if (!products.length)
    return <p className="text-center py-16">Loading products...</p>;

  return (
    <section className="bg-[#f3f4f6] py-16">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-[30px] md:text-[34px] font-bold text-[#1a1a1a] mb-12 text-left">
          These listings may also fit your interest
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((prod, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col group"
            >
              {/* TITLE & PRICE */}
              <div className="p-6 flex flex-col items-left text-left">
                <h3 className="font-semibold text-[#1a1a1a] text-[15px] leading-snug line-clamp-2">
                  {prod.name}
                </h3>
                <div className="mt-1 text-[22px] font-bold text-[#c9a227]">
                  USD ${prod.price.toLocaleString()}
                </div>
              </div>

              {/* IMAGE */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={prod.imgs[0] || "/imgs/placeholder.png"}
                  alt={prod.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition duration-700 ease-out"
                />
              </div>

              {/* TECH INFO */}
              <div className="p-6 flex flex-col flex-grow items-center">
                <div className="flex justify-center items-center gap-5 text-[#555] text-[14px] font-medium mt-3">
                  <span className="flex items-center gap-2">
                    <FaClock className="text-[#c9a227]" /> {prod.hours} hrs
                  </span>
                  <span className="h-4 w-px bg-gray-300"></span>
                  <span className="flex items-center gap-2">
                    <TbEngine className="text-[#c9a227]" /> {prod.engineHorsepower} HP
                  </span>
                </div>

                <div className="mt-8 flex flex-col gap-3 w-full">
                  <button
                    onClick={() => {
                      setSelectedProduct(prod);
                      setModalOpen(true);
                    }}
                    className="cursor-pointer bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300 w-full"
                  >
                    Get Shipping Quotes
                  </button>
                  <Link
                    href={`/products/${prod._id}`}
                    className="border border-[#1a1a1a] text-[#1a1a1a] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 w-full"
                  >
                    <FaSearch /> View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {/* ...păstrează modalul ca înainte */}
    </section>
  );
}