'use client';

import React, { createContext, useContext, useState } from 'react';

interface DockContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  mode: 'scan' | 'manual';
  setMode: (mode: 'scan' | 'manual') => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (open: boolean) => void;
}

const DockContext = createContext<DockContextType | undefined>(undefined);

export const DockProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <DockContext.Provider value={{ isMenuOpen, setIsMenuOpen, mode, setMode, isProfileOpen, setIsProfileOpen, isHelpOpen, setIsHelpOpen }}>
      {children}
    </DockContext.Provider>
  );
};

export const useDock = () => {
  const context = useContext(DockContext);
  if (!context) throw new Error('useDock must be used within a DockProvider');
  return context;
};
