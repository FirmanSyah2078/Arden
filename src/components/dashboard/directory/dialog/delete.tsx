"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface GenericDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  endpoint: string
  id: string | number
  itemName?: string
  onSuccess?: () => void
}

export function GenericDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  endpoint,
  id,
  itemName, 
  onSuccess
}: GenericDeleteDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch(`${endpoint}?id=${id}`, {
        method: "DELETE",
      })

      const json = await res.json().catch(() => ({}))

      if (!res.ok || json.status === 'fail') {
        throw new Error(json.message || "Failed to delete data")
      }

      const name = itemName || "Selected data"
      toast.success(`"${name}" has been permanently deleted`)

      onOpenChange(false)
      
      // 🔥 VAKSIN LAYAR HITAM
      setTimeout(() => {
        document.body.style.pointerEvents = "auto"
        document.body.style.overflow = "auto"
        document.body.removeAttribute("data-scroll-locked")
        router.refresh()
        if (onSuccess) onSuccess()
      }, 200)

    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Data cannot be deleted at this time.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-100">
        <AlertDialogHeader className="gap-2">
          <AlertDialogTitle className="flex items-center gap-2 text-white">
            <Trash2 className="w-4 h-4 text-red-500" />
            {title}
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-gray-400 text-sm" asChild>
            <div>
              {description}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={loading} className="bg-transparent border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleDelete()
            }}
            disabled={loading}
            className="group bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-all"
          >
            {loading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Trash2 className="w-3 h-3 mr-2 group-hover:ar-tada" />}
            Delete Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}