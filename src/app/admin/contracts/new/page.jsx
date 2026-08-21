import Link from "next/link";
import ContractForm from "@/app/components/admin/ContractForm";

export default function NewContract(){return <main className="min-h-screen bg-[#f7f7f5] px-4 py-10"><div className="mx-auto max-w-5xl"><div className="mb-7 flex flex-wrap items-center justify-between gap-4"><h1 className="text-3xl font-bold">Create Contract</h1><Link href="/admin/contracts" className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-bold text-zinc-800 shadow-sm transition hover:border-[#c9a227] hover:bg-amber-50">← Back to Contracts</Link></div><ContractForm/></div></main>}
