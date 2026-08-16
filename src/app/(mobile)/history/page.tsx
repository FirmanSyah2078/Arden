"use client"

import { useEffect, useState } from "react"
import { ClipboardClock, WifiOff } from "lucide-react"
import { UnifiedHeader } from "@/components/mobile/ui/unified-header"
import { useAttendance } from "@/hooks/mobile/use-attendance"
import { formatTime } from "@/lib/date"
import { useSholat } from "@/hooks/mobile/use-sholat"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";


// --- LIST COMPONENT (Symmetry Luxury Implementation) ---
const ListContent = ({
  isLoadingHistory,
  historyData,
  hasPrayers,
}: {
  isLoadingHistory: boolean
  historyData: any[]
  hasPrayers: boolean
}) => {
  if (isLoadingHistory) {
    return (
      <div className="flex w-full flex-col gap-3 pb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex w-full items-center">
            <div className="flex flex-1 animate-pulse items-center gap-4 rounded-2xl border border-white/5 bg-[#1F1E23] p-3 shadow-sm">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-zinc-800" />

              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="h-4 w-32 rounded-full bg-zinc-800" />
                  <div className="h-3 w-20 rounded-full bg-zinc-800" />
                </div>

                <div className="h-3 w-12 shrink-0 rounded-full bg-zinc-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!hasPrayers) {
    return (
      <div className="flex h-full py-50 flex-col items-center justify-center rounded-3xl px-6 text-center shadow-inner">
        <ClipboardClock className="mb-3 h-12 w-12 text-zinc-500" />
        <p className="text-xs font-medium tracking-wide text-zinc-500">
          No prayer schedule for today
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-col gap-0 pb-2">
        <ul className="flex w-full flex-col gap-3">
          {historyData.length > 0 ? (
            historyData.map((item, idx) => (
              <li key={idx}>
                <div className="flex w-full items-center">
                  <div className="flex flex-1 items-center gap-4 rounded-2xl border border-white/5 bg-[#1F1E23] p-3 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2A292F] text-sm font-bold text-white shadow-inner">
                      {item.tbl_students.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <div className="flex min-w-0 flex-col">
                        <p className="truncate text-sm leading-tight font-semibold text-white">
                          {item.tbl_students.full_name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-white/40 uppercase">
                          <span className="text-white/60">
                            {item.tbl_students.tbl_classes?.class_name || "N/A"}
                          </span>
                          <span className="opacity-20">•</span>
                          <span className="font-mono tracking-wide">
                            {item.tbl_students.nis}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-mono text-[10px] leading-none text-white/60">
                          {formatTime(item.created_at)} WIB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <div className="flex h-full py-50 flex-col items-center justify-center rounded-3xl px-6 text-center shadow-inner">
              <ClipboardClock className="mb-3 h-12 w-12 text-zinc-500" />
              <p className="text-xs font-medium tracking-wide text-zinc-500">
                No history available
              </p>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const router = useRouter()
  const { displayStatus, availablePrayers, isLoading: isPrayerLoading } = useSholat()
  const [activeTab, setActiveTab] = useState<string>("")
  const { historyData, isLoadingHistory, fetchHistory } = useAttendance()

  const prayerTimes = availablePrayers.map((prayer) => ({
    id: prayer,
    label: prayer,
  }))

  useEffect(() => {
    if (availablePrayers.length === 0) {
      setActiveTab("")
      return
    }
    setActiveTab((current) =>
      availablePrayers.includes(current as any)
        ? current
        : availablePrayers.find((prayer) => prayer === displayStatus) ||
        availablePrayers[0]
    )
  }, [availablePrayers, displayStatus])

  useEffect(() => {
    if (activeTab) fetchHistory(activeTab)
  }, [activeTab, fetchHistory])

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#151419] px-5 pt-4 font-sans">
      <UnifiedHeader />
      {typeof navigator !== "undefined" && !navigator.onLine && (
        <div className="mb-2 flex items-center gap-1.5 text-[10px] text-amber-300/70">
          <WifiOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Offline view — showing the last cached server history</span>
        </div>
      )}

      {/* TAB NAVIGATION - Persistent/Fixed at the top */}
      {prayerTimes.length > 0 && (
        <div className="mt-4 mb-4 flex h-12 w-full items-center justify-between gap-1 rounded-2xl border border-white/5 bg-[#1F1E23] p-1 shadow-inner">
          {prayerTimes.map((time) => (
            <button
              key={time.id}
              onClick={() => setActiveTab(time.id)}
              className={`h-full flex-1 rounded-xl text-[10px] font-bold transition-all duration-300 ${activeTab === time.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
                }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      )}

      {/* BODY - The Invisible Boundary Zone (Zero-Offside) */}
      <div
        className="custom-scrollbar flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style jsx>{`
          div {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex flex-col gap-6 pb-6">
          <ListContent
            isLoadingHistory={isPrayerLoading || (availablePrayers.length > 0 && (isLoadingHistory || !activeTab))}
            historyData={historyData}
            hasPrayers={availablePrayers.length > 0}
          />
        </div>
      </div>

      {/* FOOTER - The Safe Zone (No Overlap) */}
      <div className="flex shrink-0 items-center justify-center bg-transparent px-4 pt-4 pb-6">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="h-14 w-full max-w-sm rounded-2xl border-white/10 bg-zinc-900 font-semibold text-white/80 transition-all hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
        >
          Back
        </Button>
      </div>
    </div >
  )
}
