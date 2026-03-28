import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-heading" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Talgap — AI-Powered Candidate Assessment",
  description: "Research-backed assessment platform for inVision U. Beyond essays, beyond tests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`h-full antialiased ${inter.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body className="min-h-full flex flex-col bg-white text-[#010042]">
        {children}
      </body>
    </html>
  );
}
