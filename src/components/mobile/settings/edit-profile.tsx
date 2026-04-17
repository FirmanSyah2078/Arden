'use client';

import { useState } from 'react';
import { User, Camera, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-none text-white p-6 shadow-2xl"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-[#1F1E23] border-2 border-white/5 flex items-center justify-center overflow-hidden transition-all group-hover:border-white/10">
              {/* Placeholder icon when loading or no image */}
              <User className={`w-12 h-12 text-white/10 transition-opacity duration-300 ${formData.avatarUrl && !imageLoading ? 'opacity-0' : 'opacity-100'}`} />

              {formData.avatarUrl && (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1F1E23] transition-opacity duration-300">
                      <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={formData.avatarUrl}
                    alt="Profile"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                  />
                </>
              )}
            </div>
            <button
              onClick={handleUploadClick}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-indigo-600 text-white shadow-lg transition-all active:scale-90 hover:bg-indigo-700"
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
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center">
              <Badge variant="outline" className="text-white/60 border-white/20 text-[9px] font-mono uppercase tracking-widest">
                Pelaksana
              </Badge>
            </div>
            <DialogTitle className="sr-only">Edit Profil Akun</DialogTitle>
            <DialogDescription className="sr-only">Profile editing for Pelaksana role</DialogDescription>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Nama Lengkap</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-[#1F1E23] border-white/5 text-white rounded-xl h-11 focus:ring-white/20"
              disabled={isLoading || isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Username</Label>
            <Input
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="bg-[#1F1E23] border-white/5 text-white rounded-xl h-11 focus:ring-white/20"
              disabled={isLoading || isSubmitting}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            onClick={async () => {
              await handleSave();
              setIsOpen(false);
            }}
            disabled={isSaveDisabled}
            className="w-full h-12 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold transition-all active:scale-[0.98] shadow-lg border-none"
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>{isSubmitting ? 'Memproses...' : 'Konfirmasi'}</span>
            </div>
          </Button>

          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="w-full h-12 rounded-2xl bg-[#1F1E23] text-white border-white/5 hover:bg-[#2A292F] font-semibold transition-all active:scale-[0.98]"
          >
            Kembali
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
