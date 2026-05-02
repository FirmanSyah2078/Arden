// src/app/(desktop)/dashboard/globals/page.tsx
"use client";

import React, { useEffect, useRef } from "react";

// Import Hooks
import { usegeographic } from "@/hooks/globals/use-geographic";
import { useGenerate } from "@/hooks/globals/use-generate"; 

// Import UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, MapPin, Globe, Calculator, Lightbulb, CheckCircle2, QrCode, Palette, Shapes, Scan, PaintBucket, ShieldCheck, Target, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CityCombobox } from "@/components/dashboard/globals/city-combobox";

// =====================================================================
// 🔥 DESIGN TOKENS
// =====================================================================
const fieldClass =
  "flex h-11 w-full rounded-xl border border-border/50 bg-background/60 shadow-inner transition-all duration-300 hover:border-foreground/30 focus-within:border-foreground/40";

const triggerClass =
  "flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-background/60 px-3 text-[13px] font-medium shadow-inner transition-all duration-300 hover:border-foreground/30 focus:border-foreground/40";

const fieldInputClass =
  "flex h-full w-full items-center border-0 bg-transparent p-0 text-[13px] font-medium leading-none text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50";


export default function GlobalsPage() {
  const geo = usegeographic();
  const gen = useGenerate();

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<any>(null);

  const finalBgColor = gen.settings.isBgTransparent ? "transparent" : (gen.settings.bgColor || "#ffffff");

  // =====================================================================
  // 🔥 ENGINE: INIT & UPDATE QR CODE PREVIEW
  // =====================================================================
  useEffect(() => {
    if (typeof window !== "undefined") {
      const QRCodeStyling = require("qr-code-styling");
      
      qrCode.current = new QRCodeStyling({
        width: 180,
        height: 180,
        type: "svg", 
        data: "https://arden.app/scan/ARD-XMP1-001",
        ...(gen.settings.qrIcon ? { image: gen.settings.qrIcon } : {}), 
        qrOptions: {
          errorCorrectionLevel: gen.settings.errorLevel || "Q"
        },
        dotsOptions: {
          color: gen.settings.qrColor || "#000000",
          type: gen.settings.qrPattern || "square",
        },
        backgroundOptions: {
          color: finalBgColor,
        },
        cornersSquareOptions: {
          type: gen.settings.cornerSquare || "square",
        },
        cornersDotOptions: {
          type: gen.settings.cornerDot || "square",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: gen.settings.iconMargin || 5,
          hideBackgroundDots: gen.settings.hideDotsBg ?? true
        }
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = "";
        qrCode.current.append(qrRef.current);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Live Update: Dependency array sekarang konsisten panjangnya
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        ...(gen.settings.qrIcon ? { image: gen.settings.qrIcon } : { image: "" }), 
        qrOptions: { errorCorrectionLevel: gen.settings.errorLevel },
        dotsOptions: { color: gen.settings.qrColor, type: gen.settings.qrPattern },
        backgroundOptions: { color: finalBgColor },
        cornersSquareOptions: { type: gen.settings.cornerSquare },
        cornersDotOptions: { type: gen.settings.cornerDot },
        imageOptions: {
          margin: gen.settings.iconMargin,
          hideBackgroundDots: gen.settings.hideDotsBg
        }
      });
    }
  }, [
    gen.settings.qrColor, 
    finalBgColor, 
    gen.settings.qrPattern, 
    gen.settings.errorLevel, 
    gen.settings.cornerSquare, 
    gen.settings.cornerDot,
    gen.settings.qrIcon,
    gen.settings.iconMargin,
    gen.settings.hideDotsBg
  ]);

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
            <Card className="rounded-3xl border border-border/60 bg-card shadow-lg overflow-hidden pb-4">
              <CardHeader className="border-b border-border/40 bg-muted/5 pb-4">
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
            <Card className="rounded-3xl border border-border/60 bg-card shadow-lg overflow-hidden pb-4">
              <CardHeader className="border-b border-border/40 bg-muted/5 pb-4">
                <CardTitle className="text-[16px] font-bold flex items-center gap-2"><QrCode className="size-4 text-primary" /> Generator Engine</CardTitle>
                <CardDescription className="text-[12px]">Advanced templates and styling parameters for system-generated QR Codes.</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 pb-2">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* KIRI: LIVE PREVIEW AREA */}
                  <div className="w-full md:w-[35%] lg:w-[30%] flex flex-col items-center justify-center p-6 bg-muted/20 border border-border/40 rounded-2xl relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-size-[14px_14px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)]" />
                    
                    <div 
                      className="relative z-10 size-45 overflow-hidden rounded-md shadow-xl ring-1 ring-border/20 transition-all duration-300" 
                      style={{ 
                        backgroundColor: gen.settings.isBgTransparent ? "transparent" : (gen.settings.bgColor || "transparent"),
                        backgroundImage: gen.settings.isBgTransparent ? `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzNmM2Y0NiIgZmlsbC1vcGFjaXR5PSIwLjQiIC8+PHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iIzNmM2Y0NiIgZmlsbC1vcGFjaXR5PSIwLjQiIC8+PC9zdmc+')` : "none"
                      }}
                    >
                      <div ref={qrRef} className="size-full pointer-events-none" />
                    </div>
                    
                    <div className="mt-5 flex items-center gap-2 relative z-10 opacity-70">
                      <Scan className="size-3.5" />
                      <span className="text-[10px] font-bold tracking-widest uppercase">Live Preview</span>
                    </div>
                  </div>

                  {/* KANAN: PARAMETER SETTINGS */}
                  <div className="w-full md:w-[65%] lg:w-[70%] grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
                    
                    {/* Primary Color */}
                    <div className="space-y-2">
                      <Label className="text-[12.5px] font-semibold flex items-center gap-2"><Palette className="size-4" /> Dot Color</Label>
                      <div className={cn(fieldClass, "flex items-center gap-2.5 px-2.5", gen.isLoading && "animate-pulse")}>
                        <div className="relative size-5.5 shrink-0 overflow-hidden rounded-lg border border-border/60 shadow-sm transition-transform active:scale-95">
                          <input type="color" value={gen.settings.qrColor} onChange={(e) => gen.handleChange("qrColor", e.target.value)} disabled={gen.isLoading} className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0" />
                        </div>
                        <input type="text" value={gen.settings.qrColor} onChange={(e) => gen.handleChange("qrColor", e.target.value)} disabled={gen.isLoading} maxLength={7} spellCheck={false} className={cn(fieldInputClass, "h-full uppercase")} />
                      </div>
                    </div>

                    {/* Background Color */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[12.5px] font-semibold flex items-center gap-2"><PaintBucket className="size-4" /> Background</Label>
                        <Label htmlFor="transparent-bg" className="flex items-center gap-1.5 cursor-pointer group">
                           {/* 🔥 FIX: Memastikan border radius menjadi kotak dengan 'rounded-sm' */}
                           <Checkbox 
                             id="transparent-bg" 
                             checked={gen.settings.isBgTransparent} 
                             onCheckedChange={(checked) => gen.handleChange("isBgTransparent", !!checked)}
                             className="size-3.5 rounded-sm cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" 
                           />
                           <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors select-none cursor-pointer">Transparent</span>
                        </Label>
                      </div>
                      
                      <div className={cn(fieldClass, "flex items-center gap-2.5 px-2.5 transition-all duration-300", gen.isLoading && "animate-pulse", gen.settings.isBgTransparent && "opacity-40 pointer-events-none")}>
                        <div className="relative size-5.5 shrink-0 overflow-hidden rounded-lg border border-border/60 shadow-sm transition-transform active:scale-95">
                          <input type="color" value={gen.settings.bgColor} onChange={(e) => gen.handleChange("bgColor", e.target.value)} disabled={gen.isLoading || gen.settings.isBgTransparent} className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0" />
                        </div>
                        <input type="text" value={gen.settings.bgColor} onChange={(e) => gen.handleChange("bgColor", e.target.value)} disabled={gen.isLoading || gen.settings.isBgTransparent} maxLength={7} spellCheck={false} className={cn(fieldInputClass, "h-full uppercase")} />
                      </div>
                    </div>

                    {/* Pattern Type */}
                    <div className="space-y-2">
                      <Label className="text-[12.5px] font-semibold flex items-center gap-2"><Shapes className="size-4 text-primary" /> Dot Pattern</Label>
                      <Select value={gen.settings.qrPattern} onValueChange={(v) => gen.handleChange("qrPattern", v)} disabled={gen.isLoading}>
                        <SelectTrigger suppressHydrationWarning className={cn(triggerClass, gen.isLoading && "animate-pulse")}><SelectValue placeholder="Pattern" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="dots">Dots</SelectItem>
                          <SelectItem value="rounded">Rounded</SelectItem>
                          <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                          <SelectItem value="classy">Classy</SelectItem>
                          <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Error Correction */}
                    <div className="space-y-2">
                      <Label className="text-[12.5px] font-semibold flex items-center gap-2"><ShieldCheck className="size-4" /> Error Correction</Label>
                      <Select value={gen.settings.errorLevel} onValueChange={(v) => gen.handleChange("errorLevel", v)} disabled={gen.isLoading}>
                        <SelectTrigger suppressHydrationWarning className={cn(triggerClass, gen.isLoading && "animate-pulse")}><SelectValue placeholder="Level" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L">Low (7%)</SelectItem>
                          <SelectItem value="M">Medium (15%)</SelectItem>
                          <SelectItem value="Q">Quartile (25%)</SelectItem>
                          <SelectItem value="H">High (30%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Outer Square (Mata Luar) */}
                    <div className="space-y-2">
                      <Label className="text-[12.5px] font-semibold flex items-center gap-2"><QrCode className="size-4" /> Outer Eye Shape</Label>
                      <Select value={gen.settings.cornerSquare} onValueChange={(v) => gen.handleChange("cornerSquare", v)} disabled={gen.isLoading}>
                        <SelectTrigger suppressHydrationWarning className={cn(triggerClass, gen.isLoading && "animate-pulse")}><SelectValue placeholder="Outer Shape" /></SelectTrigger>
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

                    {/* Inner Dot (Mata Dalam) */}
                    <div className="space-y-2">
                      <Label className="text-[12.5px] font-semibold flex items-center gap-2"><Target className="size-4" /> Inner Eye Shape</Label>
                      <Select value={gen.settings.cornerDot} onValueChange={(v) => gen.handleChange("cornerDot", v)} disabled={gen.isLoading}>
                        <SelectTrigger suppressHydrationWarning className={cn(triggerClass, gen.isLoading && "animate-pulse")}><SelectValue placeholder="Inner Shape" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="dot">Dot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* ==========================================
                        🔥 CENTER LOGO INJECTION (FULL WIDTH 2 COLUMNS)
                        ========================================== */}
                    <div className="space-y-4 sm:col-span-2 mt-2 pt-6 border-t border-border/40">
                      <Label className="text-[12.5px] font-semibold flex items-center gap-2"><ImageIcon className="size-4 text-primary" /> Center Logo / Icon Injection</Label>
                      
                      {/* 🔥 FIX: Mengubah form uploader dan opsinya agar setema dengan Select (h-11) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                        
                        {/* Area 1: File Uploader */}
                        <div className="space-y-2">
                           <Label className="text-[11.5px] text-muted-foreground font-medium">Upload Image</Label>
                           <div className="flex items-center gap-3">
                              {/* Preview Mini */}
                              {gen.settings.qrIcon ? (
                                <div className="relative size-11 rounded-xl border border-border/50 bg-background shadow-inner p-1.5 flex items-center justify-center shrink-0">
                                  <img src={gen.settings.qrIcon} alt="Logo" className="max-w-full max-h-full object-contain" />
                                  <button 
                                    type="button" 
                                    onClick={() => gen.handleChange("qrIcon", "")}
                                    className="absolute -top-1.5 -right-1.5 size-4 bg-destructive text-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
                                  >
                                    <X className="size-2.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="size-11 rounded-xl border border-dashed border-border/60 bg-muted/10 flex items-center justify-center shrink-0">
                                  <ImageIcon className="size-4 text-muted-foreground/50" />
                                </div>
                              )}

                              {/* Input File setema fieldClass */}
                              <div className={cn(fieldClass, "flex-1 px-1.5 transition-all overflow-hidden", gen.isLoading && "animate-pulse")}>
                                <input 
                                  type="file" 
                                  accept="image/png, image/jpeg, image/svg+xml"
                                  onChange={gen.handleImageUpload}
                                  disabled={gen.isLoading}
                                  className={cn(fieldInputClass, "file:cursor-pointer file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-[11.5px] file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer text-muted-foreground")}
                                />
                              </div>
                           </div>
                        </div>

                        {/* Area 2: Opsi Logo (Margin & Clear Dots) */}
                        <div className="space-y-2">
                          <Label className="text-[11.5px] text-muted-foreground font-medium">Image Adjustments</Label>
                          <div className="flex items-center gap-4 h-11">
                             
                             {/* Select Margin - Disesuaikan agar sama seperti Select lain tapi porsi lebih kecil */}
                             <div className="w-1/2">
                               <Select value={gen.settings.iconMargin.toString()} onValueChange={(v) => gen.handleChange("iconMargin", parseInt(v))} disabled={gen.isLoading || !gen.settings.qrIcon}>
                                 <SelectTrigger className={cn(triggerClass, (gen.isLoading || !gen.settings.qrIcon) && "opacity-50")}>
                                   <SelectValue placeholder="Margin" />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="0">Tight (0px)</SelectItem>
                                   <SelectItem value="5">Normal (5px)</SelectItem>
                                   <SelectItem value="10">Loose (10px)</SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>

                             {/* Checkbox Clear Behind Logo - Dibuat sepadan tingginya dengan h-11 */}
                             <div className={cn("w-1/2 h-11 rounded-xl border border-border/50 bg-background/60 px-3 flex items-center justify-between shadow-inner transition-colors", (!gen.settings.qrIcon || gen.isLoading) && "opacity-50 pointer-events-none")}>
                                <Label htmlFor="hide-dots" className="text-[12.5px] font-medium text-foreground cursor-pointer select-none truncate">
                                   Clear BG
                                </Label>
                                <Checkbox 
                                  id="hide-dots" 
                                  checked={gen.settings.hideDotsBg} 
                                  onCheckedChange={(checked) => gen.handleChange("hideDotsBg", !!checked)}
                                  className="size-4 rounded-sm cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                />
                             </div>

                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                {/* AREA TOMBOL SAVE */}
                <div className={cn("mt-8 p-3 px-4 rounded-xl border flex items-center justify-between gap-4 transition-colors duration-500", gen.isDraftModified ? "bg-primary/5 border-primary/20" : "bg-muted/5 border-border/40")}>
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