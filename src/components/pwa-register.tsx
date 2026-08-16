"use client"

import { useEffect } from "react"
import { syncPendingAttendance } from "@/lib/offline/attendance-sync"
import { syncQueuedProfileUpdate } from "@/lib/offline/profile-queue"

export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) =>
          console.log(
            "Service Worker terdaftar dengan scope:",
            registration.scope
          )
        )
        .catch((error) =>
          console.error("Pendaftaran Service Worker gagal:", error)
        )
    }
  }, [])

  useEffect(() => {
    const sync = async () => {
      try {
        const result = await syncPendingAttendance()
        const profileResult = await syncQueuedProfileUpdate()

        if (result.synced > 0 || result.rejected > 0 || profileResult.synced) {
          console.log("Offline attendance sync:", result)
          window.dispatchEvent(new Event("attendance-queue-updated"))
        }
      } catch (error) {
        console.error("Offline attendance sync gagal:", error)
      }
    }

    // Coba sync ketika aplikasi dibuka.
    void sync()

    // Coba sync ketika koneksi kembali.
    window.addEventListener("online", sync)

    return () => {
      window.removeEventListener("online", sync)
    }
  }, [])

  return null
}
