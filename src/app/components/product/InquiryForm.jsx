"use client";

import { useState, forwardRef } from "react";
import { FiSend } from "react-icons/fi";

const InquiryForm = forwardRef(({ product }, ref) => {
  const [inquiryData, setInquiryData] = useState({
    productName: `https://cashman-machinery.com/products/${product._id}`,
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");

  function handleInquiryChange(e) {
    const { name, value } = e.target;
    setInquiryData(prev => ({ ...prev, [name]: value }));
  }

  async function handleInquirySubmit(e) {
    e.preventDefault();
    if (inquiryLoading) return;

    setInquiryMessage("");

    // Verificăm câmpurile obligatorii
    const requiredFields = ["fullName", "phone", "email"];
    for (let field of requiredFields) {
      if (!inquiryData[field]?.trim()) {
        setInquiryMessage("Please fill all required fields (*)");
        // Mesajul dispare după 4 secunde
        setTimeout(() => setInquiryMessage(""), 4000);
        return;
      }
    }

    setInquiryLoading(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      const data = await res.json();

      if (res.ok) {
        setInquiryMessage("Inquiry sent successfully!");
        // Resetăm formul după trimitere
        setInquiryData({
          productName: `https://agri-beige.vercel.app/products/${product._id}`,
          fullName: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setInquiryMessage(data.error || "Something went wrong");
      }

    } catch {
      setInquiryMessage("Server error. Try again later.");
    } finally {
      // Resetăm butonul de submit
      setInquiryLoading(false);
      // Mesajul dispare automat după 4 secunde
      setTimeout(() => setInquiryMessage(""), 4000);
    }
  }

  return (
    <div ref={ref} className="bg-white p-6 rounded-2xl shadow-lg mt-8">
      <h3 className="text-[22px] font-bold mb-4">Interested in This Equipment?</h3>
      <span className="text-[16px] font-bold mb-4 block">
        Complete the form below and we'll reach out promptly with more information.
      </span>

      <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name *"
          required
          value={inquiryData.fullName}
          onChange={handleInquiryChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          required
          value={inquiryData.email}
          onChange={handleInquiryChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number *"
          required
          value={inquiryData.phone}
          onChange={handleInquiryChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
        />
        <textarea
          name="message"
          placeholder="Message"
          rows={4}
          value={inquiryData.message}
          onChange={handleInquiryChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227] resize-none"
        />
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input type="checkbox" name="consent" defaultChecked required />
          <span>
            I consent to be contacted by S & W Equipment via phone, email, or SMS regarding this inquiry.
          </span>
        </label>

        <button
          type="submit"
          disabled={inquiryLoading}
          className={`
            flex items-center justify-center gap-2
            bg-[#e6c65a] text-black font-bold
            py-3 px-6 rounded-xl
            shadow-md hover:shadow-lg
            hover:bg-[#d4b44f] transition-all duration-300
            ${inquiryLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <FiSend className="w-5 h-5" />
          {inquiryLoading ? "Sending..." : "Send Inquiry"}
        </button>

        {inquiryMessage && (
          <p className={`text-sm ${inquiryMessage.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}`}>
            {inquiryMessage}
          </p>
        )}
      </form>
    </div>
  );
});

export default InquiryForm;