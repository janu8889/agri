export default function About() {
  return (
    <div>
      {/* ---------------- Decorative Header / Border for About Us ---------------- */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
        {/* Background Image */}
        <img
          src="/imgs/transport.jpeg"
          alt="Decorative border"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Darker Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/30 to-[#f5f5f5]/50"></div>

        {/* Optional: Text or Page Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
            SHIPPING
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
          Cashman Machinery International, we specialise in providing comprehensive transportation and shipping services for a wide range of agricultural and construction equipment, encompassing all makes, models, and years of manufacture. Our highly experienced team is dedicated to ensuring the safe and careful transportation of your machinery from one location to another.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          We recognise the importance of your machinery as a significant investment, and therefore we employ only the most advanced transport equipment and techniques to ensure its proper and safe handling during transport.
        </p>
      </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          From our enclosed transport trailers that protect your equipment from the elements to our open trailer options which allow for easy loading and unloading, Cashman Machinery International has you covered when it comes to agricultural and construction equipment transport.
        </p>

        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          We also offer express delivery services on select equipment, so you can rest assured that your agricultural or construction machinery will arrive on time and in perfect condition.
        </p>
      </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          Contact us today to learn more about our equipment transport services and how we can help you safely move your agricultural or construction machinery.
        </p>
      </div>
    </div>
  );
}