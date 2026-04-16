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
          className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-none text-white p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-1 mb-6 pb-4 border-b border-white/5">
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              Pengaturan Sistem
            </DialogTitle>
            <DialogDescription className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
              System Configuration
            </DialogDescription>
          </div>

          <div className="grid gap-3 mt-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full p-4 rounded-2xl bg-[#1F1E23] border border-white/5 flex items-center justify-between group transition-all active:scale-[0.98] hover:bg-[#2A292F] hover:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-[#2A292F] text-white/60 group-hover:bg-[#35343B] group-hover:text-white transition-colors">
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
        setIsOpen={(val: boolean) => {
          if (!val) setActivePopup('none');
        }} 
      />
      <HelpGuide 
        isOpen={activePopup === 'help'} 
        setIsOpen={(val: boolean) => {
          if (!val) setActivePopup('none');
        }} 
      />
    </>
  );
}
