import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  // Icon Lama (Original)
  Users,
  MessageSquare,
  Home as HomeIcon,
  LifeBuoy,   // Icon Support
  FileLock,   // Icon Privacy
  Server,     // Icon System Status
  Activity,   // Icon Uptime
  Code2,
  Smartphone,ShieldCheck,

  
  // Icon untuk Section "How It Works" (Alur)
  BrainCircuit,
  Target,
  Zap,
  History,
  CheckCircle2,
  ArrowRight,

  // Icon untuk Section "Features Grid" (9 Fitur Baru)
  ShieldAlert,
  Settings2,
  ScanLine,
  CreditCard,
  LockKeyhole,
  CalendarRange,
  ClipboardX,
  Radio,
  FileSpreadsheet
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import VantaBackground from "@/components/vanta-background"
import { Logo } from "@/components/logo"

const techStack = [
  { name: "Next.js" },
  { name: "React" },
  { name: "Supabase" },
  { name: "Tailwind CSS" },
  { name: "TypeScript" },
  { name: "Prisma" },
  { name: "Vercel" },
  { name: "Framer Motion" },
]

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          animation: scroll 25s linear infinite;
        }
      `}
      </style>

      <div className="min-h-screen text-white selection:bg-indigo-500/30 relative overflow-hidden flex flex-col">

        {/* --- PERBAIKAN 1: LAYER VANTA --- */}
        {/* Bungkus Vanta dalam div absolute dengan z-0. 
            Ini membuatnya duduk DI ATAS body hitam, tapi DI BAWAH konten (z-10) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <VantaBackground />
        </div>

        {/* --- NAVBAR --- */}
        <header className="absolute top-0 left-0 right-0 container mx-auto flex items-center justify-between py-6 px-4 z-50">
          <Logo />

          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="#">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-400 hover:bg-indigo-950/30">
                      <HomeIcon className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-indigo-950 border-indigo-500/50 text-indigo-200">
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="#">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-indigo-400 hover:bg-indigo-950/30">
                      <Users className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="bg-indigo-950 border-indigo-500/50 text-indigo-200">
                  <p>Team</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Link href="/login">
              <Button variant="cyber" className="ml-2 text-gray-200 bg-indigo-950/30 hover:border-[rgba(99,102,241,0.5)] shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                Login System
              </Button>
            </Link>
          </div>
        </header>

        {/* --- HERO SECTION WRAPPER (100% Viewport Height) --- */}
        <section className="min-h-screen flex flex-col justify-center items-center relative z-10 pt-20">
          <div className="container mx-auto px-4 text-center flex flex-col items-center h-full justify-center">

            {/* HEADLINE */}
            <h1 className="font-space text-3xl md:text-6xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-linear-to-b from-white to-indigo-300 drop-shadow-lg leading-tight pb-2">
              Character Revolution
              <span className="block mt-1">
                Through Data Precision
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-gray-400 max-w-3xl mx-auto mb-10 text-base md:text-ms drop-shadow-md leading-relaxed">
              Attendance is just the beginning.
              <span className="text-indigo-300 font-semibold mx-1">
                ARDEN (Automated Record and Data Engine)
              </span>
              is here to build an ecosystem of honesty and discipline. Through QR Code validation,
              we monitor students health cycles while closing loopholes for manipulation,
              ensuring every prayer exemption is recorded with accountable validity.
            </p>

            {/* BUTTON */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 items-center mb-16">
              <Link href="https://discord.gg/link-kamu" target="_blank">
                <Button className="bg-indigo-950/30 hover:bg-indigo-700 text-white font-medium h-12 px-8 rounded-b-md shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-105 border border-indigo-400/30 flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  Join Discord Server
                </Button>
              </Link>
            </div>

            {/* --- TECH STACK MARQUEE --- */}
            <div className="w-full max-w-4xl mx-auto">
              <p className="text-gray-500 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] mb-6">
                Powered by Modern Technology
              </p>

              <div
                className="w-full inline-flex flex-nowrap overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_128px,black_calc(100%-128px),transparent_100%)]"
              >
                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll">
                  {techStack.map((tech, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-500 font-medium text-sm md:text-base whitespace-nowrap">
                      <Code2 className="h-5 w-5 text-indigo-500/70" />
                      {tech.name}
                    </li>
                  ))}
                </ul>

                <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-infinite-scroll" aria-hidden="true">
                  {techStack.map((tech, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-500 font-medium text-sm md:text-base whitespace-nowrap">
                      <Code2 className="h-5 w-5 text-indigo-500/70" />
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES GRID (UPDATED: 9 ITEMS BASED ON SRS) */}
        <section className="container mx-auto px-4 py-24 relative z-10 bg-black/20 backdrop-blur-sm">
          
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="font-space text-2xl md:text-4xl font-bold mb-4 drop-shadow-md text-white">
              Engineered for <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Data Integrity</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Closing the gaps of manual attendance through algorithmic enforcement. Our system secures data integrity with 9 specialized features that automatically detect anomalies and ensure valid biological reporting.
            </p>
          </div>

          {/* Grid 3x3 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: ShieldAlert, 
                color: "text-red-400",
                bg: "bg-red-500/10",
                border: "group-hover:border-red-500/30",
                title: "Smart Anomaly Detection", 
                desc: "Advanced algorithms detect logical inconsistencies between sessions (e.g., Manual Input at Dhuhr vs. QR Scan at Ashar), flagging data integrity risks instantly." 
              },
              { 
                icon: Settings2, 
                color: "text-blue-400",
                bg: "bg-blue-500/10",
                border: "group-hover:border-blue-500/30",
                title: "Configurable Bio-Logic", 
                desc: "Validates biological cycles based on customizable parameters (default 3-7 days). Admins can adjust thresholds to align with specific school policies." 
              },
              { 
                icon: ScanLine, 
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
                border: "group-hover:border-emerald-500/30",
                title: "Hybrid Input Protocol", 
                desc: "Prioritizes high-speed QR scanning while providing a fail-safe manual entry mode for specific cases, ensuring queue efficiency without data loss." 
              },
              { 
                icon: CreditCard, 
                color: "text-orange-400",
                bg: "bg-orange-500/10",
                border: "group-hover:border-orange-500/30",
                title: "Lost Card Lifecycle", 
                desc: "Tracks 'Lost Card' status persistently. The system maintains an active alert until a replacement card is issued and validated by the supervisor." 
              },
              { 
                icon: LockKeyhole, 
                color: "text-indigo-400",
                bg: "bg-indigo-500/10",
                border: "group-hover:border-indigo-500/30",
                title: "Strict Role Hierarchy", 
                desc: "Multi-tier security structure. Separates duties between Executors (Input), Supervisors (Validation), and Admins (Control) to prevent internal data manipulation." 
              },
              { 
                icon: CalendarRange, 
                color: "text-purple-400",
                bg: "bg-purple-500/10",
                border: "group-hover:border-purple-500/30",
                title: "Visual Cycle Calendar", 
                desc: "Intuitive monitoring via a color-coded calendar interface (Blue for active cycle, Red for warnings), allowing instant visual analysis of attendance patterns." 
              },
              { 
                icon: ClipboardX, 
                color: "text-pink-400",
                bg: "bg-pink-500/10",
                border: "group-hover:border-pink-500/30",
                title: "Administrative Audit", 
                desc: "Automatically logs all administrative irregularities—including missing cards, lost status, and illogical patterns—creating a comprehensive compliance record for evaluation." 
              },
              { 
                icon: Radio, 
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
                border: "group-hover:border-cyan-500/30",
                title: "Real-time Cloud Sync", 
                desc: "Field data synchronizes instantly to the central server. Eliminates the risk of physical record loss and ensures data availability for real-time monitoring." 
              },
              { 
                icon: FileSpreadsheet, 
                color: "text-teal-400",
                bg: "bg-teal-500/10",
                border: "group-hover:border-teal-500/30",
                title: "Automated Reporting", 
                desc: "Generates comprehensive monthly and annual recapitulations instantly. Reduces administrative workload while guaranteeing 100% calculation accuracy." 
              },
            ].map((item, idx) => (
              <Card key={idx} className={`bg-black/40 border-white/5 hover:bg-white/5 transition-all duration-300 backdrop-blur-md group hover:-translate-y-1 overflow-hidden relative ${item.border}`}>
                {/* Gradient Hover Effect */}
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <CardTitle className="text-white text-lg font-bold font-space group-hover:text-white transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-400 leading-relaxed text-sm relative z-10 group-hover:text-gray-300 transition-colors">
                  {item.desc}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SECTION: SEAMLESS WORKFLOW (5 STEPS SRS)  */}
        <section className="relative z-10 py-24 overflow-hidden border-b border-white/5 bg-black/40 backdrop-blur-sm">
          {/* Background Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="font-space text-2xl md:text-4xl font-bold mb-4 text-white">
                The Integrity <span className="text-indigo-400">Pipeline</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                A 5-stage validation workflow executed entirely by the Officer to ensure attendance authenticity and data logic integrity.
              </p>
            </div>

            {/* Steps Container (Responsive Grid) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative">
              
              {/* Connector Line (Desktop Only - menghubungkan kartu) */}
              <div className="hidden xl:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent border-t border-dashed border-white/10 z-0" />

              {/* Step 1: Checkpoint */}
              <div className="relative z-10 group">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <ScanLine className="w-6 h-6 text-indigo-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-space">Officer Checkpoint</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    The student presents herself to the officer at the entry point. The device is fully operated by the officer to ensure physical presence and prevent proxy attendance.
                  </p>
                  <div className="mt-auto pt-4 text-indigo-500/20 font-bold text-4xl absolute top-2 right-4 select-none opacity-20">01</div>
                </div>
              </div>

              {/* Step 2: Dual Mode */}
              <div className="relative z-10 group">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-blue-950/50 border border-blue-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <Smartphone className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-space">Dual-Mode Entry</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    The officer prioritizes QR Scanning for speed. If the card is unavailable, the system enforces a &quot;Manual Mode&quot; where a specific reason (Forgot/Lost) must be logged.
                  </p>
                  <div className="mt-auto pt-4 text-blue-500/20 font-bold text-4xl absolute top-2 right-4 select-none opacity-20">02</div>
                </div>
              </div>

              {/* Step 3: Sync */}
              <div className="relative z-10 group">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <History className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-space">Cross-Session Sync</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    The system instantly retrieves the day&apos;s Dhuhr record to contextualize the Ashar entry, ensuring that the attendance method remains consistent across both sessions.
                  </p>
                  <div className="mt-auto pt-4 text-cyan-500/20 font-bold text-4xl absolute top-2 right-4 select-none opacity-20">03</div>
                </div>
              </div>

              {/* Step 4: Logic Audit */}
              <div className="relative z-10 group">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-red-500/20 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <BrainCircuit className="w-6 h-6 text-red-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-space">Logic & Anomaly Audit</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Detects irregularities. For example, a &quot;Scanned&quot; Dhuhr followed by a &quot;Forgot Card&quot; Ashar is flagged as an anomaly, as the card was proven present on-site earlier.
                  </p>
                  <div className="mt-auto pt-4 text-red-500/20 font-bold text-4xl absolute top-2 right-4 select-none opacity-20">04</div>
                </div>
              </div>

              {/* Step 5: Verdict */}
              <div className="relative z-10 group">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col items-center text-center shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <ShieldCheck className="w-6 h-6 text-emerald-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-space">Final Verdict</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Data is permanently locked with a specific status tag—&quot;Valid&quot;, &quot;Warning&quot;, or &quot;Flagged&quot;—providing the disciplinary committee with actionable insights.
                  </p>
                  <div className="mt-auto pt-4 text-emerald-500/20 font-bold text-4xl absolute top-2 right-4 select-none opacity-20">05</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION: VISION & ORIGIN (FINAL)          */}
        <section className="relative z-10 py-24 border-y border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Kolom Kiri: Narasi Filosofis */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                  <Target className="w-3 h-3" /> The Core Mission
                </div>
                
                <h2 className="font-space text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                  Building Character <br />
                  Through <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Data Precision</span>
                </h2>
                
                <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                  <p>
                    True integrity is not just a choice; it is a habit formed by consistent systems. When the option to cut corners is removed by digital logic, we stop relying on loopholes and start building a culture of genuine accountability.
                  </p>
                  <p>
                    Technology serves here not merely to record, but to standardize <strong className="text-indigo-300">honesty as the only accepted norm.</strong>
                  </p>
                </div>

                {/* Stats Blocks */}
                <div className="mt-8 flex flex-col sm:flex-row gap-8">
                  <div>
                    <h4 className="text-3xl font-bold text-white font-space">0%</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Data Manipulation</p>
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold text-white font-space">100%</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Audit Transparency</p>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan: Visual Comparison Card */}
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>

                <Card className="bg-[#0A0A0A] border-white/10 overflow-hidden relative shadow-2xl group">
                  {/* Top Gradient Bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                  
                  <CardHeader className="bg-white/5 border-b border-white/5 py-3 px-6 relative overflow-hidden flex flex-row items-center">
                    {/* Layer Animasi (Sheen Effect) */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Title & Icon */}
                    <CardTitle className="flex items-center justify-between w-full text-white font-space z-10 relative m-0 leading-none">
                      <span className="text-base md:text-lg">System Evolution</span>
                      <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/20 group-hover:scale-110 group-hover:fill-yellow-400 transition-all duration-300" />
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-0">
                    <div className="grid grid-cols-2 divide-x divide-white/5">
                      
                      {/* Sisi Kiri: Old Way (Red) */}
                      <div className="p-6 bg-red-950/5 hover:bg-red-900/10 transition-colors group/left">
                        <div className="flex items-center gap-2 mb-4 text-red-400/80 text-xs font-bold uppercase tracking-wider">
                          <History className="w-4 h-4" /> The Past
                        </div>
                        <ul className="space-y-4">
                          <li className="flex gap-3 text-xs md:text-sm text-gray-500 group-hover/left:text-gray-400 transition-colors">
                            <span className="text-red-500/50 font-bold">✕</span> Physical card loss & damage
                          </li>
                          <li className="flex gap-3 text-xs md:text-sm text-gray-500 group-hover/left:text-gray-400 transition-colors">
                            <span className="text-red-500/50 font-bold">✕</span> Proxy attendance loopholes
                          </li>
                          <li className="flex gap-3 text-xs md:text-sm text-gray-500 group-hover/left:text-gray-400 transition-colors">
                            <span className="text-red-500/50 font-bold">✕</span> Untraceable manual errors
                          </li>
                        </ul>
                      </div>

                      {/* Sisi Kanan: New Way (Indigo) */}
                      <div className="p-6 bg-indigo-950/10 hover:bg-indigo-900/20 transition-colors group/right">
                        <div className="flex items-center gap-2 mb-4 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4" /> The Future
                        </div>
                        <ul className="space-y-4">
                          <li className="flex gap-3 text-xs md:text-sm text-gray-300 group-hover/right:text-white transition-colors">
                            <span className="text-indigo-400 font-bold">✓</span> Real-time Cloud Database
                          </li>
                          <li className="flex gap-3 text-xs md:text-sm text-gray-300 group-hover/right:text-white transition-colors">
                            <span className="text-indigo-400 font-bold">✓</span> Mandatory Physical Validation
                          </li>
                          <li className="flex gap-3 text-xs md:text-sm text-gray-300 group-hover/right:text-white transition-colors">
                            <span className="text-indigo-400 font-bold">✓</span> Automated Cycle Analysis
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Link to Documentation */}
                <div className="mt-6 text-center lg:text-right">
                  <Link href="/docs/architecture" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium group">
                    Explore Technical Architecture <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER: DIGITAL GRID SYSTEM               */}
        <footer className="relative z-10 mt-auto border-t border-white/10 bg-[#050505] overflow-hidden">
          
          {/* 1. BACKGROUND EFFECT: CYBER GRID */}
          {/* Membuat pola kotak-kotak tipis seperti blueprint digital */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
               style={{
                 backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
                 backgroundSize: '40px 40px'
               }}
          ></div>

          {/* 2. RADIAL MASK (AGAR GRID TIDAK TABRAKAN DENGAN TEXT) */}
          {/* Membuat grid meredup di bagian tengah agar teks terbaca jelas */}
          <div className="absolute inset-0 z-0 bg-radial-gradient from-black via-black/90 to-transparent"></div>

          {/* 3. GLOW ACCENT */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="grid md:grid-cols-12 gap-12 mb-12">
              
              {/* KOLOM 1: IDENTITAS (Lebar 4 kolom) */}
              <div className="md:col-span-4 space-y-6">
                <Logo /> {/* Logo Kamu */}
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  An advanced attendance ecosystem designed to cultivate integrity and discipline through biometric-validated data precision.
                </p>
                
                {/* System Status Indicator */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-500/20">
                   <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-mono text-emerald-400">All Systems Operational</span>
                </div>
              </div>

              {/* KOLOM 2: PLATFORM (Lebar 2 kolom) */}
              <div className="md:col-span-2">
                <h4 className="font-space font-bold text-white mb-6 flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-500" /> Platform
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-2">Web Dashboard</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Scanner App (APK)</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Release Notes</Link></li>
                </ul>
              </div>

              {/* KOLOM 3: LEGAL & PRIVACY (Lebar 2 kolom) */}
              <div className="md:col-span-2">
                <h4 className="font-space font-bold text-white mb-6 flex items-center gap-2">
                  <FileLock className="w-4 h-4 text-indigo-500" /> Compliance
                </h4>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">Data Protection</Link></li>
                  <li><Link href="#" className="hover:text-indigo-400 transition-colors">School Regulations</Link></li>
                </ul>
              </div>

              {/* KOLOM 4: SUPPORT (Lebar 4 kolom) */}
              <div className="md:col-span-4">
                <h4 className="font-space font-bold text-white mb-6 flex items-center gap-2">
                  <LifeBuoy className="w-4 h-4 text-indigo-500" /> Help Center
                </h4>
                <p className="text-gray-500 text-sm mb-4">
                  Mengalami kendala teknis atau menemukan bug? Tim IT sekolah siap membantu.
                </p>
                <div className="flex gap-2">
                  <Input placeholder="Describe your issue..." className="bg-white/5 border-white/10 text-white placeholder:text-gray-700 focus-visible:ring-indigo-500 h-10 text-sm" />
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white h-10 px-4">
                    <Activity className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  *Respon dalam 1x24 jam kerja.
                </p>
              </div>

            </div>

            {/* COPYRIGHT BAR */}
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600 text-sm font-space">
                © 2025 Arden Organization. All rights reserved.
              </div>
              
              {/* Social / External Links (Optional) */}
              <div className="flex gap-6">
                <Link href="#" className="text-gray-600 hover:text-white transition-colors text-xs uppercase tracking-wider">Internal Server</Link>
                <Link href="#" className="text-gray-600 hover:text-white transition-colors text-xs uppercase tracking-wider">Admin Portal</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}