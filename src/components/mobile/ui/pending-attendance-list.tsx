"use client"

import { useCallback, useEffect, useState } from "react"
import { FileClock } from "lucide-react"
import {
    getPendingAttendance,
    type QueuedAttendance,
} from "@/lib/offline/attendance-queue"

function formatCapturedTime(value: string) {
    return new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(value))
}

export function PendingAttendanceList() {
    const [items, setItems] = useState<QueuedAttendance[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadPending = useCallback(async () => {
        try {
            const pending = await getPendingAttendance()
            setItems(pending)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        void loadPending()

        window.addEventListener("attendance-queue-updated", loadPending)

        return () => {
            window.removeEventListener("attendance-queue-updated", loadPending)
        }
    }, [loadPending])

    if (isLoading) {
        return (
            <div className="flex w-full flex-col gap-3 py-4">
                {[...Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className="flex w-full animate-pulse items-center gap-4 rounded-2xl border border-white/5 bg-[#1F1E23] p-3"
                    >
                        <div className="h-11 w-11 shrink-0 rounded-xl bg-zinc-800" />
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="h-4 w-32 rounded-full bg-zinc-800" />
                            <div className="h-3 w-24 rounded-full bg-zinc-800" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex min-h-full w-full flex-col">
            <div className="flex w-full flex-1 flex-col gap-0 pb-2">
                <ul className="flex w-full flex-1 flex-col gap-3">
                    {items.length > 0 ? (
                        items.map((item) => {
                            const payload = item.payload
                            const initial = payload.student_name
                                .charAt(0)
                                .toUpperCase()

                            return (
                                <li key={item.id}>
                                    <div className="flex w-full items-center">
                                        <div className="flex flex-1 items-center gap-4 rounded-2xl border border-white/5 bg-[#1F1E23] p-3 shadow-sm">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2A292F] text-sm font-bold text-white shadow-inner">
                                                {initial}
                                            </div>

                                            <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                                                <div className="flex min-w-0 flex-col">
                                                    <p className="truncate text-sm leading-tight font-semibold text-white">
                                                        {payload.student_name}
                                                    </p>

                                                    <div className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-white/40 uppercase">
                                                        <span className="text-white/60">
                                                            {payload.class_name || "N/A"}
                                                        </span>

                                                        <span className="opacity-20">•</span>

                                                        <span className="font-mono tracking-wide">
                                                            {payload.student_nis || "N/A"}
                                                        </span>
                                                    </div>

                                                    <div className="mt-1 text-[10px] text-white/40">
                                                        {payload.time} • {payload.method}
                                                    </div>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <span className="font-mono text-[10px] leading-none text-white/60">
                                                        {formatCapturedTime(payload.captured_at)} WIB
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center rounded-3xl px-6 text-center">
                            <FileClock className="mb-3 h-12 w-12 text-zinc-500" />

                            <p className="text-xs font-medium tracking-wide text-zinc-500">
                                No Queue available
                            </p>
                        </div>
                    )}
                </ul>
            </div>
        </div>
    )
}