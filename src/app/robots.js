export default function robots() {
  return {
    rules: {
      userAgent: "*", // toți roboții sunt permisi
      allow: "/",     // permit accesul la toate paginile
    },
    sitemap: "https://robinson-equipment.com/sitemap.xml", // link către sitemap-ul tău
  };
}