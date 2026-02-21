"use client";

import { useState, useEffect, useRef } from "react";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import CategorySeparator from "@/app/components/product/category";
import ListsSection from "@/app/components/product/lists";
import { useParams } from "next/navigation";

const BATCH_SIZE = 7; // câte thumbnails încărcăm pe batch

export default function ProductDetailsClient() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [mainImg, setMainImg] = useState("");
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [thumbBatch, setThumbBatch] = useState([]);

  const inquiryRef = useRef();
  const thumbsRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch produsul curent
  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) return;
        const data = await res.json();

        // Optimizează imaginile pentru thumbnails
        const optimizedImgs = data.imgs.map((url) =>
          url.replace("/upload/", "/upload/f_auto,q_auto,w_200/")
        );
        data.optimizedImgs = optimizedImgs;

        setProduct(data);
        setMainImg(data.imgs?.[0] || "/imgs/placeholder.png");

        // Primele BATCH_SIZE thumbnails
        setThumbBatch(optimizedImgs.slice(0, BATCH_SIZE));
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduct();
  }, [id]);

  // Fetch produse random
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/random");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  // Close inquiry modal la click în afara
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        (inquiryModalOpen && inquiryRef.current && !inquiryRef.current.contains(e.target)) ||
        (modalRef.current && !modalRef.current.contains(e.target))
      ) {
        setInquiryModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inquiryModalOpen]);

  // Scroll automat la thumbnail-ul activ
  useEffect(() => {
    if (!thumbsRef.current || !product) return;
    const activeThumb = thumbsRef.current.querySelector(".active-thumb");
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [mainImg, product]);

  if (!product) return <p className="text-center py-16">Loading product...</p>;

  const currentIndex = product.imgs.indexOf(mainImg);
  const nextImage = () =>
    setMainImg(product.imgs[(currentIndex + 1) % product.imgs.length]);
  const prevImage = () =>
    currentIndex > 0 && setMainImg(product.imgs[currentIndex - 1]);

  // Main image optimizată (1200px)
  const mainImgOptimized = mainImg.replace("/upload/", "/upload/f_auto,q_auto,w_600/");

  // Încarcă batch-ul următor de thumbnails
  const loadNextBatch = () => {
    const currentLength = thumbBatch.length;
    if (currentLength >= product.optimizedImgs.length) return;
    const nextBatch = product.optimizedImgs.slice(currentLength, currentLength + BATCH_SIZE);
    setThumbBatch([...thumbBatch, ...nextBatch]);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[500px] flex-shrink-0">
            {/* Main Image */}
            <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-lg">
              <img
                src={mainImgOptimized}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setGalleryModalOpen(true)}
              />

              {currentIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/60 text-white p-2 rounded-full hover:bg-black transition"
                >
                  <FaArrowLeft />
                </button>
              )}
              {currentIndex < product.imgs.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-black transition"
                >
                  <FaArrowRight />
                </button>
              )}
            </div>

            {/* Thumbnails scrollabile */}
            <div
              ref={thumbsRef}
              className="flex gap-2 mt-3 overflow-x-auto scrollbar-none"
              onScroll={() => {
                if (
                  thumbsRef.current.scrollLeft + thumbsRef.current.clientWidth >=
                  thumbsRef.current.scrollWidth - 50
                ) {
                  loadNextBatch();
                }
              }}
            >
              {thumbBatch.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setMainImg(product.imgs[idx])}
                  className={`relative w-[80px] h-[80px] flex-shrink-0 rounded overflow-hidden border-2 cursor-pointer transition ${
                    mainImg === product.imgs[idx] ? "border-[#c9a227] active-thumb" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=''
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-[#c9a227]">USD ${product.price.toLocaleString()}</p>

            {/* SEND INQUIRY BUTTON */}
            <button
              onClick={() => {
                setSelectedProduct(product);
                setInquiryModalOpen(true);
              }}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-[#c9a227] hover:text-black cursor-pointer transition-all duration-300"
            >
              Send Inquiry
            </button>

            <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {product.year && <Info label="Year" value={product.year} />}
              {product.manufacturer && <Info label="Manufacturer" value={product.manufacturer} />}
              {product.model && <Info label="Model" value={product.model} />}
              {product.condition && <Info label="Condition" value={product.condition} />}
              {product.hours && <Info label="Hours" value={`${product.hours} hrs`} />}
              {product.engineHorsepower && <Info label="Engine HP" value={product.engineHorsepower} />}
              {product.drive && <Info label="Drive" value={product.drive} />}
              {product.transmissionType && <Info label="Transmission" value={product.transmissionType} />}
              {product.description && (
                <div className="md:col-span-2">
                  <div className="font-semibold">Description</div>
                  <p className="mt-1 text-gray-600">{product.description}</p>
                </div>
              )}
            </div>

            {product.stockNumber && (
              <div className="text-xs text-gray-400 uppercase tracking-widest mt-2">
                Reference #{product.stockNumber}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GALLERY MODAL */}
      {galleryModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setGalleryModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full scale-95" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setGalleryModalOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl p-2 hover:text-[#c9a227]"
            >
              <FaTimes />
            </button>
            <img
              src={mainImgOptimized}
              alt="Product Large"
              className="w-full h-auto rounded shadow-lg"
            />
            {currentIndex > 0 && (
              <button
                onClick={prevImage}
                className="absolute top-1/2 -translate-y-1/2 left-4 bg-black/60 text-white p-3 rounded-full hover:bg-black transition"
              >
                <FaArrowLeft />
              </button>
            )}
            {currentIndex < product.imgs.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute top-1/2 -translate-y-1/2 right-4 bg-black/60 text-white p-3 rounded-full hover:bg-black transition"
              >
                <FaArrowRight />
              </button>
            )}
          </div>
        </div>
      )}

      {/* INQUIRY MODAL */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 px-4 pt-28 overflow-y-auto">
          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative overflow-y-auto">
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl"
            >
              <FaTimes />
            </button>

            <h3 className="text-[22px] font-bold text-[#1a1a1a] mb-2">Inquiry</h3>
            {selectedProduct && <p className="mb-4 text-[#555] font-medium">{selectedProduct.name}</p>}

            <form className="flex flex-col gap-4">
              <p className="text-xs text-gray-500 mb-2">All fields marked with an (*) are required.</p>

              <input type="text" placeholder="Name *" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <input type="email" placeholder="Email *" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <input type="text" placeholder="Cell Phone *" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]">
                <option value="">Preferred Time to Be Contacted</option>
                <option>Morning (8AM - 12PM)</option>
                <option>Afternoon (12PM - 5PM)</option>
                <option>Evening (5PM - 8PM)</option>
              </select>
              <input type="text" placeholder="Address *" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <input type="text" placeholder="City *" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <input type="text" placeholder="State *" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <input type="text" placeholder="Zip Code *" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />
              <textarea rows={4} placeholder="Message" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227] resize-none" />

              <button type="submit" className="cursor-pointer bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}

      <CategorySeparator category={product.category} />
      <ListsSection products={products} />
    </>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="font-semibold">{label}</div>
      <div>{value}</div>
    </div>
  );
}