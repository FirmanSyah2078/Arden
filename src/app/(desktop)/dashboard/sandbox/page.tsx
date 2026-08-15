"use client"

import React, { useState } from "react"
import { Settings, BarChart3, ArrowLeft } from "lucide-react"

import { SANDBOX_FONT_STYLES } from "@/components/dashboard/academic/fonts"
import { DEFAULT_CARD_DATA } from "@/components/dashboard/academic/card-data"
import { IdentityCardPanel } from "@/components/dashboard/academic/identity/card-panel"
import { ValidationHubPanel } from "@/components/dashboard/academic/validation-hub-panel"
import { RecentOrdersPanel } from "@/components/dashboard/academic/recent-orders-panel"

export default function SandboxPage() {
  const [tab, setTab] = useState("Generate")

  // 🔥 Satu sumber data siswi, dikirim ke IdentityCardPanel & ValidationHubPanel
  // sekaligus — keduanya selalu nampilin siswi yang sama.
  const [data] = useState(DEFAULT_CARD_DATA)

  const gbUsed = 24.67
  const gbTotal = 36

  return (
    <div className="animate-in fade-in flex w-full flex-1 flex-col font-sans text-neutral-200 antialiased duration-500 print:hidden">
      <style dangerouslySetInnerHTML={{ __html: SANDBOX_FONT_STYLES }} />

      {/* HEADER UTAMA */}
      <header className="mb-8 flex flex-col justify-between gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-transform hover:-translate-x-1 hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span
            onClick={() => window.history.back()}
            className="cursor-pointer text-sm font-semibold tracking-wide text-neutral-400 uppercase transition-colors hover:text-white"
          >
            Kembali
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setTab("Generate")}
            className={`flex items-center gap-2 text-sm transition-colors ${
              tab === "Generate" ? "font-medium text-white" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Settings size={16} /> Generate
          </button>
          <button
            onClick={() => setTab("Analytics")}
            className={`flex items-center gap-2 text-sm transition-colors ${
              tab === "Analytics" ? "font-medium text-white" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <BarChart3 size={16} /> Analytics
          </button>
          <div className="mx-2 hidden h-4 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_2px_rgba(139,92,246,0.6)]" />
            {gbUsed} / {gbTotal} GB Remaining
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="flex w-full flex-1 flex-col">
        {tab === "Analytics" ? (
          <div className="flex h-105 items-center justify-center text-sm text-neutral-600">
            Analytics view isn't part of this mockup.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
              <IdentityCardPanel data={data} />
              <ValidationHubPanel data={data} />
            </div>

            <RecentOrdersPanel />
          </>
        )}
      </div>
    </div>
  )
}
