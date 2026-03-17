"use client";

import { FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="sticky top-0 z-[60] font-bold text-[15px] text-[#f5f5f5]">
      <div className="relative flex justify-center md:justify-end">

        {/* Gradient background pentru XL */}
        <div className="hidden xl:block absolute inset-0 bg-gradient-to-l from-[#1a1a1a] via-[#1a1a1a] to-transparent pointer-events-none"></div>

        {/* Solid background sub XL */}
        <div className="xl:hidden absolute inset-0 bg-[#1a1a1a]"></div>

        {/* Content */}
        <div className="relative flex items-center space-x-6 uppercase tracking-wide py-4 px-6 bg-[#1a1a1a] xl:bg-transparent">

          {/* HOURS - ascuns pe mobil */}
          <div className="hidden md:flex items-center space-x-2">
            <FaClock className="text-[#c9a227]" />
            <span>HOURS BY APPOINTMENT</span>
          </div>

          {/* PHONE - mereu vizibil */}
          <div className="flex items-center space-x-2">
            <FaPhoneAlt className="text-[#c9a227]" />
            <a
              href="tel:+16898887714"
              onClick={() => {
                if (typeof window !== "undefined" && window.fbq) {
                  window.fbq("trackCustom", "Contact", {
                    method: "phone"
                  });

                  window.fbq("track", "Lead");
                }
              }}
            >
              (689) 888-7714
           </a>
           </div> 

          {/* ADDRESS - ascuns pe mobil */}
          <div className="hidden md:flex items-center space-x-2">
            <FaMapMarkerAlt className="text-[#c9a227]" />
            <span>3030 Cuyler St, Mims, FL 32754</span>
          </div>

        </div>

      </div>
    </div>
  );
}