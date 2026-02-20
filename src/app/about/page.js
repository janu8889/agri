export default function About() {
  return (
    <div>
      {/* ---------------- Decorative Header / Border for About Us ---------------- */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
        {/* Background Image */}
        <img
          src="/imgs/1.jpg"
          alt="Decorative border"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Darker Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/30 to-[#f5f5f5]/50"></div>

        {/* Optional: Text or Page Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
            About Us
          </h1>
        </div>

        {/* Decorative cut at bottom (triangle effect) */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-6 md:h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 V60 Q600,120 1200,60 V0 H0 Z"
              fill="#f5f5f5" // culoarea fundalului paginii / footer
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          Shertzer Equipment Group is a full service provider of pre-owned construction and lift equipment. We add value to the sale of each machine by taking equipment as trades, convenient payment methods including financing, export document preparation, and transportation services.
        </p>
      </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#c9a227] mb-4">
          Wendell Shertzer – Sales
        </h1>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          Wendell’s experience with equipment came from being involved at an early age in the family’s landscaping and snow removal company. He saw how buying clean, good used equipment was one way to have the right equipment at the right time to make jobs flow smoothly without the high payments of new equipment or high priced rentals. Wendell is interested in helping customers to be profitable in their companies by providing good used equipment to help them get the work done. 
        </p>
      </div>
       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#c9a227] mb-4">
          ABOUT US
        </h1>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          Shertzer Equipment Group is a full service provider of pre-owned construction and lift equipment. We add value to the sale of each machine by taking equipment as trades, convenient payment methods including financing, export document preparation, and transportation services.
        </p>
      </div>
    </div>
  );
}