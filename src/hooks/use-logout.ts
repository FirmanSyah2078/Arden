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

      // 🔥 FIX: Beri jeda 200ms agar Shadcn/Radix UI sempat menghapus "Layar Hitam Bening" 
      // dan mengembalikan `pointer-events` pada tag <body>.
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 200)

    } catch (error) {
      setTimeout(() => {
        router.push("/login")
      }, 200)
    }
  }

  return { handleLogout }
}