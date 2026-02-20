"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaClock, FaTimes, FaPlus } from "react-icons/fa";
import { TbEngine } from "react-icons/tb";
import Link from "next/link";

// ... păstrează restul importurilor și starea produselor

export default function ListsSection() {
  const initialProducts = [
    { name: "2022 BRANSON 5520CH", price: "USD $33,500", hours: 230, hp: 50, img: "/imgs/tractor1.jpeg", id: "123456" },
    { name: "2021 JOHN DEERE 4052R", price: "USD $29,800", hours: 180, hp: 55, img: "/imgs/tractor2.jpeg", id: "993456" },
    { name: "2020 KUBOTA L2501", price: "USD $27,500", hours: 200, hp: 80, img: "/imgs/tractor3.jpeg", id: "fg6867" },
    { name: "2022 NEW HOLLAND WORKMASTER", price: "USD $31,200", hours: 150, hp: 57, img: "/imgs/tractor4.jpeg", id: "778344" },
    { name: "2021 MASSEY FERGUSON 1735E", price: "USD $28,900", hours: 210, hp: 60, img: "/imgs/tractor5.jpeg", id: "00964" },
    { name: "2021 MASSEY FERGUSON 1735E", price: "USD $28,900", hours: 210, hp: 67, img: "/imgs/tractor5.jpeg", id: "12345" },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [sort, setSort] = useState("");
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

  const handleLoadMore = () => setProducts(prev => [...prev, ...initialProducts]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    let sorted = [...products];
    switch (e.target.value) {
      case "priceLow":
        sorted.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, "")));
        break;
      case "priceHigh":
        sorted.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, "")));
        break;
      case "hoursLow":
        sorted.sort((a, b) => a.hours - b.hours);
        break;
      case "hoursHigh":
        sorted.sort((a, b) => b.hours - a.hours);
        break;
      case "yearNew":
        sorted.sort((a, b) => parseInt(b.name.slice(0, 4)) - parseInt(a.name.slice(0, 4)));
        break;
      case "yearOld":
        sorted.sort((a, b) => parseInt(a.name.slice(0, 4)) - parseInt(b.name.slice(0, 4)));
        break;
      default:
        break;
    }
    setProducts(sorted);
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
          {products.map((prod, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col group">
              {/* TITLE & PRICE */}
              <div className="p-6 flex flex-col items-left text-left">
                <h3 className="font-semibold text-[#1a1a1a] text-[15px] leading-snug line-clamp-2">{prod.name}</h3>
                <div className="mt-1 text-[22px] font-bold text-[#c9a227]">{prod.price}</div>
              </div>
              {/* IMAGE */}
              <div className="relative h-56 w-full overflow-hidden">
                <img src={prod.img} alt={prod.name} className="object-cover w-full h-full transform group-hover:scale-105 transition duration-700 ease-out" />
              </div>
              {/* TECH INFO */}
              <div className="p-6 flex flex-col flex-grow items-center">
                <div className="flex justify-center items-center gap-5 text-[#555] text-[14px] font-medium mt-3">
                  <span className="flex items-center gap-2"><FaClock className="text-[#c9a227]" />{prod.hours} hrs</span>
                  <span className="h-4 w-px bg-gray-300"></span>
                  <span className="flex items-center gap-2">
                    <TbEngine className="text-[#c9a227]" />
                      {prod.hp} HP
                  </span>                  </div>
                {/* BUTTONS */}
                <div className="mt-8 flex flex-col gap-3 w-full">
                  <button onClick={() => { setSelectedProduct(prod); setModalOpen(true); }} className="cursor-pointer bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300 w-full">Get Shipping Quotes</button>
                  <Link href={`/products/${prod.id}`} className="border border-[#1a1a1a] text-[#1a1a1a] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 w-full"><FaSearch />View Details</Link>
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

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl"><FaTimes /></button>
            <h3 className="text-[22px] font-bold text-[#1a1a1a] mb-4">Shipping Quote Inquiry</h3>
            {selectedProduct && <p className="mb-4 text-[#555] font-medium">{selectedProduct.name}</p>}
            <form className="flex flex-col gap-4">
              <input type="text" placeholder="Name" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <input type="email" placeholder="Email" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <input type="text" placeholder="Cell Phone" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <button type="submit" className="cursor-pointer bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300">Send Inquiry</button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
