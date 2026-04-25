// src/app/(desktop)/dashboard/globals/page.tsx
"use client";

import { usegeographic } from "@/hooks/globals/use-geographic";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, MapPin, Globe, Calculator, Lightbulb, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CityCombobox } from "@/components/dashboard/configuration/city-combobox";

export default function GlobalsPage() {
  const { settings, isLoading, isSaving, isDraftModified, handleChange, handleSave } = usegeographic();
  const inputClass = "w-full pl-3 pr-3 h-11 text-[13px] font-medium bg-background/60 border border-border/50 hover:border-foreground/30 focus:bg-background rounded-xl shadow-inner text-foreground transition-all duration-300";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-primary/20">
      <header className="space-y-6">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground font-jakarta">Globals</h1>
          <p className="text-sm text-muted-foreground leading-relaxed w-full font-inter">Manage core platform settings including geospatial parameters.</p>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        <div className="mx-auto max-w-4xl w-full">
          <form onSubmit={handleSave}>
            <Card className="rounded-3xl border border-border/60 bg-card shadow-lg overflow-hidden pb-4">
              <CardHeader className="border-b border-border/40 bg-muted/5 pb-4">
                <CardTitle className="text-[16px] font-bold flex items-center gap-2"><Globe className="size-4 text-primary" /> Geographic Core</CardTitle>
                <CardDescription className="text-[12px]">Location parameters for calculating external endpoints (e.g. Astronomy).</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[12.5px] font-semibold flex items-center gap-2"><Globe className="size-4" /> Country</Label>
                    <Select value={settings.country} onValueChange={(v) => handleChange("country", v)} disabled={isLoading}>
                      <SelectTrigger className={cn(inputClass, isLoading && "animate-pulse")}><SelectValue placeholder="Country" /></SelectTrigger>
                      <SelectContent><SelectItem value="Indonesia">Indonesia</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12.5px] font-semibold flex items-center gap-2"><MapPin className="size-4 text-primary" /> City / Region</Label>
                    <CityCombobox value={settings.city} disabled={isLoading} onChange={(v) => handleChange("city", v)} className={cn(inputClass, isLoading && "animate-pulse")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12.5px] font-semibold flex items-center gap-2"><Calculator className="size-4" /> Calculation Method</Label>
                    <Select value={settings.method} onValueChange={(v) => handleChange("method", v)} disabled={isLoading}>
                      <SelectTrigger className={cn(inputClass, isLoading && "animate-pulse")}><SelectValue placeholder="Method" /></SelectTrigger>
                      <SelectContent><SelectItem value="20">Kemenag RI</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>

                <div className={cn("mt-8 p-3 px-4 rounded-xl border flex items-center justify-between gap-4 transition-colors duration-500", isDraftModified ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-border/40")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-md", isDraftModified ? "bg-primary/10 text-primary" : "bg-background border border-border/50")}>
                      {isDraftModified ? <Lightbulb className="size-4 animate-pulse" /> : <CheckCircle2 className="size-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] font-bold", isDraftModified ? "text-primary" : "text-foreground")}>{isDraftModified ? "Unsaved Changes" : "Configuration Saved"}</span>
                      <span className="text-[11px] text-muted-foreground">{isDraftModified ? "Save to update core parameters." : "Core preferences are locked."}</span>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSaving || isLoading || !isDraftModified} className={cn("h-9 px-4 rounded-lg font-bold text-[12px]", (isSaving || isLoading || !isDraftModified) ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground")}>
                    {isSaving ? "Saving..." : <><Save className="size-3.5 mr-2" /> Save Config</>}
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