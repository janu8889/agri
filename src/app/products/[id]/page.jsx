"use client";

import { useState, useEffect, useRef } from "react";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import CategorySeparator from "@/app/components/product/category";
import ListsSection from "@/app/components/homepage/products";
import Spinner from "@/app/components/ui/spinner";
import { useParams } from "next/navigation";
import Image from "next/image";

const BATCH_SIZE = 1; // câte thumbnails încărcăm pe batch

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

  const [inquiryData, setInquiryData] = useState({
    productName: "", // aici trimitem LINK-ul complet
    fullName: "",
    phone: "",
    contactTime: "",
    email: "",
    message: "",
  });

  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");

  function handleInquiryChange(e) {
    const { name, value } = e.target;
    setInquiryData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleInquirySubmit(e) {
    e.preventDefault();
    setInquiryMessage("");

    const requiredFields = [
      "fullName",
      "phone",
      "contactTime",
      "email",
    ];

    for (let field of requiredFields) {
      if (!inquiryData[field]?.trim()) {
        setInquiryMessage("Please fill all required fields (*)");
        return;
      }
    }

    setInquiryLoading(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      const data = await res.json();

      if (res.ok) {
        setInquiryMessage("Inquiry sent successfully!");
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Lead")     
        }
        setInquiryData({
          productName: "",
          fullName: "",
          phone: "",
          contactTime: "",
          email: "",
          message: "",
        });
      } else {
        setInquiryMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setInquiryMessage("Server error. Try again later.");
    } finally {
      setInquiryLoading(false);
    }
  }


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
          url.replace("/upload/", "/upload/f_auto,q_auto:eco,w_200/")
        );
        data.optimizedImgs = optimizedImgs;

        setProduct(data);
        setMainImg(data.imgs?.[0] || "/imgs/placeholder.png");

        // Primele BATCH_SIZE thumbnails
        setThumbBatch(optimizedImgs);
      } catch (err) {
        console.error(err);
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product || !mainImg) return;

    product.imgs
      .filter((url) => url !== mainImg)
      .forEach((url) => {
        const img = new window.Image();
        img.src = url.replace(
          "/upload/",
          "/upload/f_auto,q_auto:eco,dpr_auto,w_800/"
        );
      });
  }, [product, mainImg]);

  // Preload next image pentru navigare rapidă
  useEffect(() => {
    if (!product || !mainImg) return;

    const currentIndex = product.imgs.indexOf(mainImg);
    const nextIndex = (currentIndex + 1) % product.imgs.length;
    const img = new window.Image();
    img.src = product.imgs[nextIndex].replace(
      "/upload/",
      "/upload/f_auto,q_auto:eco,dpr_auto,w_800/"
    );
  }, [mainImg, product]);

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

    if (!product) {
      return (
        <div className="bg-[#f3f4f6] py-32 flex justify-center">
          <Spinner items={0}/>
        </div>
      );
    }
  
    if (product.length === 0) {
      return (
        <div className="bg-[#f3f4f6] py-32 text-center text-gray-500">
          <Spinner items={0}/>
        </div>
      );
    }

  const currentIndex = product.imgs.indexOf(mainImg);
  const nextImage = () =>
    setMainImg(product.imgs[(currentIndex + 1) % product.imgs.length]);
  const prevImage = () =>
    currentIndex > 0 && setMainImg(product.imgs[currentIndex - 1]);

  // Main image optimizată (800px) + dpr_auto
  const mainImgOptimized = mainImg.replace(
    "/upload/",
    "/upload/f_auto,q_auto:eco,dpr_auto,w_800/"
  );

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
              <Image
                src={mainImgOptimized}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
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
            {thumbBatch.map((img, idx) => {
              const originalImg = product.imgs.find((url) =>
                img.includes(url.split("/upload/")[1])
              );

              return (
                <div
                  key={idx}
                  onClick={() => setMainImg(originalImg)}
                  className={`relative w-[80px] h-[80px] flex-shrink-0 rounded overflow-hidden border-2 cursor-pointer transition ${
                    mainImg === originalImg ? "border-[#c9a227] active-thumb" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
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
      setInquiryData(prev => ({
        ...prev,
        productName: `https://robinson-equipment.com/products/${product._id}`,
      }));
      setInquiryModalOpen(true);
    }}
    className="w-full bg-[#e6c65a] text-black py-3 rounded-xl font-bold hover:bg-[#d4b44f] hover:text-black cursor-pointer transition-all duration-300"
  >
    Send Inquiry
  </button>

  {/* INFO DYNAMIC + DESCRIPTION */}
  <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    {Object.entries(product).map(([key, value]) => {
      if (!value) return null;
      if (Array.isArray(value) || typeof value === "object") return null;
      if (key === "name" || key === "price" || key === "imgs" || key === "optimizedImgs" || key === "category" || key === "_id" || key === "createdAt") return null;
      if (key === "description") return null;
      if (key === "stockNumber") return null;

      return (
        <div key={key}>
          {/* afișăm exact cum e cheia în obiect */}
          <div className="font-semibold capitalize">{key}</div>
          <div>{value}</div>
        </div>
      );
    })}

    {/* Description separat */}
    {product.description && (
      <div className="md:col-span-2">
        <div className="font-semibold">Description</div>
        <p className="mt-1 text-gray-600">{product.description}</p>
      </div>
    )}
  </div>

  {/* Reference rămâne exact cum e */}
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
              loading="lazy"
              decoding="async"
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start pt-28 justify-center z-50 px-4 py-10 overflow-y-auto"
            onClick={(e) => {
              if (modalRef.current && !modalRef.current.contains(e.target)) {
                setModalOpen(false);
              }
            }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl"
            >
              <FaTimes />
            </button>

            <h3 className="text-[22px] font-bold text-[#1a1a1a] mb-2">
              Inquiry
            </h3>

            {selectedProduct && (
              <p className="mb-4 text-[#555] font-medium">{selectedProduct.name}</p>
            )}

            <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
              <p className="text-xs text-gray-500 mb-4">
                All fields marked with an (*) are required.
              </p>

              {/* NAME */}
              <input
                type="text"
                name="fullName"
                placeholder="Full Name *"
                required
                value={inquiryData.fullName}
                onChange={handleInquiryChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                placeholder="Email *"
                required
                value={inquiryData.email}
                onChange={handleInquiryChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              {/* PHONE */}
              <input
                type="text"
                name="phone"
                placeholder="Phone Number *"
                required
                value={inquiryData.phone}
                onChange={handleInquiryChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <select
                name="contactTime"
                value={inquiryData.contactTime}
                onChange={handleInquiryChange}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              >
              <option value="">Preferred Time to Be Contacted *</option>
              <option value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</option>
              <option value="Afternoon (12PM - 5PM)">Afternoon (12PM - 5PM)</option>
              <option value="Evening (5PM - 8PM)">Evening (5PM - 8PM)</option>
            </select>

              {/* MESSAGE */}
              <textarea
                name="message"
                placeholder="Message"
                rows={4}
                value={inquiryData.message}
                onChange={handleInquiryChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227] resize-none"
              />

              <label className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                <input
                  type="checkbox"
                  name="consent"
                  defaultChecked
                  required
                  className="mt-1"
                />
              <span>
                I consent to be contacted by Robinson Equipment Co. via phone, email, or SMS regarding this inquiry.
              </span>
              </label>


              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={inquiryLoading}
                className="cursor-pointer bg-[#e6c65a] text-black font-semibold py-3 rounded-xl hover:bg-[#d4b44f] hover:text-black transition-all duration-300"
              >
                {inquiryLoading ? "Sending..." : "Send Inquiry"}
              </button>

              {/* MESSAGE */}
              {inquiryMessage && (
                <p
                  className={`text-sm ${
                    inquiryMessage.toLowerCase().includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {inquiryMessage}
                </p>
              )}
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