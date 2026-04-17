"use client";

import React, { useState, useRef } from 'react';
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pb-20 animate-in fade-in duration-500">
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

            {search && data.length > 0 && (
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
                            <li
                                key={item.id_student}
                                className="animate-in slide-in-from-bottom-2 duration-300"
                                style={{ animationDelay: `${index * 60}ms` }}
                            >
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

    return (
        <div className="w-full h-full flex flex-col">
            <ManualSearch
                search={search}
                setSearch={setSearch}
                isLoading={isLoading}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <div className="flex-1 min-h-0 relative w-full overflow-hidden pb-20">
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