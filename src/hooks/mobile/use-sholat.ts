import {DailyPrayer, PrayerCacheData} from '@/types/api';
import {useEffect, useMemo, useState} from 'react';

// =============================================================================
// DEBUG SECTION: Simulasikan waktu sholat (Contoh: '19:30' untuk Isya)
// Set ke null untuk menggunakan waktu asli.
// =============================================================================
const DEBUG_TIME: string|null = null;
// =============================================================================

interface MobilePrayerSchedule extends PrayerCacheData {
  Sunrise: string;
}

const PRAYERS: DailyPrayer[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

function getJakartaDateParts(date: Date) {
  const parts = new Intl
                    .DateTimeFormat('en-CA', {
                      timeZone: 'Asia/Jakarta',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                    .formatToParts(date);

  return {
    date: `${parts.find((part) => part.type === 'year')?.value}-${
        parts.find((part) => part.type === 'month')?.value}-${
        parts.find((part) => part.type === 'day')?.value}`,
    day: new Intl
             .DateTimeFormat(
                 'en-US', {timeZone: 'Asia/Jakarta', weekday: 'long'})
             .format(date),
  };
}

export function useSholat() {
  const [schedule, setSchedule] = useState<MobilePrayerSchedule|null>(null);
  const [trackedPrayers, setTrackedPrayers] = useState<DailyPrayer[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const now = new Date();
        const {date, day} = getJakartaDateParts(now);
        const [cacheResponse, routineResponse] = await Promise.all([
          fetch(`/api/prayers/sync?date=${date}`),
          fetch('/api/prayers/routine'),
        ]);
        const cacheJson = await cacheResponse.json();
        const routineJson = await routineResponse.json();
        console.log('[useSholat] cacheJson:', cacheJson)
        console.log('[useSholat] routineJson:', routineJson)
        console.log('[useSholat] date/day:', date, day)


        if (cacheJson.status !== 'success' || !cacheJson.data) {
          throw new Error('Today prayer cache is unavailable');
        }

        const routine = routineJson.status === 'success' &&
                Array.isArray(routineJson.data) ?
            routineJson.data.find((item: any) => item.day_name === day) :
            null;

        const tracked = routine?.is_active ?
            PRAYERS.filter(
                (prayer) => routine[`track_${prayer.toLowerCase()}`]) :
            [];

        setTrackedPrayers(tracked);
        setSchedule({...cacheJson.data, Sunrise: cacheJson.data.dhuhr});

        console.log('[useSholat] writing prayer cache')

        localStorage.setItem(
            'arden-prayer-cache',
            JSON.stringify({
              date,
              schedule: cacheJson.data,
              trackedPrayers: tracked,
              cachedAt: new Date().toISOString(),
            }),
        );
      } catch (err) {
        console.error(err);
        setSchedule(null);
        setTrackedPrayers([]);
      }
    };
    fetchJadwal();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      if (DEBUG_TIME) {
        const [hours, minutes] = DEBUG_TIME.split(':').map(Number);
        const mockDate = new Date();
        mockDate.setHours(hours, minutes, 0, 0);
        setCurrentTime(mockDate);
      } else {
        setCurrentTime(new Date());
      }
    };

    updateTime();  // Initial call
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeData = useMemo(() => {
    if (!schedule)
      return {
        displayStatus: 'Dhuhr',
        timeRange: '00:00 - 00:00',
        activeScanner: 'Dhuhr' as DailyPrayer,
        availablePrayers: [] as DailyPrayer[],
      };

    const getMins = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();

    let stat = 'Dhuhr', range = '-', active: DailyPrayer = 'Dhuhr';

    if (nowMins >= getMins(schedule.fajr) &&
        nowMins < getMins(schedule.dhuhr)) {
      stat = 'Fajr';
      active = 'Fajr';
      range = `${schedule.fajr} - ${schedule.dhuhr}`;
    } else if (
        nowMins >= getMins(schedule.dhuhr) && nowMins < getMins(schedule.asr)) {
      stat = 'Dhuhr';
      active = 'Dhuhr';
      range = `${schedule.dhuhr} - ${schedule.asr}`;
    } else if (
        nowMins >= getMins(schedule.asr) &&
        nowMins < getMins(schedule.maghrib)) {
      stat = 'Asr';
      active = 'Asr';
      range = `${schedule.asr} - ${schedule.maghrib}`;
    } else if (
        nowMins >= getMins(schedule.maghrib) &&
        nowMins < getMins(schedule.isha)) {
      stat = 'Maghrib';
      active = 'Maghrib';
      range = `${schedule.maghrib} - ${schedule.isha}`;
    } else {
      stat = 'Isha';
      active = 'Isha';
      range = `${schedule.isha} - ${schedule.fajr}`;
    }

    const availablePrayers = trackedPrayers;
    const fallbackActive = availablePrayers[0] || active;
    const activeScanner =
        availablePrayers.includes(active) ? active : fallbackActive;

    return {
      displayStatus: stat,
      timeRange: range,
      activeScanner,
      availablePrayers
    };
  }, [currentTime, schedule, trackedPrayers]);

  return {schedule, currentTime, trackedPrayers, ...timeData};
}