"use client";

import { useState, useRef, useEffect } from "react";
import ContactModal from "../ContactModal";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setBuyNowOpen(false);
        setContactOpen(false);
      }
    }
    if (buyNowOpen || contactOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [buyNowOpen, contactOpen]);

  return (
    <header className="sticky top-[54px] z-50 bg-[#eeeeee] text-[#1a1a1a] font-bold text-[18px] shadow-md shadow-black/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-2">
        <Link href="/" className="text-xl">
        <Image
          src="/logo.png"
          alt="Logo"
          width={180}
          height={80}
        />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center relative">
          <InventoryDropdown />

          {/* BUY NOW */}
          <button
            onClick={() => setBuyNowOpen(true)}
            className="uppercase tracking-wide px-[18px] py-[5px] text-[#1a1a1a] border-b-2 border-transparent hover:text-[#c9a227] hover:border-[#c9a227] transition cursor-pointer"
          >
            BUY NOW
          </button>

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
        <div className="md:hidden">
          <MobileMenu setBuyNowOpen={setBuyNowOpen} setContactOpen={setContactOpen} />
        </div>
      </div>

      {/* ---------------- Buy Now Modal ---------------- */}
      {buyNowOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 px-4 pt-28 overflow-y-auto"
          onClick={(e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
              setBuyNowOpen(false);
            }
          }}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative overflow-y-auto"
          >
            <button
              onClick={() => setBuyNowOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-[#c9a227] text-xl"
            >
              <FaTimes />
            </button>

            <h3 className="text-[22px] font-bold text-[#1a1a1a] mb-4">Buy Now Inquiry</h3>

            <form className="flex flex-col gap-4">
              {/* Machine */}
              <input
                type="text"
                placeholder="Which Machine Are You Purchasing?"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                required
              />

              {/* Billing Address */}
              <div className="text-center my-2 text-gray-400 font-medium">Billing Address</div>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <input
                  type="text"
                  placeholder="Street Address"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                  required
                />
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="City"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="text-center my-2 text-gray-400 font-medium">Shipping Address</div>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <input
                  type="text"
                  placeholder="Street Address"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                  required
                />
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="City"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                    required
                  />
                </div>
              </div>

              {/* Existing Fields */}
              <input type="text" placeholder="Name" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />
              <input type="email" placeholder="Email" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />
              <input type="text" placeholder="Cell Phone" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]" required />

              <button type="submit" className="cursor-pointer bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      )}


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

            <form className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name *"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                  required
                />
              </div>

              <input
                type="text"
                placeholder="Business Name"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="text"
                placeholder="Address *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="City *"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                />
                <input
                  type="text"
                  placeholder="State *"
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
                />
              </div>

              <input
                type="text"
                placeholder="Zip Code *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="email"
                placeholder="Email *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <input
                type="text"
                placeholder="Phone Number *"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227]"
              />

              <textarea
                rows={4}
                placeholder="Message"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c9a227] resize-none"
              />

              <button
                type="submit"
                className="cursor-pointer bg-[#1a1a1a] text-white font-semibold py-3 rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300"
              >
                Send Inquiry
              </button>
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

  return (
    <div className="relative">
      <button className="flex flex-col w-6 h-6 justify-between" onClick={() => setOpen(!open)}>
        <span className="block w-full h-[2px] bg-[#1a1a1a]"></span>
        <span className="block w-full h-[2px] bg-[#1a1a1a]"></span>
        <span className="block w-full h-[2px] bg-[#1a1a1a]"></span>
      </button>

      {open && (
        <div className="absolute z-50 right-0 mt-2 w-48 bg-[#eeeeee] shadow-lg rounded-md py-2 flex flex-col gap-1">
          <button
            className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227] transition"
            onClick={() => setInventoryOpen(!inventoryOpen)}
          >
            INVENTORY
          </button>
          {inventoryOpen && (
            <div className="flex flex-col ml-2 gap-1">
              <Link href="/inventory/agriculture" className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227] transition">AGRICULTURE</Link>
              <Link href="/inventory/construction" className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227] transition">CONSTRUCTION</Link>
              <Link href="/inventory/attachments" className="px-4 py-2 text-[#1a1a1a] hover:text-[#c9a227] transition">ATTACHMENTS</Link>
            </div>
          )}

          <button onClick={() => setBuyNowOpen(true)} className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227] transition">
            BUY NOW
          </button>
          <button onClick={() => setContactOpen(true)} className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227] transition">
            CONTACT US
          </button>
          <Link href="/about" className="text-left w-full px-4 py-2 uppercase tracking-wide text-[#1a1a1a] hover:text-[#c9a227] transition">ABOUT US</Link>
        </div>
      )}
    </div>
  );
}
