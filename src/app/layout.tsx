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

// 4. Plus Jakarta Sans (BARU - Font Tambahan)
const plusJakarta = localFont({
  src: [
    { path: "../fonts/PlusJakartaSans-VariableFont_wght.ttf", style: "normal" },
    { path: "../fonts/PlusJakartaSans-Italic-VariableFont_wght.ttf", style: "italic" },
  ],
  variable: "--font-plus-jakarta", // Nama variabel CSS baru
  weight: "200 800",
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
    <html lang="en" className="dark">
      <body
        className={`
          ${inter.variable} 
          ${spaceGrotesk.variable} 
          ${montserrat.variable} 
          ${plusJakarta.variable} 
          font-sans antialiased bg-[#000000] text-white selection:bg-indigo-500/30
        `}
      >
        {children}
      </body>
    </html>
  );
}