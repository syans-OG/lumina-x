import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/dom/Cursor";
import Navbar from "@/components/dom/Navbar";
import Preloader from "@/components/dom/Preloader";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumina X | Audiophile Experience",
  description: "A cinematic 3D landing page for the Lumina X Headset.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}
      >
        <SmoothScroll>
          <Preloader />
          {/* <Navbar /> */}
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
