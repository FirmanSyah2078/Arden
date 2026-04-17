'use client';

import Image from 'next/image';
import { User, History, Settings, LogOut } from 'lucide-react';
import { useProfile } from '@/hooks/settings/use-profile';

interface BottomDockProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const BottomDock = ({ onOpenHistory, onOpenSettings, onLogout }: BottomDockProps) => {
    const { formData } = useProfile();

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#1F1E23] border border-white/10 rounded-full p-2 shadow-2xl flex items-center justify-between transition-all duration-500 hover:border-white/20">
            
            {/* LEFT SECTION: Identity */}
            <div className="flex items-center gap-3 px-3">
                <div className="flex items-center gap-2">
                    <Image
                        src="/arden.svg"
                        alt="Logo"
                        width={18}
                        height={20}
                        className="object-contain shrink-0"
                    />
                    <span className="text-[10px] font-extrabold text-white tracking-tighter leading-none opacity-80">ARDEN</span>
                </div>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#2A292F] overflow-hidden shrink-0 border border-white/10">
                        {formData?.avatarUrl ? (
                            <Image src={formData.avatarUrl} alt="Profile" width={24} height={24} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                                <User size={10} />
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-white truncate max-w-[60px]">
                        {formData?.name?.split(' ')[0] || 'User'}
                    </span>
                </div>
            </div>

            {/* DIVIDER: Vertical Line */}
            <div className="w-px h-6 bg-white/10 mx-1" />

            {/* RIGHT SECTION: Navigation Actions */}
            <div className="flex items-center gap-1 px-1">
                <button
                    onClick={onOpenHistory}
                    className="p-2 rounded-full text-white/40 hover:text-white hover:bg-[#2A292F] transition-all active:scale-90"
                    title="History"
                >
                    <History size={18} />
                </button>
                <button
                    onClick={onOpenSettings}
                    className="p-2 rounded-full text-white/40 hover:text-white hover:bg-[#2A292F] transition-all active:scale-90"
                    title="Settings"
                >
                    <Settings size={18} />
                </button>
                <button
                    onClick={onLogout}
                    className="p-2 rounded-full text-white/40 hover:text-red-400 hover:bg-red-900/20 transition-all active:scale-90"
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>

        </div>
    );
};
