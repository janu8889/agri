export default function Warranty() {
  return (
    <div>
      {/* ---------------- Decorative Header / Border for About Us ---------------- */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
        {/* Background Image */}
        <img
          src="/imgs/warranty.webp"
          alt="Decorative border"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Darker Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/70 via-[#1a1a1a]/30 to-[#f5f5f5]/50"></div>

        {/* Optional: Text or Page Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
            Warranty
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
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#c9a227] mb-4">
           Why Choose Us?
        </h1>
        <h2 className="text-[16px] md:text-[18px] font-bold text-[#c9a227] mb-4">
            We Stand Behind Our Equipment -  100% Money Back Guarantee
        </h2>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          If for any reason you are not completely happy with your equipment purchase, simply notify us within 30 days of delivery and we will issue you a full refund – no questions asked. Whether it’s an issue with performance, suitability for the job or simply changing needs, you can return the equipment hassle-free. 
        </p>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          We even provide complimentary shipping both ways within the continental US, so there’s absolutely no risk to you. We’ll pick up the equipment and return it to our facility at no cost. You’ll get a prompt and courteous refund in up to 48 hours.
        </p>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          We stand behind the quality of the equipment we sell and your complete satisfaction. Our 30-day money back guarantee allows you to purchase with confidence from our dealership. Experience the customer service and excellence we are known for – if you are not thrilled with your purchase, your money back is guaranteed.
        </p>
      </div>

      {/* ---------------- Warranty Features Band ---------------- */}
        <div className="w-full bg-[#1a1a1a] py-20 relative overflow-hidden">
        
        {/* Decorative background pattern */}
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

            {/* Title */}
            <div className="text-center mb-14">
            <h2 className="text-[#c9a227] text-[28px] md:text-[38px] font-bold tracking-wide">
                Our Quality Standards
            </h2>

            <div className="flex justify-center mt-4">
                <div className="w-24 h-[3px] bg-[#c9a227]"></div>
            </div>
            </div>
            {/* Columns */}
            <div className="grid md:grid-cols-3 gap-10">

              {/* Column 1 */}
              <div className="group text-center bg-gradient-to-b from-[#252525] to-[#1d1d1d] border border-[#c9a227]/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#c9a227]/60 hover:shadow-[0_0_30px_rgba(201,162,39,0.15)]">
                <div className="flex justify-center mb-6">
                  <svg
                    className="w-14 h-14 text-[#c9a227] transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>

                <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
                  Standard Operational Warranty
                </h3>

                <p className="text-gray-300 text-[15px] leading-relaxed">
                  Included with every purchase, this essential coverage ensures your
                  equipment arrives in full working order and ready for immediate
                  operation. It protects you against major mechanical defects on key
                  systems for the initial period after delivery, giving you peace of
                  mind from day one.
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
                    <path d="M3 13h2l2-5 4 10 2-5h6" />
                  </svg>
                </div>

                <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
                  Extended Powertrain Protection
                </h3>

                <p className="text-gray-300 text-[15px] leading-relaxed">
                  Designed for long-term security, this plan offers extensive coverage
                  for critical components including the engine, transmission, and
                  hydraulic pumps. It extends your protection for up to 12 months,
                  significantly minimizing the risk of unexpected repair costs and
                  safeguarding your investment.
                </p>
              </div>

              {/* Column 3 */}
              <div className="group text-center bg-gradient-to-b from-[#252525] to-[#1d1d1d] border border-[#c9a227]/20 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#c9a227]/60 hover:shadow-[0_0_30px_rgba(201,162,39,0.15)]">
                <div className="flex justify-center mb-6">
                  <svg
                    className="w-14 h-14 text-[#c9a227] transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3l8 4v5c0 5-4 8-8 9-4-1-8-4-8-9V7l8-4z" />
                    <circle cx="12" cy="11" r="3" />
                  </svg>
                </div>

                <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
                  Certified Quality Assurance
                </h3>

                <p className="text-gray-300 text-[15px] leading-relaxed">
                  Every equipment undergoes a rigorous multi-point inspection by our
                  technical team before it leaves our yard. We guarantee that the
                  equipment matches its described condition and performance history
                  specifically, providing total transparency and eliminating
                  uncertainty before you sign.
                </p>
              </div>

            </div>
            
            
        </div>
        </div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <h1 className="text-[24px] md:text-[28px] font-bold text-[#c9a227] mb-4">
            Our Satisfied Clients
        </h1>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          Our reputation is built on the trust of hundreds of clients across the construction and agricultural sectors who rely on our machinery to drive their businesses forward. We take pride in a track record defined by transparency and the strict honoring of our warranty commitments. For us, success is not just about the sale, but about supporting the people who use our equipment day in and day out. By choosing Cashman Machinery International, you join a network of professionals who know that their investment is fully protected by a partner dedicated to their long-term operational security.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <h2 className="text-[16px] md:text-[18px] font-bold text-[#c9a227] mb-4">
            Long-Term Partnerships
        </h2>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          We measure our true success by the loyalty of our customers, many of whom return to us for every fleet expansion. We are dedicated to building enduring relationships based on honesty and consistent performance, turning first-time buyers into lifelong partners.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-5 mb-12">
        <h2 className="text-[16px] md:text-[18px] font-bold text-[#c9a227] mb-4">
            Real-World Results
        </h2>
        <p className="text-[#222222] text-[16px] md:text-[18px] leading-relaxed">
          From demanding construction sites to extensive agricultural projects, our machinery is proven to deliver under pressure. Our satisfied clients are our best advocates, demonstrating daily that Cashman Machinery International equipment stands for reliability, efficiency, and job-site excellence.
        </p>
      </div>
    </div>

    
  );
}