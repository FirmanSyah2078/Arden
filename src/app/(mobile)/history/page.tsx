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
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl px-6 text-center">
        <ClipboardClock className="mb-3 h-12 w-12 text-zinc-500" />
        <p className="text-xs font-medium tracking-wide text-zinc-500">
          No prayer schedule for today
        </p>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="flex w-full flex-1 flex-col gap-0 pb-2">
        <ul className="flex w-full flex-1 flex-col gap-3">
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
            <div className="flex flex-1 flex-col items-center justify-center rounded-3xl px-6 text-center">
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

  const activeTabIndex = prayerTimes.findIndex(
    (time) => time.id === activeTab
  )

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
      {(isPrayerLoading || prayerTimes.length > 0) && (
        <div className="relative mt-4 mb-4 flex h-12 w-full items-center gap-1 rounded-2xl border border-white/5 bg-[#141317] p-1 shadow-inner">
          {prayerTimes.length > 0 ? (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 left-1 rounded-xl border border-indigo-500/50 bg-indigo-600 shadow-[0_6px_16px_-5px_rgba(79,70,229,0.55)] transition-transform duration-[220ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{
                  width: `calc((100% - 0.5rem) / ${prayerTimes.length})`,
                  transform: `translateX(${Math.max(activeTabIndex, 0) * 100}%)`,
                }}
              />
              {prayerTimes.map((time) => (
                <button
                  key={time.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === time.id}
                  onClick={() => setActiveTab(time.id)}
                  className={`relative z-10 h-full flex-1 rounded-xl text-[10px] font-bold transition-colors duration-[220ms] ${activeTab === time.id
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                    }`}
                >
                  {time.label}
                </button>
              ))}
            </>
          ) : (
            <div className="h-full w-full animate-pulse rounded-xl bg-zinc-800" />
          )}
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
        <div className="flex min-h-full flex-col pb-6">
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
