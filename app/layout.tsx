import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Financial Sentinel",
  description: "AI-Powered Fraud Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* We removed the className={geistSans.variable} parts here */}
      <body className="antialiased font-sans bg-slate-950">
        {children}
      </body>
    </html>
  );
}