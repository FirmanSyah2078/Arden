"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Loader2, ChevronRight, AlertCircle, Info, X } from 'lucide-react';
import { AttendanceStatusResponse, StudentMobile } from '@/types/api';

export interface ManualProps {
    search: string;
    setSearch: (s: string) => void;
    data: StudentMobile[];
    isLoading: boolean;
    onFocus: () => void;
    onBlur: () => void;
    handleSelect: (s: StudentMobile) => void;
    setPick: (status: AttendanceStatusResponse) => void;
    setOpenForm: (value: boolean) => void;
    onScrollDirectionChange?: (visible: boolean) => void;
}

// --- COMPONENT 1: SEARCH BAR (High-End Gray Outline Version) ---
export const ManualSearch = ({ search, setSearch, isLoading, onFocus, onBlur }: { search: string, setSearch: (s: string) => void, isLoading: boolean, onFocus: () => void, onBlur: () => void }) => (
    <div className="relative mb-6 flex-none z-20 px-1">
        <div className={`relative h-12 w-full bg-[#1F1E23] rounded-2xl border flex items-center p-1 pl-3 transition-all duration-300 group shadow-lg ${search ? 'border-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.4),0_0_12px_rgba(255,255,255,0.05)]' : 'border-white/5'
            }`}>
            <Search size={18} className={`${search ? 'text-white' : 'text-white/20'} transition-colors shrink-0 mr-2`} />
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="Search by Name or NIS..."
                spellCheck="false"
                autoComplete="off"
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-white font-medium placeholder:text-white/20 text-[14px] h-full"
            />
            <div className="flex items-center gap-2 mr-2">
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="p-1.5 rounded-lg bg-[#2A292F] hover:bg-[#35343B] text-white/40 hover:text-white transition-all active:scale-90"
                    >
                        <X size={14} />
                    </button>
                )}
                {isLoading && (
                    <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-lg bg-white/10 ml-1">
                        <Loader2 size={16} className="text-white/60 animate-spin shrink-0" />
                    </div>
                )}
            </div>
        </div>
    </div>
);

