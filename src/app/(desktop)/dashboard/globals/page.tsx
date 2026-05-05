"use client";

// Import Hooks
import { usegeographic } from "@/hooks/globals/use-geographic";
import { useGenerate } from "@/hooks/globals/use-generate";

// Import UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Save, MapPin, Globe, Calculator, Lightbulb, CheckCircle2,
  QrCode, Scan, ShieldCheck,
  Image as ImageIcon, X, RefreshCw, RotateCcw, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CityCombobox } from "@/components/dashboard/globals/city-combobox";

// =====================================================================
// 🔥 DESIGN TOKENS
// =====================================================================
const fieldClass =
  "flex h-9 w-full items-center rounded-xl border border-border/50 bg-background/60 shadow-inner transition-all duration-300 hover:border-foreground/30 focus-within:border-foreground/40";

const triggerClass =
  "flex h-9 w-full items-center justify-between rounded-xl border border-border/50 bg-background/60 px-3 text-[13px] font-medium shadow-inner transition-colors duration-300 hover:border-foreground/30 data-[state=open]:border-foreground/40 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0";

const fieldInputClass =
  "flex h-full w-full items-center border-0 bg-transparent p-0 text-[13px] font-medium leading-none text-foreground outline-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50";


export default function GlobalsPage() {
  const geo = usegeographic();
  const gen = useGenerate();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-primary/20">
      <header className="space-y-6">
        <div className="flex flex-col gap-1 w-full">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground font-jakarta">Globals</h1>
          <p className="text-sm text-muted-foreground leading-relaxed w-full font-inter">Manage core platform settings including geospatial parameters and generator engines.</p>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        <div className="mx-auto max-w-4xl w-full space-y-8">

          {/* =====================================================================
              KARTU 1: GEOGRAPHIC CORE
              ===================================================================== */}
          <form onSubmit={geo.handleSave}>
            <Card className="rounded-3xl border border-border/60 bg-card shadow-lg pb-4">
              <CardHeader className="border-b border-border/40 bg-muted/5 pb-4 rounded-t-3xl">
                <CardTitle className="text-[16px] font-bold flex items-center gap-2"><Globe className="size-4 text-primary" /> Geographic Core</CardTitle>
                <CardDescription className="text-[12px]">Location parameters for calculating external endpoints (e.g. Astronomy).</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[12.5px] font-semibold flex items-center gap-2"><Globe className="size-4" /> Country</Label>
                    <Select value={geo.settings.country} onValueChange={(v) => geo.handleChange("country", v)} disabled={geo.isLoading}>
                      <SelectTrigger suppressHydrationWarning className={cn(triggerClass, geo.isLoading && "animate-pulse")}><SelectValue placeholder="Country" /></SelectTrigger>
                      <SelectContent><SelectItem value="Indonesia">Indonesia</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12.5px] font-semibold flex items-center gap-2"><MapPin className="size-4 text-primary" /> City / Region</Label>
                    <CityCombobox value={geo.settings.city} disabled={geo.isLoading} onChange={(v) => geo.handleChange("city", v)} className={cn(triggerClass, geo.isLoading && "animate-pulse")} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[12.5px] font-semibold flex items-center gap-2"><Calculator className="size-4" /> Calculation Method</Label>
                    <Select value={geo.settings.method} onValueChange={(v) => geo.handleChange("method", v)} disabled={geo.isLoading}>
                      <SelectTrigger suppressHydrationWarning className={cn(triggerClass, geo.isLoading && "animate-pulse")}><SelectValue placeholder="Method" /></SelectTrigger>
                      <SelectContent><SelectItem value="20">Kemenag RI</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>

                <div className={cn("mt-8 p-3 px-4 rounded-xl border flex items-center justify-between gap-4 transition-colors duration-500", geo.isDraftModified ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-border/40")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-md", geo.isDraftModified ? "bg-primary/10 text-primary" : "bg-background border border-border/50")}>
                      {geo.isDraftModified ? <Lightbulb className="size-4 animate-pulse" /> : <CheckCircle2 className="size-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] font-bold", geo.isDraftModified ? "text-primary" : "text-foreground")}>{geo.isDraftModified ? "Unsaved Changes" : "Configuration Saved"}</span>
                      <span className="text-[11px] text-muted-foreground">{geo.isDraftModified ? "Save to update core parameters." : "Core preferences are locked."}</span>
                    </div>
                  </div>
                  <Button type="submit" disabled={geo.isSaving || geo.isLoading || !geo.isDraftModified} className={cn("h-9 px-4 rounded-lg font-bold text-[12px]", (geo.isSaving || geo.isLoading || !geo.isDraftModified) ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground")}>
                    {geo.isSaving ? "Saving..." : <><Save className="size-3.5 mr-2" /> Save Config</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* =====================================================================
              KARTU 2: GENERATOR ENGINE (QR CODE)
              ===================================================================== */}
          <form onSubmit={gen.handleSave}>
            <Card className="rounded-3xl border border-border/60 bg-card shadow-lg pb-4 relative z-10">
              <CardHeader className="border-b border-border/40 bg-muted/5 pb-4 rounded-t-3xl">
                <CardTitle className="text-[16px] font-bold flex items-center gap-2"><QrCode className="size-4 text-primary" /> Generator Engine Studio</CardTitle>
                <CardDescription className="text-[12px]">Advanced templates, colors, and styling parameters for system-generated QR Codes.</CardDescription>
              </CardHeader>

              <CardContent className="pt-6 pb-2">
                <div className="flex flex-col md:flex-row gap-8 items-start">

                  {/* KIRI: LIVE PREVIEW AREA & CONTROLS */}
                  <div className="w-full md:w-[35%] lg:w-[30%] flex flex-col gap-4 shrink-0">

                    {/* 1. Canvas & Payload Input */}
                    <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border border-border/40 rounded-2xl relative overflow-hidden w-full group">
                      <div className="absolute inset-0 bg-size-[14px_14px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)]" />

                      <div
                        className={cn(
                          "relative z-10 size-45 overflow-hidden shadow-xl ring-1 ring-border/20 transition-all duration-300",
                          gen.settings.qrShape === 'circle' ? "rounded-full" : "rounded-md"
                        )}
                        style={{
                          backgroundColor: gen.settings.isBgTransparent ? "transparent" : (gen.settings.bgColor || "transparent"),
                          backgroundImage: gen.settings.isBgTransparent ? `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzNmM2Y0NiIgZmlsbC1vcGFjaXR5PSIwLjQiIC8+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzNmM2Y0NiIgZmlsbC1vcGFjaXR5PSIwLjQiIC8+PC9zdmc+')` : "none"
                        }}
                      >
                        <div ref={gen.qrRef} className="size-full pointer-events-none" />
                      </div>

                      {/* Input Data Dinamis (Lebar penuh, di dalam box) */}
                      <div className="mt-6 flex justify-center relative z-10 w-full px-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2.5 px-3 py-1.5 w-full rounded-lg border border-border/40 bg-background/50 backdrop-blur-md shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                          <Scan className="size-3.5 text-muted-foreground shrink-0" />
                          <div className="w-px h-3.5 bg-border/60 shrink-0" />
                          <input
                            type="text"
                            value={gen.previewPayload}
                            onChange={(e) => gen.setPreviewPayload(e.target.value)}
                            className="w-full bg-transparent border-none text-[11px] font-mono font-semibold text-foreground tracking-widest focus:outline-none focus:ring-0 p-0 m-0"
                            placeholder="Test payload..."
                            spellCheck={false}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Engine Controls (Refresh & Reset) */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button type="button" variant="outline" onClick={gen.forceRefresh} className="group h-9 text-[11px] font-bold border-border/50 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-colors shadow-sm">
                        <RefreshCw className="size-3.5 mr-1.5 text-muted-foreground group-hover:text-blue-400 group-hover:ar-spin-slow" />
                        Refresh
                      </Button>
                      <Button type="button" variant="outline" onClick={gen.resetToDefault} className="group h-9 text-[11px] font-bold border-border/50 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors shadow-sm">
                        <RotateCcw className="size-3.5 mr-1.5 text-muted-foreground group-hover:text-red-400 group-hover:ar-shake" />
                        Reset
                      </Button>
                    </div>

                    {/* 3. Export Buttons */}
                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Button type="button" variant="outline" onClick={() => gen.handleDownload('png')} className="group h-9 text-[11px] font-bold border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors shadow-sm">
                        <Download className="size-3.5 mr-1.5 text-muted-foreground group-hover:text-primary group-hover:ar-bounce-x" />
                        Export PNG
                      </Button>
                      <Button type="button" variant="outline" onClick={() => gen.handleDownload('svg')} className="group h-9 text-[11px] font-bold border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors shadow-sm">
                        <Download className="size-3.5 mr-1.5 text-muted-foreground group-hover:text-primary group-hover:ar-bounce-x" />
                        Export SVG
                      </Button>
                    </div>
                  </div>

                  {/* KANAN: PARAMETER SETTINGS (2 KATEGORI SAJA) */}
                  <div className="w-full md:w-[65%] lg:w-[70%] space-y-8">

                    {/* =========================================================
                        CATEGORY 1: ENGINE, SHAPES & COLORS
                        ========================================================= */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                        <ShieldCheck className="size-4 text-primary" />
                        <h3 className="text-[13px] font-bold tracking-wider uppercase text-foreground/80">Engine, Shapes & Colors</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                        {/* Overall Shape */}
                        <div className="space-y-2">
                          <Label className="text-[12.5px] font-semibold flex items-center gap-2">Overall Canvas Shape</Label>
                          <Select value={gen.settings.qrShape} onValueChange={(v) => gen.handleChange("qrShape", v)} disabled={gen.isLoading}>
                            <SelectTrigger className={triggerClass}><SelectValue placeholder="Shape" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square">Square Frame</SelectItem>
                              <SelectItem value="circle">Circular Frame</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Error Correction */}
                        <div className="space-y-2">
                          <Label className="text-[12.5px] font-semibold flex items-center gap-2">Error Correction Level</Label>
                          <Select value={gen.settings.errorLevel} onValueChange={(v) => gen.handleChange("errorLevel", v)} disabled={gen.isLoading}>
                            <SelectTrigger className={triggerClass}><SelectValue placeholder="Level" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="L" disabled={!!gen.settings.qrIcon}>Low (7%)</SelectItem>
                              <SelectItem value="M" disabled={!!gen.settings.qrIcon}>Medium (15%)</SelectItem>
                              <SelectItem value="Q">Quartile (25%)</SelectItem>
                              <SelectItem value="H">High (30%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Outer Square */}
                        <div className="space-y-2">
                          <Label className="text-[12.5px] font-semibold flex items-center gap-2">Outer Frame (Eyes)</Label>
                          <Select value={gen.settings.cornerSquare} onValueChange={(v) => gen.handleChange("cornerSquare", v)} disabled={gen.isLoading}>
                            <SelectTrigger className={triggerClass}><SelectValue placeholder="Shape" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="dot">Dot</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                              <SelectItem value="classy">Classy</SelectItem>
                              <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Inner Dot */}
                        <div className="space-y-2">
                          <Label className="text-[12.5px] font-semibold flex items-center gap-2">Inner Pupil (Eyes)</Label>
                          <Select value={gen.settings.cornerDot} onValueChange={(v) => gen.handleChange("cornerDot", v)} disabled={gen.isLoading}>
                            <SelectTrigger className={triggerClass}><SelectValue placeholder="Shape" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="dot">Dot</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Main Dot Pattern */}
                        <div className="space-y-2">
                          <Label className="text-[12.5px] font-semibold flex items-center gap-2">Main Dot Pattern</Label>
                          <Select value={gen.settings.qrPattern} onValueChange={(v) => gen.handleChange("qrPattern", v)} disabled={gen.isLoading}>
                            <SelectTrigger className={triggerClass}><SelectValue placeholder="Pattern" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square">Classic Square</SelectItem>
                              <SelectItem value="dots">Dots</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                              <SelectItem value="classy">Classy</SelectItem>
                              <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* 🔥 FIX: Background Color (Dikembalikan ke Input Visual Murni) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-[12.5px] font-semibold flex items-center gap-2">Background Fill</Label>
                            <Label htmlFor="transparent-bg" className="flex items-center gap-1.5 cursor-pointer group">
                              <Checkbox id="transparent-bg" checked={gen.settings.isBgTransparent} onCheckedChange={(checked) => gen.handleChange("isBgTransparent", !!checked)} className="cursor-pointer" />
                              <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors select-none cursor-pointer">Transparent</span>
                            </Label>
                          </div>
                          <div className={cn(fieldClass, "gap-2.5 px-2.5 transition-all duration-300", gen.isLoading && "animate-pulse", gen.settings.isBgTransparent && "opacity-40 pointer-events-none")}>
                            <div className="relative size-5.5 shrink-0 overflow-hidden rounded-lg border border-border/60 shadow-sm transition-transform active:scale-95">
                              <input type="color" value={gen.settings.bgColor} onChange={(e) => gen.handleChange("bgColor", e.target.value)} disabled={gen.isLoading || gen.settings.isBgTransparent} className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0" />
                            </div>
                            <input type="text" value={gen.settings.bgColor} onChange={(e) => gen.handleChange("bgColor", e.target.value)} disabled={gen.isLoading || gen.settings.isBgTransparent} maxLength={7} spellCheck={false} className={cn(fieldInputClass, "uppercase")} />
                          </div>
                        </div>

                        {/* GLOBAL COLOR & ADVANCED SWITCH */}
                        <div className="sm:col-span-2 pt-3">
                          <Label className="text-[12.5px] font-semibold flex items-center gap-2 mb-2">Global QR Color</Label>
                          <div className="flex items-center gap-4">
                            {/* Input Global Color */}
                            <div className={cn(fieldClass, "gap-2.5 px-2.5 flex-1 max-w-[48%] transition-all duration-500", gen.settings.isCustomColor && "opacity-40 pointer-events-none grayscale-50")}>
                              <div className="relative size-5.5 shrink-0 overflow-hidden rounded-lg border border-border/60 shadow-sm transition-transform active:scale-95">
                                <input type="color" value={gen.settings.qrColor} onChange={(e) => gen.handleChange("qrColor", e.target.value)} disabled={gen.isLoading} className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0" />
                              </div>
                              <input type="text" value={gen.settings.qrColor} onChange={(e) => gen.handleChange("qrColor", e.target.value)} disabled={gen.isLoading} maxLength={7} spellCheck={false} className={cn(fieldInputClass, "uppercase")} />
                            </div>

                            {/* Switch Advanced Colors Ber-Border Sejajar Input */}
                            <div className="flex items-center gap-2.5 bg-muted/10 px-3.5 py-1.5 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors h-9">
                              <Label htmlFor="custom-color" className="text-[11px] font-bold text-muted-foreground cursor-pointer select-none m-0">Advanced Colors</Label>
                              <Switch id="custom-color" checked={gen.settings.isCustomColor} onCheckedChange={(val) => gen.handleChange("isCustomColor", val)} disabled={gen.isLoading} className="scale-75 data-[state=checked]:bg-primary m-0" />
                            </div>
                          </div>
                        </div>

                        {/* 🔥 FIX: Menggunakan variabel Easing dari global.css untuk membungkam linter */}
                        <div className={cn(
                          "sm:col-span-2 overflow-hidden transition-all duration-500 ease-(--transition-timing-function-smooth) origin-top",
                          gen.settings.isCustomColor ? "max-h-37.5 opacity-100 translate-y-0 mt-4" : "max-h-0 opacity-0 -translate-y-2 mt-0 pointer-events-none"
                        )}>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-1">
                            {/* Main Dot */}
                            <div className="space-y-2">
                              <Label className="text-[11.5px] font-semibold text-muted-foreground">Main Dot Color</Label>
                              <div className={cn(fieldClass, "gap-2.5 px-2.5")}>
                                <div className="relative size-5.5 shrink-0 overflow-hidden rounded-lg border border-border/60 shadow-sm"><input type="color" value={gen.settings.qrColor} onChange={(e) => gen.handleChange("qrColor", e.target.value)} disabled={gen.isLoading} className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0" /></div>
                                <input type="text" value={gen.settings.qrColor} onChange={(e) => gen.handleChange("qrColor", e.target.value)} disabled={gen.isLoading} maxLength={7} spellCheck={false} className={cn(fieldInputClass, "uppercase")} />
                              </div>
                            </div>
                            {/* Outer Eye */}
                            <div className="space-y-2">
                              <Label className="text-[11.5px] font-semibold text-muted-foreground">Outer Eye Color</Label>
                              <div className={cn(fieldClass, "gap-2.5 px-2.5")}>
                                <div className="relative size-5.5 shrink-0 overflow-hidden rounded-lg border border-border/60 shadow-sm"><input type="color" value={gen.settings.cornerSquareColor} onChange={(e) => gen.handleChange("cornerSquareColor", e.target.value)} disabled={gen.isLoading} className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0" /></div>
                                <input type="text" value={gen.settings.cornerSquareColor} onChange={(e) => gen.handleChange("cornerSquareColor", e.target.value)} disabled={gen.isLoading} maxLength={7} spellCheck={false} className={cn(fieldInputClass, "uppercase")} />
                              </div>
                            </div>
                            {/* Inner Pupil */}
                            <div className="space-y-2">
                              <Label className="text-[11.5px] font-semibold text-muted-foreground">Inner Pupil Color</Label>
                              <div className={cn(fieldClass, "gap-2.5 px-2.5")}>
                                <div className="relative size-5.5 shrink-0 overflow-hidden rounded-lg border border-border/60 shadow-sm"><input type="color" value={gen.settings.cornerDotColor} onChange={(e) => gen.handleChange("cornerDotColor", e.target.value)} disabled={gen.isLoading} className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0" /></div>
                                <input type="text" value={gen.settings.cornerDotColor} onChange={(e) => gen.handleChange("cornerDotColor", e.target.value)} disabled={gen.isLoading} maxLength={7} spellCheck={false} className={cn(fieldInputClass, "uppercase")} />
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* =========================================================
                        CATEGORY 2: BRANDING & DATA
                        ========================================================= */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                        <ImageIcon className="size-4 text-primary" />
                        <h3 className="text-[13px] font-bold tracking-wider uppercase text-foreground/80">Branding Injection</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6 items-start">
                        {/* Area 1: File Uploader */}
                        <div className="space-y-2">
                          <Label className="text-[11.5px] text-muted-foreground font-medium block">Upload Image (Max 1MB)</Label>
                          <div className="flex items-center gap-3">
                            {gen.settings.qrIcon ? (
                              <div className="relative size-9 rounded-xl border border-border/50 bg-background shadow-inner p-1 flex items-center justify-center shrink-0">
                                <img src={gen.settings.qrIcon} alt="Logo" className="max-w-full max-h-full object-contain" />
                                <button type="button" onClick={() => gen.handleChange("qrIcon", "")} className="absolute -top-1.5 -right-1.5 size-4 bg-destructive text-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform focus:outline-none">
                                  <X className="size-2.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="size-9 rounded-xl border border-dashed border-border/60 bg-muted/10 flex items-center justify-center shrink-0">
                                <ImageIcon className="size-3.5 text-muted-foreground/50" />
                              </div>
                            )}
                            <div className={cn(fieldClass, "flex-1 px-1", gen.isLoading && "animate-pulse")}>
                              <input type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={gen.handleImageUpload} disabled={gen.isLoading} className="w-full text-[11px] text-muted-foreground cursor-pointer focus:outline-none file:cursor-pointer file:h-7 file:px-3 file:mr-3 file:rounded-md file:border-0 file:bg-foreground/5 file:text-foreground hover:file:bg-foreground/10 file:font-semibold file:transition-colors" />
                            </div>
                          </div>
                        </div>

                        {/* Area 2: Logo Adjustments (Scale & Background) */}
                        <div className="space-y-2">
                          <Label className="text-[11.5px] text-muted-foreground font-medium block">Image Adjustments</Label>
                          <div className="flex items-center gap-3 h-9">
                            {/* Select Scale */}
                            <div className={cn("w-1/2", (!gen.settings.qrIcon || gen.isLoading) && "opacity-50 pointer-events-none")}>
                              <Select value={gen.settings.imageSize.toString()} onValueChange={(v) => gen.handleChange("imageSize", parseFloat(v))} disabled={gen.isLoading || !gen.settings.qrIcon}>
                                <SelectTrigger className={triggerClass}><SelectValue placeholder="Scale" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0.2">Small (20%)</SelectItem>
                                  <SelectItem value="0.4">Medium (40%)</SelectItem>
                                  <SelectItem value="0.6">Large (60%)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {/* Checkbox Clear Behind Logo */}
                            <div className={cn("w-1/2 h-9 rounded-xl border border-border/50 bg-background/60 px-3 flex items-center justify-between shadow-inner transition-colors", (!gen.settings.qrIcon || gen.isLoading) && "opacity-50 pointer-events-none")}>
                              <Label htmlFor="hide-dots" className="text-[11.5px] font-medium text-foreground select-none truncate">Clear BG</Label>
                              <Checkbox id="hide-dots" checked={gen.settings.hideDotsBg} onCheckedChange={(checked) => gen.handleChange("hideDotsBg", !!checked)} disabled={gen.isLoading || !gen.settings.qrIcon} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* AREA TOMBOL SAVE */}
                <div className={cn("mt-10 p-3 px-4 rounded-xl border flex items-center justify-between gap-4 transition-colors duration-500", gen.isDraftModified ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-border/40")}>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-md", gen.isDraftModified ? "bg-primary/10 text-primary" : "bg-background border border-border/50")}>
                      {gen.isDraftModified ? <Lightbulb className="size-4 animate-pulse" /> : <CheckCircle2 className="size-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-[13px] font-bold", gen.isDraftModified ? "text-primary" : "text-foreground")}>{gen.isDraftModified ? "Unsaved Changes" : "Configuration Saved"}</span>
                      <span className="text-[11px] text-muted-foreground">{gen.isDraftModified ? "Save to update visual generator." : "Generator visual logic locked."}</span>
                    </div>
                  </div>
                  <Button type="submit" disabled={gen.isSaving || gen.isLoading || !gen.isDraftModified} className={cn("h-9 px-4 rounded-lg font-bold text-[12px]", (gen.isSaving || gen.isLoading || !gen.isDraftModified) ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground")}>
                    {gen.isSaving ? "Saving..." : <><Save className="size-3.5 mr-2" /> Save Engine</>}
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