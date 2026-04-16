// src/app/(desktop)/dashboard/schedules/page.tsx
"use client";

import { useAcademicSchedules } from "@/hooks/schedules/use-schedules";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Save, CalendarDays, CheckCircle2, Circle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { DailyPrayer } from "@/types/api";

const PRAYER_LIST: DailyPrayer[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function AcademicSchedulesPage() {
  const { weeklySchedule, isLoading, isSaving, isDraftModified, toggleDayActive, togglePrayerTracked, handleSave } = useAcademicSchedules();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-primary/20">
      <header className="space-y-6">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground font-jakarta">Academic Schedules</h1>
          <p className="text-sm text-muted-foreground leading-relaxed w-full font-inter">Define active school days and mandatory tracking routines.</p>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        <div className="mx-auto max-w-4xl w-full">
          <form onSubmit={handleSave}>
            <Card className="rounded-3xl border border-border/60 bg-card shadow-lg overflow-hidden pb-4">
              <CardHeader className="border-b border-border/40 bg-muted/5 pb-4">
                <CardTitle className="text-[16px] font-bold tracking-tight font-jakarta flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" /> Weekly Tracking Routine
                </CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground font-inter mt-1">Configure daily attendance requirements.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-0 sm:px-6">
                <div className="flex flex-col divide-y divide-border/40">
                  {weeklySchedule.map((schedule) => (
                    <div key={schedule.day} className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 py-5 px-5 sm:px-0 transition-colors duration-300", !schedule.isActive && "opacity-70", isLoading && "animate-pulse")}>
                      <div className="flex items-center gap-4 min-w-[150px]">
                        <Switch disabled={isLoading} checked={schedule.isActive} onCheckedChange={(val) => toggleDayActive(schedule.day, val)} className="data-[state=checked]:bg-success" />
                        <div className="flex flex-col">
                          <span className={cn("text-[14px] font-bold font-jakarta", !schedule.isActive && "line-through text-muted-foreground")}>{schedule.day}</span>
                          <span className="text-[11px] font-inter text-muted-foreground">{schedule.isActive ? "Active School Day" : "Holiday / Day Off"}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {schedule.isActive ? PRAYER_LIST.map((prayer) => {
                          const isTracked = schedule.trackedPrayers.includes(prayer);
                          return (
                            <button key={prayer} type="button" disabled={isLoading} onClick={() => togglePrayerTracked(schedule.day, prayer)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-bold font-inter transition-all duration-300", isTracked ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20" : "bg-background border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground")}>
                              {isTracked ? <CheckCircle2 className="size-3.5" /> : <Circle className="size-3.5" />} {prayer}
                            </button>
                          )
                        }) : <div className="px-3 py-1.5 rounded-full bg-background border border-border/40 text-[11px] font-bold font-inter text-muted-foreground flex items-center gap-1.5"><CalendarDays className="size-3.5" /> No tracking needed</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={cn("mt-8 mx-5 sm:mx-0 p-3 px-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-500", isDraftModified ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-border/40")}>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className={cn("p-1.5 rounded-md shrink-0 transition-colors duration-500", isDraftModified ? "bg-primary/10 text-primary" : "bg-background border border-border/50 text-foreground")}>
                      {isDraftModified ? <Lightbulb className="size-4 animate-pulse" /> : <CheckCircle2 className="size-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] font-bold font-jakarta", isDraftModified ? "text-primary" : "text-foreground")}>{isDraftModified ? "Unsaved Changes" : "Schedules Saved"}</span>
                      <span className="text-[11px] font-inter text-muted-foreground">{isDraftModified ? "Save to apply changes." : "Active routing is secured."}</span>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSaving || isLoading || !isDraftModified} className={cn("shrink-0 h-9 px-4 rounded-lg font-bold text-[12px] shadow-sm", (isSaving || isLoading || !isDraftModified) ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                    {isSaving ? "Saving..." : <><Save className="size-3.5 mr-2" /> Save Schedules</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}