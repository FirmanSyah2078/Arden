// src/hooks/globals/use-generate.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

// 🔥 FIX TYPESCRIPT: Mendeklarasikan tipe union secara spesifik
type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";
type DotType = "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
type CornerSquareType = "dot" | "square" | "extra-rounded" | "rounded" | "classy" | "classy-rounded";
type CornerDotType = "dot" | "square";

export function useGenerate() {
  const [settings, setSettings] = useState({ 
    qrColor: "#000000", 
    bgColor: "#ffffff",
    isBgTransparent: true, 
    qrPattern: "square", 
    errorLevel: "Q",
    cornerSquare: "square",
    cornerDot: "square",
    qrIcon: "", 
    iconMargin: 5, 
    hideDotsBg: true 
  });
  
  const [savedSettings, setSavedSettings] = useState(settings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isMounted, setIsMounted] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<any>(null);

  const finalBgColor = settings.isBgTransparent ? "transparent" : (settings.bgColor || "#ffffff");
  const previewPayload = "ARD-48CCDA39";

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

  useEffect(() => {
    setIsMounted(true);
    loadSettings(); 
  }, [loadSettings]);

  // =====================================================================
  // 🔥 ENGINE: INIT & UPDATE QR CODE PREVIEW
  // =====================================================================
  useEffect(() => {
    if (!isMounted || typeof window === "undefined") return;

    const initQRCode = async () => {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      
      if (!qrCode.current) {
        qrCode.current = new QRCodeStyling({
          width: 180,
          height: 180,
          type: "svg", 
          data: previewPayload,
          ...(settings.qrIcon ? { image: settings.qrIcon } : {}), 
          
          // 🔥 FIX TYPESCRIPT: Penambahan `as Type` pada parameter
          qrOptions: {
            errorCorrectionLevel: settings.errorLevel as ErrorCorrectionLevel
          },
          dotsOptions: {
            color: settings.qrColor || "#000000",
            type: settings.qrPattern as DotType,
          },
          backgroundOptions: {
            color: finalBgColor,
          },
          cornersSquareOptions: {
            type: settings.cornerSquare as CornerSquareType,
          },
          cornersDotOptions: {
            type: settings.cornerDot as CornerDotType,
          },
          imageOptions: {
            crossOrigin: "anonymous",
            margin: settings.iconMargin || 5,
            hideBackgroundDots: settings.hideDotsBg ?? true
          }
        });

        if (qrRef.current) {
          qrRef.current.innerHTML = "";
          qrCode.current.append(qrRef.current);
        }
      }
    };

    initQRCode();
  }, [isMounted]);

  // Live Update
  useEffect(() => {
    if (qrCode.current && isMounted) {
      qrCode.current.update({
        data: previewPayload,
        ...(settings.qrIcon ? { image: settings.qrIcon } : { image: "" }), 
        
        // 🔥 FIX TYPESCRIPT: Lakukan hal yang sama di bagian update
        qrOptions: { 
          errorCorrectionLevel: settings.errorLevel as ErrorCorrectionLevel 
        },
        dotsOptions: { 
          color: settings.qrColor, 
          type: settings.qrPattern as DotType 
        },
        backgroundOptions: { color: finalBgColor },
        cornersSquareOptions: { 
          type: settings.cornerSquare as CornerSquareType 
        },
        cornersDotOptions: { 
          type: settings.cornerDot as CornerDotType 
        },
        imageOptions: {
          margin: settings.iconMargin,
          hideBackgroundDots: settings.hideDotsBg
        }
      });
    }
  }, [
    settings.qrColor, 
    finalBgColor, 
    settings.qrPattern, 
    settings.errorLevel, 
    settings.cornerSquare, 
    settings.cornerDot,
    settings.qrIcon,
    settings.iconMargin,
    settings.hideDotsBg,
    isMounted 
  ]);

  const handleChange = (field: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { 
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

  return { 
    settings, 
    isLoading, 
    isSaving, 
    isDraftModified, 
    handleChange, 
    handleImageUpload, 
    handleSave,
    qrRef,
    finalBgColor,
    previewPayload 
  };
}