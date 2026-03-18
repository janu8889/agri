 "use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

// contactTime
export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const modalRef = useRef(null);

  const [contactData, setContactData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  function handleContactChange(e) {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  }

  async function handleContactSubmit(e) {
    e.preventDefault();
    setContactMessage("");

    // Validare simplă
    const requiredFields = ["fullName", "phone", "email"];
    for (let field of requiredFields) {
      if (!contactData[field]?.trim()) {
        setContactMessage("Please fill all required fields (*)");
        return;
      }
    }

    setContactLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();

      if (res.ok) {
        setContactMessage("Inquiry sent successfully!");
        
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Lead")     
        }

        setContactData({
          fullName: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setContactMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setContactMessage("Server error. Try again later.");
    } finally {
      setContactLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setContactOpen(false);
      }
    }
    if (contactOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contactOpen]);

  return (
    <>
      <footer className="bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 text-[18px] text-[#f5f5f5]">
          
          {/* Container coloane centrate */}
          <div className="flex flex-col md:flex-row justify-between gap-8 text-left">

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <h2 className="mb-2 uppercase tracking-wide font-bold text-[18px] text-[#c9a227]">
                Robinson Equipment Co.
              </h2>
              <div className="flex flex-col gap-1">
                <span className="text-[16px]">3030 Cuyler St</span>
                <span className="text-[16px]">Mims, FL 32754</span>
                <span className="text-[16px]">(689) 888-7714</span>
              </div>
            </div>

            {/* Inventory Links */}
            <div className="flex flex-col gap-2">
              <h2 className="mb-2 uppercase tracking-wide font-bold text-[18px] text-[#c9a227]">
                INVENTORY LINKS
              </h2>
              <div className="flex flex-col gap-2">
                <Link className="text-[16px] hover:text-[#c9a227] transition-colors duration-200" href="/inventory/agriculture">
                  Agriculture
                </Link>
                <Link className="text-[16px] hover:text-[#c9a227] transition-colors duration-200" href="/inventory/construction">
                  Construction
                </Link>
                <Link className="text-[16px] hover:text-[#c9a227] transition-colors duration-200" href="/inventory/attachments">
                 Attachments
                </Link>
              </div>
            </div>

            {/* Page Links */}
            <div className="flex flex-col gap-2">
              <h2 className="mb-2 uppercase tracking-wide font-bold text-[18px] text-[#c9a227]">
                PAGE LINKS
              </h2>
              <div className="flex flex-col gap-2">
                <Link className="text-[16px] hover:text-[#c9a227] transition-colors duration-200" href="/warranty">
                  Warranty
                </Link>
                <Link className="text-[16px] hover:text-[#c9a227] transition-colors duration-200" href="/shipping">
                  Shipping
                </Link>
                <Link className="text-[16px] hover:text-[#c9a227] transition-colors duration-200" href="/about">
                  About Us
                </Link>
                <button
                  onClick={() => setContactOpen(true)}
                  className="text-left text-[16px] hover:text-[#c9a227] transition-colors duration-200 cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* ---------------- Contact Modal ---------------- */}
      {contactOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start pt-28 justify-center z-50 px-4 py-10 overflow-y-auto"
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              setContactOpen(false);
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl"
            >
              <FaTimes />
            </button>

            <h3 className="text-[22px] font-bold text-[#1a1a1a] mb-2">
              Do you have any questions?
            </h3>

            <p className="text-xs text-gray-500 mb-4">
              All fields marked with an (*) are required.
            </p>

           <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                name="fullName"
                value={contactData.fullName}
                onChange={handleContactChange}
                placeholder="Full Name *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleContactChange}
              placeholder="Email *"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <input
              type="text"
              name="phone"
              value={contactData.phone}
              onChange={handleContactChange}
              placeholder="Phone Number *"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <textarea
              name="message"
              value={contactData.message}
              onChange={handleContactChange}
              placeholder="Message"
              rows={4}
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

            <button
              type="submit"
              disabled={contactLoading}
              className="cursor-pointer bg-[#e6c65a] text-black font-semibold py-3 rounded-xl hover:bg-[#d4b44f] hover:text-black transition-all duration-300"
            >
              {contactLoading ? "Sending..." : "Send Inquiry"}
            </button>

            {contactMessage && (
              <p className={`text-sm mt-2 ${contactMessage.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}`}>
                {contactMessage}
              </p>
            )}
          </form>
          </div>
        </div>
      )}
    </>
  );
}
