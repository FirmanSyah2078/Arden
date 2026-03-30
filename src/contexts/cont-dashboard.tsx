"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
  isReady: boolean; // 🔥 TAMBAHAN: Sinyal bahwa Context sudah selesai membaca memori
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [realRole, setRealRole] = useState<RoleType>(defaultRole);
  const [activeRole, setActiveRole] = useState<RoleType>(defaultRole);

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
    
    setMounted(true); // Sinyal siap!
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("arden_active_role", activeRole.name);
    }
  }, [activeRole.name, mounted]);

  // 🔥 PERBAIKAN: TIDAK ADA LAGI LAYAR LOADING PENUH! LANGSUNG RENDER CHILDREN!
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