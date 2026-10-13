import { Geist } from "next/font/google";
import { Barlow_Condensed } from "next/font/google";
import { storeConfig } from "@/lib/store-config";
import { CartProvider } from "@/context/cart-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: storeConfig.seo.defaultTitle,
  description: storeConfig.seo.defaultDescription,
  metadataBase: new URL(storeConfig.seo.siteUrl),
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: storeConfig.seo.defaultTitle,
    description: storeConfig.seo.defaultDescription,
    siteName: storeConfig.name,
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
