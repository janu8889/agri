import ProductCreateForm from "@/app/components/admin/ProductCreateForm";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-[#1a1a1a]">Admin Products</h1>
        <ProductCreateForm />
      </div>
    </main>
  );
}



