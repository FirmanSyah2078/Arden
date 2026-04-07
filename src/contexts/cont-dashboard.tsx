"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // 🔥 1. IMPORT INI
import { systemRoles } from "../config/nav-dashboard";

export type RoleType = {
  name: string;
  plan: string;
  level: number;
  logo?: React.ElementType;
};

export const defaultRole: RoleType = { name: "Pemantau", plan: "Read-Only", level: 50 };

interface DashboardContextType {
  realRole: RoleType;
  activeRole: RoleType;
  setActiveRole: (role: RoleType) => void;
  isReady: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // 🔥 2. PANGGIL PATHNAME

  const [mounted, setMounted] = useState(false);
  const [realRole, setRealRole] = useState<RoleType>(defaultRole);
  const [activeRole, setActiveRole] = useState<RoleType>(defaultRole);

  // 🔥 3. PENAWAR BRUTAL: PEMBERSIH KUTUKAN RADIX UI
  useEffect(() => {
    // Paksa hilangkan lock pointer & scroll yang tertinggal dari halaman Login
    document.body.style.pointerEvents = "auto";
    document.body.style.overflow = "auto";
    document.body.removeAttribute("data-scroll-locked");

    // Sapu bersih elemen pelindung gaib (focus-guard) jika ada yang nyangkut
    const lingeringBackdrops = document.querySelectorAll('[data-radix-focus-guard]');
    lingeringBackdrops.forEach((el) => el.remove());
  }, [pathname]); // Akan bereaksi setiap kali rute URL berubah

  useEffect(() => {
    const savedReal = localStorage.getItem("arden_real_role");
    const savedActive = localStorage.getItem("arden_active_role");

    let initialReal = defaultRole;
    let initialActive = defaultRole;

    if (savedReal) {
      initialReal = systemRoles.find(r => r.name === savedReal) || defaultRole;
    } else {
      initialReal = systemRoles.find(r => r.name === "Admin") || defaultRole;
    }

    if (savedActive) {
      initialActive = systemRoles.find(r => r.name === savedActive) || initialReal;
    } else {
      initialActive = initialReal;
    }

    setRealRole(initialReal);
    setActiveRole(initialActive);
    
    setMounted(true); 
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("arden_active_role", activeRole.name);
    }
  }, [activeRole.name, mounted]);

  return (
    <DashboardContext.Provider value={{ realRole, activeRole, setActiveRole, isReady: mounted }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within DashboardProvider");
  return context;
}