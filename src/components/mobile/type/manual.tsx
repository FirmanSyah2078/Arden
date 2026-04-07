'use client';

import { useState, useEffect } from 'react';
import { Search, User, Loader2, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AttendanceStatusResponse, StudentMobile } from '@/types/api';

interface ManualProps {
    setPick: (status: AttendanceStatusResponse) => void;
    setOpenForm: (value: boolean) => void;
}

export const Manual = ({ setPick, setOpenForm }: ManualProps) => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<StudentMobile[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const MAX_RESULTS = 15;

    useEffect(() => {
        // 🔥 FIX: Kalau kosong, bersihkan data dan matikan loading
        if (!search.trim()) { 
            setData([]); 
            setIsLoading(false);
            return; 
        }

        // 🔥 FIX: Langsung nyalakan loading DETIK ITU JUGA saat user ngetik!
        // Ini akan mencegah "No Results Found" muncul duluan selama masa tunggu 500ms.
        setIsLoading(true);

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/student?prm=${search}&limit=${MAX_RESULTS}`);
                const json = await res.json();
                if (json.status === 'success' && json.data) {
                    const mappedData: StudentMobile[] = json.data.map((s: any) => ({
                        id_student: s.id_student, full_name: s.full_name, nis: s.nis, class_name: s.tbl_classes?.class_name || 'Unknown', icode: ''
                    }));
                    setData(mappedData);
                } else { 
                    setData([]); 
                }
            } catch (error) { 
                console.error(error); 
            } finally { 
                // Matikan loading HANYA SETELAH proses fetch selesai
                setIsLoading(false); 
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleSelect = (student: StudentMobile) => {
        setPick({
            id: String(student.id_student), full_name: student.full_name, nis: student.nis, class_name: student.class_name, status: 'idle', message: 'Manual Entry'
        });
        setOpenForm(true);
    };

    return (
        <div className="w-full h-full flex flex-col pb-5">
            
            {/* SEARCH BAR */}
            <div className="relative mb-3 flex-none z-20">
                <div className={`relative h-11 w-full bg-[#1F1E23] rounded-xl border flex items-center p-1 pl-3 transition-all group shadow-sm ${search ? 'border-white/20' : 'border-white/5'}`}>
                    <Search size={16} className={`${search ? 'text-white' : 'text-white/20'} transition-colors shrink-0 mr-2`} />
                    <input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Search by Name or NIS..." 
                        spellCheck="false" 
                        autoComplete="off"
                        className="flex-1 min-w-0 bg-transparent border-none outline-none text-white font-medium placeholder:text-white/20 text-[13px] h-full" 
                    />
                    {isLoading && (
                        <div className="w-9 h-9 flex items-center justify-center shrink-0 rounded-lg bg-white/5 ml-2">
                            <Loader2 size={16} className="text-green-500 animate-spin shrink-0" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 relative w-full overflow-hidden">
                
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#151419] to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#151419] to-transparent pointer-events-none z-10" />

                {/* 1. STATE KOSONG */}
                {!search && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pb-20 animate-in fade-in duration-500">
                        <div className="flex items-center justify-center -space-x-3 mb-5">
                            <div className="w-10 h-10 rounded-full border-2 border-[#151419] bg-[#1F1E23] flex items-center justify-center z-10 shadow-lg ar-float-loop" style={{ animationDelay: '0s' }}> 
                                <User size={16} className="text-white/20" /> 
                            </div>
                            <div className="w-12 h-12 rounded-full border-2 border-[#151419] bg-[#27272A] flex items-center justify-center z-20 scale-110 shadow-xl ar-float-loop" style={{ animationDelay: '0.2s' }}> 
                                <Search size={20} className="text-white/60" /> 
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-[#151419] bg-[#1F1E23] flex items-center justify-center z-10 shadow-lg ar-float-loop" style={{ animationDelay: '0.4s' }}> 
                                <User size={16} className="text-white/20" /> 
                            </div>
                        </div>

                        <h3 className="text-white font-medium text-base mb-1 tracking-tight"> Manual Search </h3>
                        <p className="text-white/30 text-xs max-w-[220px] leading-relaxed"> Enter a student's name or NIS to begin the search without a scanner. </p>
                    </div>
                )}
                
                {/* 2. STATE HASIL PENCARIAN */}
                {search && data.length > 0 && (
                    <ScrollArea className="h-full w-full pr-3">
                        <ul className="flex flex-col gap-2 pb-16 pt-2">
                            {data.map((item) => (
                                <li key={item.id_student} className="animate-in slide-in-from-bottom-2 duration-300">
                                    <button onClick={() => handleSelect(item)} className="w-full text-left bg-[#1F1E23] hover:bg-[#27272A] border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5 transition-all active:scale-[0.98] group shadow-sm">
                                        <div className="w-9 h-9 rounded-full bg-white/5 text-white/70 font-bold text-xs flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-colors shrink-0"> {item.full_name.charAt(0)} </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors"> {item.full_name} </p>
                                            <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                                                <span className="bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider"> {item.class_name} </span>
                                                <span>•</span><span className="font-mono tracking-wide">{item.nis}</span>
                                            </div>
                                        </div>
                                        <div className="text-white/10 group-hover:text-white/60 group-hover:translate-x-1 transition-all shrink-0"> <ChevronRight size={16} /> </div>
                                    </button>
                                </li>
                            ))}
                            
                            {data.length === MAX_RESULTS && (
                                <li className="py-4 flex items-center justify-center gap-2 text-white/40 bg-[#1F1E23] border border-white/5 rounded-2xl mt-2">
                                    <Info size={14} />
                                    <span className="text-[10px] font-medium tracking-wide uppercase">Results limited. Please be more specific.</span>
                                </li>
                            )}
                        </ul>
                    </ScrollArea>
                )}

                {/* 3. STATE TIDAK DITEMUKAN */}
                {search && !isLoading && data.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pb-24 animate-in fade-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400 ar-beat-loop shadow-[0_0_15px_rgba(239,68,68,0.1)]"> 
                            <AlertCircle size={28} /> 
                        </div>
                        <h3 className="text-white font-semibold text-base mb-1">No Results Found</h3>
                        <p className="text-white/40 text-xs max-w-[220px] leading-relaxed">We couldn't find any student matching your query in the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
};