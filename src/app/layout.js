import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import TopBar from "./components/layout/TopBar";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔑 Faviconul se pune aici în app directory
// export const metadata = {
//   title: "Robinson Equipment Co.",
//   description:
//     "Robinson Equipment Co. offers high-quality agricultural and construction machinery. Explore durable tractors, excavators, and equipment solutions designed for efficiency and performance.",
//   icons: {
//     icon: "/favicon.ico",               // favicon principal
//     apple: "/apple-touch-icon.png",     // optional pentru iOS
//     other: [
//       { rel: "icon", url: "/favicon-32x32.png", type: "image/png" },
//       { rel: "icon", url: "/favicon-16x16.png", type: "image/png" },
//     ],
//   },
// };

export const metadata = {
  metadataBase: new URL("https://robinson-equipment.com"), // pune domeniul tău real

  title: {
    default: "Robinson Equipment Co.",
    template: "%s | Robinson Equipment Co.",
  },

  description:
    "Robinson Equipment Co. offers high-quality agricultural and construction machinery.",

  alternates: {
    canonical: "/", 
  },

  openGraph: {
    title: "Robinson Equipment Co.",
    description:
      "High-quality agricultural and construction machinery.",
    url: "https://robinson-equipment.com",
    siteName: "Robinson Equipment Co.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",               // favicon principal
    apple: "/apple-touch-icon.png",     // optional pentru iOS
    other: [
      { rel: "icon", url: "/favicon-32x32.png", type: "image/png" },
      { rel: "icon", url: "/favicon-16x16.png", type: "image/png" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* Meta Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];
            t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1266243378829253');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1266243378829253&ev=PageView&noscript=1"
          />
        </noscript>

        <TopBar />
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
          {children}
        </main>
        <div className="w-full py-4">
          <div className="max-w-7xl mx-auto flex justify-center items-center gap-2">
            <p className="text-gray-800 font-medium text-base md:text-lg tracking-wide">
              EMAIL US:
            </p>
            <a
              href="mailto:sales@robinson-equipment.com"
              className="text-[#c9a227] text-base md:text-lg font-semibold hover:underline hover:text-[#a17f0d] transition duration-300"
            >
              	sales@robinson-equipment.com
            </a>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}