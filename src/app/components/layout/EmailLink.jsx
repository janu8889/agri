"use client";

export default function EmailLink() {
  return (
    <a
      href="mailto:sales@robinson-equipment.com"
      className="text-[#c9a227] text-base md:text-lg font-semibold hover:underline hover:text-[#a17f0d] transition duration-300"
      onClick={() => {
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("trackCustom", "Contact", {
            method: "email",
          });

          window.fbq("track", "Lead");
        }
      }}
    >
      sales@robinson-equipment.com
    </a>
  );
}