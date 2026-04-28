"use client";

import React from "react";
import { usePathname } from "next/navigation";

export const UnifiedHeader = () => {
  const pathname = usePathname();

  // Dynamic content based on page - Mirroring the EditProfile popup style
  const getContent = () => {
    if (pathname === '/me') {
      return {
        title: "My Profile",
        desc: "Update your identity and account details"
      };
    }
    if (pathname === '/history') {
      return {
        title: "History Logs",
        desc: "Attendance tracking records and logs"
      };
    }
    if (pathname === '/guide') {
      return {
        title: "User Guide",
        desc: "Operational guidelines and system help"
      };
    }
    return {
      title: "Arden System",
      desc: "Main navigation and system hub"
    };
  };

  const { title, desc } = getContent();

  return (
    <header className="flex flex-col gap-1 mb-6 pb-4 border-b border-white/5 w-full">
      <h1 className="text-xl font-bold tracking-tight text-white">
        {title}
      </h1>
      <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
        {desc}
      </p>
    </header>
  );
};
