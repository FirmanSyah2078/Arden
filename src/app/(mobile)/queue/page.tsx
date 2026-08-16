"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UnifiedHeader } from "@/components/mobile/ui/unified-header"
import { PendingAttendanceList } from "@/components/mobile/ui/pending-attendance-list"

export default function OfflineAttendancePage() {
    const router = useRouter()

    return (
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#151419] px-5 pt-4 font-sans">
            <UnifiedHeader />

            <main className="min-h-0 flex-1 overflow-y-auto">
                <PendingAttendanceList />
            </main>

            <div className="flex shrink-0 items-center justify-center bg-transparent px-4 pt-4 pb-6">
                <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="h-14 w-full max-w-sm rounded-2xl border-white/10 bg-zinc-900 font-semibold text-white/80 transition-all hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
                >
                    Back
                </Button>
            </div>
        </div>
    )
}
