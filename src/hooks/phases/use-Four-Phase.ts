// src/hooks/menstrual/use-menstrual.ts
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { PeriodSettingsData, ApiResponse } from "@/types/api";
import { RefreshCw, Lightbulb, CheckCircle2, Save } from "lucide-react";

export interface MenstrualSettings {
  minDuration: number | string;
  standardDuration: number | string;
  maxDuration: number | string;
  overLimit: number | string;
}

export function useFourPhase() {
  const [settings, setSettings] = useState<MenstrualSettings>({
    minDuration: 5, standardDuration: 7, maxDuration: 10, overLimit: 30,
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

  const handleChange = (field: keyof MenstrualSettings, value: any) => { setSettings((prev) => ({ ...prev, [field]: value })); };

  const handleBlur = (field: keyof MenstrualSettings) => {
    setSettings((prev) => {
      let next = { ...prev };
      if (next[field] === "") return next;
      const numVal = Number(next[field]);

      if (field === "minDuration") {
        if (numVal < 1) next.minDuration = 1;
        else if (prev.standardDuration !== "" && numVal >= Number(prev.standardDuration)) {
          next.minDuration = Number(prev.standardDuration) - 1; toast.info("Minimum auto-corrected", { duration: 1500 });
        }
      } else if (field === "standardDuration") {
        if (prev.minDuration !== "" && numVal <= Number(prev.minDuration)) {
          next.standardDuration = Number(prev.minDuration) + 1; toast.info("Standard auto-corrected", { duration: 1500 });
        } else if (prev.maxDuration !== "" && numVal >= Number(prev.maxDuration)) {
          next.standardDuration = Number(prev.maxDuration) - 1; toast.info("Standard auto-corrected", { duration: 1500 });
        }
      } else if (field === "maxDuration") {
        if (prev.standardDuration !== "" && numVal <= Number(prev.standardDuration)) {
          next.maxDuration = Number(prev.standardDuration) + 1; toast.info("Maximum auto-corrected", { duration: 1500 });
        } else if (prev.overLimit !== "" && numVal >= Number(prev.overLimit)) {
          next.maxDuration = Number(prev.overLimit) - 1; toast.info("Maximum auto-corrected", { duration: 1500 });
        }
      } else if (field === "overLimit") {
        if (prev.maxDuration !== "" && numVal <= Number(prev.maxDuration)) {
          next.overLimit = Number(prev.maxDuration) + 1; toast.info("Over limit auto-corrected", { duration: 1500 });
        } else if (numVal > 30) {
          next.overLimit = 30; toast.info("Over limit capped at 30 Days", { duration: 1500 });
        }
      }
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    let min = Number(settings.minDuration) || 1; let std = Number(settings.standardDuration) || (min + 1);
    let max = Number(settings.maxDuration) || (std + 1); let over = Number(settings.overLimit) || (max + 1);
    if (std <= min) std = min + 1; if (max <= std) max = std + 1; if (over <= max) over = max + 1;

    const hasEmpty = settings.minDuration === "" || settings.standardDuration === "" || settings.maxDuration === "" || settings.overLimit === "";
    const payloadToSave: PeriodSettingsData = { minDuration: min, standardDuration: std, maxDuration: max, overLimit: over };

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
    return (Number(settings.minDuration) !== savedSettings.minDuration || Number(settings.standardDuration) !== savedSettings.standardDuration || Number(settings.maxDuration) !== savedSettings.maxDuration || Number(settings.overLimit) !== savedSettings.overLimit);
  }, [settings, savedSettings]);

  const bannerState = useMemo(() => {
    if (isLoading || isSaving) return { variant: "muted", icon: RefreshCw, spin: true, title: "Processing Data...", desc: "Synchronizing algorithm parameters with database.", btnText: "Processing...", btnIcon: RefreshCw, action: () => {} };
    if (isDraftModified) return { variant: "primary", icon: Lightbulb, spin: true, title: "Unsaved Logic Changes", desc: "You have modified the algorithm parameters. Save to apply to the system.", btnText: "Update Logic", btnIcon: Save, action: handleSave };
    return { variant: "muted", icon: CheckCircle2, spin: false, title: "Logic Saved", desc: "Current configuration is active and mapped to the attendance algorithm.", btnText: "Updated", btnIcon: CheckCircle2, action: () => {} };
  }, [isLoading, isSaving, isDraftModified, handleSave]);

  return { settings, isLoading, isSaving, isDraftModified, bannerState, handleChange, handleBlur, handleSave };
}