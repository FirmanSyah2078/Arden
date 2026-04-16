'use client';

import { useState } from 'react';
import { User, Camera, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/settings/use-profile';

interface EditProfileProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function EditProfile({ isOpen, setIsOpen }: EditProfileProps) {
  const { 
    formData, 
    isLoading, 
    isSubmitting, 
    isSaveDisabled, 
    handleChange, 
    handleSave, 
    handleFileChange, 
    fileInputRef, 
    handleUploadClick 
  } = useProfile();

  return (
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

        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-indigo-500/20 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-500/50">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-indigo-400" />
              )}
            </div>
            <button 
              onClick={handleUploadClick}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-500 text-white shadow-lg transition-all active:scale-90 hover:bg-indigo-600"
            >
              <Camera size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
          <div className="text-center">
            <DialogTitle className="text-lg font-bold tracking-tight">Kelola Profil Akun</DialogTitle>
            <DialogDescription className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
              Akun Pelaksana
            </DialogDescription>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Nama Lengkap</Label>
            <Input 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-white/[0.03] border-white/10 text-white rounded-xl h-11 focus:ring-indigo-500/50"
              disabled={isLoading || isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Username</Label>
            <Input 
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="bg-white/[0.03] border-white/10 text-white rounded-xl h-11 focus:ring-indigo-500/50"
              disabled={isLoading || isSubmitting}
            />
          </div>
        </div>

        <Button 
          onClick={async () => {
            await handleSave();
            setIsOpen(false);
          }}
          disabled={isSaveDisabled}
          className="w-full h-12 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20"
        >
          <div className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </div>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
