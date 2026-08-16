import type {AttendanceDataMobile} from '@/types/api'

const HISTORY_CACHE_KEY = 'arden-history-cache'

type HistoryCache = {
  date: string
  time: string
  records: AttendanceDataMobile[]
  cachedAt: string
}

function getKey(date: string, time: string) {
  return `${HISTORY_CACHE_KEY}:${date}:${time}`;
  }

export function saveHistoryCache(
  date: string,
  time: string,
  records: AttendanceDataMobile[],
) {
  const payload: HistoryCache = {
    date,
    time,
    records,
    cachedAt: new Date().toISOString(),
  }

                                localStorage.setItem(
                                    getKey(date, time), JSON.stringify(payload))
}

export function getHistoryCache(
  date: string,
  time: string,
): HistoryCache | null {
  const raw = localStorage.getItem(getKey(date, time))

  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed.records)) {
      return null
    }

    return parsed as HistoryCache
  } catch {
    return null
  }
}