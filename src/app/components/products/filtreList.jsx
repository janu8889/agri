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
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 px-4 pt-28 overflow-y-auto">
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl"
            >
              <FaTimes />
            </button>

            <h3 className="text-[22px] font-bold text-[#1a1a1a] mb-2">
              Shipping Quote Inquiry
            </h3>

            {selectedProduct && (
              <p className="mb-4 text-[#555] font-medium">{selectedProduct.name}</p>
            )}

            <form className="flex flex-col gap-4">
              <p className="text-xs text-gray-500 mb-2">
                All fields marked with an (*) are required.
              </p>

              <input
                type="text"
                placeholder="Name *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="email"
                placeholder="Email *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="text"
                placeholder="Cell Phone *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]">
                <option value="">Preferred Time to Be Contacted</option>
                <option>Morning (8AM - 12PM)</option>
                <option>Afternoon (12PM - 5PM)</option>
                <option>Evening (5PM - 8PM)</option>
              </select>

              <input
                type="text"
                placeholder="Address *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="text"
                placeholder="City *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="text"
                placeholder="State *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="text"
                placeholder="Zip Code *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <textarea
                rows={4}
                placeholder="Message"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227] resize-none"
              />

              <button
                type="submit"
                className="cursor-pointer bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}