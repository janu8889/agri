/** @type {import('next').NextConfig} */
const contractScriptPolicy = process.env.NODE_ENV === "development"
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/contract/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, private" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Referrer-Policy", value: "no-referrer" },
          { key: "Content-Security-Policy", value: `default-src 'self'; img-src 'self' data: https://res.cloudinary.com; style-src 'self' 'unsafe-inline'; ${contractScriptPolicy}; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'` },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
      {
        source: "/:path*", // toate paginile
        has: [
          {
            type: "host",
            value: "agri-beige.vercel.app", // schimbă cu numele real
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex", // asta blochează indexarea
          },
        ],
      },
    ];
  },
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
