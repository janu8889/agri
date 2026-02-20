"use client";

import { useState, useRef, useEffect } from "react";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import CategorySeparator from "@/app/components/product/category";
import ListsSection from "@/app/components/product/lists";



// === Obiect de test ===
const product = { 
  name: "2022 BRANSON 5520CH", 
  category: "agri",
  price: "USD $33,500", 
  year: 2022,
  manufacturer: "BRANSON",
  model: "5520CH",
  condition: "Used",
  hours: 230, 
  description: 'For sale is a 2006 Caterpillar 314C excavator with 2,725 hours. It features an enclosed cab with air conditioning, auxiliary hydraulics, a hydraulic thumb, backfill blade, and a hydraulic quick attach system. The machine runs on steel tracks and has a ROPS safety structure. This excavator is in good working condition and ready for heavy-duty construction or excavation work.',
  loader: "Yes",
  backhoe: "",
  cab: "Yes",
  engineHorsepower: "55 HP",
  drive: "4WD",
  transmissionType: "Hydro",
  stockNumber: "5346d",
  imgs: [
    "/imgs/tractor1.jpeg", 
    "/imgs/tractor2.jpeg", 
    "/imgs/tractor3.jpeg", 
    "/imgs/tractor4.jpeg", 
    "/imgs/tractor5.jpeg"
  ], 
  id:"123456" 
};

export default function ProductDetails({ params }) {
  const [mainImg, setMainImg] = useState(product.imgs[0]);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const inquiryRef = useRef();

  const currentIndex = product.imgs.indexOf(mainImg);

  // Pentru galerie
  const nextImage = () => {
    const nextIdx = (currentIndex + 1) % product.imgs.length;
    setMainImg(product.imgs[nextIdx]);
  };
  const prevImage = () => {
    if (currentIndex === 0) return;
    setMainImg(product.imgs[currentIndex - 1]);
  };

  // Inchidere inquiry modal la click in afara
  useEffect(() => {
    function handleClickOutside(e) {
      if (inquiryRef.current && !inquiryRef.current.contains(e.target)) {
        setInquiryModalOpen(false);
      }
    }
    if (inquiryModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inquiryModalOpen]);

  return (
    <>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ---------------- IMAGES LEFT ---------------- */}
        <div className="flex flex-col gap-3">
          {/* Main Image */}
          <div className="relative w-full lg:w-[500px] h-[400px] cursor-pointer overflow-hidden rounded-xl shadow-lg">
            <img
              src={mainImg}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onClick={() => setGalleryModalOpen(true)}
            />

            {/* Arrows */}
            {currentIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute top-1/2 -translate-y-1/2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
              >
                <FaArrowLeft />
              </button>
            )}
            {currentIndex < product.imgs.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute top-1/2 -translate-y-1/2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
              >
                <FaArrowRight />
              </button>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-2">
            {product.imgs.map((img, idx) => (
              <div
                key={idx}
                className={`w-20 h-20 cursor-pointer rounded overflow-hidden border-2 ${
                  mainImg === img ? "border-[#c9a227] shadow-md" : "border-transparent"
                } transition-all duration-300`}
                onClick={() => setMainImg(img)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

{/* ---------------- INFO RIGHT PREMIUM CLEAN ---------------- */}
<div className="flex-1 flex flex-col gap-6">

  {/* Name */}
  <div>
    <h1 className="text-4xl font-extrabold text-[#1a1a1a] leading-tight">
      {product.name}
    </h1>
  </div>

  {/* Price */}
  <p className="text-3xl font-bold text-[#c9a227]">
    {product.price}
  </p>

  {/* Send Inquiry Button */}
  <button
    onClick={() => setInquiryModalOpen(true)}
    className="cursor-pointer bg-[#1a1a1a] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#c9a227] hover:text-black transition-transform duration-200 hover:scale-105 w-full lg:w-auto px-8"
  >
    Send Inquiry
  </button>

  {/* Product Details Card */}
  <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-[#444]">

    {product.year && (
      <div>
        <div className="font-semibold text-[#1a1a1a]">Year</div>
        <div>{product.year}</div>
      </div>
    )}

    {product.manufacturer && (
      <div>
        <div className="font-semibold text-[#1a1a1a]">Manufacturer</div>
        <div>{product.manufacturer}</div>
      </div>
    )}

    {product.model && (
      <div>
        <div className="font-semibold text-[#1a1a1a]">Model</div>
        <div>{product.model}</div>
      </div>
    )}

    {product.condition && (
      <div>
        <div className="font-semibold text-[#1a1a1a]">Condition</div>
        <div>{product.condition}</div>
      </div>
    )}

    {product.hours && (
      <div>
        <div className="font-semibold text-[#1a1a1a]">Hours</div>
        <div>{product.hours} hrs</div>
      </div>
    )}

    {product.engineHorsepower && (
      <div>
        <div className="font-semibold text-[#1a1a1a]">Engine HP</div>
        <div>{product.engineHorsepower}</div>
      </div>
    )}

    {product.drive && (
      <div>
        <div className="font-semibold text-[#1a1a1a]">Drive</div>
        <div>{product.drive}</div>
      </div>
    )}

    {product.transmissionType && (
      <div>
        <div className="font-semibold text-[#1a1a1a]">Transmission</div>
        <div>{product.transmissionType}</div>
      </div>
    )}

    <div className="col-span-2 border-t border-gray-200 mt-2 mb-2"></div>

    {product.description && (
      <div className="col-span-2 mt-2">
        <span className="font-semibold text-[#1a1a1a]">Description:</span>
        <p className="mt-1 text-[#555] leading-relaxed">
          {product.description}
        </p>
      </div>
    )}

  </div>

  {/* 🔥 STOCK OUTSIDE CARD */}
  {product.stockNumber && (
    <div className="text-xs text-gray-400 tracking-widest uppercase mt-2">
      Reference #{product.stockNumber}
    </div>
  )}

</div>


      </div>

      {/* ---------------- GALLERY MODAL ---------------- */}
      {galleryModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setGalleryModalOpen(false)}
        >
          <div
            className="relative max-w-4xl w-full scale-95 transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGalleryModalOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl p-2 hover:text-[#c9a227]"
            >
              <FaTimes />
            </button>
            <img
              src={mainImg}
              alt="Product Large"
              className="w-full h-auto rounded shadow-lg"
            />
            {currentIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute top-1/2 -translate-y-1/2 left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"
              >
                <FaArrowLeft />
              </button>
            )}
            {currentIndex < product.imgs.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute top-1/2 -translate-y-1/2 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"
              >
                <FaArrowRight />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ---------------- INQUIRY MODAL ---------------- */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div ref={inquiryRef} className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl font-bold"
            >
              <FaTimes />
            </button>

            <h3 className="text-[20px] font-bold text-[#1a1a1a] mb-4">Send Inquiry</h3>

            <p className="mb-4 text-[#555] font-medium">{product.name}</p>

          <form className="flex flex-col gap-4">

            <p className="text-xs text-gray-500 mb-2">
              All fields marked with an (*) are required.
            </p>

            <input
              type="text"
              placeholder="Name"
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

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            >
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
              rows="4"
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
    </div>
    <CategorySeparator category={product.category}/>
    
    <ListsSection />
    </>
  );
}
