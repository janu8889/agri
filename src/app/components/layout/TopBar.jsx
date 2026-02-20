"use client";

import { FaPhoneAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function TopBar() {
  return (
    <div className="sticky top-0 z-[60] font-bold text-[15px] text-[#f5f5f5]">
      <div className="relative flex justify-end">

        {/* Gradient background pentru XL */}
        <div className="hidden xl:block absolute inset-0 bg-gradient-to-l from-[#1a1a1a] via-[#1a1a1a] to-transparent pointer-events-none"></div>

        {/* Solid background sub XL */}
        <div className="xl:hidden absolute inset-0 bg-[#1a1a1a]"></div>

        {/* Content */}
        <div className="relative flex items-center space-x-6 uppercase tracking-wide py-4 px-6 bg-[#1a1a1a] xl:bg-transparent">

          {/* Icon + Hours */}
          <div className="flex items-center space-x-2">
            <FaClock className="text-[#c9a227]" />
            <span>HOURS BY APPOINTMENT</span>
          </div>

          {/* Icon + Phone */}
          <div className="flex items-center space-x-2">
            <FaPhoneAlt className="text-[#c9a227]" />
            <span>(717) 341-9514</span>
          </div>

          {/* Icon + Address */}
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-[#c9a227]" />
            <span>255 HIGHVILLE RD. CONESTOGA, PA 17516</span>
          </div>

        </div>

      </div>
    </div>
  );
}
