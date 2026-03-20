"use client";

import { useState, useEffect, useRef } from "react";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import CategorySeparator from "@/app/components/product/category";
import ListsSection from "@/app/components/homepage/products";
import Spinner from "@/app/components/ui/spinner";
import MobileBottomBar from "@/app/components/layout/MobileBottomBar";
import InquiryForm from "@/app/components/product/InquiryForm";
import { useParams } from "next/navigation";
import { FaCheckCircle, FaTruck } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

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
  const inquiryFormRef = useRef(null);

  const inquiryRef = useRef();
  const thumbsRef = useRef(null);
  const modalRef = useRef(null);

  const [inquiryData, setInquiryData] = useState({
    productName: "", // aici trimitem LINK-ul complet
    fullName: "",
    phone: "",
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

    // 🔥 ANTI DOUBLE SUBMIT
    if (inquiryLoading) return;

    setInquiryMessage("");

    const requiredFields = [
      "fullName",
      "phone",
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
          const leadKey = `fb_lead_${product._id}`;
          if (!sessionStorage.getItem(leadKey)) {
            window.fbq("track", "Lead", {
              content_name: product.name,
              content_category: product.category,
              content_ids: [product._id],
              value: product.price || 0,
              currency: "USD",
              brand: product.manufacturer || "",
              year: product.year || null,
              hours: product.hours || null,
              power_hp: product.engineHorsepower || null,
              drive: product.drive || "",
            });
            sessionStorage.setItem(leadKey, "1");
          }
        }

        // ✅ reset DOAR dacă e succes
        setInquiryData({
          productName: "",
          fullName: "",
          phone: "",
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

        const optimizedImgs = data.imgs.map(url => url);
        data.optimizedImgs = optimizedImgs;

        setProduct(data);
        setMainImg(data.imgs?.[0] || "/imgs/placeholder.png");
        setThumbBatch(optimizedImgs);

        // 🔥 Aici poți pune ViewContent (după setProduct)
        if (typeof window !== "undefined" && window.fbq) {
          const key = `fb_vc_${data._id}`;
          if (!sessionStorage.getItem(key)) {
            window.fbq("track", "ViewContent", {
              content_type: "product",
              content_name: data.name,
              content_category: data.category,
              value: data.price || 0,
              currency: "USD",
              contents: [{ id: data._id, quantity: 1, item_price: data.price || 0 }],
              brand: data.manufacturer || "",
              condition: data.condition || "",
              year: data.year || null,
              hours: data.hours || null,
              power_hp: data.engineHorsepower || null,
              drive: data.drive || "",
            });
            sessionStorage.setItem(key, "1");
          }
        }

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
        img.src = url;
      });
  }, [product, mainImg]);

  // Preload next image pentru navigare rapidă
  useEffect(() => {
    if (!product || !mainImg) return;

    const currentIndex = product.imgs.indexOf(mainImg);
    const nextIndex = (currentIndex + 1) % product.imgs.length;
    const img = new window.Image();
    img.src = product.imgs[nextIndex];

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
  const mainImgOptimized = mainImg;

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
                unoptimized
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
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
  
  {/* No Hidden Fees */}
<div className="flex items-center gap-3 flex-1">
  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
    <FaCheckCircle className="w-5 h-5 text-green-600" />
  </div>

  <div className="flex flex-col">
    <span className="font-semibold text-gray-800">No Hidden Fees</span>
    <span className="text-sm text-gray-500">All fees included</span>
  </div>
</div>

{/* Nationwide Shipping */}
<div className="flex items-center gap-3 flex-1">
  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f5e7b2]">
    <FaTruck className="w-5 h-5 text-[#c9a227]" />
  </div>

  <div className="flex flex-col">
    <span className="font-semibold text-gray-800">Nationwide Shipping</span>
    <span className="text-sm text-gray-500">All 50 states</span>
  </div>
</div>

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

        // Scroll la formular
        if (inquiryFormRef.current) {
          const yOffset = -200; // ajustează după nevoie
          const y = inquiryFormRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }}
      className="flex items-center justify-center gap-2
            bg-[#e6c65a] text-black font-bold
            py-3 px-6 rounded-xl
            shadow-md hover:shadow-lg
            hover:bg-[#d4b44f] transition-all duration-300 cursor-pointer"
    >
      <FaEnvelope className="w-5 h-5" />
      Make an Inquiry
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
      <MobileBottomBar
        product={product}
        onInquiryClick={() => {
          setSelectedProduct(product);
          setInquiryData(prev => ({
            ...prev,
            productName: `https://robinson-equipment.com/products/${product._id}`,
          }));

          // Scroll la formular
          if (inquiryFormRef.current) {
            const yOffset = -200; // ajustează după nevoie
            const y = inquiryFormRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }}
      />

      {product && <InquiryForm ref={inquiryFormRef} product={product} />}

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