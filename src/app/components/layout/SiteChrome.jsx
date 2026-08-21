"use client";
import { usePathname } from "next/navigation";
export default function SiteChrome({ children }) { const pathname = usePathname(); return pathname.startsWith("/contract/") ? null : children; }

export function SiteMain({ children }) {
  const pathname = usePathname();
  const className = pathname.startsWith("/contract/")
    ? ""
    : "max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8";
  return <main className={className}>{children}</main>;
}
