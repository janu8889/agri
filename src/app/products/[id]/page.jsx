"use client";

import { useState, useEffect, useRef } from "react";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import CategorySeparator from "@/app/components/product/category";
import ListsSection from "@/app/components/product/lists";
import { useParams } from "next/navigation";

export default function ProductDetailsClient() {
  const params = useParams();
  const id = params.id; // id-ul produsului din URL

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const inquiryRef = useRef();

  // === Fetch produsul curent ===
  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}/single`);

        if (!res.ok) {
          console.error("Product not found");
          return;
        }
        const data = await res.json();
        setProduct(data);
        setMainImg(data.imgs?.[0] || "/imgs/placeholder.png");
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }

    fetchProduct();
  }, [id]);

  // === Fetch produse random pentru lista de sugestii ===
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/random");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Failed to fetch random products:", err);
      }
    }

    fetchProducts();
  }, []);

  // === Close inquiry modal la click în afara ===
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

  if (!product) return <p className="text-center py-16">Loading product...</p>;

  const currentIndex = product.imgs.indexOf(mainImg);
  const nextImage = () => setMainImg(product.imgs[(currentIndex + 1) % product.imgs.length]);
  const prevImage = () => currentIndex > 0 && setMainImg(product.imgs[currentIndex - 1]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* IMAGES LEFT */}
          <div className="flex flex-col gap-3">
            <div className="relative w-full lg:w-[500px] h-[400px] cursor-pointer overflow-hidden rounded-xl shadow-lg">
              <img
                src={mainImg}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                onClick={() => setGalleryModalOpen(true)}
              />
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
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* INFO RIGHT */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold text-[#1a1a1a] leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-[#c9a227]">USD ${product.price.toLocaleString()}</p>
            <button
              onClick={() => setInquiryModalOpen(true)}
              className="bg-[#1a1a1a] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#c9a227] hover:text-black transition-transform duration-200 hover:scale-105 w-full lg:w-auto px-8"
            >
              Send Inquiry
            </button>

            <div className="bg-white p-6 rounded-2xl shadow-lg mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-[#444]">
              {product.year && <div><div className="font-semibold">Year</div>{product.year}</div>}
              {product.manufacturer && <div><div className="font-semibold">Manufacturer</div>{product.manufacturer}</div>}
              {product.model && <div><div className="font-semibold">Model</div>{product.model}</div>}
              {product.condition && <div><div className="font-semibold">Condition</div>{product.condition}</div>}
              {product.hours && <div><div className="font-semibold">Hours</div>{product.hours} hrs</div>}
              {product.engineHorsepower && <div><div className="font-semibold">Engine HP</div>{product.engineHorsepower}</div>}
              {product.drive && <div><div className="font-semibold">Drive</div>{product.drive}</div>}
              {product.transmissionType && <div><div className="font-semibold">Transmission</div>{product.transmissionType}</div>}
              {product.description && <div className="col-span-2 mt-2"><span className="font-semibold">Description:</span><p className="mt-1 text-[#555]">{product.description}</p></div>}
            </div>

            {product.stockNumber && (
              <div className="text-xs text-gray-400 tracking-widest uppercase mt-2">Reference #{product.stockNumber}</div>
            )}
          </div>
        </div>
      </div>

      {/* GALLERY MODAL */}
      {galleryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={() => setGalleryModalOpen(false)}>
          <div className="relative max-w-4xl w-full scale-95" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setGalleryModalOpen(false)} className="absolute top-2 right-2 text-white text-2xl p-2 hover:text-[#c9a227]"><FaTimes /></button>
            <img src={mainImg} alt="Product Large" className="w-full h-auto rounded shadow-lg" />
            {currentIndex > 0 && <button onClick={prevImage} className="absolute top-1/2 -translate-y-1/2 left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"><FaArrowLeft /></button>}
            {currentIndex < product.imgs.length - 1 && <button onClick={nextImage} className="absolute top-1/2 -translate-y-1/2 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-80 transition"><FaArrowRight /></button>}
          </div>
        </div>
      )}

      {/* INQUIRY MODAL */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div ref={inquiryRef} className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button onClick={() => setInquiryModalOpen(false)} className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl font-bold"><FaTimes /></button>
            <h3 className="text-[20px] font-bold text-[#1a1a1a] mb-4">Send Inquiry</h3>
            <p className="mb-4 text-[#555] font-medium">{product.name}</p>
          </div>
        </div>
      )}

      <CategorySeparator category={product.category} />
      <ListsSection products={products} />
    </>
  );
}