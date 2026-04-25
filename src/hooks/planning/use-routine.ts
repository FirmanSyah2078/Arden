// src/hooks/schedules/use-schedules.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { DailyPrayer } from "@/types/api";

export interface DaySchedule {
  day: string;
  isActive: boolean;
  trackedPrayers: DailyPrayer[];
}

export function useRoutine() {
  const defaultWeekly: DaySchedule[] = [
    { day: "Monday", isActive: true, trackedPrayers: ["Dhuhr", "Asr"] },
    { day: "Tuesday", isActive: true, trackedPrayers: ["Dhuhr", "Asr"] },
    { day: "Wednesday", isActive: true, trackedPrayers: ["Dhuhr", "Asr"] },
    { day: "Thursday", isActive: true, trackedPrayers: ["Dhuhr", "Asr"] },
    { day: "Friday", isActive: true, trackedPrayers: ["Dhuhr"] },
    { day: "Saturday", isActive: false, trackedPrayers: [] },
    { day: "Sunday", isActive: false, trackedPrayers: [] },
  ];

  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(defaultWeekly);
  const [savedWeeklySchedule, setSavedWeeklySchedule] = useState<DaySchedule[]>(defaultWeekly);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/prayers/routine");
      const json = await res.json();

      if (json.status === "success" && json.data) {
        const mappedSchedule = json.data.map((dbRow: any) => {
          const tracked: DailyPrayer[] = [];
          if (dbRow.track_fajr) tracked.push("Fajr");
          if (dbRow.track_dhuhr) tracked.push("Dhuhr");
          if (dbRow.track_asr) tracked.push("Asr");
          if (dbRow.track_maghrib) tracked.push("Maghrib");
          if (dbRow.track_isha) tracked.push("Isha");
          return { day: dbRow.day_name, isActive: dbRow.is_active, trackedPrayers: tracked };
        });

        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        mappedSchedule.sort((a: any, b: any) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
        
        if (mappedSchedule.length > 0) {
          setWeeklySchedule(mappedSchedule);
          setSavedWeeklySchedule(mappedSchedule);
        }
      }
    } catch (error) { toast.error("Failed to load schedules"); } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const toggleDayActive = (dayName: string, active: boolean) => {
    setWeeklySchedule(prev => prev.map(s => s.day === dayName ? { ...s, isActive: active } : s));
  };

  const togglePrayerTracked = (dayName: string, prayer: DailyPrayer) => {
    setWeeklySchedule(prev => prev.map(s => {
      if (s.day === dayName) {
        const isTracked = s.trackedPrayers.includes(prayer);
        const newPrayers = isTracked ? s.trackedPrayers.filter(p => p !== prayer) : [...s.trackedPrayers, prayer];
        return { ...s, trackedPrayers: newPrayers };
      }
      return s;
    }));
  };

  const handleSave = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    setIsSaving(true);
    try {
      const res = await fetch("/api/prayers/routine", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(weeklySchedule) });
      const json = await res.json();
      if (json.status === "success") {
        setSavedWeeklySchedule(weeklySchedule); 
        toast.success("Academic schedules updated successfully!");
      } else throw new Error(json.message);
    } catch (err) { toast.error("Failed to save schedules."); } finally { setIsSaving(false); }
  };

  const isDraftModified = JSON.stringify(weeklySchedule) !== JSON.stringify(savedWeeklySchedule);

  return { weeklySchedule, isLoading, isSaving, isDraftModified, toggleDayActive, togglePrayerTracked, handleSave };
}