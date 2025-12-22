import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = () => {
    setIsLoading(true)
    
    // 1. Hapus Cookie 'user_role' (Set umurnya jadi 0 detik)
    // Pastikan path dan namanya SAMA PERSIS dengan saat login
    document.cookie = "user_role=; path=/; max-age=0;"

    // 2. Redirect ke Halaman Depan/Login
    // Gunakan 'replace' agar user tidak bisa klik tombol 'Back' browser buat balik ke dashboard
    router.replace("/login")
    
    // 3. Refresh Router (Penting di Next.js App Router!)
    // Ini memaksa Server Components mengecek ulang cookie (yang sudah hilang),
    // sehingga Middleware akan bekerja memblokir akses jika user mencoba maksa masuk lagi.
    router.refresh()
  }

  return {
    handleLogout,
    isLoading
  }
}