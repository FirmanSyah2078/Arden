"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CloudOff,
  History,
  QrCode,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { UnifiedHeader } from "@/components/mobile/ui/unified-header";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const guides = [
  {
    title: "Scan a student card",
    summary: "Use the QR scanner when the student card is available.",
    icon: QrCode,
    accent: "text-indigo-400",
    steps: [
      "Open Go and stay on Scan mode.",
      "Tap the camera button to turn on the camera.",
      "Place the QR code on the student card inside the scan frame.",
      "Keep the card steady while the system validates the attendance.",
      "Wait for the result before closing the camera.",
    ],
  },
  {
    title: "Record attendance manually",
    summary: "Search by student name or NIS when scanning is unavailable.",
    icon: Search,
    accent: "text-zinc-300",
    steps: [
      "Switch Go to Manual mode using the dock.",
      "Type the student's name or NIS in the search bar.",
      "Select the correct student from the result list.",
      "Review the identity details before continuing.",
      "Complete and submit the attendance form.",
    ],
  },
  {
    title: "Check attendance history",
    summary: "Review server-confirmed attendance by prayer time.",
    icon: History,
    accent: "text-zinc-300",
    steps: [
      "Open History from the menu.",
      "Choose a prayer-time tab at the top.",
      "Check the student's name, class, NIS, and recorded time.",
      "History shows confirmed records, not pending offline submissions.",
    ],
  },
  {
    title: "Handle offline attendance",
    summary: "Attendance made offline stays pending until it can sync.",
    icon: CloudOff,
    accent: "text-amber-300",
    steps: [
      "If the connection is unavailable, the attendance is kept in the queue.",
      "Open Queue to review pending attendance records.",
      "Do not treat a pending record as server-confirmed success.",
      "When the connection returns, Arden retries synchronization automatically.",
      "A rejected record remains visible with its server response.",
    ],
  },
  {
    title: "Update your profile",
    summary: "Keep your name, username, and profile photo accurate.",
    icon: UserRound,
    accent: "text-zinc-300",
    steps: [
      "Open Profile from the menu.",
      "Tap the camera button to choose a new profile photo.",
      "Use JPG, PNG, or WebP images up to 5 MB before compression.",
      "Update your name or username when necessary.",
      "Save the changes and wait for the confirmation.",
    ],
  },
  {
    title: "If something goes wrong",
    summary: "A short checklist for common attendance issues.",
    icon: ShieldCheck,
    accent: "text-zinc-300",
    steps: [
      "Camera unavailable: check browser camera permission and try again.",
      "No search result: check the spelling or search with the student's NIS.",
      "Pending attendance: open Queue instead of History.",
      "Unexpected result: verify the selected student before submitting again.",
      "If the issue continues, capture the visible message and report it to the operator.",
    ],
  },
];

export default function GuidePage() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#151419] px-5 pt-4 font-sans">
      <UnifiedHeader />

      <div
        className="min-h-0 flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex flex-col gap-3 pb-6 pt-5">
          {guides.map((guide, index) => {
            const Icon = guide.icon;
            const isExpanded = expandedIndex === index;

            return (
              <section
                key={guide.title}
                className={cn(
                  "overflow-hidden rounded-2xl border transition-colors duration-200",
                  isExpanded
                    ? "border-indigo-500/40 bg-[#1F1E23]"
                    : "border-white/5 bg-[#1F1E23]",
                )}
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="flex w-full items-center gap-3 p-3 text-left"
                >
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2A292F]", guide.accent)}>
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-zinc-100">{guide.title}</span>
                    <span className="mt-1 block truncate text-[11px] leading-relaxed text-zinc-500">{guide.summary}</span>
                  </span>
                  <ChevronDown
                    size={17}
                    className={cn(
                      "shrink-0 text-zinc-600 transition-transform duration-200",
                      isExpanded && "rotate-180 text-indigo-400",
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-white/5 px-4 pb-4 pt-3">
                    <ol className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={step} className="flex items-start gap-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2A292F] text-[10px] font-semibold text-zinc-400">
                            {stepIndex + 1}
                          </span>
                          <span className="text-[11px] leading-relaxed text-zinc-400">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center px-4 pb-6 pt-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="h-14 w-full max-w-sm rounded-2xl border-white/10 bg-zinc-900 font-semibold text-white/80 transition-all hover:bg-zinc-800 hover:text-white active:scale-[0.98]"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
