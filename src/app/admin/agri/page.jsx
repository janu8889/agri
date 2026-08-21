import AgriForm from "@/app/components/admin/agriForm";
import Link from "next/link";

export default function Agri() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-[#1a1a1a]">Agriculture Products</h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center my-10">
          <Link
            href="/admin/contracts"
            className="px-8 py-3 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#c9a227] hover:text-black transition-all duration-300"
          >Contracts</Link>
          <Link
            href="/admin/agri"
            className="px-8 py-3 bg-[#1a1a1a] text-white font-semibold rounded-xl 
            hover:bg-[#c9a227] hover:text-black transition-all duration-300"
          >
            Agri
          </Link>

          <Link
            href="/admin/uti"
            className="px-8 py-3 bg-[#1a1a1a] text-white font-semibold rounded-xl 
            hover:bg-[#c9a227] hover:text-black transition-all duration-300"
          >
            Uti
          </Link>

          <Link
            href="/admin/ati"
            className="px-8 py-3 bg-[#1a1a1a] text-white font-semibold rounded-xl 
            hover:bg-[#c9a227] hover:text-black transition-all duration-300"
          >
            Ati
          </Link>
        </div>
        <AgriForm />
      </div>
    </main>
  );
}

