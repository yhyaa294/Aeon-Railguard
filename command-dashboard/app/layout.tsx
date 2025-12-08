import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "AEON RAILGUARD | Command Center",
  description: "Smart City Emergency Response Platform - PT KAI Nexus",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${orbitron.variable} antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
