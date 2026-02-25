import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import TopBar from "./components/layout/TopBar";
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
export const metadata = {
  title: "Robinson Equipment Co.",
  description:
    "Robinson Equipment Co. offers high-quality agricultural and construction machinery. Explore durable tractors, excavators, and equipment solutions designed for efficiency and performance.",
  icons: {
    icon: "/favicon.ico",               // favicon principal
    apple: "/apple-touch-icon.png",     // optional pentru iOS
    other: [
      { rel: "icon", url: "/favicon-32x32.png", type: "image/png" },
      { rel: "icon", url: "/favicon-16x16.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
              href="mailto:shertzerequipmentgroup@gmail.com"
              className="text-[#c9a227] text-base md:text-lg font-semibold hover:underline hover:text-[#a17f0d] transition duration-300"
            >
              shertzerequipmentgroup@gmail.com
            </a>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}