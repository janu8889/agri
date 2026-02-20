"use client";

import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

export default function ContactModal({ open, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start pt-28 justify-center z-50 px-4 py-10 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
      >
        <button
          onClick={onClose}
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
            <input type="text" placeholder="First Name *"
              className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />
            <input type="text" placeholder="Last Name *"
              className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />
          </div>

          <input type="text" placeholder="Business Name"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" />

          <input type="text" placeholder="Address *"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />

          <div className="flex gap-2">
            <input type="text" placeholder="City *"
              className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />
            <input type="text" placeholder="State *"
              className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />
          </div>

          <input type="text" placeholder="Zip Code *"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />

          <input type="email" placeholder="Email *"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />

          <input type="text" placeholder="Phone Number *"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />

          <textarea rows={4} placeholder="Message"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227] resize-none" />

          <button
            type="submit"
            className="cursor-pointer bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300"
          >
            Send Inquiry
          </button>
        </form>
      </div>
    </div>
  );
}