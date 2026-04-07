import { useState, useEffect, useMemo } from 'react';
import { DailyPrayer, PrayerTimes } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_TIME_SHOLAT || 'https://api.aladhan.com';

interface ExtendedPrayerTimes extends PrayerTimes { Sunrise: string; }

export function useSholat() {
  const [schedule, setSchedule] = useState<ExtendedPrayerTimes | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const now = new Date();
        const res = await fetch(`${API_URL}/v1/timings/${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}?latitude=-8.0954&longitude=112.1609&method=20`);
        const json = await res.json();
        if (json.code === 200) setSchedule(json.data.timings);
      } catch (err) { console.error(err); }
    };
    fetchJadwal();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeData = useMemo(() => {
    if (!schedule) return { displayStatus: 'Dhuhr', timeRange: '00:00 - 00:00', activeScanner: 'Dhuhr' as DailyPrayer };

    const getMins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();

    let stat = 'Dhuhr', range = '-', active: DailyPrayer = 'Dhuhr';
    
    if (nowMins >= getMins(schedule.Fajr) && nowMins < getMins(schedule.Sunrise)) { stat = 'Fajr'; active = 'Fajr'; range = `${schedule.Fajr} - ${schedule.Sunrise}`; }
    else if (nowMins >= getMins(schedule.Sunrise) && nowMins < getMins(schedule.Dhuhr)) { stat = 'Sunrise'; active = 'Dhuhr'; range = `${schedule.Sunrise} - ${schedule.Dhuhr}`; }
    else if (nowMins >= getMins(schedule.Dhuhr) && nowMins < getMins(schedule.Asr)) { stat = 'Dhuhr'; active = 'Dhuhr'; range = `${schedule.Dhuhr} - ${schedule.Asr}`; }
    else if (nowMins >= getMins(schedule.Asr) && nowMins < getMins(schedule.Maghrib)) { stat = 'Asr'; active = 'Asr'; range = `${schedule.Asr} - ${schedule.Maghrib}`; }
    else if (nowMins >= getMins(schedule.Maghrib) && nowMins < getMins(schedule.Isha)) { stat = 'Maghrib'; active = 'Maghrib'; range = `${schedule.Maghrib} - ${schedule.Isha}`; }
    else { stat = 'Isha'; active = 'Isha'; range = `${schedule.Isha} - ${schedule.Fajr}`; }

    return { displayStatus: stat, timeRange: range, activeScanner: active };
  }, [currentTime, schedule]);

  return { schedule, currentTime, ...timeData };
}