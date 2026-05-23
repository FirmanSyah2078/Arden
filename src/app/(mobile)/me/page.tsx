"use client";

import { useState } from 'react';
import { User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { useProfile } from '@/hooks/settings/use-profile';
import { useRouter } from 'next/navigation';

export default function MePage() {
  const router = useRouter();
  const {
    formData,
    isLoading,
    isSubmitting,
    isSaveDisabled,
    isDirty,
    handleChange,
    handleSave,
    handleFileChange,
    resetForm,
    fileInputRef,
    handleUploadClick
  } = useProfile();

  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col px-6 pt-4 font-sans overflow-hidden">
      <UnifiedHeader />

      <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">
        {/* Avatar Section - Symmetry Luxury */}
        <div className="flex flex-col items-center py-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          <div className="relative">
            {/* Aura Glow Effect */}
            <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl scale-110" />
            
            <div className="w-32 h-32 rounded-full bg-[#1F1E23] border-2 border-white/10 flex items-center justify-center overflow-hidden relative z-10 shadow-2xl transition-transform duration-500 hover:scale-105">
              <User className={`w-16 h-16 text-white/10 transition-opacity duration-300 ${formData?.avatarUrl && !imageLoading ? 'opacity-0' : 'opacity-100'}`} />
              {formData?.avatarUrl && (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#1F1E23] z-20">
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

            {/* CAMERA BUTTON - Refined Sleek */}
            <button
              onClick={handleUploadClick}
              className="absolute bottom-1 right-1 p-2 rounded-full bg-indigo-600 text-white shadow-lg transition-all active:scale-90 border-2 border-[#151419] z-20"
              title="Change Photo"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>

        {/* Form Section - Symmetry Search Bar Style */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          <div className="space-y-2 group">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1 transition-colors group-focus-within:text-indigo-400">
              Full Name
            </Label>
<Input
  value={formData?.name || ''}
  onChange={(e) => handleChange('name', e.target.value)}
  className="bg-[#1F1E23] border-white/10 text-white rounded-2xl h-12 outline-none transition-all duration-300 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 !ring-0 !ring-offset-0"
  disabled={isLoading || isSubmitting}
/>
          </div>

          <div className="space-y-2 group">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1 transition-colors group-focus-within:text-indigo-400">
              Username
            </Label>
<Input
  value={formData?.username || ''}
  onChange={(e) => handleChange('username', e.target.value)}
  className="bg-[#1F1E23] border-white/10 text-white rounded-2xl h-12 outline-none transition-all duration-300 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 !ring-0 !ring-offset-0"
  disabled={isLoading || isSubmitting}
/>
          </div>
        </div>

        {/* Action Buttons - Dynamic Back/Cancel */}
        <div className="flex flex-col gap-3 mt-12 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both">
          <Button
            onClick={async () => {
              await handleSave();
            }}
            disabled={isSaveDisabled}
            className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold transition-all active:scale-[0.98] border-none shadow-[0_4px_20px_rgba(79,70,229,0.3)]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : 'Save Changes'}
          </Button>

          <Button
            onClick={() => {
              if (isDirty) {
                resetForm();
              } else {
                router.back();
              }
            }}
            variant="outline"
            className="w-full h-14 rounded-2xl bg-zinc-900/50 text-white/80 border-white/10 hover:bg-zinc-800 hover:text-white font-semibold transition-all active:scale-[0.98]"
          >
            {isDirty ? 'Cancel' : 'Back'}
          </Button>
        </div>
      </div>
    </div>
  );
}
