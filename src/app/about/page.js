import ContactSection from "../components/about/ContactSection";

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}


function LocationIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ExternalIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}


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
            Our Story
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
              fill="#f5f5f5"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          Central New Holland delivers comprehensive solutions for pre-owned construction and agricultural equipment. We add value to the sale of each equipment by taking equipment as trades, convenient payment methods, export document preparation, and transportation services.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#c9a227] mb-4">
          Central New Holland – Sales
        </h1>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          Daniel R. Petrov, Sales & Marketing Director at Central New Holland, gained his experience with equipment from being involved at an early age in his family’s landscaping and snow removal company. He learned that buying clean, quality used equipment was one of the best ways to have the right equipment at the right time without the high payments of new machinery or expensive rental costs. Today, Daniel and the team at Central New Holland are focused on helping customers stay profitable by providing reliable used equipment that helps get the job done efficiently and affordably.
        </p>

      </div>

      {/* ---------------- NEW: 3 Columns Section (Same style as Warranty) ---------------- */}
      <div className="w-full bg-[#1a1a1a] py-20 relative overflow-hidden">

        {/* Background pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#c9a227" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Title + Subtitle */}
        <div className="text-center mb-14">
          <h2 className="text-[#c9a227] text-[28px] md:text-[38px] font-bold tracking-wide">
            Our Core Values
          </h2>

          <div className="flex justify-center mt-4 mb-4">
            <div className="w-24 h-[3px] bg-[#c9a227]"></div>
          </div>

          <p className="text-gray-300 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Built on trust, quality, and long-term partnerships — everything we do reflects these principles.
          </p>
        </div>

          {/* Columns */}
          <div className="grid md:grid-cols-3 gap-10">

            {/* Column 1 */}
            <div className="group text-center bg-gradient-to-b from-[#252525] to-[#1d1d1d] border border-[#c9a227]/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#c9a227]/60 hover:shadow-[0_0_30px_rgba(201,162,39,0.15)]">
              <div className="flex justify-center mb-6">                
          <svg
            className="w-16 h-16 text-[#c9a227] transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
          </svg>               
              </div>

              <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
                Integrity
              </h3>

              <p className="text-gray-300 text-[15px] leading-relaxed">
                Complete transparency in every machine's history, condition, and provenance. No surprises, only trust.
              </p>
            </div>

            {/* Column 2 */}
            <div className="group text-center bg-gradient-to-b from-[#252525] to-[#1d1d1d] border border-[#c9a227]/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#c9a227]/60 hover:shadow-[0_0_30px_rgba(201,162,39,0.15)]">
              <div className="flex justify-center mb-6">
              <svg
                className="w-14 h-14 text-[#c9a227] transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L6.5 20l2-7L3 9h7z" />
              </svg>
              </div>

              <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
                Excellence
              </h3>

              <p className="text-gray-300 text-[15px] leading-relaxed">
                Only the finest equipment earn a place in our inventory. We accept nothing less than exceptional.
              </p>
            </div>

            {/* Column 3 */}
            <div className="group text-center bg-gradient-to-b from-[#252525] to-[#1d1d1d] border border-[#c9a227]/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#c9a227]/60 hover:shadow-[0_0_30px_rgba(201,162,39,0.15)]">
              <div className="flex justify-center mb-6">
                <span className="text-[#c9a227] text-[64px] leading-none transition-transform duration-300 group-hover:scale-110">
                  🤝
                </span>
              </div>

              <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
                Relationship
              </h3>

              <p className="text-gray-300 text-[15px] leading-relaxed">
                Building lasting connections with customers.
              </p>
            </div>

          </div>
        </div>
      </div>

      <ContactSection LocationIcon={LocationIcon} ClockIcon={ClockIcon} PhoneIcon={PhoneIcon} ExternalIcon={ExternalIcon} />
    </div>
  );
}