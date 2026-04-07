"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils" 

export type FieldConfig = {
  name: string
  label: string
  type: "text" | "number" | "password" | "select"
  placeholder?: string
  options?: { label: string; value: string }[]
  required?: boolean
  description?: string
  readOnly?: boolean
  halfWidth?: boolean 
}

interface GenericCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  endpoint: string
  fields: FieldConfig[]
  onSuccess?: () => void
}

export function GenericCreateDialog({
  open,
  onOpenChange,
  title,
  description = "Fill out the form below to add a new record.",
  endpoint,
  fields,
  onSuccess
}: GenericCreateDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, string | number | undefined>>({})

  const toTitleCase = (str: string) => {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  }

  const handleInputChange = (key: string, value: string | number) => {
    let finalValue = value;
    if (typeof value === "string") {
      if (key === "name" || key === "full_name") finalValue = toTitleCase(value);
      else if (key === "class_name") finalValue = value.toUpperCase();
      // 🔥 FIX: Paksa username menjadi huruf kecil semua dan tanpa spasi
      else if (key === "username") finalValue = value.toLowerCase().replace(/\s+/g, '');
    }
    setFormData((prev) => ({ ...prev, [key]: finalValue }))
  }

  const isFormValid = useMemo(() => {
    return fields.every((field) => {
      if (!field.required) return true;
      const val = formData[field.name];
      return val !== undefined && val !== "" && val !== null;
    });
  }, [formData, fields]);

  const getIdentifierName = () => {
    return formData.name || formData.full_name || formData.class_name || formData.username || "New Record";
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const json = await res.json()
      
      if (!res.ok || json.status === 'fail') {
        throw new Error(json.message || "Failed to save data")
      }

      toast.success(`"${getIdentifierName()}" has been successfully added`)

      onOpenChange(false)
      setFormData({}) 
      
      setTimeout(() => {
        document.body.style.pointerEvents = "auto"
        document.body.style.overflow = "auto"
        document.body.removeAttribute("data-scroll-locked")
        router.refresh()
        if (onSuccess) onSuccess()
      }, 200)

    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "System error occurred")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "bg-[#050505] border border-white/10 text-white placeholder:text-gray-600 outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/40 hover:border-white/30 shadow-none transition-all duration-300"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#0a0a0a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-400">{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 py-4">
          {fields.map((field) => (
            <div 
              key={field.name} 
              className={cn("grid gap-2", field.halfWidth ? "col-span-1" : "sm:col-span-2")}
            >
              <Label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === "select" ? (
                <Select onValueChange={(val) => handleInputChange(field.name, val)}>
                  <SelectTrigger className={inputClass}>
                    <SelectValue placeholder={field.placeholder || "Select..."} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                    {field.options?.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-white/10 focus:text-white cursor-pointer">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  className={`${inputClass} ${field.readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
                  readOnly={field.readOnly}
                  value={formData[field.name]?.toString() || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-white/10 bg-transparent text-gray-300 hover:bg-white/5 transition-colors">
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !isFormValid} 
            className={`
              group border-0 font-medium transition-all
              ${(!isFormValid) ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200 shadow-md"}
            `}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4 group-hover:ar-bounce-x" />} 
            Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}