import FilterSection from "@/app/components/products/filtreSection";
import CategorySeparator from "@/app/components/product/category";
import FiltreList from "@/app/components/products/filtreList";

export default function Construction() {
  return (
    <div className="max-w-screen-2xl mx-auto px-6">
      {/* Header categorie cu descriere */}
      <div className="text-left mt-2 mb-6 px-6 md:px-0">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight">
          Construction Equipment
        </h1>
        <p className="mt-2 text-lg md:text-xl text-[#555] leading-relaxed">
          Browse our premium selection of construction machinery and attachments, including excavators, loaders, backhoes, and other heavy equipment. Built for durability, efficiency, and performance, our construction equipment helps you tackle any project with confidence and precision.
        </p>
      </div>

      <FilterSection />
      <CategorySeparator category="construction" />
      <FiltreList />
    </div>
  );
}