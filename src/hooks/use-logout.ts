// src/hooks/use-logout.ts
import { useRouter } from "next/navigation"

export function useLogout() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      
      const cookies = ["user_role", "auth_token", "user_name", "user_photo", "user_username"]
      cookies.forEach(name => {
        document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      })
      localStorage.clear()

      // 🔥 FIX: Hapus paksa atribut pengunci layar milik Shadcn/Radix UI
      document.body.style.pointerEvents = "";
      document.body.removeAttribute("data-scroll-locked");

      // Gunakan window.location.href untuk Hard Reload (Paling Ampuh!)
      // Ini akan menyapu bersih sisa-sisa state React dan DOM yang nyangkut
      window.location.href = "/login"

    } catch (error) {
      document.body.style.pointerEvents = "";
      document.body.removeAttribute("data-scroll-locked");
      window.location.href = "/login"
    }
  }

  return { handleLogout }
}