import type { Metadata } from "next";

// Ini opsional: Untuk mengganti judul Tab browser
export const metadata: Metadata = {
  title: "Login System - ARDEN",
  description: "Secure Access Portal",
};

// WAJIB: Harus ada export default function
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Render halaman page.tsx di sini */}
      {children}
    </section>
  );
}