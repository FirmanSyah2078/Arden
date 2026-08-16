"use client"

// Import Hooks
import { usegeographic } from "@/hooks/globals/use-geographic"
import { useGenerate } from "@/hooks/globals/use-generate"
import { GeneratorEnginePreview } from "@/components/dashboard/globals/generator-engine-preview"

// Import UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Save,
  MapPin,
  Globe,
  Calculator,
  Lightbulb,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Image as ImageIcon,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CityCombobox } from "@/components/dashboard/globals/city-combobox"

// =====================================================================
// 🔥 DESIGN TOKENS
// =====================================================================
const fieldClass =
  "flex h-9 w-full items-center rounded-xl border border-border/50 bg-background/60 shadow-inner transition-all duration-300 hover:border-foreground/30 focus-within:border-foreground/40"

const triggerClass =
  "flex h-9 w-full items-center justify-between rounded-xl border border-border/50 bg-background/60 px-3 text-[13px] font-medium shadow-inner transition-colors duration-300 hover:border-foreground/30 data-[state=open]:border-foreground/40 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"

const fieldInputClass =
  "flex h-full w-full items-center border-0 bg-transparent p-0 text-[13px] font-medium leading-none text-foreground outline-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"

export default function GlobalsPage() {
  const geo = usegeographic()
  const gen = useGenerate()

  return (
    <div className="bg-background selection:bg-primary/20 flex flex-1 flex-col gap-6 p-4">
      <header className="space-y-6">
        <div className="flex w-full flex-col gap-1">
          <h1 className="text-foreground font-jakarta text-xl font-bold tracking-tight sm:text-2xl">
            Globals
          </h1>
          <p className="text-muted-foreground font-inter w-full text-sm leading-relaxed">
            Manage core platform settings including geospatial parameters and
            generator engines.
          </p>
        </div>
        <div className="from-border via-border/50 h-px w-full bg-linear-to-r to-transparent" />
      </header>

      <main className="w-full flex-1 pb-8">
        <div className="mx-auto w-full max-w-4xl space-y-8">
          {/* =====================================================================
              KARTU 1: GEOGRAPHIC CORE
              ===================================================================== */}
          <form onSubmit={geo.handleSave}>
            <Card className="border-border/60 bg-card rounded-3xl border pb-4 shadow-lg">
              <CardHeader className="border-border/40 bg-muted/5 rounded-t-3xl border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-[16px] font-bold">
                  <Globe className="text-primary size-4" /> Geographic Core
                </CardTitle>
                <CardDescription className="text-[12px]">
                  Location parameters for calculating external endpoints (e.g.
                  Astronomy).
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-2">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                      <Globe className="size-4" /> Country
                    </Label>
                    <Select
                      value={geo.settings.country}
                      onValueChange={(v) => geo.handleChange("country", v)}
                      disabled={geo.isLoading}
                    >
                      <SelectTrigger
                        suppressHydrationWarning
                        className={cn(
                          triggerClass,
                          geo.isLoading && "animate-pulse"
                        )}
                      >
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indonesia">Indonesia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                      <MapPin className="text-primary size-4" /> City / Region
                    </Label>
                    <CityCombobox
                      value={geo.settings.city}
                      disabled={geo.isLoading}
                      onChange={(v) => geo.handleChange("city", v)}
                      className={cn(
                        triggerClass,
                        geo.isLoading && "animate-pulse"
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                      <Calculator className="size-4" /> Calculation Method
                    </Label>
                    <Select
                      value={geo.settings.method}
                      onValueChange={(v) => geo.handleChange("method", v)}
                      disabled={geo.isLoading}
                    >
                      <SelectTrigger
                        suppressHydrationWarning
                        className={cn(
                          triggerClass,
                          geo.isLoading && "animate-pulse"
                        )}
                      >
                        <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">Kemenag RI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-8 flex items-center justify-between gap-4 rounded-xl border p-3 px-4 transition-colors duration-500",
                    geo.isDraftModified
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/5 border-border/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "rounded-md p-1.5",
                        geo.isDraftModified
                          ? "bg-primary/10 text-primary"
                          : "bg-background border-border/50 border"
                      )}
                    >
                      {geo.isDraftModified ? (
                        <Lightbulb className="size-4 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "text-[13px] font-bold",
                          geo.isDraftModified
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        {geo.isDraftModified
                          ? "Unsaved Changes"
                          : "Configuration Saved"}
                      </span>
                      <span className="text-muted-foreground text-[11px]">
                        {geo.isDraftModified
                          ? "Save to update core parameters."
                          : "Core preferences are locked."}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      geo.isSaving || geo.isLoading || !geo.isDraftModified
                    }
                    className={cn(
                      "h-9 rounded-lg px-4 text-[12px] font-bold",
                      geo.isSaving || geo.isLoading || !geo.isDraftModified
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {geo.isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 size-3.5" /> Save Config
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>

          {/* =====================================================================
    KARTU 2: GENERATOR ENGINE STUDIO — ARDEN QR ENGINE
    ===================================================================== */}
          <form onSubmit={gen.handleSave}>
            <Card className="border-border/60 bg-card relative z-10 rounded-3xl border pb-4 shadow-lg">
              <CardHeader className="border-border/40 bg-muted/5 rounded-t-3xl border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-[16px] font-bold">
                  <QrCode className="text-primary size-4" />
                  Generator Engine Studio
                </CardTitle>

                <CardDescription className="text-[12px]">
                  Design and manage the master Arden QR Engine used by
                  system-generated QR Codes across Arden.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 pb-2">
                <div className="flex flex-col items-start gap-8 md:flex-row">
                  {/* ===============================================================
            KIRI: ARDEN QR ENGINE PREVIEW
            =============================================================== */}
                  <GeneratorEnginePreview
                    settings={gen.settings}
                    isLoading={gen.isLoading}
                  />

                  {/* ===============================================================
            KANAN: MASTER ENGINE SETTINGS
            =============================================================== */}
                  <div className="w-full space-y-8 md:w-[65%] lg:w-[70%]">
                    {/* =============================================================
              CATEGORY 1: ENGINE, SHAPES & COLORS
              ============================================================= */}
                    <div className="space-y-6">
                      <div className="border-border/50 flex items-center gap-2 border-b pb-2">
                        <ShieldCheck className="text-primary size-4" />

                        <h3 className="text-foreground/80 text-[13px] font-bold tracking-wider uppercase">
                          Engine, Shapes & Colors
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                        {/* ---------------------------------------------------------
                  OVERALL SHAPE
                  --------------------------------------------------------- */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                            Overall Canvas Shape
                          </Label>

                          <Select
                            value={gen.settings.qrShape}
                            onValueChange={(value) =>
                              gen.handleChange("qrShape", value)
                            }
                            disabled={gen.isLoading}
                          >
                            <SelectTrigger className={triggerClass}>
                              <SelectValue placeholder="Shape" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="square">
                                Square Frame
                              </SelectItem>

                              <SelectItem value="circle">
                                Circular Frame
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* ---------------------------------------------------------
                  ERROR CORRECTION
                  --------------------------------------------------------- */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                            Error Correction Level
                          </Label>

                          <Select
                            value={gen.settings.errorLevel}
                            onValueChange={(value) =>
                              gen.handleChange("errorLevel", value)
                            }
                            disabled={gen.isLoading}
                          >
                            <SelectTrigger className={triggerClass}>
                              <SelectValue placeholder="Level" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem
                                value="L"
                                disabled={Boolean(gen.settings.qrIcon)}
                              >
                                Low (7%)
                              </SelectItem>

                              <SelectItem
                                value="M"
                                disabled={Boolean(gen.settings.qrIcon)}
                              >
                                Medium (15%)
                              </SelectItem>

                              <SelectItem value="Q">Quartile (25%)</SelectItem>

                              <SelectItem value="H">High (30%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* ---------------------------------------------------------
                  OUTER FRAME
                  --------------------------------------------------------- */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                            Outer Frame (Eyes)
                          </Label>

                          <Select
                            value={gen.settings.cornerSquare}
                            onValueChange={(value) =>
                              gen.handleChange("cornerSquare", value)
                            }
                            disabled={gen.isLoading}
                          >
                            <SelectTrigger className={triggerClass}>
                              <SelectValue placeholder="Shape" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="square">Square</SelectItem>

                              <SelectItem value="dot">Dot</SelectItem>

                              <SelectItem value="rounded">Rounded</SelectItem>

                              <SelectItem value="extra-rounded">
                                Extra Rounded
                              </SelectItem>

                              <SelectItem value="classy">Classy</SelectItem>

                              <SelectItem value="classy-rounded">
                                Classy Rounded
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* ---------------------------------------------------------
                  INNER PUPIL
                  --------------------------------------------------------- */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                            Inner Pupil (Eyes)
                          </Label>

                          <Select
                            value={gen.settings.cornerDot}
                            onValueChange={(value) =>
                              gen.handleChange("cornerDot", value)
                            }
                            disabled={gen.isLoading}
                          >
                            <SelectTrigger className={triggerClass}>
                              <SelectValue placeholder="Shape" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="square">Square</SelectItem>

                              <SelectItem value="dot">Dot</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* ---------------------------------------------------------
                  MAIN DOT PATTERN
                  --------------------------------------------------------- */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                            Main Dot Pattern
                          </Label>

                          <Select
                            value={gen.settings.qrPattern}
                            onValueChange={(value) =>
                              gen.handleChange("qrPattern", value)
                            }
                            disabled={gen.isLoading}
                          >
                            <SelectTrigger className={triggerClass}>
                              <SelectValue placeholder="Pattern" />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="square">
                                Classic Square
                              </SelectItem>

                              <SelectItem value="dots">Dots</SelectItem>

                              <SelectItem value="rounded">Rounded</SelectItem>

                              <SelectItem value="extra-rounded">
                                Extra Rounded
                              </SelectItem>

                              <SelectItem value="classy">Classy</SelectItem>

                              <SelectItem value="classy-rounded">
                                Classy Rounded
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* ---------------------------------------------------------
                  BACKGROUND
                  --------------------------------------------------------- */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2 text-[12.5px] font-semibold">
                              Background Fill
                            </Label>

                            <Label
                              htmlFor="transparent-bg"
                              className="group flex cursor-pointer items-center gap-1.5"
                            >
                              <Checkbox
                                id="transparent-bg"
                                checked={gen.settings.isBgTransparent}
                                onCheckedChange={(checked) =>
                                  gen.handleChange(
                                    "isBgTransparent",
                                    Boolean(checked)
                                  )
                                }
                                className="cursor-pointer"
                              />

                              <span className="text-muted-foreground group-hover:text-foreground cursor-pointer text-[10px] font-medium transition-colors select-none">
                                Transparent
                              </span>
                            </Label>
                          </div>

                          <div
                            className={cn(
                              fieldClass,
                              "gap-2.5 px-2.5 transition-all duration-300",
                              gen.settings.isBgTransparent &&
                                "pointer-events-none opacity-40"
                            )}
                          >
                            <div className="border-border/60 relative size-5.5 shrink-0 overflow-hidden rounded-lg border shadow-sm transition-transform active:scale-95">
                              <input
                                type="color"
                                value={gen.settings.bgColor}
                                onChange={(event) =>
                                  gen.handleChange(
                                    "bgColor",
                                    event.target.value
                                  )
                                }
                                disabled={
                                  gen.isLoading || gen.settings.isBgTransparent
                                }
                                className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0"
                              />
                            </div>

                            <input
                              type="text"
                              value={gen.settings.bgColor}
                              onChange={(event) =>
                                gen.handleChange("bgColor", event.target.value)
                              }
                              disabled={
                                gen.isLoading || gen.settings.isBgTransparent
                              }
                              maxLength={7}
                              spellCheck={false}
                              className={cn(fieldInputClass, "uppercase")}
                            />
                          </div>
                        </div>

                        {/* =========================================================
                  GLOBAL COLOR
                  ========================================================= */}
                        <div className="pt-3 sm:col-span-2">
                          <Label className="mb-2 flex items-center gap-2 text-[12.5px] font-semibold">
                            Global QR Color
                          </Label>

                          <div className="flex items-center gap-4">
                            {/* GLOBAL COLOR INPUT */}
                            <div
                              className={cn(
                                fieldClass,
                                "max-w-[48%] flex-1 gap-2.5 px-2.5 transition-all duration-500",
                                gen.settings.isCustomColor &&
                                  "pointer-events-none opacity-40 grayscale-50"
                              )}
                            >
                              <div className="border-border/60 relative size-5.5 shrink-0 overflow-hidden rounded-lg border shadow-sm transition-transform active:scale-95">
                                <input
                                  type="color"
                                  value={gen.settings.qrColor}
                                  onChange={(event) =>
                                    gen.handleChange(
                                      "qrColor",
                                      event.target.value
                                    )
                                  }
                                  disabled={gen.isLoading}
                                  className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0"
                                />
                              </div>

                              <input
                                type="text"
                                value={gen.settings.qrColor}
                                onChange={(event) =>
                                  gen.handleChange(
                                    "qrColor",
                                    event.target.value
                                  )
                                }
                                disabled={gen.isLoading}
                                maxLength={7}
                                spellCheck={false}
                                className={cn(fieldInputClass, "uppercase")}
                              />
                            </div>

                            {/* ADVANCED COLORS */}
                            <div className="bg-muted/10 border-border/50 hover:bg-muted/30 flex h-9 items-center gap-2.5 rounded-xl border px-3.5 py-1.5 transition-colors">
                              <Label
                                htmlFor="custom-color"
                                className="text-muted-foreground m-0 cursor-pointer text-[11px] font-bold select-none"
                              >
                                Advanced Colors
                              </Label>

                              <Switch
                                id="custom-color"
                                checked={gen.settings.isCustomColor}
                                onCheckedChange={(value) =>
                                  gen.handleChange("isCustomColor", value)
                                }
                                disabled={gen.isLoading}
                                className="data-[state=checked]:bg-primary m-0 scale-75"
                              />
                            </div>
                          </div>
                        </div>

                        {/* =========================================================
                  ADVANCED COLORS
                  ========================================================= */}
                        <div
                          className={cn(
                            "origin-top overflow-hidden transition-all duration-500 ease-(--transition-timing-function-smooth) sm:col-span-2",
                            gen.settings.isCustomColor
                              ? "mt-4 max-h-37.5 translate-y-0 opacity-100"
                              : "pointer-events-none mt-0 max-h-0 -translate-y-2 opacity-0"
                          )}
                        >
                          <div className="grid grid-cols-1 gap-5 pb-1 sm:grid-cols-3">
                            {/* MAIN DOT */}
                            <div className="space-y-2">
                              <Label className="text-muted-foreground text-[11.5px] font-semibold">
                                Main Dot Color
                              </Label>

                              <div className={cn(fieldClass, "gap-2.5 px-2.5")}>
                                <div className="border-border/60 relative size-5.5 shrink-0 overflow-hidden rounded-lg border shadow-sm">
                                  <input
                                    type="color"
                                    value={gen.settings.mainDotColor}
                                    onChange={(event) =>
                                      gen.handleChange(
                                        "mainDotColor",
                                        event.target.value
                                      )
                                    }
                                    disabled={gen.isLoading}
                                    className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0"
                                  />
                                </div>

                                <input
                                  type="text"
                                  value={gen.settings.mainDotColor}
                                  onChange={(event) =>
                                    gen.handleChange(
                                      "mainDotColor",
                                      event.target.value
                                    )
                                  }
                                  disabled={gen.isLoading}
                                  maxLength={7}
                                  spellCheck={false}
                                  className={cn(fieldInputClass, "uppercase")}
                                />
                              </div>
                            </div>

                            {/* OUTER EYE */}
                            <div className="space-y-2">
                              <Label className="text-muted-foreground text-[11.5px] font-semibold">
                                Outer Eye Color
                              </Label>

                              <div className={cn(fieldClass, "gap-2.5 px-2.5")}>
                                <div className="border-border/60 relative size-5.5 shrink-0 overflow-hidden rounded-lg border shadow-sm">
                                  <input
                                    type="color"
                                    value={gen.settings.cornerSquareColor}
                                    onChange={(event) =>
                                      gen.handleChange(
                                        "cornerSquareColor",
                                        event.target.value
                                      )
                                    }
                                    disabled={gen.isLoading}
                                    className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0"
                                  />
                                </div>

                                <input
                                  type="text"
                                  value={gen.settings.cornerSquareColor}
                                  onChange={(event) =>
                                    gen.handleChange(
                                      "cornerSquareColor",
                                      event.target.value
                                    )
                                  }
                                  disabled={gen.isLoading}
                                  maxLength={7}
                                  spellCheck={false}
                                  className={cn(fieldInputClass, "uppercase")}
                                />
                              </div>
                            </div>

                            {/* INNER PUPIL */}
                            <div className="space-y-2">
                              <Label className="text-muted-foreground text-[11.5px] font-semibold">
                                Inner Pupil Color
                              </Label>

                              <div className={cn(fieldClass, "gap-2.5 px-2.5")}>
                                <div className="border-border/60 relative size-5.5 shrink-0 overflow-hidden rounded-lg border shadow-sm">
                                  <input
                                    type="color"
                                    value={gen.settings.cornerDotColor}
                                    onChange={(event) =>
                                      gen.handleChange(
                                        "cornerDotColor",
                                        event.target.value
                                      )
                                    }
                                    disabled={gen.isLoading}
                                    className="absolute -top-2 -left-2 size-10 cursor-pointer border-0 p-0"
                                  />
                                </div>

                                <input
                                  type="text"
                                  value={gen.settings.cornerDotColor}
                                  onChange={(event) =>
                                    gen.handleChange(
                                      "cornerDotColor",
                                      event.target.value
                                    )
                                  }
                                  disabled={gen.isLoading}
                                  maxLength={7}
                                  spellCheck={false}
                                  className={cn(fieldInputClass, "uppercase")}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* =============================================================
              CATEGORY 2: BRANDING & DATA
              ============================================================= */}
                    <div className="space-y-5">
                      <div className="border-border/50 flex items-center gap-2 border-b pb-2">
                        <ImageIcon className="text-primary size-4" />

                        <h3 className="text-foreground/80 text-[13px] font-bold tracking-wider uppercase">
                          Branding Injection
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 items-start gap-x-5 gap-y-6 sm:grid-cols-2">
                        {/* ---------------------------------------------------------
                  FILE UPLOADER
                  --------------------------------------------------------- */}
                        <div className="space-y-2">
                          <Label className="text-muted-foreground block text-[11.5px] font-medium">
                            Upload Image (Max 2MB)
                          </Label>

                          <div className="flex items-center gap-3">
                            {gen.settings.qrIcon ? (
                              <div className="border-border/50 bg-background relative flex size-9 shrink-0 items-center justify-center rounded-xl border p-1 shadow-inner">
                                {/* 
                                  QR branding preview.
                                  Source dapat berupa URL sementara/local preview sebelum
                                  file disimpan ke Supabase Storage, sehingga <img> digunakan
                                  secara sengaja daripada next/image.
                                */}

                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={gen.settings.qrIcon}
                                  alt="QR branding preview"
                                  className="max-h-full max-w-full object-contain"
                                />

                                <button
                                  type="button"
                                  onClick={() => gen.handleChange("qrIcon", "")}
                                  disabled={gen.isLoading}
                                  className={cn(
                                    "bg-destructive absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full text-white shadow transition-transform focus:outline-none",
                                    gen.isLoading
                                      ? "pointer-events-none cursor-not-allowed opacity-50"
                                      : "cursor-pointer hover:scale-110"
                                  )}
                                  aria-label="Remove QR branding image"
                                >
                                  <X className="size-2.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="border-border/60 bg-muted/10 flex size-9 shrink-0 items-center justify-center rounded-xl border border-dashed">
                                <ImageIcon className="text-muted-foreground/50 size-3.5" />
                              </div>
                            )}

                            <div
                              className={cn(
                                fieldClass,
                                "flex-1 px-1",
                                gen.isLoading &&
                                  "pointer-events-none opacity-60"
                              )}
                            >
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/svg+xml"
                                onChange={gen.handleImageUpload}
                                disabled={gen.isLoading}
                                className={cn(
                                  "text-muted-foreground",
                                  "file:bg-foreground/5",
                                  "file:text-foreground",
                                  "hover:file:bg-foreground/10",
                                  "w-full text-[11px]",
                                  "file:mr-3",
                                  "file:h-7",
                                  "file:rounded-md",
                                  "file:border-0",
                                  "file:px-3",
                                  "file:font-semibold",
                                  "file:transition-colors",
                                  "focus:outline-none",
                                  gen.isLoading
                                    ? "cursor-not-allowed file:cursor-not-allowed"
                                    : "cursor-pointer file:cursor-pointer"
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        {/* ---------------------------------------------------------
                  IMAGE ADJUSTMENTS
                  --------------------------------------------------------- */}
                        <div className="space-y-2">
                          <Label className="text-muted-foreground block text-[11.5px] font-medium">
                            Image Adjustments
                          </Label>

                          <div className="flex h-9 items-center gap-3">
                            {/* SCALE */}
                            <div
                              className={cn(
                                "w-1/2",
                                (!gen.settings.qrIcon || gen.isLoading) &&
                                  "pointer-events-none opacity-50"
                              )}
                            >
                              <Select
                                value={gen.settings.imageSize.toString()}
                                onValueChange={(value) =>
                                  gen.handleChange(
                                    "imageSize",
                                    parseFloat(value)
                                  )
                                }
                                disabled={gen.isLoading || !gen.settings.qrIcon}
                              >
                                <SelectTrigger className={triggerClass}>
                                  <SelectValue placeholder="Scale" />
                                </SelectTrigger>

                                <SelectContent>
                                  <SelectItem value="0.2">
                                    Small (20%)
                                  </SelectItem>

                                  <SelectItem value="0.4">
                                    Medium (40%)
                                  </SelectItem>

                                  <SelectItem value="0.6">
                                    Large (60%)
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* CLEAR BACKGROUND BEHIND LOGO */}
                            <div
                              className={cn(
                                "border-border/50 bg-background/60 flex h-9 w-1/2 items-center justify-between rounded-xl border px-3 shadow-inner transition-colors",
                                (!gen.settings.qrIcon || gen.isLoading) &&
                                  "pointer-events-none opacity-50"
                              )}
                            >
                              <Label
                                htmlFor="hide-dots"
                                className="text-foreground truncate text-[11.5px] font-medium select-none"
                              >
                                Clear BG
                              </Label>

                              <Checkbox
                                id="hide-dots"
                                checked={gen.settings.hideDotsBg}
                                onCheckedChange={(checked) =>
                                  gen.handleChange(
                                    "hideDotsBg",
                                    Boolean(checked)
                                  )
                                }
                                disabled={gen.isLoading || !gen.settings.qrIcon}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ===============================================================
          SAVE MASTER ENGINE
          =============================================================== */}
                <div
                  className={cn(
                    "mt-10 flex items-center justify-between gap-4 rounded-xl border p-3 px-4 transition-colors duration-500",
                    gen.isDraftModified
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/5 border-border/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "rounded-md p-1.5",
                        gen.isDraftModified
                          ? "bg-primary/10 text-primary"
                          : "bg-background border-border/50 border"
                      )}
                    >
                      {gen.isDraftModified ? (
                        <Lightbulb className="size-4 animate-pulse" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "text-[13px] font-bold",
                          gen.isDraftModified
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        {gen.isDraftModified
                          ? "Unsaved Changes"
                          : "Configuration Saved"}
                      </span>

                      <span className="text-muted-foreground text-[11px]">
                        {gen.isDraftModified
                          ? "Save to update the central Arden QR Engine."
                          : "Generator engine configuration is synchronized."}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      gen.isSaving || gen.isLoading || !gen.isDraftModified
                    }
                    className={cn(
                      "h-9 rounded-lg px-4 text-[12px] font-bold",
                      gen.isSaving || gen.isLoading || !gen.isDraftModified
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {gen.isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 size-3.5" />
                        Save Engine
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </div>
  )
}
