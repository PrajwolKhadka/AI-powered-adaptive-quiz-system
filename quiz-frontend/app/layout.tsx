import type { Metadata } from "next";
import { DM_Mono, DM_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Maanak",
  description: "AI powered adaptive quiz system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        {children}
         </AuthProvider>
        <footer className="bg-gray-900 text-gray-300 py-6">
          <div className="container mx-auto px-6 text-center">
            <p>© {new Date().getFullYear()} Maanak - AI Powered Adaptive Quiz System. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
