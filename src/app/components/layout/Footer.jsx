 "use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const modalRef = useRef(null);

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
                <span className="text-[16px]">(321) 524-9445</span>
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

            <form className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name *"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Business Name"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="text"
                placeholder="Address *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="City *"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                />
                <input
                  type="text"
                  placeholder="State *"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                />
              </div>

              <input
                type="text"
                placeholder="Zip Code *"
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
                placeholder="Phone Number *"
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
    </>
  );
}
