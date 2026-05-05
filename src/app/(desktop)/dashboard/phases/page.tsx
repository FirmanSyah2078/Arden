"use client";

import { useFourPhase } from "@/hooks/phases/use-Four-Phase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, CalendarDays, CalendarCheck, CalendarRange, ClockAlert, Activity, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PhasesPage() {
  const phase = useFourPhase();
  const inputPremiumClass = "pl-3 pr-10 h-11 text-lg font-bold bg-background/60 border border-border/50 hover:border-foreground/30 focus:bg-background focus-visible:bg-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/50 rounded-xl shadow-inner text-foreground transition-all duration-300 font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-primary/20">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1 w-full">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground font-jakarta">Phases</h1>
            <p className="text-sm text-muted-foreground leading-relaxed w-full font-inter">
              Configure biological parameters for female students' menstrual cycles. These settings affect the core algorithm.
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        <div className="mx-auto max-w-4xl w-full">
          <form onSubmit={phase.handleSave} className="space-y-6">
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
                      <Input id="min" type="number" min={1} max={phase.calculated.std - 1} placeholder="1" value={phase.settings.min_duration} onChange={(e) => phase.handleChange("min_duration", e.target.value === "" ? "" : Number(e.target.value))} onBlur={() => phase.handleBlur("min_duration")} disabled={phase.isLoading} className={cn(inputPremiumClass, phase.isLoading && "animate-pulse text-transparent placeholder:text-transparent")} />
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
                      <Input id="std" type="number" min={phase.calculated.min + 1} max={phase.calculated.max - 1} placeholder={`${phase.calculated.min + 1}`} value={phase.settings.standard_duration} onChange={(e) => phase.handleChange("standard_duration", e.target.value === "" ? "" : Number(e.target.value))} onBlur={() => phase.handleBlur("standard_duration")} disabled={phase.isLoading} className={cn(inputPremiumClass, phase.isLoading && "animate-pulse text-transparent placeholder:text-transparent")} />
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
                      <Input id="max" type="number" min={phase.calculated.std + 1} max={phase.calculated.over - 1} placeholder={`${phase.calculated.std + 1}`} value={phase.settings.max_duration} onChange={(e) => phase.handleChange("max_duration", e.target.value === "" ? "" : Number(e.target.value))} onBlur={() => phase.handleBlur("max_duration")} disabled={phase.isLoading} className={cn(inputPremiumClass, phase.isLoading && "animate-pulse text-transparent placeholder:text-transparent")} />
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
                      <Input id="over" type="number" min={phase.calculated.max + 1} max={30} placeholder={`${phase.calculated.max + 1}`} value={phase.settings.over_limit} onChange={(e) => phase.handleChange("over_limit", e.target.value === "" ? "" : Number(e.target.value))} onBlur={() => phase.handleBlur("over_limit")} disabled={phase.isLoading} className={cn(inputPremiumClass, phase.isLoading && "animate-pulse text-transparent placeholder:text-transparent")} />
                      <span className="absolute right-3 text-[12px] font-medium text-muted-foreground pointer-events-none font-inter">Days</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[13px] font-bold font-jakarta text-foreground flex items-center gap-2"><Activity className="size-4 text-primary animate-pulse" /> Algorithm Simulation</div>
                  </div>
                  <div className={cn("flex h-3 w-full gap-0.75 rounded-full p-0.5 bg-background/80 border border-border/50 shadow-inner overflow-hidden transition-all duration-500", phase.isLoading && "animate-pulse grayscale opacity-50")}>
                    <div className="h-full rounded-full bg-minimal/40 transition-all duration-500 cursor-default" style={{ width: `${(phase.calculated.min / phase.calculated.totalScale) * 100}%` }} />
                    <div className="h-full rounded-full bg-standard/40 transition-all duration-500 cursor-default" style={{ width: `${((phase.calculated.std - phase.calculated.min) / phase.calculated.totalScale) * 100}%` }} />
                    <div className="h-full rounded-full bg-maximal/40 transition-all duration-500 cursor-default" style={{ width: `${((phase.calculated.max - phase.calculated.std) / phase.calculated.totalScale) * 100}%` }} />
                    <div className="h-full rounded-full bg-over/40 transition-all duration-500 cursor-default" style={{ width: `${((phase.calculated.totalScale - phase.calculated.max) / phase.calculated.totalScale) * 100}%` }} />
                  </div>
                  <div className={cn("flex w-full mt-3 gap-1 transition-opacity duration-500", phase.isLoading && "opacity-40")}>
                    <div style={{ width: `${(phase.calculated.min / phase.calculated.totalScale) * 100}%` }} className="flex flex-col items-center text-center justify-center min-w-max group cursor-default">
                      <span className="font-bold text-minimal text-[12px] font-inter group-hover:brightness-125 transition-colors">Minimum</span><span className="text-muted-foreground text-[11px] font-inter">{1 === phase.calculated.min ? `Day ${phase.calculated.min}` : `1-${phase.calculated.min} Days`}</span>
                    </div>
                    <div style={{ width: `${((phase.calculated.std - phase.calculated.min) / phase.calculated.totalScale) * 100}%` }} className="flex flex-col items-center text-center justify-center min-w-max group cursor-default">
                      <span className="font-bold text-standard text-[12px] font-inter group-hover:brightness-125 transition-colors">Standard</span><span className="text-muted-foreground text-[11px] font-inter">{phase.calculated.min + 1 === phase.calculated.std ? `Day ${phase.calculated.std}` : `${phase.calculated.min + 1}-${phase.calculated.std} Days`}</span>
                    </div>
                    <div style={{ width: `${((phase.calculated.max - phase.calculated.std) / phase.calculated.totalScale) * 100}%` }} className="flex flex-col items-center text-center justify-center min-w-max group cursor-default">
                      <span className="font-bold text-maximal text-[12px] font-inter group-hover:brightness-125 transition-colors">Maximum</span><span className="text-muted-foreground text-[11px] font-inter">{phase.calculated.std + 1 === phase.calculated.max ? `Day ${phase.calculated.max}` : `${phase.calculated.std + 1}-${phase.calculated.max} Days`}</span>
                    </div>
                    <div style={{ width: `${((phase.calculated.totalScale - phase.calculated.max) / phase.calculated.totalScale) * 100}%` }} className="flex flex-col items-center text-center justify-center min-w-max group cursor-default">
                      <span className="font-bold text-over text-[12px] font-inter group-hover:brightness-125 transition-colors">Over</span><span className="text-muted-foreground text-[11px] font-inter">{phase.calculated.max + 1 === phase.calculated.over ? `≥ ${phase.calculated.over} Days` : `${phase.calculated.max + 1}-${phase.calculated.over} Days`}</span>
                    </div>
                  </div>
                </div>

                <div className={cn("mt-5 mb-3 p-3 px-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-500", phase.bannerState.variant === "primary" ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-border/40")}>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className={cn("p-1.5 rounded-md shrink-0 transition-colors duration-500", phase.bannerState.variant === "primary" ? "bg-primary/10 text-primary" : "bg-background border border-border/50 text-foreground")}>
                      <phase.bannerState.icon className={cn("size-4", phase.bannerState.spin && "animate-spin", phase.bannerState.variant === "primary" && "animate-pulse")} />
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] font-bold font-jakarta transition-colors duration-500", phase.bannerState.variant === "primary" ? "text-primary" : "text-foreground")}>{phase.bannerState.title}</span>
                      <span className="text-[11px] font-inter text-muted-foreground leading-relaxed pr-2">{phase.bannerState.desc}</span>
                    </div>
                  </div>
                  <Button type="button" onClick={phase.bannerState.action} disabled={phase.bannerState.variant === "muted"} className={cn("shrink-0 h-9 px-4 rounded-lg font-bold text-[12px] transition-colors shadow-sm w-full sm:w-auto group", phase.bannerState.variant === "muted" ? "bg-muted text-muted-foreground pointer-events-none" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                    <phase.bannerState.btnIcon className={cn("size-3.5 mr-2", phase.bannerState.variant === "primary" && "group-hover:ar-bounce-x")} />{phase.bannerState.btnText}
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