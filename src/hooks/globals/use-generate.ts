// src/hooks/globals/use-generate.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useGenerate() {
  const [settings, setSettings] = useState({ 
    qrColor: "#000000", 
    bgColor: "#ffffff",
    isBgTransparent: true, 
    qrPattern: "square", 
    errorLevel: "Q",
    cornerSquare: "square",
    cornerDot: "square",
    // Parameter Baru untuk Icon
    qrIcon: "", // Base64 string gambar
    iconMargin: 5, // Jarak default 5px
    hideDotsBg: true // Hapus dot di belakang icon
  });
  
  const [savedSettings, setSavedSettings] = useState(settings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/globals/generate");
      const json = await res.json();
      if (json.status === "success" && json.data) {
        const isTransparent = json.data.bgColor === "transparent" || json.data.isBgTransparent;
        const serverData = { ...settings, ...json.data, isBgTransparent: isTransparent };
        setSettings(serverData);
        setSavedSettings(serverData);
      }
    } catch (error) { 
      // Silently fail
    } finally { 
      setIsLoading(false); 
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Fungsi khusus untuk menangani upload gambar lokal menjadi Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // Batas 1MB
        toast.error("Image is too large. Max 1MB allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("qrIcon", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSaving(true);
    
    const dataToSave = { ...settings };
    if (dataToSave.isBgTransparent) {
      dataToSave.bgColor = "transparent";
    }

    try {
      const res = await fetch("/api/globals/generate", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        // Note: Menyimpan base64 panjang ke database mungkin perlu tipe data TEXT/LONGTEXT di Prisma
        body: JSON.stringify(dataToSave) 
      });
      const json = await res.json();
      if (json.status === "success") {
        setSavedSettings(settings);
        toast.success("Generator settings updated!");
      } else throw new Error(json.message);
    } catch (err) { 
      toast.error("Failed to save generator settings."); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const isDraftModified = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  return { settings, isLoading, isSaving, isDraftModified, handleChange, handleImageUpload, handleSave };
}