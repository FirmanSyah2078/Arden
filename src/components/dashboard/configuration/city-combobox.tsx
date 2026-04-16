// src/components/dashboard/configuration/city-combobox.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// 🔥 FIX: Import data kota dari lib!
import { INDONESIAN_CITIES, CityData } from "@/lib/indonesia-cities";

// Format data untuk kebutuhan UI Search Combobox
const CITIES_DB = INDONESIAN_CITIES.map((c: CityData) => {
  const typeLabel = c.type === 'Kabupaten' ? 'Kab.' : c.type === 'Kota Adm.' ? 'Kota' : c.type;
  return {
    ...c,
    display: `${typeLabel} ${c.name} / ${c.province}`,
    searchString: `${c.type} ${c.name} ${c.province}`.toLowerCase()
  };
});

interface CityComboboxProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  className?: string;
}

export function CityCombobox({ 
  value, 
  onChange, 
  disabled, 
  className 
}: CityComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (searchQuery.trim() === "") setSearchQuery(value);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery, value]);

  useEffect(() => { setSearchQuery(value); }, [value]);

  const handleType = (text: string) => {
    setSearchQuery(text);
    onChange(text);
    setIsSearching(true);
    setIsOpen(true);
    setTimeout(() => setIsSearching(false), 300); 
  };

  const handleSelect = (displayStr: string) => {
    setSearchQuery(displayStr);
    onChange(displayStr);
    setIsOpen(false);
  };

  const filteredData = CITIES_DB.filter(c => c.searchString.includes(searchQuery.toLowerCase()));

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input 
        value={searchQuery}
        onChange={(e) => handleType(e.target.value)}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        placeholder="Search or type city..."
        autoComplete="off"
        spellCheck="false"
        className={cn(className, "pr-12")}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
        {isSearching && <Loader2 className="size-3.5 animate-spin text-primary" />}
        <ChevronDown className={cn("size-4 text-muted-foreground opacity-50 transition-transform duration-300", isOpen && "rotate-180")} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-popover border border-border/50 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto p-1.5 animate-in fade-in zoom-in-95 slide-in-from-top-2">
          {filteredData.length > 0 ? (
            filteredData.map((city, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(city.display)}
                className="w-full flex items-center px-3 py-2.5 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left group"
              >
                <span className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">
                  {city.type === 'Kabupaten' ? 'Kab.' : city.type === 'Kota Adm.' ? 'Kota' : city.type} {city.name}
                  <span className="text-muted-foreground font-normal ml-1.5">/ {city.province}</span>
                </span>
              </button>
            ))
          ) : (
            <div className="px-3 py-5 text-center flex flex-col items-center justify-center gap-1">
              <MapPin className="size-5 text-muted-foreground/30 mb-1" />
              <span className="text-[12px] font-medium text-muted-foreground">City not found in quick list.</span>
              <span className="text-[10px] text-muted-foreground/70">It will be saved as manual input.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}