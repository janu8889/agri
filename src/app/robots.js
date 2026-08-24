export default function robots() {
  return {
    rules: {
      userAgent: "*", // toți roboții sunt permisi
      allow: "/",     // permit accesul la toate paginile
    },
    sitemap: "https://www.centralnewholland.com/sitemap.xml", // link către sitemap-ul tău
  };
}