import {
  addAttendanceToQueue,
  type AttendancePayload,
} from "@/lib/offline/attendance-queue"
import { validateOfflineAttendance } from "@/lib/offline/offline-gatekeeper"
import type { AttendanceDataMobile } from "@/types/api"
import { useCallback, useState } from "react"

export function useAttendance() {
  const [historyData, setHistoryData] = useState<AttendanceDataMobile[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  const fetchHistory = useCallback(async (activeTab: string) => {
    setIsLoadingHistory(true)

    try {
      const now = new Date()
      const offset = now.getTimezoneOffset() * 60000
      const localISODate = new Date(now.getTime() - offset)
        .toISOString()
        .split("T")[0]

      const res = await fetch(
        `/api/attendance?date=${localISODate}&time=${activeTab}`,
      )
      const json = await res.json()

      if (json.status === "success" && json.data) {
        setHistoryData(json.data.absensi)
      } else {
        setHistoryData([])
      }
    } catch {
      setHistoryData([])
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  const submitAttendance = async (payload: any) => {
    const syncStatus = (status: unknown) => {
      const value = String(status).toLowerCase()

      if (value === "haid" || value === "menstruation") {
        return "Menstruation"
      }

      if (value === "suci" || value === "pure") {
        return "Pure"
      }

      return "Pure"
    }

    const formattedPayload: AttendancePayload = {
      id_student: Number(payload.id_student),
      student_name: String(payload.student_name || "Unknown student"),
      student_nis: String(payload.student_nis || ""),
      class_name: String(payload.class_name || ""),
      time: String(payload.time),
      status: syncStatus(payload.status),
      method: payload.method === "Manual" ? "Manual" : "Scan QR",
      remarks: payload.remarks || "",
      captured_at: new Date().toISOString(),
      client_request_id: crypto.randomUUID(),
    }

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dtnew: formattedPayload,
        }),
      })

      // HTTP 4xx/5xx dikembalikan ke Alert agar server tetap menjadi
      // validator Gatekeeper terakhir. Hanya error jaringan yang masuk queue.
      return await res.json()
    } catch {
      // Pre-check lokal hanya filter awal. Server tetap memvalidasi ulang
      // setiap item ketika queue berhasil disinkronkan.
      const offlineCheck = validateOfflineAttendance(formattedPayload)

      if (offlineCheck.status === "Rejected") {
        return {
          status: "fail",
          message: offlineCheck.message,
          data: {
            offline: true,
            local_gatekeeper_status: "Rejected",
          },
        }
      }

      await addAttendanceToQueue(formattedPayload)
      window.dispatchEvent(new Event("attendance-queue-updated"))

      return {
        status: "queued",
        message:
          offlineCheck.status === "Unavailable"
            ? "Absensi disimpan dan akan divalidasi server saat koneksi kembali."
            : `Absensi disimpan. Pemeriksaan lokal: ${offlineCheck.status}. Menunggu sinkronisasi server.`,
        data: {
          offline: true,
          local_gatekeeper_status: offlineCheck.status,
          local_gatekeeper_message: offlineCheck.message,
          client_request_id: formattedPayload.client_request_id,
        },
      }
    }
  }

  return {
    historyData,
    isLoadingHistory,
    fetchHistory,
    submitAttendance,
  }
}
