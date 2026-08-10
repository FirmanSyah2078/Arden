"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Settings,
  BarChart3,
  ChevronsUpDown,
  Minus,
  Plus,
  Sparkles,
  RefreshCw,
  Search,
  Copy,
  UploadCloud,
  CircleHelp,
  ArrowLeft,
  User,
  RotateCw,
  MousePointer2,
} from "lucide-react";

// =========================================================================
// 🔥 DUMMY DATA & CONSTANTS (PROXY PANEL)
// =========================================================================

const FORMATS = ["ip:port@user:pass", "user:pass@ip:port", "ip:port:user:pass"];

const ORDERS = [
  {
    plan: "Premium Plan",
    order: "IPC-PRM-#5374",
    date: "26th Sep, 2024",
    data: "15GB",
    price: "$181.50",
    status: "Delivered",
  },
  {
    plan: "Elite Exclusive Plan",
    order: "IPC-ELTE-#6847",
    date: "21st May, 2024",
    data: "11GB",
    price: "$160.60",
    status: "Awaiting Payment",
  },
  {
    plan: "Core Signature",
    order: "IPC-SGRT-#3699",
    date: "25th July, 2024",
    data: "25GB",
    price: "$217.50",
    status: "Cancelled",
  },
];

const STATUS_STYLES: Record<string, { dot: string; text: string; bg: string }> = {
  Delivered: { dot: "bg-emerald-400", text: "text-emerald-300", bg: "bg-emerald-400/10" },
  "Awaiting Payment": { dot: "bg-amber-400", text: "text-amber-300", bg: "bg-amber-400/10" },
  Cancelled: { dot: "bg-rose-400", text: "text-rose-300", bg: "bg-rose-400/10" },
};

// =========================================================================
// 🔥 DATA & STYLE KARTU PELAJAR 3D
// =========================================================================

const DEFAULT_CARD_DATA = {
  name: "Daniel Voss",
  nis: "23.0145.RPL",
  kelas: "XII RPL 2",
  angkatan: "2023 / 2026",
  waliKelas: "Ibu Sari Wulandari, S.Pd",
  validUntil: "07 / 2027",
  photoSrc: "",
  qrData: "https://emberline.academy/verify/23.0145.RPL",
  icode: "ARD-O98HYnhj",
};

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
`;

const F_LABEL = { fontFamily: "'JetBrains Mono', monospace" };
const F_DISPLAY = { fontFamily: "'Space Grotesk', sans-serif" };

function SignalTrace({ className = "", id }: { className?: string; id: string }) {
  return (
    <svg viewBox="0 0 400 240" className={className} fill="none" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="400" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF9A52" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF6A2B" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path
        d="M60 -20 L60 60 L140 60 L140 130 L220 130 L220 40 L300 40 L300 260"
        stroke={`url(#${id})`}
        strokeWidth="1.5"
      />
      <path
        d="M100 -20 L100 90 L180 90 L180 170 L260 170 L260 60 L340 60 L340 260"
        stroke={`url(#${id})`}
        strokeWidth="1.5"
        opacity="0.5"
      />
    </svg>
  );
}

function GridTexture({ id }: { id: string }) {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
      <defs>
        <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M18 0H0V18" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function Field({ label, value, onChange, className = "", placeholder = "" }: any) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-neutral-700 focus:border-orange-400/50"
      />
    </label>
  );
}

