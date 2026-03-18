"use client";

import { useState, useRef, useEffect } from "react";
import ContactModal from "../ContactModal";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const [contactOpen, setContactOpen] = useState(false);
  const modalRef = useRef(null);


  const [contactData, setContactData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState("");


  function handleContactChange(e) {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  }


  async function handleContactSubmit(e) {
    e.preventDefault();
    setContactMessage("");

    // Validare simplă
    const requiredFields = ["fullName", "phone", "email"];
    for (let field of requiredFields) {
      if (!contactData[field]?.trim()) {
        setContactMessage("Please fill all required fields (*)");
        return;
      }
    }

    setContactLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();

      if (res.ok) {
        setContactMessage("Inquiry sent successfully!");

        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Lead")     
        }

        setContactData({
          fullName: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setContactMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setContactMessage("Server error. Try again later.");
    } finally {
      setContactLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setContactOpen(false);
      }
    }
    if (contactOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contactOpen]);

  return (
    <header className="sticky top-[54px] z-50 bg-[#eeeeee] text-[#1a1a1a] font-bold text-[18px] shadow-md shadow-black/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-2">
        <Link href="/" className="text-xl">
        <Image
          src="/logo.png"
          alt="Logo"
          width={180}
          height={80}
          priority
        />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-6 items-center relative">
          <InventoryDropdown />

          <Link href="/warranty" className="uppercase tracking-wide px-[18px] py-[5px] text-[#1a1a1a] border-b-2 border-transparent hover:text-[#c9a227] hover:border-[#c9a227] transition">
            Warranty
          </Link>

          <Link href="/shipping" className="uppercase tracking-wide px-[18px] py-[5px] text-[#1a1a1a] border-b-2 border-transparent hover:text-[#c9a227] hover:border-[#c9a227] transition">
            SHIPPING
          </Link>

          <Link href="/about" className="uppercase tracking-wide px-[18px] py-[5px] text-[#1a1a1a] border-b-2 border-transparent hover:text-[#c9a227] hover:border-[#c9a227] transition">
            ABOUT US
          </Link>
          <button
            onClick={() => setContactOpen(true)}
            className="uppercase tracking-wide px-[18px] py-[5px] text-[#1a1a1a] border-b-2 border-transparent hover:text-[#c9a227] hover:border-[#c9a227] transition cursor-pointer"
          >
            CONTACT US
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <MobileMenu setContactOpen={setContactOpen} />
        </div>
      </div>



      {/* ---------------- Contact Modal ---------------- */}
      {contactOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start pt-28 justify-center z-50 px-4 py-10 overflow-y-auto"
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              setContactOpen(false);
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
          >
            <button
              onClick={() => setContactOpen(false)}
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

           <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                name="fullName"
                value={contactData.fullName}
                onChange={handleContactChange}
                placeholder="Full Name *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleContactChange}
              placeholder="Email *"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <input
              type="text"
              name="phone"
              value={contactData.phone}
              onChange={handleContactChange}
              placeholder="Phone Number *"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
            />

            <textarea
              name="message"
              value={contactData.message}
              onChange={handleContactChange}
              placeholder="Message"
              rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227] resize-none"
            />

            <label className="flex items-start gap-2 text-xs text-gray-500 mb-4">
              <input
                type="checkbox"
                name="consent"
                defaultChecked
                required
                className="mt-1"
              />
              <span>
                I consent to be contacted by Robinson Equipment Co. via phone, email, or SMS regarding this inquiry.
              </span>
            </label>

            <button
              type="submit"
              disabled={contactLoading}
              className="cursor-pointer bg-[#e6c65a] text-black font-semibold py-3 rounded-xl hover:bg-[#d4b44f] hover:text-black transition-all duration-300"
            >
              {contactLoading ? "Sending..." : "Send Inquiry"}
            </button>

            {contactMessage && (
              <p className={`text-sm mt-2 ${contactMessage.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"}`}>
                {contactMessage}
              </p>
            )}
          </form>
          </div>
        </div>
      )}
    </header>
  );
}

// -------------------- Inventory Dropdown --------------------
function InventoryDropdown() {
  return (
    <div className="relative group">
      <button className="uppercase tracking-wide px-[18px] py-[5px] text-[#1a1a1a] border-b-2 border-transparent hover:text-[#c9a227] hover:border-[#c9a227] transition cursor-pointer">
        INVENTORY
      </button>

      <div className="absolute top-full left-0 bg-[#eeeeee] mt-1 shadow-lg rounded-b-md min-w-[180px] py-2 flex flex-col gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <Link href="/inventory/agriculture" className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227] transition">
          AGRICULTURE
        </Link>
        <Link href="/inventory/construction" className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227] transition">
          CONSTRUCTION
        </Link>
        <Link href="/inventory/attachments" className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227] transition">
          ATTACHMENTS
        </Link>
      </div>
    </div>
  );
}



// -------------------- Mobile Menu --------------------
function MobileMenu({ setBuyNowOpen, setContactOpen }) {
  const [open, setOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  // 🔥 ASTA E TOT
  const closeMenu = () => {
    setOpen(false);
    setInventoryOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="flex flex-col w-6 h-6 justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="block w-full h-[2px] bg-[#1a1a1a]"></span>
        <span className="block w-full h-[2px] bg-[#1a1a1a]"></span>
        <span className="block w-full h-[2px] bg-[#1a1a1a]"></span>
      </button>

      {open && (
        <div className="absolute z-50 right-0 mt-2 w-48 bg-[#eeeeee] shadow-lg rounded-md py-2 flex flex-col gap-1">
          
          {/* INVENTORY */}
          <button
            className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227]"
            onClick={() => setInventoryOpen(!inventoryOpen)}
          >
            INVENTORY
          </button>

          {inventoryOpen && (
            <div className="flex flex-col ml-2 gap-1">
              <Link href="/inventory/agriculture" onClick={closeMenu} className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227]">
                AGRICULTURE
              </Link>
              <Link href="/inventory/construction" onClick={closeMenu} className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227]">
                CONSTRUCTION
              </Link>
              <Link href="/inventory/attachments" onClick={closeMenu} className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227]">
                ATTACHMENTS
              </Link>
            </div>
          )}

          {/* LINKS */}
          <Link href="/warranty" onClick={closeMenu} className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227]">
            WARRANTY
          </Link>

          <Link href="/shipping" onClick={closeMenu} className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227]">
            SHIPPING
          </Link>

          <button
            onClick={() => {
              setContactOpen(true);
              closeMenu(); // 🔥 important
            }}
            className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227]"
          >
            CONTACT US
          </button>

          <Link href="/about" onClick={closeMenu} className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227]">
            ABOUT US
          </Link>
        </div>
      )}
    </div>
  );
}