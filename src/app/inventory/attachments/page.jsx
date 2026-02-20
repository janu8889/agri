import FilterSection from "@/app/components/products/filtreSection";
import CategorySeparator from "@/app/components/product/category";
import FiltreList from "@/app/components/products/filtreList";

export default function Attachments() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6">
      {/* Header categorie cu descriere */}
      <div className="text-left mt-2 mb-6 px-6 md:px-0">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight">
          Attachments & Implements
        </h1>
        <p className="mt-2 text-lg md:text-xl text-[#555] leading-relaxed">
          Explore our high-quality tractor and machinery attachments, including buckets, plows, harrows, and other implements designed for agriculture and construction. Enhance the versatility, efficiency, and performance of your equipment with our premium selection of attachments to tackle any task with confidence.
        </p>
      </div>

      <FilterSection />
      <CategorySeparator category="attachments" />
      <FiltreList />
    </div>
  );
}