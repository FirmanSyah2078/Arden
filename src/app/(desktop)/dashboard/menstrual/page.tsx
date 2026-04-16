// src/app/(desktop)/dashboard/menstrual/page.tsx
"use client";

import { useMenstrualLogic } from "@/hooks/menstrual/use-menstrual";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, CalendarDays, CalendarCheck, CalendarRange, ClockAlert, Activity, Lightbulb, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MenstrualLogicPage() {
  const { settings, isLoading, isSaving, isDraftModified, bannerState, handleChange, handleBlur, handleSave } = useMenstrualLogic();

  let min = Number(settings.minDuration) || 1; 
  let std = Number(settings.standardDuration) || (min + 1);
  let max = Number(settings.maxDuration) || (std + 1); 
  let over = Number(settings.overLimit) || (max + 1);
  
  if (std <= min) std = min + 1; 
  if (max <= std) max = std + 1; 
  if (over <= max) over = max + 1;
  
  const totalScale = over > 30 ? 30 : over;

  const inputPremiumClass = "pl-3 pr-10 h-11 text-lg font-bold bg-background/60 border border-border/50 hover:border-foreground/30 focus:bg-background focus-visible:bg-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/50 rounded-xl shadow-inner text-foreground transition-all duration-300 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-minimal/20">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1 w-full">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground font-jakarta">Menstrual Logic</h1>
            <p className="text-sm text-muted-foreground leading-relaxed w-full font-inter">
              Configure biological parameters for female students' menstrual cycles. These settings affect the core algorithm.
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        <div className="mx-auto max-w-3xl w-full">
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="rounded-3xl border border-border/60 bg-card shadow-lg overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5 pb-4">
                <CardTitle className="text-[16px] font-bold tracking-tight font-jakarta">4-Phase Time Range</CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground font-inter">Set the threshold days for the cycle monitoring algorithm.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Min */}
                  <div className="relative group flex flex-col p-4 rounded-2xl border border-border/40 bg-muted/5 hover:bg-muted/10 hover:border-border/80 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-minimal/10 text-minimal"><CalendarDays className="size-4 group-hover:ar-tada transition-all" /></div>
                      <Label htmlFor="min" className="text-[13px] font-bold font-jakarta text-foreground/80">Minimum</Label>
                    </div>
                    <div className="relative flex items-center mt-auto">
                      <Input id="min" type="number" min={1} max={std - 1} placeholder="1" value={settings.minDuration} onChange={(e) => handleChange("minDuration", e.target.value === "" ? "" : Number(e.target.value))} onBlur={() => handleBlur("minDuration")} disabled={isLoading} className={cn(inputPremiumClass, isLoading && "animate-pulse text-transparent placeholder:text-transparent")} />
                      <span className="absolute right-3 text-[12px] font-medium text-muted-foreground pointer-events-none font-inter">Days</span>
                    </div>
                  </div>
                  {/* Std */}
                  <div className="relative group flex flex-col p-4 rounded-2xl border border-border/40 bg-muted/5 hover:bg-muted/10 hover:border-border/80 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-standard/10 text-standard"><CalendarCheck className="size-4 group-hover:ar-tada transition-all" /></div>
                      <Label htmlFor="std" className="text-[13px] font-bold font-jakarta text-foreground/80">Standard</Label>
                    </div>
                    <div className="relative flex items-center mt-auto">
                      <Input id="std" type="number" min={min + 1} max={max - 1} placeholder={`${min + 1}`} value={settings.standardDuration} onChange={(e) => handleChange("standardDuration", e.target.value === "" ? "" : Number(e.target.value))} onBlur={() => handleBlur("standardDuration")} disabled={isLoading} className={cn(inputPremiumClass, isLoading && "animate-pulse text-transparent placeholder:text-transparent")} />
                      <span className="absolute right-3 text-[12px] font-medium text-muted-foreground pointer-events-none font-inter">Days</span>
                    </div>
                  </div>
                  {/* Max */}
                  <div className="relative group flex flex-col p-4 rounded-2xl border border-border/40 bg-muted/5 hover:bg-muted/10 hover:border-border/80 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-maximal/10 text-maximal"><CalendarRange className="size-4 group-hover:ar-tada transition-all" /></div>
                      <Label htmlFor="max" className="text-[13px] font-bold font-jakarta text-foreground/80">Maximum</Label>
                    </div>
                    <div className="relative flex items-center mt-auto">
                      <Input id="max" type="number" min={std + 1} max={over - 1} placeholder={`${std + 1}`} value={settings.maxDuration} onChange={(e) => handleChange("maxDuration", e.target.value === "" ? "" : Number(e.target.value))} onBlur={() => handleBlur("maxDuration")} disabled={isLoading} className={cn(inputPremiumClass, isLoading && "animate-pulse text-transparent placeholder:text-transparent")} />
                      <span className="absolute right-3 text-[12px] font-medium text-muted-foreground pointer-events-none font-inter">Days</span>
                    </div>
                  </div>
                  {/* Over */}
                  <div className="relative group flex flex-col p-4 rounded-2xl border border-border/40 bg-muted/5 hover:bg-muted/10 hover:border-border/80 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-over/10 text-over"><ClockAlert className="size-4 group-hover:ar-beat transition-all" /></div>
                      <Label htmlFor="over" className="text-[13px] font-bold font-jakarta text-foreground/80">Over</Label>
                    </div>
                    <div className="relative flex items-center mt-auto">
                      <Input id="over" type="number" min={max + 1} max={30} placeholder={`${max + 1}`} value={settings.overLimit} onChange={(e) => handleChange("overLimit", e.target.value === "" ? "" : Number(e.target.value))} onBlur={() => handleBlur("overLimit")} disabled={isLoading} className={cn(inputPremiumClass, isLoading && "animate-pulse text-transparent placeholder:text-transparent")} />
                      <span className="absolute right-3 text-[12px] font-medium text-muted-foreground pointer-events-none font-inter">Days</span>
                    </div>
                  </div>
                </div>

                {/* --- VISUALISASI --- */}
                <div className="p-5 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[13px] font-bold font-jakarta text-foreground flex items-center gap-2"><Activity className="size-4 text-primary animate-pulse" /> Algorithm Simulation</div>
                  </div>
                  
                  <div className={cn("flex h-3 w-full gap-0.75 rounded-full p-0.5 bg-background/80 border border-border/50 shadow-inner overflow-hidden transition-all duration-500", isLoading && "animate-pulse grayscale opacity-50")}>
                    <div className="h-full rounded-full bg-minimal/40 transition-all duration-500 cursor-default" style={{ width: `${(min / totalScale) * 100}%` }} />
                    <div className="h-full rounded-full bg-standard/40 transition-all duration-500 cursor-default" style={{ width: `${((std - min) / totalScale) * 100}%` }} />
                    <div className="h-full rounded-full bg-maximal/40 transition-all duration-500 cursor-default" style={{ width: `${((max - std) / totalScale) * 100}%` }} />
                    <div className="h-full rounded-full bg-over/40 transition-all duration-500 cursor-default" style={{ width: `${((totalScale - max) / totalScale) * 100}%` }} />
                  </div>
                  
                  <div className={cn("flex w-full mt-3 gap-1 transition-opacity duration-500", isLoading && "opacity-40")}>
                    <div style={{ width: `${(min / totalScale) * 100}%` }} className="flex flex-col items-center text-center justify-center min-w-max group cursor-default">
                      <span className="font-bold text-minimal text-[12px] font-inter group-hover:brightness-125 transition-colors">Minimum</span>
                      <span className="text-muted-foreground text-[11px] font-inter">{1 === min ? `Day ${min}` : `1-${min} Days`}</span>
                    </div>
                    <div style={{ width: `${((std - min) / totalScale) * 100}%` }} className="flex flex-col items-center text-center justify-center min-w-max group cursor-default">
                      <span className="font-bold text-standard text-[12px] font-inter group-hover:brightness-125 transition-colors">Standard</span>
                      <span className="text-muted-foreground text-[11px] font-inter">{min + 1 === std ? `Day ${std}` : `${min + 1}-${std} Days`}</span>
                    </div>
                    <div style={{ width: `${((max - std) / totalScale) * 100}%` }} className="flex flex-col items-center text-center justify-center min-w-max group cursor-default">
                      <span className="font-bold text-maximal text-[12px] font-inter group-hover:brightness-125 transition-colors">Maximum</span>
                      <span className="text-muted-foreground text-[11px] font-inter">{std + 1 === max ? `Day ${max}` : `${std + 1}-${max} Days`}</span>
                    </div>
                    <div style={{ width: `${((totalScale - max) / totalScale) * 100}%` }} className="flex flex-col items-center text-center justify-center min-w-max group cursor-default">
                      <span className="font-bold text-over text-[12px] font-inter group-hover:brightness-125 transition-colors">Over</span>
                      
                      {/* 🔥 LOGIKA TEKS OVER DIPERBAIKI */}
                      <span className="text-muted-foreground text-[11px] font-inter">
                        {max + 1 === over ? `≥ ${over} Days` : `${max + 1}-${over} Days`}
                      </span>

                    </div>
                  </div>
                </div>

                {/* BANNER */}
                <div className={cn("mt-5 mb-3 p-3 px-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-500", bannerState.variant === "primary" ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-border/40")}>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className={cn("p-1.5 rounded-md shrink-0 transition-colors duration-500", bannerState.variant === "primary" ? "bg-primary/10 text-primary" : "bg-background border border-border/50 text-foreground")}>
                      <bannerState.icon className={cn("size-4", bannerState.spin && "animate-spin", bannerState.variant === "primary" && "animate-pulse")} />
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] font-bold font-jakarta transition-colors duration-500", bannerState.variant === "primary" ? "text-primary" : "text-foreground")}>{bannerState.title}</span>
                      <span className="text-[11px] font-inter text-muted-foreground leading-relaxed pr-2">{bannerState.desc}</span>
                    </div>
                  </div>
                  <Button type="button" onClick={bannerState.action} disabled={bannerState.variant === "muted"} className={cn("shrink-0 h-9 px-4 rounded-lg font-bold text-[12px] transition-colors shadow-sm w-full sm:w-auto group", bannerState.variant === "muted" ? "bg-muted text-muted-foreground pointer-events-none" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                    <bannerState.btnIcon className={cn("size-3.5 mr-2", bannerState.variant === "primary" && "group-hover:ar-bounce-x")} />{bannerState.btnText}
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