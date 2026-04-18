// src/hooks/preferences/use-preferences.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { INDONESIAN_CITIES } from "@/lib/indonesia-cities";

export function useGlobalPreferences() {
  const [settings, setSettings] = useState({ country: "Indonesia", city: "Kota Blitar / Jawa Timur", timezone: "Asia/Jakarta", method: "20" });
  const [savedCity, setSavedCity] = useState("Kota Blitar / Jawa Timur");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/prayers/geographic");
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setSettings({ country: json.data.country, city: json.data.city, timezone: json.data.timezone, method: json.data.method });
        setSavedCity(json.data.city);
      }
    } catch (error) { toast.error("Failed to load geographic settings"); } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const handleChange = (field: string, value: string) => {
    setSettings(prev => {
      const next = { ...prev, [field]: value };
      if (field === "city") {
        const found = INDONESIAN_CITIES.find((c) => next.city.includes(c.name));
        if (found) next.timezone = found.timezone;
      }
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSaving(true);
    try {
      const res = await fetch("/api/prayers/geographic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      const json = await res.json();
      if (json.status === "success") {
        setSavedCity(settings.city);
        toast.success("Geographic parameters updated!");
      } else throw new Error(json.message);
    } catch (err) { toast.error("Failed to save settings."); } finally { setIsSaving(false); }
  };

  const isDraftModified = settings.city !== savedCity;

  return { settings, isLoading, isSaving, isDraftModified, handleChange, handleSave };
}