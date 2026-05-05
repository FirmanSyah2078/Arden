// src/hooks/globals/use-generate.ts
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { toast } from "sonner";
import imageCompression from 'browser-image-compression';
import { 
  GeneratorSettingsData, 
  QRErrorCorrectionLevel, 
  QRDotType, 
  QRCornerSquareType, 
  QRCornerDotType,
  QRShape
} from "@/types/api";

const defaultSettings: GeneratorSettingsData = { 
  qrShape: "square", qrColor: "#000000", bgColor: "#ffffff",
  isBgTransparent: true, qrPattern: "square", errorLevel: "Q",
  cornerSquare: "square", cornerSquareColor: "#000000",
  cornerDot: "square", cornerDotColor: "#000000",
  isCustomColor: false, 
  qrIcon: "", imageSize: 0.4, iconMargin: 5, hideDotsBg: true 
};

export function useGenerate() {
  const [settings, setSettings] = useState<GeneratorSettingsData>(defaultSettings);
  const [savedSettings, setSavedSettings] = useState<GeneratorSettingsData>(defaultSettings);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [previewPayload, setPreviewPayload] = useState("ARD-48CCDA39");

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<any>(null);

  // finalBgColor ini HANYA untuk dilempar ke SVG generator, bukan untuk UI input
  const finalBgColor = settings.isBgTransparent ? "transparent" : (settings.bgColor || "#ffffff");

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/generate");
      const json = await res.json();
      if (json.status === "success" && json.data) {
        
        // 🔥 SELF-HEALING LOGIC (MENCEGAH HYDRATION ERROR)
        // Jika di database terlanjur tersimpan kata "transparent" dari error lama,
        // kita paksa ubah jadi Hex agar <input type="color"> tidak ngambek.
        const dbBgColor = json.data.bgColor;
        const isTransparent = dbBgColor === "transparent" || json.data.isBgTransparent;
        const safeBgColor = (dbBgColor === "transparent" || !dbBgColor) ? "#ffffff" : dbBgColor;

        const serverData = { 
          ...settings, 
          ...json.data, 
          isBgTransparent: isTransparent,
          bgColor: safeBgColor // UI akan selalu menerima HEX yang valid
        };
        
        setSettings(serverData);
        setSavedSettings(serverData);
      }
    } catch (error) { 
      // Silently fail
    } finally { 
      setIsLoading(false); 
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsMounted(true);
    loadSettings(); 
  }, [loadSettings]);

  // =====================================================================
  // 🔥 ENGINE: RENDER QR CODE
  // =====================================================================
  const renderQRCode = async (forceNew = false) => {
    if (!isMounted || typeof window === "undefined" || !qrRef.current) return;
    const QRCodeStyling = (await import("qr-code-styling")).default;

    const options = {
      width: 180, height: 180, type: "svg" as const,
      shape: settings.qrShape as QRShape,
      data: previewPayload,
      ...(settings.qrIcon ? { image: settings.qrIcon } : { image: "" }), 
      
      qrOptions: { errorCorrectionLevel: settings.errorLevel as QRErrorCorrectionLevel },
      dotsOptions: { color: settings.qrColor || "#000000", type: settings.qrPattern as QRDotType },
      backgroundOptions: { color: finalBgColor }, // Di sini baru dia pakai transparent
      cornersSquareOptions: { type: settings.cornerSquare as QRCornerSquareType, color: settings.cornerSquareColor || settings.qrColor },
      cornersDotOptions: { type: settings.cornerDot as QRCornerDotType, color: settings.cornerDotColor || settings.qrColor },
      imageOptions: {
        crossOrigin: "anonymous", 
        imageSize: settings.imageSize,
        margin: settings.iconMargin, hideBackgroundDots: settings.hideDotsBg ?? true
      }
    };

    if (!qrCode.current || forceNew) {
      qrRef.current.innerHTML = ""; 
      qrCode.current = new QRCodeStyling(options); 
      qrCode.current.append(qrRef.current);
    } else {
      qrCode.current.update(options);
    }
  };

  useEffect(() => {
    renderQRCode();
  }, [settings, finalBgColor, previewPayload, isMounted]);

  const forceRefresh = async () => {
    await renderQRCode(true);
    toast.success("Engine Cache Cleared!", { duration: 1500 });
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
    setSelectedFile(null);
    setPreviewPayload("ARD-48CCDA39");
    toast.info("Engine reset to default state.", { duration: 2000 });
  };

  const handleChange = (field: keyof GeneratorSettingsData, value: string | boolean | number) => {
    setSettings(prev => {
      let next = { ...prev, [field]: value };
      
      if (field === "qrIcon" && value !== "") {
        if (next.errorLevel === "L" || next.errorLevel === "M") {
          next.errorLevel = "Q";
          toast.info("Error Correction locked to 'Q' to support image.", { duration: 2000 });
        }
      }

      if (field === "isCustomColor" && value === false) {
        next.cornerSquareColor = next.qrColor;
        next.cornerDotColor = next.qrColor;
      }

      if (field === "qrColor" && !next.isCustomColor) {
        next.cornerSquareColor = value as string;
        next.cornerDotColor = value as string;
      }

      if (field === "qrIcon" && value === "") {
         setSelectedFile(null);
      }

      return next;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { 
      toast.error("Image is too large. Max 2MB allowed.");
      return;
    }

    const toastId = toast.loading("Compressing and analyzing image...");

    try {
      const options = {
        maxSizeMB: 0.2, 
        maxWidthOrHeight: 512, 
        useWebWorker: true, 
      };

      const compressedFile = await imageCompression(file, options);
      const previewUrl = URL.createObjectURL(compressedFile);
      
      handleChange("qrIcon", previewUrl);
      setSelectedFile(compressedFile);
      
      toast.success("Image preview ready!", { id: toastId, duration: 1500 });
    } catch (error) {
      toast.error("Image compression failed.", { id: toastId });
    }
  };

  const handleDownload = async (extension: "png" | "svg") => {
    if (!qrCode.current) return;
    try {
      await qrCode.current.download({ name: "ARDEN-QRCode", extension });
      toast.success(`QR Code downloaded as ${extension.toUpperCase()}`);
    } catch (err) { toast.error("Failed to download QR Code"); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSaving(true);
    
    let finalIconUrl = settings.qrIcon;

    try {
      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", selectedFile);

        toast.loading("Uploading logo to Storage...");
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fileFormData });
        const uploadJson = await uploadRes.json();
        
        if (!uploadRes.ok) throw new Error(uploadJson.message);
        finalIconUrl = uploadJson.data.url; 

        if (savedSettings.qrIcon && savedSettings.qrIcon.startsWith("http")) {
          await fetch(`/api/upload?url=${encodeURIComponent(savedSettings.qrIcon)}`, { method: 'DELETE' });
        }
      } 
      else if (settings.qrIcon === "" && savedSettings.qrIcon && savedSettings.qrIcon.startsWith("http")) {
         await fetch(`/api/upload?url=${encodeURIComponent(savedSettings.qrIcon)}`, { method: 'DELETE' });
         finalIconUrl = "";
      }

      toast.loading("Saving configuration...");
      
      // 🔥 PENTING: Kita tidak lagi menimpa bgColor menjadi "transparent" di database.
      // Database murni akan menyimpan Hex Code terakhir yang dipilih (history warnanya aman).
      const dataToSave = { ...settings, qrIcon: finalIconUrl };

      const res = await fetch("/api/generate", { 
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dataToSave) 
      });
      const json = await res.json();
      
      if (json.status === "success") {
        setSettings(dataToSave);
        setSavedSettings(dataToSave);
        setSelectedFile(null); 
        toast.dismiss();
        toast.success("Generator settings updated!");
      } else throw new Error(json.message);
    } catch (err: any) { 
      toast.dismiss();
      toast.error(`Failed to save: ${err.message}`); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const isDraftModified = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings) || selectedFile !== null;
  }, [settings, savedSettings, selectedFile]);

  return { 
    settings, isLoading, isSaving, isDraftModified, finalBgColor, qrRef,
    previewPayload, setPreviewPayload, forceRefresh, resetToDefault,
    handleChange, handleImageUpload, handleDownload, handleSave, 
  };
}