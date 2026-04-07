"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, SaveAll } from "lucide-react"
import { toast } from "sonner"
import { FieldConfig } from "./create"
import { cn } from "@/lib/utils" 

interface GenericEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  endpoint: string
  initialData: Record<string, unknown>
  idField: string 
  fields: FieldConfig[]
  onSuccess?: () => void
}

export function GenericEditDialog({
  open,
  onOpenChange,
  title,
  description = "Make changes to the form below.",
  endpoint,
  initialData,
  idField,
  fields,
  onSuccess
}: GenericEditDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (initialData) setFormData({ ...initialData })
  }, [initialData, open])

  const toTitleCase = (str: string) => str.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());

  const handleInputChange = (key: string, value: string | number | boolean) => {
    let finalValue = value;
    if (typeof value === "string") {
      if (key === "name" || key === "full_name") finalValue = toTitleCase(value);
      else if (key === "class_name") finalValue = value.toUpperCase();
      // 🔥 FIX: Paksa username menjadi huruf kecil semua dan tanpa spasi
      else if (key === "username") finalValue = value.toLowerCase().replace(/\s+/g, '');
    }
    setFormData((prev) => ({ ...prev, [key]: finalValue }))
  }

  const isChanged = useMemo(() => {
    if (!initialData || !formData) return false;
    return fields.some((field) => {
      const initialVal = initialData[field.name];
      const currentVal = formData[field.name];
      return String(initialVal ?? "").trim() !== String(currentVal ?? "").trim();
    });
  }, [formData, initialData, fields]);

  const isValid = useMemo(() => {
    return fields.every(field => {
        if(!field.required) return true;
        const val = formData[field.name];
        return val !== "" && val !== null && val !== undefined;
    });
  }, [formData, fields]);

  const getName = () => formData.full_name || formData.class_name || formData.name || formData.username || "Data";

  async function handleSubmit() {
    setLoading(true)
    try {
      const payload = { ...formData, [idField]: initialData[idField] }
      
      const res = await fetch(endpoint, {
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || json.status === 'fail') throw new Error(json.message || "Failed to update data")

      toast.success(`"${getName()}" has been successfully updated`)

      onOpenChange(false)
      
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
      <DialogContent className="sm:max-w-112.5 bg-[#0a0a0a] border-white/10 text-white">
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
              <Label className="text-gray-400 text-xs uppercase tracking-wide font-medium">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === "select" ? (
                <Select 
                  value={formData[field.name]?.toString() || ""} 
                  onValueChange={(val) => handleInputChange(field.name, val)}
                >
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
                  className={`${inputClass} ${field.readOnly ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder={field.placeholder}
                  value={(formData[field.name] as string | number) || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  readOnly={field.readOnly}
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
            disabled={loading || !isChanged || !isValid} 
            className={`
              group border-0 font-medium transition-all
              ${(!isChanged || !isValid) ? "bg-white/10 text-gray-500 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200 shadow-md"}
            `}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SaveAll className="mr-2 h-4 w-4 group-hover:ar-bounce-x" />} 
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}