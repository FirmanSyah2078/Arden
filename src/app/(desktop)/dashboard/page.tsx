"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { 
  Users, Droplets, Compass, FileClock, UserX, 
  TrendingUp, TrendingDown, Activity, BotMessageSquare, 
  Layers, Filter, ChevronDown, X
} from "lucide-react";
// 🔥 FIX: Tambahkan Legend dari recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const statsData = {
  totalSiswi: { value: 1250 }, 
  siswiSuci: { value: 980, trend: 20 }, 
  sedangHaid: { value: 245, trend: -5 },
  izinSakit: { value: 15, trend: 0 },
  alpha: { value: 10, trend: 1 },
};

type FilterType = "all" | "X" | "XI" | "XII";

export interface ClassData {
  angkatan: "X" | "XI" | "XII";
  namaKelas: string;
  suci: number;
  haid: number;
}

const chartData: ClassData[] = [
  // --- KELAS X ---
  { angkatan: "X", namaKelas: "X-1", suci: 32, haid: 4 },
  { angkatan: "X", namaKelas: "X-2", suci: 28, haid: 6 },
  { angkatan: "X", namaKelas: "X-3", suci: 30, haid: 5 },
  { angkatan: "X", namaKelas: "X-4", suci: 25, haid: 8 },
  { angkatan: "X", namaKelas: "X-5", suci: 29, haid: 3 },
  { angkatan: "X", namaKelas: "X-6", suci: 31, haid: 4 },
  { angkatan: "X", namaKelas: "X-7", suci: 27, haid: 7 },
  { angkatan: "X", namaKelas: "X-8", suci: 26, haid: 6 },
  { angkatan: "X", namaKelas: "X-9", suci: 33, haid: 2 },
  { angkatan: "X", namaKelas: "X-10", suci: 24, haid: 9 },
  { angkatan: "X", namaKelas: "X-11", suci: 30, haid: 5 },
  { angkatan: "X", namaKelas: "X-12", suci: 28, haid: 4 },

  // --- KELAS XI ---
  { angkatan: "XI", namaKelas: "XI-1", suci: 29, haid: 5 },
  { angkatan: "XI", namaKelas: "XI-2", suci: 34, haid: 2 },
  { angkatan: "XI", namaKelas: "XI-3", suci: 27, haid: 8 },
  { angkatan: "XI", namaKelas: "XI-4", suci: 31, haid: 4 },
  { angkatan: "XI", namaKelas: "XI-5", suci: 25, haid: 9 },
  { angkatan: "XI", namaKelas: "XI-6", suci: 30, haid: 6 },
  { angkatan: "XI", namaKelas: "XI-7", suci: 28, haid: 7 },
  { angkatan: "XI", namaKelas: "XI-8", suci: 32, haid: 3 },
  { angkatan: "XI", namaKelas: "XI-9", suci: 26, haid: 6 },
  { angkatan: "XI", namaKelas: "XI-10", suci: 29, haid: 5 },
  { angkatan: "XI", namaKelas: "XI-11", suci: 35, haid: 1 },
  { angkatan: "XI", namaKelas: "XI-12", suci: 24, haid: 10 },

  // --- KELAS XII ---
  { angkatan: "XII", namaKelas: "XII-1", suci: 30, haid: 5 },
  { angkatan: "XII", namaKelas: "XII-2", suci: 28, haid: 6 },
  { angkatan: "XII", namaKelas: "XII-3", suci: 33, haid: 3 },
  { angkatan: "XII", namaKelas: "XII-4", suci: 31, haid: 4 },
  { angkatan: "XII", namaKelas: "XII-5", suci: 27, haid: 8 },
  { angkatan: "XII", namaKelas: "XII-6", suci: 29, haid: 5 },
  { angkatan: "XII", namaKelas: "XII-7", suci: 25, haid: 9 },
  { angkatan: "XII", namaKelas: "XII-8", suci: 34, haid: 2 },
  { angkatan: "XII", namaKelas: "XII-9", suci: 26, haid: 7 },
  { angkatan: "XII", namaKelas: "XII-10", suci: 32, haid: 4 },
  { angkatan: "XII", namaKelas: "XII-11", suci: 28, haid: 6 },
  { angkatan: "XII", namaKelas: "XII-12", suci: 30, haid: 5 },
];

