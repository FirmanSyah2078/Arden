import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function useLogin() {
  const router = useRouter()
  
  // State Input
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  // State UI
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  
  // State Device
  const [isMobile, setIsMobile] = useState(false)

  // 1. Cek Device Presisi
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isSmallScreen = window.innerWidth < 768
      
      setIsMobile(isMobileDevice || isSmallScreen)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  // 2. Fungsi Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    try {
      const { data: user, error } = await supabase
        .from('tbl_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single()

      if (error || !user) {
        throw new Error("Username atau Password salah.")
      }

      // --- LOGIKA STRICT ARDEN ---
      if (isMobile) {
        if (user.role === 'Pelaksana') {
           document.cookie = `user_role=${user.role}; path=/; max-age=86400`
           router.push('/app/home')
        } else {
           throw new Error("Fitur Manajemen wajib dibuka lewat Laptop/PC.")
        }
      } else {
        if (user.role === 'Admin' || user.role === 'Pemantau') {
           document.cookie = `user_role=${user.role}; path=/; max-age=86400`
           router.push('/dashboard')
        } else {
           throw new Error("Login Pelaksana wajib menggunakan Aplikasi HP.")
        }
      }

    } catch (err) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg("Terjadi kesalahan sistem.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    username, setUsername,
    password, setPassword,
    showPassword, setShowPassword,
    isLoading,
    errorMsg,
    handleLogin
  }
}