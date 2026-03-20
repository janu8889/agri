"use client";

import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function MobileBottomBar({ product, onInquiryClick }) {
  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden z-50 px-3 pb-3">
      <div className="bg-white border border-gray-200 shadow-xl rounded-2xl flex gap-3 p-3">
        
        {/* Call Now */}
        <a
          href="tel:+16898887714"
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300"
        >
          <FaPhoneAlt className="w-4 h-4" />
          Call Now
        </a>

        {/* Inquire Now */}
        <button
          type="button"
          onClick={onInquiryClick}
          className="flex-1 flex items-center justify-center gap-2 bg-[#e6c65a] text-black py-3 rounded-xl font-semibold hover:bg-[#d4b44f] transition-all duration-300"
        >
          <FaEnvelope className="w-4 h-4" />
          Inquire Now
        </button>

      </div>
    </div>
  );
}