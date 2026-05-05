import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { PeriodSettingsData, ApiResponse } from "@/types/api";
import { RefreshCw, Lightbulb, CheckCircle2, Save } from "lucide-react";

type SettingsState = {
  [K in keyof PeriodSettingsData]: number | string;
};

export function useFourPhase() {
  const [settings, setSettings] = useState<SettingsState>({
    min_duration: 5, standard_duration: 7, max_duration: 10, over_limit: 30,
  });

  const [savedSettings, setSavedSettings] = useState<PeriodSettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/menstrual");
        const result: ApiResponse<PeriodSettingsData> = await response.json();
        
        if (result.status === "success" && result.data) {
          setSettings(result.data);
          setSavedSettings(result.data);
        }
      } catch (error) { toast.error("Failed to load database settings."); } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);

  const handleChange = (field: keyof PeriodSettingsData, value: any) => { setSettings((prev) => ({ ...prev, [field]: value })); };

  const handleBlur = (field: keyof PeriodSettingsData) => {
    // 1. Ambil snapshot data saat ini
    let next = { ...settings };
    if (next[field] === "") return;
    
    const numVal = Number(next[field]);
    let toastMessage = ""; // Siapkan wadah untuk pesan toast

    // 2. Lakukan kalkulasi
    if (field === "min_duration") {
      if (numVal < 1) {
        next.min_duration = 1;
      } else if (settings.standard_duration !== "" && numVal >= Number(settings.standard_duration)) {
        next.min_duration = Number(settings.standard_duration) - 1; 
        toastMessage = "Minimum auto-corrected";
      }
    } else if (field === "standard_duration") {
      if (settings.min_duration !== "" && numVal <= Number(settings.min_duration)) {
        next.standard_duration = Number(settings.min_duration) + 1; 
        toastMessage = "Standard auto-corrected";
      } else if (settings.max_duration !== "" && numVal >= Number(settings.max_duration)) {
        next.standard_duration = Number(settings.max_duration) - 1; 
        toastMessage = "Standard auto-corrected";
      }
    } else if (field === "max_duration") {
      if (settings.standard_duration !== "" && numVal <= Number(settings.standard_duration)) {
        next.max_duration = Number(settings.standard_duration) + 1; 
        toastMessage = "Maximum auto-corrected";
      } else if (settings.over_limit !== "" && numVal >= Number(settings.over_limit)) {
        next.max_duration = Number(settings.over_limit) - 1; 
        toastMessage = "Maximum auto-corrected";
      }
    } else if (field === "over_limit") {
      if (settings.max_duration !== "" && numVal <= Number(settings.max_duration)) {
        next.over_limit = Number(settings.max_duration) + 1; 
        toastMessage = "Over limit auto-corrected";
      } else if (numVal > 30) {
        next.over_limit = 30; 
        toastMessage = "Over limit capped at 30 Days";
      }
    }

    // 3. Simpan state
    setSettings(next);
    
    // 4. Panggil toast DILUAR fungsi setState agar aman dari efek pantul React Strict Mode!
    if (toastMessage) {
      toast.info(toastMessage, { duration: 1500 });
    }
  };

  const calculated = useMemo(() => {
    let min = Number(settings.min_duration) || 1; 
    let std = Number(settings.standard_duration) || (min + 1);
    let max = Number(settings.max_duration) || (std + 1); 
    let over = Number(settings.over_limit) || (max + 1);
    
    if (std <= min) std = min + 1; 
    if (max <= std) max = std + 1; 
    if (over <= max) over = max + 1;

    const totalScale = over > 30 ? 30 : over;
    return { min, std, max, over, totalScale };
  }, [settings]);

  const handleSave = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const hasEmpty = settings.min_duration === "" || settings.standard_duration === "" || settings.max_duration === "" || settings.over_limit === "";
    const payloadToSave: PeriodSettingsData = { min_duration: calculated.min, standard_duration: calculated.std, max_duration: calculated.max, over_limit: calculated.over };

    setIsSaving(true);
    try {
      const response = await fetch("/api/menstrual", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadToSave) });
      const result: ApiResponse<PeriodSettingsData> = await response.json();
      if (result.status === "success") {
        setSettings(payloadToSave); setSavedSettings(payloadToSave);
        if (hasEmpty) toast.info("Empty fields auto-filled and saved.", { duration: 3000 });
        else toast.success("Menstrual logic updated successfully!");
      } else throw new Error(result.error || "API Error");
    } catch (error: any) { toast.error(`Failed to update logic: ${error.message}`); } finally { setIsSaving(false); }
  };

  const isDraftModified = useMemo(() => {
    if (!savedSettings) return false;
    return (Number(settings.min_duration) !== savedSettings.min_duration || Number(settings.standard_duration) !== savedSettings.standard_duration || Number(settings.max_duration) !== savedSettings.max_duration || Number(settings.over_limit) !== savedSettings.over_limit);
  }, [settings, savedSettings]);

  const bannerState = useMemo(() => {
    if (isLoading || isSaving) return { variant: "muted", icon: RefreshCw, spin: true, title: "Processing Data...", desc: "Synchronizing algorithm parameters with database.", btnText: "Processing...", btnIcon: RefreshCw, action: () => {} };
    if (isDraftModified) return { variant: "primary", icon: Lightbulb, spin: true, title: "Unsaved Logic Changes", desc: "You have modified the algorithm parameters. Save to apply to the system.", btnText: "Update Logic", btnIcon: Save, action: handleSave };
    return { variant: "muted", icon: CheckCircle2, spin: false, title: "Logic Saved", desc: "Current configuration is active and mapped to the attendance algorithm.", btnText: "Updated", btnIcon: CheckCircle2, action: () => {} };
  }, [isLoading, isSaving, isDraftModified, handleSave]);

  return { settings, calculated, isLoading, isSaving, isDraftModified, bannerState, handleChange, handleBlur, handleSave };
}