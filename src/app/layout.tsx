import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const vt323 = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-vt323" });

export const metadata: Metadata = {
  title: "Voidline: A questionnable encounter",
  description: "While reaching for the stars, you find trolls in your way. Violence is the right response in this case.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={vt323.className}>{children}</body>
    </html>
  );
}
