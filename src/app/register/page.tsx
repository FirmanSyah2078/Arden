"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "", 
    username: "",
    password: "",
    role: "Admin" 
  })

  // Fungsi dinamis untuk menangani input
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 🔥 FIX: Menambahkan created_at secara eksplisit di frontend
      const payload = {
        ...formData,
        created_at: new Date().toISOString()
      }

      const res = await fetch("/api/user", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      // Mencegah Crash HTML 500 jika API salah rute
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Terjadi kesalahan sistem pada server.");
      }

      const json = await res.json()

      if (!res.ok || json.status === 'fail') {
        throw new Error(json.message || "Gagal mendaftar")
      }

      toast.success("Akun Admin berhasil dibuat! Silakan login.")
      router.push("/login") 
      
    } catch (error: any) { 
      toast.error(error.message || "Terjadi kesalahan saat mendaftar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md border-white/10 bg-card text-card-foreground shadow-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">System Setup</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Buat akun Admin pertama untuk sistem ini.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                id="name" 
                placeholder="Ex: Super Admin" 
                className="bg-black/20 border-white/10 focus:border-primary/50"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex w-full items-center overflow-hidden rounded-md border border-white/10 bg-black/20 focus-within:border-primary/50 transition-all">
                <span className="flex select-none items-center px-3 text-[13px] text-white/40 border-r border-white/10 bg-white/5">@</span>
                <Input 
                  id="username" 
                  placeholder="admin" 
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  required
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="******" 
                className="bg-black/20 border-white/10 focus:border-primary/50"
                required
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Role Access</Label>
              <Select 
                value={formData.role} 
                onValueChange={(val) => handleChange("role", val)}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-black/20 border-white/10 focus:ring-primary/50">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0d0d0d] text-white">
                  <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                  <SelectItem value="Pemantau">Pemantau</SelectItem>
                  <SelectItem value="Pelaksana">Pelaksana</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">
                *Pilih Admin untuk akun pertama.
              </p>
            </div>

          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Membuat Akun..." : "Create First Account"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Sudah punya akun? <Link href="/login" className="text-primary hover:underline font-medium">Login disini</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}