import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import TopBar from "./components/layout/TopBar";
import EmailLink from "./components/layout/EmailLink";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import SiteChrome, { SiteMain } from "./components/layout/SiteChrome";

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
  metadataBase: new URL("https://centralnewholland.com"), // pune domeniul tău real

  title: {
    default: "Central New Holland",
    template: "%s | Central New Holland",
  },

  description:
    "Central New Holland offers high-quality agricultural and construction machinery.",

  alternates: {
    canonical: "/", 
  },

  openGraph: {
    title: "Central New Holland",
    description:
      "High-quality agricultural and construction machinery.",
    url: "https://centralnewholland.com",
    siteName: "Central New Holland",
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

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

            fbq('init', '27782989024637922');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* Noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=27782989024637922&ev=PageView&noscript=1"
          />
        </noscript>

        <SiteChrome><TopBar /><Header /></SiteChrome>
        <SiteMain>{children}</SiteMain>
        <Analytics />
        <SiteChrome><div className="w-full py-4">
          <div className="max-w-7xl mx-auto flex justify-center items-center gap-2">
            <p className="text-gray-800 font-medium text-base md:text-lg tracking-wide">
              EMAIL US:
            </p>
          <EmailLink />
          </div>
        </div><Footer /></SiteChrome>
      </body>
    </html>
  );
}
