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
    handleChange,
    handleSave,
    handleFileChange,
    fileInputRef,
    handleUploadClick
  } = useProfile();

  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col px-6 pt-4 font-sans overflow-hidden">
      <UnifiedHeader />

      <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">
        {/* Avatar Section - Simpel & Gede */}
        <div className="flex flex-col items-center py-10 gap-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-[#1F1E23] border-4 border-white/5 flex items-center justify-center overflow-hidden relative z-10 shadow-xl">
              <User className={`w-16 h-16 text-white/10 transition-opacity duration-300 ${formData.avatarUrl && !imageLoading ? 'opacity-0' : 'opacity-100'}`} />
              {formData.avatarUrl && (
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

            <button
              onClick={handleUploadClick}
              className="absolute bottom-1 right-1 p-3 rounded-full bg-indigo-600 text-white shadow-lg transition-all active:scale-90 border-4 border-[#151419] z-20"
            >
              <Camera size={18} />
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

        {/* Form Section - Balik ke Simple List */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">
              Full Name
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-[#1F1E23] border-white/5 text-white rounded-xl h-12 px-4"
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">
              Username
            </Label>
            <Input
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="bg-[#1F1E23] border-white/5 text-white rounded-xl h-12 px-4"
              disabled={isLoading || isSubmitting}
            />
          </div>
        </div>

        {/* Action Buttons - Standar */}
        <div className="flex flex-col gap-3 mt-10">
          <Button
            onClick={async () => {
              await handleSave();
            }}
            disabled={isSaveDisabled}
            className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-bold transition-all active:scale-[0.98] border-none"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : 'Save Changes'}
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full h-14 rounded-2xl bg-transparent text-white/60 border-white/5 hover:bg-[#2A292F] hover:text-white font-semibold transition-all active:scale-[0.98]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
