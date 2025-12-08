import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
