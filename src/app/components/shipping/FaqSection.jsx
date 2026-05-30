"use client";

import { useState } from "react";

function FaqSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 bg-[#f5f5f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a227] font-semibold uppercase tracking-[3px] text-sm">
            FAQ
          </span>

          <h2 className="mt-3 text-[#1a1a1a] text-[32px] md:text-[42px] font-bold">
            Common Questions
          </h2>

          <div className="w-24 h-[3px] bg-[#c9a227] mx-auto mt-5" />
        </div>

        {/* FAQ Container */}
        <div className="bg-white border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-sm">

          {faqs.map(([question, answer], index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={question}
                className={`${
                  index !== faqs.length - 1
                    ? "border-b border-[#e5e7eb]"
                    : ""
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  type="button"
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#fafafa] transition-colors"
                >
                  <span className="font-semibold text-[#1a1a1a] text-[16px] md:text-[17px]">
                    {question}
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`w-5 h-5 text-[#c9a227] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-6 text-[#555] leading-relaxed">
                    {answer}
                  </div>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default FaqSection;