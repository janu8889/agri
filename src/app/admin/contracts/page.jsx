import Link from "next/link";
import ContractAdmin from "@/app/components/admin/ContractAdmin";

const navItems=[["Contracts","/admin/contracts"],["Agri","/admin/agri"],["Uti","/admin/uti"],["Ati","/admin/ati"]];

export default function Contracts(){
  return <main className="min-h-screen bg-[#f7f7f5] px-4 py-8 md:px-8 md:py-10">
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-1 text-xs font-bold uppercase tracking-[.2em] text-[#9a7b1d]">Administration</p><h1 className="text-3xl font-bold text-[#1a1a1a] md:text-4xl">Contracts</h1><p className="mt-2 text-sm text-zinc-600">Create, manage and download customer agreements.</p></div>
        <Link href="/admin/client-signatures" className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:border-[#c9a227] hover:bg-amber-50">Saved signatures</Link>
      </div>
      <nav aria-label="Admin sections" className="mb-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        {navItems.map(([label,href])=><Link key={href} href={href} aria-current={href==="/admin/contracts"?"page":undefined} className={`min-w-28 rounded-xl px-7 py-3 text-center font-semibold transition-all duration-300 ${href==="/admin/contracts"?"bg-[#c9a227] text-black shadow-sm":"bg-[#1a1a1a] text-white hover:bg-[#c9a227] hover:text-black"}`}>{label}</Link>)}
      </nav>
      <ContractAdmin/>
    </div>
  </main>
}
