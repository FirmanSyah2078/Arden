import { useState, useCallback } from 'react';
import { AttendanceDataMobile } from '@/types/api';

export function useAttendance() {
  const [historyData, setHistoryData] = useState<AttendanceDataMobile[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = useCallback(async (activeTab: string) => {
    setIsLoadingHistory(true);
    try {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISODate = new Date(now.getTime() - offset).toISOString().split('T')[0];

      const res = await fetch(`/api/attendance?date=${localISODate}&time=${activeTab}`);
      const json = await res.json();

      if (json.status === 'success' && json.data) {
        setHistoryData(json.data.absensi);
      } else {
        setHistoryData([]);
      }
    } catch (error) {
      setHistoryData([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const submitAttendance = async (payload: any) => {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dtnew: payload })
    });
    return await res.json();
  };

  return { historyData, isLoadingHistory, fetchHistory, submitAttendance };
}