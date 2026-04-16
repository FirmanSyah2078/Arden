// src/hooks/integrations/use-integrations.ts
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { PrayerTimes, PrayerCacheData } from "@/types/api";
import { Database, CheckCircle2, RefreshCw, ShieldAlert, TriangleAlert, Copy, Save } from "lucide-react";

const ALADHAN_API_URL = process.env.NEXT_PUBLIC_API_TIME_SHOLAT || "https://api.aladhan.com";

interface ExtendedPrayerTimes extends PrayerTimes { Sunrise: string }

export function useDataIntegrations() {
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [geoConfig, setGeoConfig] = useState({ city: "", country: "", method: "" });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncingDB, setIsSyncingDB] = useState(false);
  const [isCopyingYesterday, setIsCopyingYesterday] = useState(false);
  const [apiStatus, setApiStatus] = useState<"connected" | "error" | "syncing">("syncing");

  const [schedule, setSchedule] = useState<ExtendedPrayerTimes | null>(null);
  const [cachedSchedule, setCachedSchedule] = useState<PrayerCacheData | null>(null);

  const fetchJadwal = useCallback(async () => {
    setApiStatus("syncing"); setIsLoading(true);
    try {
      // 1. Dapatkan config Geografis dari DB dulu
      const resGeo = await fetch("/api/prayers/geographic");
      const jsonGeo = await resGeo.json();
      let city = "Kota Blitar"; let country = "Indonesia"; let method = "20"; let isActive = true;
      
      if (jsonGeo.status === "success" && jsonGeo.data) {
        city = jsonGeo.data.city; country = jsonGeo.data.country; method = jsonGeo.data.method; isActive = jsonGeo.data.is_api_active;
        setGeoConfig({ city, country, method }); setSyncEnabled(isActive);
      }

      // 2. Tarik DB & API
      const now = new Date();
      const aladhanDateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      const dbDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      const resDB = await fetch(`/api/prayers/sync?date=${dbDateStr}`);
      const jsonDB = await resDB.json();
      setCachedSchedule(jsonDB.status === "success" && jsonDB.data ? jsonDB.data : null);

      if (!isActive) { setApiStatus("error"); setSchedule(null); setIsLoading(false); return; }

      let cleanCity = city.includes("/") ? city.split("/")[0].replace(/(Kota Adm\.|Kota|Kab\.)/gi, "").trim() : city;
      const resAladhan = await fetch(`${ALADHAN_API_URL}/v1/timingsByCity/${aladhanDateStr}?city=${encodeURIComponent(cleanCity)}&country=${encodeURIComponent(country)}&method=${method}`);
      const jsonAladhan = await resAladhan.json();

      if (jsonAladhan.code === 200) { setSchedule(jsonAladhan.data.timings); setApiStatus("connected"); } 
      else throw new Error("API Response Error");
    } catch (err) { setApiStatus("error"); setSchedule(null); } finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchJadwal(); }, [fetchJadwal]);

  const toggleApiState = async (active: boolean) => {
    setSyncEnabled(active);
    try {
      await fetch("/api/prayers/geographic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_api_active: active }) });
      toast.success(active ? "API connection enabled!" : "API offline. System running on local cache.");
      fetchJadwal(); // Refresh UI setelah toggle
    } catch (err) { toast.error("Failed to update API state."); }
  };

  const isCacheSynced = useMemo(() => {
    if (!schedule || !cachedSchedule) return false;
    return (schedule.Fajr === cachedSchedule.fajr && schedule.Dhuhr === cachedSchedule.dhuhr && schedule.Asr === cachedSchedule.asr && schedule.Maghrib === cachedSchedule.maghrib && schedule.Isha === cachedSchedule.isha);
  }, [schedule, cachedSchedule]);

  const handleSyncToDB = async () => {
    if (!schedule) return;
    setIsSyncingDB(true);
    try {
      const now = new Date();
      const payload: PrayerCacheData = { date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`, fajr: schedule.Fajr, dhuhr: schedule.Dhuhr, asr: schedule.Asr, maghrib: schedule.Maghrib, isha: schedule.Isha };
      const res = await fetch("/api/prayers/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.status === "success") { setCachedSchedule(payload); toast.success("Schedule cached to DB!"); } else throw new Error(json.message);
    } catch (error) { toast.error("Sync failed."); } finally { setIsSyncingDB(false); }
  };

  const handleCopyYesterday = async () => {
    setIsCopyingYesterday(true);
    try {
      const res = await fetch("/api/prayers/copy-fallback", { method: "POST" });
      const json = await res.json();
      if (json.status === "success") { toast.success("Fallback recovered!"); fetchJadwal(); } else throw new Error();
    } catch (err) { toast.error("Missing yesterday's cache."); } finally { setIsCopyingYesterday(false); }
  };

  const prayerRanges = useMemo(() => {
    if (!schedule) return null;
    return { Fajr: `${schedule.Fajr} - ${schedule.Sunrise}`, Dhuhr: `${schedule.Dhuhr} - ${schedule.Asr}`, Asr: `${schedule.Asr} - ${schedule.Maghrib}`, Maghrib: `${schedule.Maghrib} - ${schedule.Isha}`, Isha: `${schedule.Isha} - ${schedule.Fajr}` };
  }, [schedule]);

  const bannerState = useMemo(() => {
    if (isLoading || isSyncingDB || isCopyingYesterday) return { variant: "muted", icon: RefreshCw, spin: true, title: "Loading Data...", desc: "Synchronizing configuration and astronomical data.", btnText: "Processing...", btnIcon: RefreshCw, action: () => {} };
    if (!cachedSchedule && !syncEnabled) return { variant: "primary", icon: TriangleAlert, spin: false, title: "System Offline - Missing Data!", desc: "API is disabled and local DB is empty. Recover yesterday's schedule.", btnText: "Recover Fallback", btnIcon: Copy, action: handleCopyYesterday };
    if (!cachedSchedule && syncEnabled) return { variant: "primary", icon: Database, spin: false, title: "Missing Local Cache!", desc: "Local database is empty. Force sync now to fetch data from API.", btnText: "Force Sync Now", btnIcon: Save, action: handleSyncToDB };
    if (!syncEnabled && cachedSchedule) return { variant: "muted", icon: ShieldAlert, spin: false, title: "API Offline - Fallback Active", desc: "External API disabled. Mobile app is safely using local database cache.", btnText: "Fallback Secured", btnIcon: CheckCircle2, action: () => {} };
    if (!isCacheSynced) return { variant: "primary", icon: RefreshCw, spin: false, title: "Out of Sync", desc: "Local database does not match the current astronomical endpoint.", btnText: "Force Sync Now", btnIcon: Save, action: handleSyncToDB };
    return { variant: "muted", icon: CheckCircle2, spin: false, title: "Automated Daily Sync Active", desc: "Today's schedule is safely secured in the local database.", btnText: "Synced Today", btnIcon: CheckCircle2, action: () => {} };
  }, [ isLoading, isSyncingDB, isCopyingYesterday, syncEnabled, cachedSchedule, isCacheSynced, handleCopyYesterday, handleSyncToDB ]);

  return { syncEnabled, isLoading, apiStatus, prayerRanges, bannerState, toggleApiState };
}