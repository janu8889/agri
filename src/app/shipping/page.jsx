import ServicesSection from "../components/shipping/ServicesSection";
import ProcessSection from "../components/shipping/ProcessSection";
import FaqSection from "../components/shipping/FaqSection";

const services = [
  {
    title: "Enclosed Transport",
    subtitle: "Premium protection for your machine",
    price: "Starting at $1.00/mile",
    buttonClass: "btn btn-primary btn-block",
    icon: "enclosed",
    features: ["Full weather protection", "$500K+ insurance coverage", "GPS tracking included", "Soft-tie down system"],
  },
  {
    title: "Open Transport",
    subtitle: "Economical nationwide delivery",
    price: "Starting at $0.85/mile",
    buttonClass: "btn btn-outline btn-block",
    icon: "open",
    features: ["Cost-effective option", "$500K+ insurance coverage", "Flexible scheduling", "Professional handlers"],
  },
  {
    title: "Door-to-Door",
    subtitle: "Maximum convenience",
    price: "Custom Quote",
    buttonClass: "btn btn-outline btn-block",
    icon: "home",
    features: ["Pickup at any location", "Delivery to your home", "Inspection on arrival", "Enclosed or open option"],
  },
];

const processSteps = [
  ["1", "Request Quote", "Tell us your delivery locations"],
  ["2", "Schedule", "Choose your pickup date and transport type"],
  ["3", "Track", "Monitor your machine throughout transit"],
  ["4", "Receive", "Inspect and accept your machine at delivery"],
];

const faqs = [
  [
    "How long does shipping take?",
    "Transit times vary by distance. East Coast to West Coast typically takes 7-10 days. Regional transport (under 500 miles) usually takes 2-4 days. We'll provide an accurate estimate with your quote.",
  ],
  [
    "Is my machine insured during transport?",
    "Yes, all machines are fully insured during transport. Our carriers provide up to $500,000 in coverage. We can arrange additional coverage for high-value machines upon request.",
  ],
  [
    "Can I track my machine?",
    "Absolutely. Our transporters are equipped with GPS tracking. You'll receive regular updates and can request real-time location information at any time.",
  ],
  [
    "What if my machine doesn't run?",
    "No problem. Our carriers are equipped with winches and ramps to safely load non-running machines. Please let us know in advance so we can accommodate your needs.",
  ],
];

const CheckIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-[18px] h-[18px] flex-shrink-0"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const ServiceIcon = ({ type }) => {
  const className = "w-7 h-7";

  if (type === "open") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={className}
      >
        <path d="M14 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v11a1 1 0 001 1h2" />
        <path d="M14 18h6a1 1 0 001-1v-3.65a1 1 0 00-.22-.624l-3.48-4.35A1 1 0 0016.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    );
  }

  if (type === "home") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={className}
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}


export default function Shipping() {
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
      <ServicesSection services={services} ServiceIcon={ServiceIcon} CheckIcon={CheckIcon} />
      <ProcessSection processSteps={processSteps}/>
      <FaqSection faqs={faqs}/>
    </div>
  );
}