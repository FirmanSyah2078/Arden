import type {AttendancePayload} from '@/lib/offline/attendance-queue'

type PrayerSchedule = {
  fajr: string
dhuhr: string
asr: string
maghrib: string
  isha: string
}

type PrayerCache = {
  date: string
  schedule: PrayerSchedule
  trackedPrayers: string[]
  cachedAt: string
}

type OfflineGatekeeperResult = {
  status: 'Normal' | 'Late' | 'Rejected' | 'Unavailable'
  message: string
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function getJakartaDate(value: Date) {
  return new Intl
      .DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .format(value)
}

function getJakartaMinutes(value: Date) {
  const parts = new Intl
                    .DateTimeFormat('en-GB', {
                      timeZone: 'Asia/Jakarta',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                    .formatToParts(value)

  const hours = Number(
      parts.find((part) => part.type === 'hour')?.value,
  )
  const minutes = Number(
      parts.find((part) => part.type === 'minute')?.value,
  )

  return hours * 60 + minutes
}

export function validateOfflineAttendance(
  payload: AttendancePayload,
): OfflineGatekeeperResult {
  const rawCache = localStorage.getItem('arden-prayer-cache')

  if (!rawCache) {
    return {
      status: 'Unavailable', message: 'Offline schedule cache is unavailable.',
    }
  }

  let cache: PrayerCache

  try {
    cache = JSON.parse(rawCache) as PrayerCache
  } catch {
    return {
      status: 'Unavailable', message: 'Offline schedule cache is invalid.',
    }
  }

  const capturedAt = new Date(payload.captured_at)

  if (Number.isNaN(capturedAt.getTime())) {
    return {
      status: 'Unavailable', message: 'Captured attendance time is invalid.',
    }
  }

  const capturedDate = getJakartaDate(capturedAt)

  if (cache.date !== capturedDate) {
    return {
      status: 'Unavailable', message: 'Offline schedule is not for today.',
    }
  }

  if (!cache.trackedPrayers.includes(payload.time)) {
    return {
      status: 'Rejected', message: `${payload.time} is not active for today.`,
    }
  }

  const prayerTime =
      cache.schedule[payload.time.toLowerCase() as keyof PrayerSchedule]

      if (!prayerTime) {
    return {
      status: 'Unavailable',
          message: ` Offline time for ${payload.time} is unavailable.`,
    }
  }

  const elapsedMinutes = getJakartaMinutes(capturedAt) - toMinutes(prayerTime)

  if (elapsedMinutes < 0) {
    return {
      status: 'Rejected',
          message: `${payload.time} session has not started yet.`,
    }
  }

  if (elapsedMinutes > 60) {
    return {
      status: 'Rejected',
          message: `${payload.time} session is permanently closed.`,
    }
  }

  if (elapsedMinutes > 20 && payload.method === 'Scan QR') {
    return {
      status: 'Rejected', message: 'QR Scanner is closed. Use Manual input.',
    }
  }

  if (elapsedMinutes > 20) {
    return {
      status: 'Late', message: 'Attendance is within the Late window.',
    }
  }

  return {
    status: 'Normal', message: 'Attendance is within the Normal window.',
  }
}
