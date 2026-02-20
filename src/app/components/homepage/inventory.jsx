import Link from "next/link";
import { FaTractor, FaCogs } from "react-icons/fa"; // iconițe cool
import { GiTowTruck } from "react-icons/gi";
import ExcavatorBucketIcon from "../icons/ExcavatorBucketIcon"

export default function Inventory() {
  const categories = [
    {
      title: "Agriculture Equipment",
      link: "/inventory/agriculture",
      icon: <FaTractor className="text-[#c9a227] text-4xl mb-4 mx-auto" />,
    },
    {
      title: "Construction Equipment",
      link: "/inventory/construction",
      icon: <GiTowTruck className="text-[#c9a227] text-4xl mb-4 mx-auto" />,
    },
    {
      title: "Attachments",
      link: "/inventory/attachments",
      icon: <ExcavatorBucketIcon className="text-[#c9a227] mb-4 mx-auto" />, 
    },
  ];

  return (
    <div className="bg-[#1a1a1a] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.link}
            className="group block relative rounded-xl overflow-hidden p-6 text-center shadow-lg bg-[#222222] transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Gradient overlay subtle */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#c9a227]/10 via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none rounded-xl"></div>

            {/* Icon */}
            {cat.icon}

            {/* Title */}
            <h3 className="text-[20px] font-bold text-[#f5f5f5] mb-2 group-hover:text-[#c9a227] transition-colors duration-300">
              {cat.title}
            </h3>

            {/* VIEW Inventory */}
            <span className="inline-block mt-4 text-[#c9a227] font-semibold opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              VIEW INVENTORY
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
