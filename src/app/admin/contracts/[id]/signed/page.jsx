import dbConnect from "@/lib/dbConnect";
import Contract from "@/models/contract";
import ContractDocument from "@/app/components/contracts/ContractDocument";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { signatureLabel } from "@/lib/contracts/signature";
import { signatureMethod } from "@/lib/contracts/security";

export const dynamic = "force-dynamic";
export default async function SignedContractPage({params}){await dbConnect();const {id}=await params;let c;try{c=await Contract.findById(id).select("+signature +auditIp +auditUserAgent -audit").lean()}catch{}if(!c)notFound();if(c.status!=="signed")redirect(`/admin/contracts/${id}`);const method=signatureMethod(c);return <main className="min-h-screen bg-[#efeee9] py-6 sm:py-10"><div className="mx-auto mb-5 flex w-[min(100%-2rem,980px)] flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 font-sans shadow-sm"><div><h1 className="font-bold">Signed contract #{c.orderNumber}</h1><p className="text-sm text-zinc-600">{signatureLabel(method)} · {new Date(c.signedAt).toISOString()}</p></div><div className="flex flex-wrap gap-2"><Link href={`/api/admin/contracts/${id}/pdf?version=signed`} className="rounded bg-black px-4 py-2 text-sm font-bold text-white">Download signed PDF</Link><Link href={`/api/admin/contracts/${id}/pdf?version=unsigned`} className="rounded border px-4 py-2 text-sm font-bold">Download unsigned PDF</Link><Link href={`/admin/contracts/${id}`} className="rounded border px-4 py-2 text-sm">Metadata</Link></div></div><ContractDocument contract={JSON.parse(JSON.stringify(c))} signed/></main>}
