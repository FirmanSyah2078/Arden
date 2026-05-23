"use client";

import React, { useState, useRef } from 'react';
import { Search, User, Loader2, ChevronRight, Info, X, SearchX } from 'lucide-react';
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

// --- COMPONENT: SKELETON ITEM (High-End Shimmer) ---
const SkeletonItem = () => (
    <div className="w-full bg-[#1F1E23] border border-white/5 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
        <div className="w-11 h-11 rounded-xl bg-[#2A292F] relative overflow-hidden shrink-0">
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" />
        </div>
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-[#2A292F] rounded-full w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" />
            </div>
            <div className="h-2 bg-[#2A292F] rounded-full w-1/3 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_infinite] -translate-x-full" />
            </div>
        </div>
        <div className="w-4 h-4 rounded-full bg-[#2A292F] shrink-0" />
    </div>
);

// --- COMPONENT 1: SEARCH BAR (Symmetry Outline Version) ---
export const ManualSearch = ({ search, setSearch, isLoading, onFocus, onBlur }: { search: string, setSearch: (s: string) => void, isLoading: boolean, onFocus: () => void, onBlur: () => void }) => (
    <div className="relative mb-6 flex-none z-20 px-1 animate-in fade-in zoom-in-95 duration-500 fill-mode-both" style={{ animationDelay: '450ms' }}>
        <div className={`relative h-12 w-full bg-[#1F1E23] rounded-2xl border flex items-center p-1 pl-3 transition-all duration-300 group ${search ? 'border-indigo-500/40 ring-1 ring-indigo-500/20' : 'border-white/10'
            }`}>
            <Search size={18} className={`${search ? 'text-white' : 'text-zinc-400'} transition-colors shrink-0 mr-2`} />
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="Search by Name or NIS"
                spellCheck="false"
                autoComplete="off"
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-white font-medium placeholder:text-white/20 text-[14px] h-full"
            />
            <div className="flex items-center gap-2 mr-2">
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="p-1.5 rounded-lg bg-[#2A292F] hover:bg-[#35343B] text-zinc-400 hover:text-white transition-all active:scale-90"
                    >
                        <X size={14} />
                    </button>
                )}
                {isLoading && (
                    <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-lg bg-zinc-800/50 ml-1">
                        <Loader2 size={16} className="text-zinc-400 animate-spin shrink-0" />
                    </div>
                )}
            </div>
        </div>
    </div>
);

// --- COMPONENT 2: SEARCH RESULTS (Invisible Boundary Version) ---
export const ManualResults = ({ search, data, isLoading, handleSelect, isFocused, onScrollDirectionChange }: { search: string, data: StudentMobile[], isLoading: boolean, handleSelect: (s: StudentMobile) => void, isFocused: boolean, onScrollDirectionChange?: (visible: boolean) => void }) => {
    const MAX_RESULTS = 15;
    const lastScrollY = useRef(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;
        const delta = currentScrollY - lastScrollY.current;
        if (Math.abs(delta) > 10) {
            // Auto-hide keyboard on scroll
            if (document.activeElement instanceof HTMLInputElement) {
                document.activeElement.blur();
            }
            if (delta > 0) onScrollDirectionChange?.(false);
            else onScrollDirectionChange?.(true);
            lastScrollY.current = currentScrollY;
        }
    };

    return (
        <div 
            onScroll={handleScroll}
            className="h-full w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
            {!search && !isFocused && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-in fade-in duration-700 ease-out">
                    <style>{`
                        @keyframes symmetry-float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-8px); }
                        }
                        @keyframes shimmer {
                            100% { transform: translateX(100%); }
                        }
                        .animate-symmetry-float {
                            animation: symmetry-float 4s ease-in-out infinite;
                        }
                    `}</style>
                    
                    {/* Content Wrapper: shifted up for Visual Centering and fixed width to prevent jitter */}
                    <div className="flex flex-col items-center justify-center transition-transform duration-500">
                        <div className="relative w-32 h-12 mb-8 flex items-center justify-center animate-in fade-in zoom-in-95 duration-700 fill-mode-both" style={{ animationDelay: '0ms' }}>
                            <div className="absolute inset-0 bg-zinc-500/10 blur-3xl rounded-full scale-150" />
                            <div className="relative flex items-center justify-center -space-x-3">
                                {[
                                    { icon: User, delay: '0s' },
                                    { icon: Search, delay: '0.2s' },
                                    { icon: User, delay: '0.4s' }
                                ].map((item, i) => (
                                    <div 
                                        key={i}
                                        className={`relative w-12 h-12 rounded-full bg-zinc-800 border border-black flex items-center justify-center shadow-xl animate-symmetry-float overflow-hidden transition-all ${i === 1 ? 'z-20 scale-110' : 'z-10 scale-80'}`}
                                        style={{ animationDelay: item.delay }}
                                    >
                                        <item.icon size={20} className="text-zinc-400 relative z-10" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <h3 className="text-white font-bold text-xl mb-2 tracking-tight animate-in fade-in zoom-in-95 duration-700 fill-mode-both" style={{ animationDelay: '150ms' }}>Manual Search</h3>
                        <p className="text-white/40 text-xs max-w-55 leading-relaxed font-medium animate-in fade-in zoom-in-95 duration-700 fill-mode-both" style={{ animationDelay: '300ms' }}>
                            Enter student name or NIS to access the attendance record manually.
                        </p>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="flex flex-col gap-3 pb-6 pt-1">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonItem key={i} />
                    ))}
                </div>
            )}

            {search && !isLoading && data.length > 0 && (
                <ul className="flex flex-col gap-3 pb-6 pt-1">
                    {data.map((item, index) => (
                        <li key={item.id_student} className="animate-in fade-in duration-300">
                            <button
                                onClick={() => handleSelect(item)}
                                className="w-full text-left bg-[#1F1E23] hover:bg-[#2A292F] border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98] group shadow-sm"
                            >
                                <div className="w-11 h-11 rounded-xl bg-[#2A292F] text-white font-bold text-sm flex items-center justify-center border-none group-hover:bg-[#35343B] transition-all shrink-0 shadow-inner">
                                    {item.full_name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-white truncate group-hover:text-white transition-colors capitalize"> {item.full_name} </p>
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
            )}

            {search && !isLoading && data.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                    <div className="w-20 h-20 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-4 shadow-inner">
                        <SearchX size={32} className="text-zinc-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-zinc-300 font-semibold text-sm">No results found</p>
                        <p className="text-zinc-500 text-[11px] font-mono uppercase tracking-wider">Try another keyword</p>
                    </div>
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
