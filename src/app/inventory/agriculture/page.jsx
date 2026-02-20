import FilterSection from "@/app/components/products/filtreSection";
import CategorySeparator from "@/app/components/product/category";
import FiltreList from "@/app/components/products/filtreList"

export default function Agriculture() {
  return (
    <div>
      <FilterSection />
      <CategorySeparator category="agri"/>
      <FiltreList />
    </div>
  );
}
