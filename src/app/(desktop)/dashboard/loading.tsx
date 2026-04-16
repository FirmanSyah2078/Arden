import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-3">
        {/* Nanti ganti dengan Lottie mungil milikmu */}
        <Loader2 className="size-8 animate-spin text-white/50" />
        
        {/* Satu kalimat, elegan, dan redup */}
        <span className="text-[11px] font-medium tracking-widest text-white/40 uppercase animate-pulse">
          Loading Data...
        </span>
      </div>
    </div>
  );
}