import {getPendingAttendance, removeAttendanceFromQueue,} from '@/lib/offline/attendance-queue'

let isSyncing = false

export type AttendanceSyncResult = {
  synced: number
rejected: number
  remaining: number
}

export async function syncPendingAttendance(): Promise<AttendanceSyncResult> {
  if (isSyncing) {
    return {
      synced: 0, rejected: 0, remaining: 0,
    }
  }

  isSyncing = true

  let synced = 0
  let rejected = 0

  try {
    const pendingItems = await getPendingAttendance()

    for (const item of pendingItems) {
      try {
        const response = await fetch('/api/attendance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dtnew: item.payload,
          }),
        })

        const result = await response.json().catch(() => null)

        if (response.ok && result?.status === 'success') {
          await removeAttendanceFromQueue(item.id)
          synced += 1
          continue
        }

        /*
         * HTTP 400 dari Gatekeeper berarti request sudah diproses
         * tetapi ditolak secara permanen, misalnya:
         * - sesi belum dimulai
         * - sesi sudah ditutup
         * - siswa sudah absen
         * - QR harus diganti Manual
         *
         * Jangan biarkan item seperti ini retry selamanya.
         */
        // if (response.status >= 400 && response.status < 500) {
        //   await removeAttendanceFromQueue(item.id)
        //   rejected += 1
        //   continue
        // }

        if (response.status >= 400 && response.status < 500) {
          console.error('Offline attendance ditolak server:', {
            status: response.status,
            result,
            payload: item.payload,
          })

              await removeAttendanceFromQueue(item.id)
          rejected += 1
          continue
        }

        /*
         * HTTP 5xx berarti kemungkinan masalah server.
         * Item tetap disimpan dan dicoba lagi nanti.
         */
        break
      } catch {
        /*
         * Network error:
         * Cloudflared belum tersedia, internet masih mati,
         * atau server belum bisa dijangkau.
         *
         * Item jangan dihapus.
         */
        break
      }
    }

    const remainingItems = await getPendingAttendance()

    return {
      synced, rejected, remaining: remainingItems.length,
    }
  } finally {
    isSyncing = false
  }
}