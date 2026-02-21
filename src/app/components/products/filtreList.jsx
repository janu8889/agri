"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaClock, FaTimes, FaPlus } from "react-icons/fa";
import { TbEngine } from "react-icons/tb";
import Link from "next/link";

export default function FiltreList({ products: initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [sort, setSort] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const modalRef = useRef(null);

  // actualizare produse dacă prop-ul se schimbă
  useEffect(() => {
    setProducts(initialProducts || []);
  }, [initialProducts]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    }
    if (modalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);

  // restul codului rămâne la fel: sortare, modal, load more etc.
  const handleSortChange = (e) => {
    setSort(e.target.value);
    let sorted = [...products];
    switch (e.target.value) {
      case "priceLow":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "hoursLow":
        sorted.sort((a, b) => a.hours - b.hours);
        break;
      case "hoursHigh":
        sorted.sort((a, b) => b.hours - a.hours);
        break;
      case "yearNew":
        sorted.sort((a, b) => b.year - a.year);
        break;
      case "yearOld":
        sorted.sort((a, b) => a.year - b.year);
        break;
      default:
        break;
    }
    setProducts(sorted);
  };

  const handleLoadMore = () => {
    setProducts(prev => [...prev, ...(initialProducts || [])]);
  };

  return (
    <section className="bg-[#f3f4f6] py-16">
      <div className="max-w-screen-2xl mx-auto px-6">

        {/* SORT BY */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex-1">
            <label className="block font-semibold text-[#1a1a1a] mb-2">Sort By</label>
            <select
              value={sort}
              onChange={handleSortChange}
              className="border border-gray-300 rounded px-4 py-2 w-full sm:w-60 focus:ring-2 focus:ring-[#c9a227]"
            >
              <option value="">Default</option>
              <option value="priceLow">Lowest Price</option>
              <option value="priceHigh">Highest Price</option>
              <option value="hoursLow">Lowest Hours</option>
              <option value="hoursHigh">Highest Hours</option>
              <option value="yearNew">Newest Year</option>
              <option value="yearOld">Oldest Year</option>
            </select>
          </div>
        </div>

        {/* GRID PRODUSE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((prod) => (
            <div key={prod._id || prod.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col group">
              {/* TITLE & PRICE */}
              <div className="p-6 flex flex-col items-left text-left">
                <h3 className="font-semibold text-[#1a1a1a] text-[15px] leading-snug line-clamp-2">{prod.name}</h3>
                <div className="mt-1 text-[22px] font-bold text-[#c9a227]">USD ${prod.price.toLocaleString()}</div>
              </div>
              {/* IMAGE */}
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={prod.imgs?.[0] || prod.img || "/imgs/default.jpeg"}
                  alt={prod.name}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition duration-700 ease-out"
                />
              </div>
              {/* TECH INFO */}
              <div className="p-6 flex flex-col flex-grow items-center">
                <div className="flex justify-center items-center gap-5 text-[#555] text-[14px] font-medium mt-3">
                  <span className="flex items-center gap-2"><FaClock className="text-[#c9a227]" />{prod.hours} hrs</span>
                  <span className="h-4 w-px bg-gray-300"></span>
                  <span className="flex items-center gap-2"><TbEngine className="text-[#c9a227]" />{prod.engineHorsepower || prod.hp} HP</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MORE BUTTON */}
        <div className="flex justify-center mt-10">
          <button onClick={handleLoadMore} className="flex cursor-pointer items-center gap-2 bg-[#c9a227] text-black font-bold px-6 py-3 rounded hover:opacity-90 transition">
            <FaPlus /> More
          </button>
        </div>

      </div>
    </section>
  );
}