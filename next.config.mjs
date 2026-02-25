/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
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
  },
};

export default nextConfig;