// --- COMPONENT 2: SEARCH RESULTS (Solid Material White Theme) ---
export const ManualResults = ({ search, data, isLoading, handleSelect, isFocused, onScrollDirectionChange }: { search: string, data: StudentMobile[], isLoading: boolean, handleSelect: (s: StudentMobile) => void, isFocused: boolean, onScrollDirectionChange?: (visible: boolean) => void }) => {
    const MAX_RESULTS = 15;
    const lastScrollY = useRef(0);

    // Handle scroll direction to trigger UI changes (e.g., hide/show header)
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;
        const delta = currentScrollY - lastScrollY.current;
        if (Math.abs(delta) > 10) {
            if (delta > 0) onScrollDirectionChange?.(false);
            else onScrollDirectionChange?.(true);
            lastScrollY.current = currentScrollY;
        }
    };

    return (
        <div className="h-full w-full relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-[#151419] to-transparent pointer-events-none z-10" />

            {!search && !isFocused && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 blur-2xl bg-indigo-500/20 rounded-full" />
                        <div className="relative flex items-center justify-center -space-x-3">
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
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-1 tracking-tight">Manual Search</h3>
                    <p className="text-white/40 text-xs max-w-55 leading-relaxed">Enter name or NIS to search for student data manually.</p>
                </div>
            )}
            {search && isLoading && (
                <div className="h-full w-full overflow-hidden">
                    <div className="flex items-center justify-between px-1 py-2">
                        <div className="h-2.5 w-24 animate-pulse rounded-full bg-zinc-800" />
                        <div className="h-2.5 w-16 animate-pulse rounded-full bg-zinc-800" />
                    </div>
                    <ul className="flex flex-col gap-3 pb-8 pt-1">
                        {[...Array(4)].map((_, i) => (
                            <li key={i} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-[#1F1E23] p-4">
                                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-zinc-800" />
                                <div className="flex min-w-0 flex-1 flex-col gap-2">
                                    <div className="h-3.5 w-32 animate-pulse rounded-full bg-zinc-800" />
                                    <div className="h-2.5 w-24 animate-pulse rounded-full bg-zinc-800" />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {search && data.length > 0 && data.length > 0 && (
                <div
                    onScroll={handleScroll}
                    onTouchStart={() => (document.activeElement as HTMLElement)?.blur()}
                    className="h-full w-full pr-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    <div className="py-2 px-1 flex justify-between items-center opacity-100 transition-all duration-300">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Search Results</span>
                        <span className="text-[10px] font-medium text-white">{data.length} Students found</span>
                    </div>

                    <ul className="flex flex-col gap-3 pb-8 pt-1">
                        {data.map((item, index) => (
                            <li key={item.id_student}>
                                <button
                                    onClick={() => handleSelect(item)}
                                    className="w-full text-left bg-[#1F1E23] hover:bg-[#2A292F] border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98] group shadow-sm"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-[#2A292F] text-white font-bold text-sm flex items-center justify-center border-none group-hover:bg-[#35343B] transition-all shrink-0 shadow-inner">
                                        {item.full_name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate group-hover:text-white transition-colors"> {item.full_name} </p>
                                        <div className="flex items-center gap-2 text-[10px] text-white/30 mt-0.5">
                                            <span className="bg-white/5 px-1.5 py-0.5 rounded-md uppercase tracking-wider font-medium text-white/50"> {item.class_name} </span>
                                            <span className="opacity-20">•</span>
                                            <span className="font-mono tracking-wide">{item.nis}</span>
                                        </div>
                                    </div>
                                    <div className="text-white/10 group-hover:text-white/40 transition-all shrink-0 transform group-hover:translate-x-1">
                                        <ChevronRight size={18} />
                                    </div>
                                </button>
                            </li>
                        ))}
                        {data.length === MAX_RESULTS && (
                            <div className="py-4 flex items-center justify-center gap-2 text-white/30 bg-white/2 border border-white/5 rounded-2xl mt-2">
                                <Info size={14} />
                                <span className="text-[10px] font-medium tracking-wide uppercase">Limit results. Please be more specific.</span>
                            </div>
                        )}
                    </ul>
                </div>
            )}

            {search && !isLoading && data.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pb-24 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-red-950 border border-red-900/50 flex items-center justify-center mb-4 text-red-400 ar-beat-loop shadow-[0_0_15px_rgba(127,29,29,0.2)]">
                        <AlertCircle size={28} />
                    </div>
                    <h3 className="text-white font-semibold text-base mb-1">No Results Found</h3>
                    <p className="text-white/40 text-xs max-w-55 leading-relaxed">No student found with the provided name or NIS.</p>
                </div>
            )}
        </div>
    );
};

export const Manual = ({ setPick, setOpenForm, search, setSearch, data, isLoading, onFocus, onBlur, handleSelect, onScrollDirectionChange }: ManualProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isEntering, setIsEntering] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setIsEntering(false), 450);
        return () => clearTimeout(t);
    }, []);

    if (isEntering) {
        return (
            <div className="flex h-full w-full flex-col">
                {/* Skeleton search bar */}
                <div className="relative z-20 mb-6 flex-none px-1">
                    <div className="flex h-12 w-full items-center rounded-2xl border border-white/5 bg-[#1F1E23] p-1 pl-3 shadow-lg">
                        <div className="mr-2 h-4 w-4 animate-pulse rounded bg-zinc-800" />
                        <div className="h-3 w-40 animate-pulse rounded-full bg-zinc-800" />
                    </div>
                </div>
                {/* Skeleton list */}
                <div className="relative min-h-0 w-full flex-1 overflow-hidden">
                    <div className="flex flex-col gap-3 px-1 pt-1">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex w-full items-center gap-4 rounded-2xl border border-white/5 bg-[#1F1E23] p-4">
                                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-zinc-800" />
                                <div className="flex min-w-0 flex-1 flex-col gap-2">
                                    <div className="h-3.5 w-32 animate-pulse rounded-full bg-zinc-800" />
                                    <div className="h-2.5 w-24 animate-pulse rounded-full bg-zinc-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <ManualSearch
                search={search}
                setSearch={setSearch}
                isLoading={isLoading}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <div className="flex-1 min-h-0 relative w-full overflow-hidden">
                <ManualResults
                    search={search}
                    data={data}
                    isLoading={isLoading}
                    isFocused={isFocused}
                    handleSelect={handleSelect}
                    onScrollDirectionChange={onScrollDirectionChange}
                />
            </div>
        </div>
    );
};