export default function HomePage() {
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const fullText = "Welcome back, Antara.";

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingDone(true);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (isTypingDone) {
      const timeout = setTimeout(() => setCursorVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [isTypingDone]);

  const [filter, setFilter] = useState<FilterType>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const processedData = useMemo(() => {
    if (filter === "all") {
      return ["X", "XI", "XII"].map((angkatan) => {
        const items = chartData.filter((d) => d.angkatan === angkatan);
        return {
          label: `Kelas ${angkatan}`,
          suci: items.reduce((a, b) => a + b.suci, 0),
          haid: items.reduce((a, b) => a + b.haid, 0),
        };
      });
    }
    return chartData
      .filter((d) => d.angkatan === filter)
      .map((d) => ({
        label: d.namaKelas,
        suci: d.suci,
        haid: d.haid,
      }));
  }, [filter]);

  const isSummary = filter === "all";
  const chartWidth = isSummary ? "100%" : "850px";

  const renderTrend = (trend: number, isInverse: boolean = false) => {
    if (trend === 0) {
      return (
        <div className="flex items-center gap-1.5 text-[11px] font-bold mb-1 text-muted-foreground/40">
          <Activity className="size-3.5" strokeWidth={2} />
          <span className="tracking-wide uppercase">Stabil</span>
        </div>
      );
    }
    const isUp = trend > 0;
    const isGood = isInverse ? !isUp : isUp; 
    const colorClass = isGood ? "text-emerald-500" : "text-red-500";
    const Icon = isUp ? TrendingUp : TrendingDown;

    return (
      <div className={`flex items-center gap-1 text-[11px] font-bold mb-1 ${colorClass}`}>
        <Icon className="size-3.5" strokeWidth={2.5} />
        <span className="tracking-tight">{isUp ? "+" : "-"}{Math.abs(trend)}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-white/20">
      <main className="flex-1 w-full pb-8">
        
        {/* --- A. BANNER & PROFILE --- */}
        <div className="relative w-full mb-20">
          <div className="relative w-full h-30 overflow-hidden rounded-xl shadow-sm shrink-0 group">
            <Image src="/baner.png" alt="Banner" fill priority className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/20 to-transparent" />
          </div>
          <div className="absolute left-8 md:left-12 -bottom-12.5 flex items-end gap-6">
            <div className="relative size-20 md:size-24 rounded-full border-[3px] border-background bg-card shadow-2xl overflow-hidden shrink-0 z-10">
              <Image src="/photo.jpg" alt="Profile" fill className="object-cover" />
            </div>
            <div className="mb-3 z-10">
              <h1 className="font-jakarta text-xl md:text-2xl font-bold text-foreground tracking-tight flex items-center min-h-8">
                {typedText}
                <span className={`inline-block w-px h-5 md:h-7 ml-2 bg-primary transition-opacity duration-500 ${cursorVisible ? "animate-pulse opacity-100" : "opacity-0"}`} />
              </h1>
              <p className="font-inter text-[9px] md:text-[12px] font-semibold text-muted-foreground mt-0.5 opacity-50">Administrator System</p>
            </div>
          </div>
        </div>

        {/* --- B. SYSTEM MESSAGE (AEGIS) --- */}
        <div className="px-2 md:px-8 mb-10 mt-4">
          <div className="flex items-start gap-3 md:gap-4 w-full">
            <div className="relative shrink-0">
              <div className="size-10 md:size-11 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center shadow-sm">
                <BotMessageSquare className="size-5 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-emerald-500 border-2 border-background rounded-full" />
            </div>
            <div className="flex flex-col gap-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 pl-1">
                <span className="text-[13px] md:text-sm font-bold font-jakarta text-foreground/90 tracking-wide">AEGIS</span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary uppercase tracking-widest">System Dispatch</span>
              </div>
              <div className="relative p-4 md:p-5 rounded-2xl rounded-tl-sm bg-card/60 border border-border/50 shadow-sm group w-full">
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl rounded-tl-sm" />
                <p className="relative text-[11px] md:text-[13px] font-inter text-muted-foreground leading-relaxed z-10">
                  Sinkronisasi data kehadiran berhasil diperbarui. Saat ini terdapat <span className="text-foreground font-bold">{statsData.sedangHaid.value} siswi</span> dalam masa udzur. Mohon perhatian khusus pada <span className="text-red-500 font-bold">{statsData.alpha.value} siswi</span> dengan status Alpha hari ini.
                </p>
              </div>
              <div className="pl-1 flex items-center gap-1 justify-end">
                <span className="text-[10px] font-inter font-medium text-muted-foreground/40">Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- C. STAT CARDS GRID --- */}
        <div className="px-2 md:px-8 mb-10">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div className="group relative flex flex-col p-5 md:p-6 bg-transparent border border-white/5 rounded-2xl transition-all duration-500 hover:bg-white/2 hover:border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <Users className="size-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500 text-foreground" />
                <span className="font-jakarta text-[13px] font-medium text-muted-foreground/70">Total Siswi</span>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h2 className="font-jakarta text-2xl font-bold text-foreground tracking-tight">{statsData.totalSiswi.value}</h2>
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out bg-foreground" />
            </div>

            <div className="group relative flex flex-col p-5 md:p-6 bg-transparent border border-white/5 rounded-2xl transition-all duration-500 hover:bg-white/2 hover:border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <Compass className="size-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500 text-emerald-500" />
                <span className="font-jakarta text-[13px] font-medium text-muted-foreground/70">Status Suci</span>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h2 className="font-jakarta text-2xl font-bold text-foreground tracking-tight">{statsData.siswiSuci.value}</h2>
                {renderTrend(statsData.siswiSuci.trend, false)}
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out bg-emerald-500" />
            </div>

            <div className="group relative flex flex-col p-5 md:p-6 bg-transparent border border-white/5 rounded-2xl transition-all duration-500 hover:bg-white/2 hover:border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <Droplets className="size-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500 text-pink-500" />
                <span className="font-jakarta text-[13px] font-medium text-muted-foreground/70">Sedang Haid</span>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h2 className="font-jakarta text-2xl font-bold text-foreground tracking-tight">{statsData.sedangHaid.value}</h2>
                {renderTrend(statsData.sedangHaid.trend, true)}
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out bg-pink-500" />
            </div>

            <div className="group relative flex flex-col p-5 md:p-6 bg-transparent border border-white/5 rounded-2xl transition-all duration-500 hover:bg-white/2 hover:border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <FileClock className="size-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500 text-amber-500" />
                <span className="font-jakarta text-[13px] font-medium text-muted-foreground/70">Izin / Sakit</span>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h2 className="font-jakarta text-2xl font-bold text-foreground tracking-tight">{statsData.izinSakit.value}</h2>
                {renderTrend(statsData.izinSakit.trend, true)}
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out bg-amber-500" />
            </div>

            <div className="group relative flex flex-col p-5 md:p-6 bg-transparent border border-white/5 rounded-2xl transition-all duration-500 hover:bg-white/2 hover:border-white/10 overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <UserX className="size-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500 text-red-500" />
                <span className="font-jakarta text-[13px] font-medium text-muted-foreground/70">Alpha / Bolos</span>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <h2 className="font-jakarta text-2xl font-bold text-foreground tracking-tight">{statsData.alpha.value}</h2>
                {renderTrend(statsData.alpha.trend, true)}
              </div>
              <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out bg-red-500" />
            </div>
          </div>
        </div>

        {/* --- D. SECTION CHART (ULTRA PREMIUM STACKED BAR) --- */}
        <div className="px-2 md:px-8">
          <div className="flex flex-col bg-card/20 border border-white/5 rounded-3xl overflow-hidden shadow-sm">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 pb-4 md:pb-6 gap-4">
              <div className="flex flex-col gap-1.5">
                <h2 className="font-jakarta text-xl font-bold text-foreground tracking-tight">Statistik Biologis Kehadiran</h2>
                <p className="font-inter text-xs text-muted-foreground/70 font-medium">
                  {isSummary ? "Overview akumulasi rasio Suci & Haid seluruh angkatan" : `Detail persebaran rasio Suci & Haid untuk Angkatan ${filter}`}
                </p>
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 h-10 px-4 rounded-xl bg-white/3 border border-white/10 text-xs font-jakarta font-bold text-white/80 hover:bg-white/6 hover:text-white transition-all outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <Filter size={14} className="opacity-70 text-primary" />
                  <span className="tracking-wide">
                    {isSummary ? "Semua Angkatan" : `Angkatan ${filter}`}
                  </span>
                  <ChevronDown size={14} className={`opacity-50 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-44 bg-[#151419]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => { setFilter("all"); setIsDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-jakarta font-bold tracking-wide transition-colors flex items-center justify-between ${isSummary ? "bg-primary/10 text-primary" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                    >
                      Semua Angkatan
                      {isSummary && <div className="size-1.5 rounded-full bg-primary" />}
                    </button>
                    <div className="h-px w-full bg-white/5 my-1" />
                    {["X", "XI", "XII"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => { setFilter(lvl as FilterType); setIsDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-jakarta font-bold tracking-wide transition-colors flex items-center justify-between ${filter === lvl ? "bg-primary/10 text-primary" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                      >
                        Kelas {lvl}
                        {filter === lvl && <div className="size-1.5 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full overflow-x-auto overflow-y-hidden smooth-scrollbar">
              <div 
                className="px-6 md:px-8 pb-8 pt-2" 
                style={{ minWidth: chartWidth, height: "350px" }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processedData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    {/* 🔥 FIX: Grid diubah opacitynya agar grafik tidak terkesan melayang */}
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                    
                    {/* 🔥 FIX: Tambahkan Legend agar user paham warna apa melambangkan apa */}
                    <Legend 
                      verticalAlign="top" 
                      align="right"
                      iconType="circle" 
                      wrapperStyle={{ paddingBottom: "20px", fontSize: "11px", fontFamily: "var(--font-inter)", color: "rgba(255,255,255,0.7)" }} 
                    />

                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tickMargin={16} 
                      tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 500, fontFamily: "var(--font-inter)" }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      allowDecimals={false} 
                      tickMargin={12} 
                      tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "var(--font-inter)" }}
                    />

                    <Tooltip 
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#0a0a0c]/90 backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl shadow-2xl min-w-35">
                              <p className="text-white/90 text-[13px] font-bold font-jakarta mb-3 pb-2 border-b border-white/10">
                                {label}
                              </p>
                              <div className="flex flex-col gap-2">
                                {payload.map((entry, index) => (
                                  <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-1.5 h-3.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                      <span className="text-[11px] font-inter font-medium text-white/70 capitalize">
                                        {entry.name}
                                      </span>
                                    </div>
                                    <span className="text-[12px] font-jakarta text-white font-bold ml-4">
                                      {entry.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    {/* Stacked Bars: Suci + Haid (Radius diubah agar lebih luwes) */}
                    <Bar 
                      dataKey="suci" 
                      name="Status Suci" 
                      fill="#10b981" 
                      stackId="a" 
                      radius={[0, 0, 4, 4]} 
                      maxBarSize={38} 
                    />
                    <Bar 
                      dataKey="haid" 
                      name="Sedang Haid" 
                      fill="#ec4899" 
                      stackId="a" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={38} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}