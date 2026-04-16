'use client';

import { useState } from 'react';
import { User, HelpCircle, Bell, Shield, X, ChevronRight, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import EditProfile from './edit-profile';
import HelpGuide from './help-guide';

interface SettingsHubProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function SettingsHub({ isOpen, setIsOpen }: SettingsHubProps) {
  const [activePopup, setActivePopup] = useState<'none' | 'edit-profile' | 'help'>('none');

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Kelola Profil Akun',
      description: 'Perbarui informasi identitas dan data akun',
      icon: <User className="w-5 h-5" />,
      action: () => setActivePopup('edit-profile'),
    },
    {
      id: 'help',
      title: 'Pusat Panduan Operasional',
      description: 'Dokumentasi penggunaan sistem dan prosedur absensi',
      icon: <HelpCircle className="w-5 h-5" />,
      action: () => setActivePopup('help'),
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          showCloseButton={false}
          className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-white/10 text-white p-6 shadow-2xl"
        >
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90 z-10"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-4 mb-10 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <DialogTitle className="text-lg font-bold tracking-tight">Pengaturan Akun</DialogTitle>
              <DialogDescription className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                Account Management
              </DialogDescription>
            </div>
          </div>

          <div className="grid gap-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group transition-all active:scale-[0.98] hover:bg-white/[0.05] hover:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/10 text-white/80 group-hover:bg-white/20 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-white/30 leading-tight">{item.description}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-Popups */}
      <EditProfile 
        isOpen={activePopup === 'edit-profile'} 
        setIsOpen={(val) => {
          if (!val) setActivePopup('none');
        }} 
      />
      <HelpGuide 
        isOpen={activePopup === 'help'} 
        setIsOpen={(val) => {
          if (!val) setActivePopup('none');
        }} 
      />
    </>
  );
}