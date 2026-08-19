"use client";

import React, { useState, useRef } from 'react';
import { Search, User, Loader2, ChevronRight, SearchX, Info, X } from 'lucide-react';
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
    hasMore?: boolean;
}

// --- COMPONENT 1: SEARCH BAR (Structured pill — icon tile + divider) ---
export const ManualSearch = ({ search, setSearch, isLoading, onFocus, onBlur }: { search: string, setSearch: (s: string) => void, isLoading: boolean, onFocus: () => void, onBlur: () => void }) => {
    const [focused, setFocused] = useState(false);
    const active = focused || search.length > 0;
    return (
        <div className="relative mb-6 flex-none z-20 px-1">
            <div className={`relative flex h-13 w-full items-center rounded-full border bg-[#1F1E23] p-1.5 pr-2 shadow-lg transition-all duration-300 ${focused ? 'border-indigo-500/60' : search ? 'border-white/15' : 'border-white/5'}`}>
                {/* Icon tile */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${active ? 'bg-indigo-600 text-white' : 'bg-[#2A292F] text-zinc-400'}`}>
                    <Search size={17} strokeWidth={2.2} />
                </div>

                {/* Divider */}
                <div className="mx-2.5 h-6 w-px shrink-0 bg-white/10" />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => { setFocused(true); onFocus(); }}
                    onBlur={() => { setFocused(false); onBlur(); }}
                    placeholder="Search by Name or NIS..."
                    spellCheck="false"
                    autoComplete="off"
                    className="h-full min-w-0 flex-1 border-none bg-transparent text-[14px] font-medium text-white outline-none placeholder:text-white/25"
                />

                <div className="flex min-h-9 min-w-9 items-center justify-end gap-1.5">
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="rounded-full bg-[#2A292F] p-2 text-zinc-200 transition-all hover:bg-[#333238] hover:text-white active:scale-90"
                        >
                            <X size={14} />
                        </button>
                    )}
                    {isLoading && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                            <Loader2 size={16} className="shrink-0 animate-spin text-white/60" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT 2: SEARCH RESULTS (Solid Material White Theme) ---
export const ManualResults = ({ search, data, isLoading, handleSelect, isFocused, onScrollDirectionChange, hasMore }: { search: string, data: StudentMobile[], isLoading: boolean, handleSelect: (s: StudentMobile) => void, isFocused: boolean, onScrollDirectionChange?: (visible: boolean) => void, hasMore?: boolean }) => {
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
        <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden pr-3">
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-[#151419] to-transparent pointer-events-none z-10" />

            {!search && !isFocused && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-in fade-in duration-220 ease-out">
                    {/* Kartu siswa + badge search: cari siswa lalu isi form */}
                    <div className="relative mb-8 animate-in fade-in zoom-in-95 duration-220 fill-mode-both" style={{ animationDelay: '0ms' }}>
                        <div className="flex h-20 w-32 items-center gap-3 rounded-xl border border-white/10 bg-[#27272A] px-3 shadow-inner">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1F1E23]">
                                <User size={18} className="text-zinc-500" />
                            </div>
                            <div className="flex flex-1 flex-col gap-1.5">
                                <div className="h-2 w-full rounded-full bg-zinc-600" />
                                <div className="h-2 w-2/3 rounded-full bg-zinc-700" />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-indigo-600 shadow-lg">
                            <Search size={16} className="text-white" />
                        </div>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2 tracking-tight animate-in fade-in zoom-in-95 duration-220 fill-mode-both" style={{ animationDelay: '80ms' }}>Manual Attendance</h3>
                    <p className="text-white/40 text-xs max-w-55 leading-relaxed font-medium animate-in fade-in zoom-in-95 duration-220 fill-mode-both" style={{ animationDelay: '140ms' }}>
                        Search a student by name or NIS, then fill in the attendance form.
                    </p>
                </div>
            )}
            {search && isLoading && (
                <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-1 pb-3 pt-2">
                        <div className="h-2.5 w-24 animate-pulse rounded-full bg-zinc-800" />
                        <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
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
            {search && data.length > 0 && (
                <div
                    onScroll={handleScroll}
                    onTouchStart={() => (document.activeElement as HTMLElement)?.blur()}
                    className="min-h-0 w-full flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    <div className="flex items-center justify-between px-1 pb-3 pt-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                            Search results
                        </span>

                        <span className="rounded-full bg-[#2A292F] px-2.5 py-1 text-[10px] font-semibold tabular-nums text-zinc-300">
                            {data.length} {data.length === 1 ? 'student' : 'students'}
                        </span>
                    </div>

                    <ul className="flex flex-col gap-3 pb-8 pt-1">
                        {data.map((item) => (
                            <li key={item.id_student}>
                                <button
                                    onClick={() => handleSelect(item)}
                                    className="w-full text-left bg-[#1F1E23] hover:bg-[#2A292F] border border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-[0.98] group shadow-sm"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2A292F] text-sm font-bold text-zinc-200 transition-all group-hover:bg-[#35343B]">
                                        {item.full_name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-semibold text-zinc-100 transition-colors group-hover:text-white"> {item.full_name} </p>
                                        <div className="flex items-center gap-2 text-[10px] text-white/30 mt-0.5">
                                            <span className="rounded-md bg-[#2A292F] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">{item.class_name} </span>
                                            <span className="opacity-20">•</span>
                                            <span className="font-mono tracking-wide text-zinc-500">
                                                {item.nis}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-300">
                                        <ChevronRight size={18} />
                                    </div>
                                </button>
                            </li>
                        ))}
                        {hasMore && (
                            <div className="flex items-start gap-2 px-1 py-3 text-zinc-500">
                                <Info size={14} className="mt-0.5 shrink-0 text-zinc-500" />
                                <span className="text-[11px] leading-relaxed">
                                    Showing the first 15 matches. Refine your search for a specific student.
                                </span>
                            </div>
                        )}
                    </ul>
                </div>
            )}

            {search && !isLoading && data.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pb-24 text-center animate-in fade-in duration-[220ms] ease-out">
                    <div className="mobile-empty-pop mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#2A292F] text-zinc-400">
                        <SearchX size={26} strokeWidth={1.8} />
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-zinc-100">No student found</h3>
                    <p className="max-w-55 text-xs leading-relaxed text-zinc-500">
                        Try a different name or NIS.
                    </p>
                </div>
            )}
        </div>
    );
};

export const Manual = ({ setPick, setOpenForm, search, setSearch, data, isLoading, onFocus, onBlur, handleSelect, onScrollDirectionChange, hasMore }: ManualProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <ManualSearch
                search={search}
                setSearch={setSearch}
                isLoading={isLoading}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <div className="relative min-h-0 w-full flex-1 overflow-hidden">
                <ManualResults
                    search={search}
                    data={data}
                    isLoading={isLoading}
                    isFocused={isFocused}
                    handleSelect={handleSelect}
                    hasMore={hasMore}
                    onScrollDirectionChange={onScrollDirectionChange}
                />
            </div>
        </div>
    );
};