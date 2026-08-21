import ContractClient from "./ContractClient";
export const metadata = { title: "Confidential agreement", robots: { index: false, follow: false, nocache: true } };
export default async function ContractPage({ params }) { const { token } = await params; return <ContractClient token={token} />; }
