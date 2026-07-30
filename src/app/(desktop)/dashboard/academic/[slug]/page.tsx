"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAcademicClass } from "@/hooks/academic/use-academic-class";

export default function ClassListPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const { classData, searchQuery, setSearchQuery, filteredStudents } = useAcademicClass(slug);

  if (!classData) return <div className="p-6 text-foreground">Kelas Tidak Ditemukan</div>;

  return (
    <div className="flex flex-col w-full h-full p-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <header className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/academic')} className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white transition-transform hover:-translate-x-1">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground font-jakarta">{classData.name} Roster</h1>
          <p className="text-sm text-muted-foreground">{classData.academic_year} • Wali Kelas: {classData.wali}</p>
        </div>
      </header>

      <div className="relative mb-6 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors size-4" />
        <Input 
          placeholder="Cari berdasarkan nama siswi atau NIS..." 
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 bg-card border-white/5 text-sm rounded-2xl text-foreground focus-visible:ring-1 focus-visible:ring-primary/50 shadow-sm"
          spellCheck={false} autoComplete="off"
        />
      </div>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student) => (
            <button 
              key={student.id} 
              onClick={() => router.push(`/dashboard/academic/${slug}/${student.nanoId}`)}
              className="flex items-center gap-4 p-4 rounded-3xl bg-card border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all text-left group hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors text-muted-foreground">
                <User className="size-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors truncate">{student.name}</span>
                <span className="text-[11px] text-muted-foreground font-mono mt-0.5 tracking-wider">NIS: {student.nis}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <Search className="size-12 text-muted-foreground mb-4" />
          <p className="text-xs font-bold tracking-widest text-foreground uppercase">Siswi tidak ditemukan</p>
        </div>
      )}
    </div>
  );
}