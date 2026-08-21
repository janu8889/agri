import { strokesToSvgPaths } from "@/lib/contracts/signature";

export default function SignatureRenderer({ method, strokes, typedName, className = "" }) {
  if (method === "typed_consent") return <div className={`typed-signature ${className}`}><strong>{typedName}</strong><small>Electronically signed</small></div>;
  const paths = strokesToSvgPaths(strokes, 300, 80);
  if (!paths.length) return <div className={className}/>;
  return <svg className={className} viewBox="0 0 300 80" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Drawn electronic signature">{paths.map((d, i) => <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>)}</svg>;
}
