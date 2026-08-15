"use client"

import React, { useState } from "react"
import { Calendar, QrCode } from "lucide-react"

import { QrCornerFrame } from "./qr-corner-frame"
import { F_LABEL } from "./fonts"
import type { IdentityCardData } from "./card-data"

interface ValidationHubPanelProps {
  data: Pick<IdentityCardData, "qrData" | "icode">
}

export function ValidationHubPanel({ data }: ValidationHubPanelProps) {
  const [hubTab, setHubTab] = useState<"calendar" | "qr">("calendar")
  const [calendarDate, setCalendarDate] = useState(new Date())

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  }
  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
  }

  const generateCalendarDays = () => {
    const year = calendarDate.getFullYear()
    const month = calendarDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let firstDayIndex = new Date(year, month, 1).getDay() - 1
    if (firstDayIndex === -1) firstDayIndex = 6

    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

    const blanks = Array(firstDayIndex).fill(null)
    const days = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1
      const isActiveCycle = dayNum >= 10 && dayNum <= 15
      return {
        day: dayNum,
        isActive: isActiveCycle,
        isToday: isCurrentMonth && today.getDate() === dayNum,
      }
    })

    // 💡 Selalu render tepat 42 slot (6 baris x 7 hari) — biar baris pertama
    // (yang sering cuma berisi 1-2 sel terisi) nggak jadi baris "paling
    // kurus" dan digencet duluan begitu tinggi grid kepepet.
    const totalCurrentSlots = blanks.length + days.length
    const remainingSlots = 42 - totalCurrentSlots
    const trailingBlanks = Array(remainingSlots).fill(null)

    return [...blanks, ...days, ...trailingBlanks]
  }

  const formattedMonth = calendarDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-[#0f0f12] shadow-xl">
      <div className="relative z-20 flex items-center justify-between border-b border-white/5 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-sm font-medium text-white">Validation Hub</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setHubTab("calendar")}
            data-active={hubTab === "calendar"}
            className={`sidebar-shine rounded-lg p-1.5 transition-colors duration-300 ${
              hubTab === "calendar"
                ? "bg-white/10 text-white"
                : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
            }`}
            title="Calendar View"
          >
            <Calendar size={15} />
          </button>
          <button
            onClick={() => setHubTab("qr")}
            data-active={hubTab === "qr"}
            className={`sidebar-shine rounded-lg p-1.5 transition-colors duration-300 ${
              hubTab === "qr" ? "bg-white/10 text-white" : "text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
            }`}
            title="Emergency QR"
          >
            <QrCode size={15} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-5">
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-white/5 bg-black/20 shadow-inner">
          <div className="relative grid flex-1 grid-cols-1 grid-rows-1">
            {/* CALENDAR VIEW */}
            <div
              className={`col-start-1 row-start-1 flex flex-col p-6 font-mono text-xs text-neutral-300 transition-all duration-700 ease-in-out ${
                hubTab === "calendar" ? "z-10 scale-100 opacity-100" : "pointer-events-none z-0 scale-95 opacity-0"
              }`}
            >
              <div className="mb-4 flex shrink-0 items-center justify-between border-b border-white/5 pb-4">
                <span className="font-semibold tracking-widest text-neutral-400 uppercase">{formattedMonth}</span>
                <div className="flex gap-4 text-neutral-500">
                  <button
                    onClick={handlePrevMonth}
                    className="text-[10px] tracking-widest uppercase transition-colors hover:text-white"
                  >
                    &lt; Prev
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="text-[10px] tracking-widest uppercase transition-colors hover:text-white"
                  >
                    Next &gt;
                  </button>
                </div>
              </div>

              <div className="mb-2 flex flex-1 flex-col justify-center">
                <div className="mx-auto grid w-full max-w-[260px] grid-cols-7 gap-x-2 gap-y-1.5 text-center">
                  {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((d) => (
                    <div key={d} className="pb-2 text-[10px] font-semibold tracking-widest text-neutral-500">
                      {d}
                    </div>
                  ))}

                  {generateCalendarDays().map((d, i) => {
                    // 💡 Kotak kosong (h-7) tetap dirender dengan tinggi eksplisit
                    // biar nggak jadi baris paling "kurus" di grid.
                    if (!d) return <div key={`empty-${i}`} aria-hidden="true" className="h-7" />

                    const baseStyle =
                      "flex items-center justify-center h-7 rounded-lg transition-colors cursor-pointer border"
                    const activeStyle = d.isToday
                      ? "border-orange-500/50 bg-orange-500/10 text-orange-400 font-bold"
                      : d.isActive
                        ? "border-white/10 bg-white/10 text-white font-bold"
                        : "border-transparent hover:border-white/5 hover:bg-white/[0.03]"

                    return (
                      <div key={i} className={`${baseStyle} ${activeStyle}`}>
                        {d.day}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-auto flex shrink-0 gap-6 border-t border-white/5 pt-4 text-[10px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500/50" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span>Active Cycle</span>
                </div>
              </div>
            </div>

            {/* QR VIEW */}
            <div
              className={`col-start-1 row-start-1 flex flex-col items-center justify-center p-6 transition-all duration-700 ease-in-out ${
                hubTab === "qr" ? "z-10 scale-100 opacity-100" : "pointer-events-none z-0 scale-95 opacity-0"
              }`}
            >
              <QrCornerFrame cornerSize="w-2 h-2" padding="p-2.5" className="mt-4 mb-6">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&color=d4d4d8&bgcolor=1c1d22&data=${encodeURIComponent(data.qrData || data.icode)}`}
                  alt="QR verifikasi"
                  className="h-[110px] w-[110px] opacity-90"
                />
              </QrCornerFrame>

              <h3 className="mb-2 font-sans text-xs font-bold tracking-widest text-neutral-300 uppercase">
                Emergency Access
              </h3>
              <p className="mb-6 max-w-[220px] text-center font-sans text-[10px] leading-relaxed text-neutral-500">
                Tunjukkan kode ini kepada Pelaksana untuk melakukan pemindaian secara manual.
              </p>

              <div className="mb-4 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-[#0a0a0c] px-4 py-1.5 shadow-sm">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
                <span className="text-[10px] font-medium tracking-[0.25em] text-orange-400" style={F_LABEL}>
                  {data.icode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
