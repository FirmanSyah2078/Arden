import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. Space Grotesk (Variable)
const spaceGrotesk = localFont({
  src: "../fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-space-grotesk", // Variabel CSS
  weight: "300 700",
});

// 2. Inter (Variable + Italic)
const inter = localFont({
  src: [
    { path: "../fonts/Inter-VariableFont_opsz,wght.ttf", style: "normal" },
    { path: "../fonts/Inter-Italic-VariableFont_opsz,wght.ttf", style: "italic" },
  ],
  variable: "--font-inter", // Variabel CSS
  weight: "100 900",
});

// 3. Montserrat (Variable + Italic)
const montserrat = localFont({
  src: [
    { path: "../fonts/Montserrat-VariableFont_wght.ttf", style: "normal" },
    { path: "../fonts/Montserrat-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-montserrat", // Variabel CSS
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ARDEN",
  description: "Sistem Absensi Karakter Siswi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Gabungkan semua variable di className body */}
      {/* 'font-sans' di sini akan otomatis merujuk ke Inter karena settingan tailwind nanti */}
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${montserrat.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}