function SegmentedToggle({ options, value, onChange, hint }: any) {
  return (
    <div>
      <div className="inline-flex rounded-xl bg-white/4 p-1 border border-white/5">
        {options.map((opt: any) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-5 py-2.5 text-sm rounded-lg transition-colors ${
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {hint && <p className="mt-2 text-xs text-neutral-600">{hint}</p>}
    </div>
  );
}

function StepHeader({ n, title }: any) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/5">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/6 text-[11px] text-neutral-400">
        {n}
      </span>
      <span className="text-sm text-neutral-300">{title}</span>
    </div>
  );
}

// =========================================================================
// 🔥 HALAMAN UTAMA DASHBOARD
// =========================================================================

export default function ProxyDashboard() {
  const [tab, setTab] = useState("Generate");
  const [format, setFormat] = useState(FORMATS[0]);
  const [formatOpen, setFormatOpen] = useState(false);
  const [proxyMode, setProxyMode] = useState("Sticky Proxy");
  const [protocol, setProtocol] = useState("HTTP");
  const [quantity, setQuantity] = useState(250);
  const [generating, setGenerating] = useState(false);
  const [proxies, setProxies] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const gbUsed = 24.67;
  const gbTotal = 36;

  // State 3D Card
  const [data, setData] = useState(DEFAULT_CARD_DATA);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return ORDERS;
    const q = search.toLowerCase();
    return ORDERS.filter(
      (o) =>
        o.plan.toLowerCase().includes(q) ||
        o.order.toLowerCase().includes(q) ||
        o.status.toLowerCase().includes(q)
    );
  }, [search]);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const list = Array.from({ length: Math.min(quantity, 500) }).map((_, i) => {
        const ip = `${Math.floor(Math.random() * 223) + 1}.${Math.floor(
          Math.random() * 255
        )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        const port = 10000 + Math.floor(Math.random() * 50000);
        return `${ip}:${port}@user${i}:pass${Math.floor(Math.random() * 9999)}`;
      });
      setProxies(list);
      setGenerating(false);
    }, 900);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -14, y: px * 16 });
  }, []);

  const handleLeave = () => {
    setHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData((d) => ({ ...d, [key]: e.target.value }));

  const combinedRotateY = (flipped ? 180 : 0) + tilt.y;

  return (
    <div className="flex flex-col w-full flex-1 text-neutral-200 font-sans antialiased animate-in fade-in duration-500">
      
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />

      {/* HEADER BARU: Simetris, Elegan, dan Lega */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="shrink-0 flex items-center justify-center size-8 rounded-full border border-white/10 bg-white/5 text-white transition-transform hover:-translate-x-1 hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
          </button>
          <span
            onClick={() => window.history.back()}
            className="text-sm font-semibold tracking-wide uppercase text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            Kembali
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setTab("Generate")}
            className={`flex items-center gap-2 text-sm transition-colors ${
              tab === "Generate"
                ? "text-white font-medium"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Settings size={16} />
            Generate
          </button>
          <button
            onClick={() => setTab("Analytics")}
            className={`flex items-center gap-2 text-sm transition-colors ${
              tab === "Analytics"
                ? "text-white font-medium"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <BarChart3 size={16} />
            Analytics
          </button>
          <div className="bg-white/10 h-4 w-px mx-2 hidden sm:block" />
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_2px_rgba(139,92,246,0.6)]" />
            {gbUsed} / {gbTotal} GB Remaining
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <div className="flex flex-col flex-1 w-full">
        {tab === "Analytics" ? (
          <div className="flex h-[420px] items-center justify-center text-neutral-600 text-sm">
            Analytics view isn't part of this mockup.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
              
              {/* KIRI: Config Panel */}
              <div className="rounded-2xl border border-white/5 bg-[#0f0f12] shadow-xl">
                <div className="flex items-center justify-between px-6 py-5">
                  <h2 className="text-base font-medium text-white">Generate Proxies</h2>
                  <span className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-neutral-300">
                    Premium Plan Selected
                  </span>
                </div>

                <div className="px-6 pb-6 space-y-6">
                  
                  {/* STEP 1: 3D CARD */}
                  <div className="rounded-xl border border-white/5 bg-white/[0.015]">
                    <StepHeader n={1} title="Interactive Identity Card" />
                    
                    <div className="p-6 sm:p-10 flex flex-col items-center">
                      <div className="text-center mb-8">
                        <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                          <MousePointer2 size={14} className="text-orange-400/80" /> Gerakkan kursor di atas kartu, klik untuk membalik
                        </p>
                      </div>

                      {/* Card Stage */}
                      <div style={{ perspective: "1600px" }} className="relative mb-6">
                        <div
                          ref={cardRef}
                          onMouseMove={handleMouseMove}
                          onMouseEnter={() => setHovering(true)}
                          onMouseLeave={handleLeave}
                          onClick={() => setFlipped((f) => !f)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setFlipped((f) => !f);
                          }}
                          className="relative h-[228px] w-[380px] cursor-pointer select-none outline-none sm:h-[240px] sm:w-[400px]"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: `rotateX(${tilt.x}deg) rotateY(${combinedRotateY}deg)`,
                            transition: hovering ? "transform 0.08s linear" : "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                          }}
                        >
                          {/* ---------------- FRONT ---------------- */}
                          <div
                            className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                            style={{
                              backfaceVisibility: "hidden",
                              background: "radial-gradient(120% 140% at 15% 10%, #1c1d22 0%, #101114 55%, #0a0a0c 100%)",
                            }}
                          >
                            <GridTexture id="grid-front" />
                            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
                            
                            <div className="relative flex h-full flex-col px-7 pt-5 pb-6">
                              {/* Header Card Depan */}
                              <div className="flex items-center gap-3 mb-5">
                                <img src="/icon.ico" alt="logo" className="h-5 w-5 object-contain" />
                                <span className="text-[13px] font-semibold tracking-wide text-white">
                                  Identity Card Arden
                                </span>
                              </div>

                              {/* Body Card Depan */}
                              <div className="flex flex-1 items-stretch gap-5">
                                {/* Foto 3x4 */}
                                <div className="relative h-[116px] w-[86px] shrink-0 overflow-hidden rounded-[8px] border border-white/10 bg-[#1c1e24] shadow-md">
                                  {data.photoSrc ? (
                                    <img src={data.photoSrc} alt={data.name} className="h-full w-full object-cover object-center" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center text-neutral-600">
                                      <User size={28} strokeWidth={1.4} />
                                    </div>
                                  )}
                                </div>

                                {/* Detail Info */}
                                <div className="flex flex-1 flex-col justify-center">
                                  <div className="mb-4">
                                    <p className="text-[17px] font-semibold leading-tight text-white">{data.name}</p>
                                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-orange-400">{data.nis}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                    <div>
                                      <p className="text-[8.5px] uppercase tracking-[0.16em] text-neutral-500">Kelas</p>
                                      <p className="mt-0.5 text-[11.5px] font-medium text-neutral-200">{data.kelas}</p>
                                    </div>
                                    <div>
                                      <p className="text-[8.5px] uppercase tracking-[0.16em] text-neutral-500">Angkatan</p>
                                      <p className="mt-0.5 text-[11.5px] font-medium text-neutral-200">{data.angkatan}</p>
                                    </div>
                                    <div>
                                      <p className="text-[8.5px] uppercase tracking-[0.16em] text-neutral-500">Wali Kelas</p>
                                      <p className="mt-0.5 text-[11.5px] font-medium text-neutral-200">{data.waliKelas}</p>
                                    </div>
                                    <div>
                                      <p className="text-[8.5px] uppercase tracking-[0.16em] text-neutral-500">Berlaku s/d</p>
                                      <p className="mt-0.5 text-[11.5px] font-medium text-neutral-200">{data.validUntil}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Garis Ujung Kanan Bawah */}
                            <svg className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 opacity-70" viewBox="0 0 100 100" fill="none">
                              <path d="M100 20 L60 20 L60 60 L20 60 L20 100" stroke="#FF6A2B" strokeOpacity="0.4" strokeWidth="1.5" />
                            </svg>
                          </div>

                          {/* ---------------- BACK (REVISED) ---------------- */}
                          <div
                            className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                            style={{
                              backfaceVisibility: "hidden",
                              transform: "rotateY(180deg)",
                              background: "radial-gradient(120% 140% at 85% 0%, #1c1d22 0%, #101114 55%, #0a0a0c 100%)",
                            }}
                          >
                            <GridTexture id="grid-back" />
                            <SignalTrace id="trace-back" className="absolute inset-0 h-full w-full opacity-60" />

                            <div className="relative flex h-full flex-col p-7">
                              {/* Header Back */}
                              <div className="flex items-center gap-3">
                                <img src="/icon.ico" alt="logo" className="h-5 w-5 object-contain" />
                                <span className="text-[13px] font-semibold tracking-wide text-white">
                                  Identity Card Arden
                                </span>
                              </div>

                              {/* Main Content (QR + iCode) */}
                              <div className="flex flex-1 flex-col items-start justify-end gap-2.5 pb-1 z-10">
                                <div className="rounded-lg bg-white p-1.5 shadow-lg">
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=0&data=${encodeURIComponent(
                                      data.qrData || data.icode
                                    )}`}
                                    alt="QR verifikasi"
                                    className="h-[76px] w-[76px]"
                                  />
                                </div>
                                <span 
                                  className="text-[11px] font-medium tracking-[0.2em] text-orange-400"
                                  style={F_LABEL}
                                >
                                  {data.icode}
                                </span>
                              </div>

                              {/* Vertical Text Right */}
                              <div className="absolute right-7 top-7 bottom-7 flex items-center justify-center">
                                <span
                                  className="text-[8.5px] uppercase tracking-[0.25em] text-neutral-500"
                                  style={{
                                    ...F_LABEL,
                                    writingMode: "vertical-rl",
                                    transform: "rotate(180deg)",
                                  }}
                                >
                                  Digunakan selama menjadi siswi
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Soft ground shadow */}
                        <div
                          className="pointer-events-none absolute left-1/2 top-full h-8 w-[320px] -translate-x-1/2 rounded-full bg-black/60 blur-2xl"
                          style={{ transform: `translateX(-50%) scale(${1 - Math.abs(tilt.y) / 300})`, opacity: 0.5 }}
                        />
                      </div>

                      <button
                        onClick={() => setFlipped((f) => !f)}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        <RotateCw size={14} />
                        Balik kartu
                      </button>

                      {/* Panel Edit Field */}
                      <div className="mt-8 w-full border-t border-white/5 pt-8">
                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                          Edit data kartu
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                          <Field label="Nama Siswa" value={data.name} onChange={update("name")} />
                          <Field label="NIS" value={data.nis} onChange={update("nis")} />
                          <Field label="Kelas" value={data.kelas} onChange={update("kelas")} />
                          <Field label="Angkatan" value={data.angkatan} onChange={update("angkatan")} />
                          <Field label="Wali Kelas" value={data.waliKelas} onChange={update("waliKelas")} />
                          <Field label="Berlaku s/d" value={data.validUntil} onChange={update("validUntil")} />
                          <Field label="Data QR (URL/Teks)" value={data.qrData} onChange={update("qrData")} />
                          <Field label="iCode" value={data.icode} onChange={update("icode")} />
                          <Field label="Path Foto Siswa" value={data.photoSrc} onChange={update("photoSrc")} placeholder="/photo.jpg" className="sm:col-span-2" />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="rounded-xl border border-white/5 bg-white/[0.015]">
                    <StepHeader n={2} title="Configure Proxy" />
                    <div className="p-5 space-y-5">
                      <div>
                        <label className="mb-2 block text-xs text-neutral-500">Format</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setFormatOpen((v) => !v)}
                            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white hover:border-white/20 transition-colors"
                          >
                            {format}
                            <ChevronsUpDown size={15} className="text-neutral-500" />
                          </button>
                          {formatOpen && (
                            <div className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-lg border border-white/10 bg-[#16161a] shadow-xl">
                              {FORMATS.map((f) => (
                                <button
                                  key={f}
                                  onClick={() => {
                                    setFormat(f);
                                    setFormatOpen(false);
                                  }}
                                  className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 ${
                                    f === format ? "text-violet-400" : "text-neutral-300"
                                  }`}
                                >
                                  {f}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-neutral-600">
                          Choose format depending on use case.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <SegmentedToggle
                          options={["Sticky Proxy", "Rotating Proxy"]}
                          value={proxyMode}
                          onChange={setProxyMode}
                          hint="Available with select providers."
                        />
                        <SegmentedToggle
                          options={["HTTP", "Socks5"]}
                          value={protocol}
                          onChange={setProtocol}
                          hint="Available with select providers."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer controls */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <CircleHelp size={18} className="text-neutral-600" />
                      <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 50))}
                          className="text-neutral-400 hover:text-white transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center text-sm font-medium text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(1000, q + 50))}
                          className="text-neutral-400 hover:text-white transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-900/30 hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
                    >
                      <Sparkles size={16} />
                      {generating ? "Generating..." : "Generate Proxies"}
                    </button>
                  </div>
                </div>
              </div>

              {/* KANAN: Proxy List panel */}
              <div className="rounded-2xl border border-white/5 bg-[#0f0f12] flex flex-col h-full shadow-xl">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                  <h2 className="flex items-center gap-2 text-base font-medium text-white">
                    Proxy List
                    <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-neutral-400">
                      {proxies.length || 850}
                    </span>
                  </h2>
                  <div className="flex items-center gap-3 text-neutral-500">
                    <button className="hover:text-white transition-colors">
                      <Copy size={16} />
                    </button>
                    <button className="hover:text-white transition-colors">
                      <UploadCloud size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 min-h-[420px] flex-col items-center justify-center p-6">
                  {proxies.length === 0 ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 shadow-[0_0_40px_10px_rgba(139,92,246,0.15)]">
                        <RefreshCw
                          size={26}
                          className={`text-violet-400 ${generating ? "animate-spin" : ""}`}
                        />
                      </div>
                      <h3 className="mb-2 text-base font-medium text-white">
                        {generating ? "Generating proxies…" : "Generate proxies"}
                      </h3>
                      <p className="max-w-xs text-sm text-neutral-500">
                        Select the region, configure the proxy format, and set the desired
                        quantity on the left.
                      </p>
                    </div>
                  ) : (
                    <div className="h-full w-full overflow-y-auto rounded-lg border border-white/5 bg-black/20 p-2 font-mono text-xs text-neutral-300">
                      {proxies.map((p, i) => (
                        <div
                          key={i}
                          className="border-b border-white/5 px-4 py-2 last:border-0 hover:bg-white/[0.03]"
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BAWAH: Recent Orders */}
            <div className="mt-6 rounded-2xl border border-white/5 bg-[#0f0f12] shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b border-white/5">
                <h2 className="flex items-center gap-2 text-base font-medium text-white">
                  Recent Orders
                  <span className="text-sm font-normal text-neutral-500">
                    {ORDERS.length} Orders
                  </span>
                </h2>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 w-64">
                  <Search size={15} className="text-neutral-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-white/[0.02] text-left text-xs text-neutral-500 uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Provider // Plan</th>
                      <th className="px-6 py-4 font-medium">Order Number</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Data Amount</th>
                      <th className="px-6 py-4 font-medium">Price</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o, i) => {
                      const s = STATUS_STYLES[o.status];
                      return (
                        <tr
                          key={i}
                          className="border-b border-white/5 text-neutral-300 hover:bg-white/[0.02] transition-colors last:border-0"
                        >
                          <td className="px-6 py-4">{o.plan}</td>
                          <td className="px-6 py-4 text-neutral-400 font-mono">{o.order}</td>
                          <td className="px-6 py-4 text-neutral-400">{o.date}</td>
                          <td className="px-6 py-4 text-neutral-400">{o.data}</td>
                          <td className="px-6 py-4 text-neutral-400">{o.price}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium border border-white/5 ${s.bg} ${s.text}`}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-neutral-600">
                          No orders match "{search}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}