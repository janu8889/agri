"use client";

import { useState, useRef, useEffect } from "react";
import Spinner from "../ui/spinner";
import { FaSearch, FaClock, FaTimes } from "react-icons/fa";
import Link from "next/link";

// contactTime
export default function ProductsSection({ products }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const modalRef = useRef(null);

  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingMessage, setShippingMessage] = useState("");

  function handleShippingChange(e) {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleShippingSubmit(e) {
    e.preventDefault();

    // 🔥 ANTI DOUBLE SUBMIT
    if (shippingLoading) return;

    setShippingMessage("");

    const requiredFields = [
      "fullName",
      "phone",
      "email",
    ];

    for (let field of requiredFields) {
      if (!shippingData[field]?.trim()) {
        setShippingMessage("Please fill all required fields (*)");
        return;
      }
    }

    setShippingLoading(true);

    try {
      const res = await fetch("/api/shipping-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shippingData),
      });

      const data = await res.json();

      if (res.ok) {
        setShippingMessage("Inquiry sent successfully!");

        if (typeof window !== "undefined" && window.fbq && selectedProduct) {
          const leadKey = `fb_shipping_lead_${selectedProduct._id}`;
          if (!sessionStorage.getItem(leadKey)) {
            window.fbq("track", "Lead", {
              content_name: selectedProduct.name,
              content_category: selectedProduct.category,
              content_ids: [selectedProduct._id],
              value: selectedProduct.price || 0,
              currency: "USD",
              brand: selectedProduct.manufacturer || "",
              year: selectedProduct.year || null,
              hours: selectedProduct.hours || null,
              power_hp: selectedProduct.engineHorsepower || null,
              drive: selectedProduct.drive || "",
            });
            sessionStorage.setItem(leadKey, "1");
          }
        }

        // ✅ reset DOAR dacă e succes
        setShippingData({
          fullName: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setShippingMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setShippingMessage("Server error. Try again later.");
    } finally {
      setShippingLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setModalOpen(false);
      }
    }
    if (modalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);

  if (!products) {
    return (
      <div className="bg-[#f3f4f6] py-32 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-[#f3f4f6] py-32 text-center text-gray-500">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="bg-[#f3f4f6] py-16">
      <div className="max-w-screen-2xl mx-auto px-6">
        <h2 className="text-[30px] md:text-[34px] font-bold text-[#1a1a1a] mb-12 text-left">
          Featured Equipment
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
                  {/* <span className="h-4 w-px bg-gray-300"></span>
                  <span className="flex items-center gap-2">
                    <TbEngine className="text-[#c9a227]" /> {prod.engineHorsepower} HP
                  </span> */}
                </div>

                <div className="mt-8 flex flex-col gap-3 w-full">
                  <button
                    onClick={() => {
                      const productUrl = `https://agri-beige.vercel.app/products/${prod._id}`;
                      setSelectedProduct(prod);

                      setShippingData(prev => ({
                        ...prev,
                        productName: productUrl,
                      }));

                      setModalOpen(true);
                    }}
                    className="cursor-pointer bg-[#e6c65a] text-black font-semibold py-3 rounded-xl  hover:bg-[#d4b44f] hover:text-black transition-all duration-300 w-full"
                  >
                    Get Full Media
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start pt-28 justify-center z-50 px-4 py-10 overflow-y-auto" 
        
        onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              setModalOpen(false);
            }
          }}
        >

          <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl"
            >
              <FaTimes />
            </button>

            <h3 className="text-[22px] font-bold text-[#1a1a1a] mb-2">
              Full Media Inquiry
            </h3>

            {selectedProduct && (
              <p className="mb-4 text-[#555] font-medium">{selectedProduct.name}</p>
            )}

          <form onSubmit={handleShippingSubmit} className="flex flex-col gap-4">
            <p className="text-xs text-gray-500 mb-4">
              All fields marked with an (*) are required.
            </p>

            <input
              type="text"
              name="fullName"
              value={shippingData.fullName}
              onChange={handleShippingChange}
              placeholder="Full Name *"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <input
              type="email"
              name="email"
              value={shippingData.email}
              onChange={handleShippingChange}
              placeholder="Email *"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <input
              type="text"
              name="phone"
              value={shippingData.phone}
              onChange={handleShippingChange}
              placeholder="Phone Number *"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <textarea
              name="message"
              value={shippingData.message}
              onChange={handleShippingChange}
              rows={4}
              placeholder="Message"
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
                I consent to be contacted by Central New Holland via phone, email, or SMS regarding this inquiry.
              </span>
            </label>

            <button
              type="submit"
              disabled={shippingLoading}
              className="cursor-pointer bg-[#e6c65a] text-black font-semibold py-3 rounded-xl hover:bg-[#d4b44f] hover:text-black transition-all duration-300"
            >

              {shippingLoading ? "Sending..." : "Send Inquiry"}
            </button>

            {shippingMessage && (
              <p
                className={`text-sm ${
                  shippingMessage.toLowerCase().includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {shippingMessage}
              </p>
            )}
          </form>
          </div>
        </div>
      )}
    </section>
  );
}