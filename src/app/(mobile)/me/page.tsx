"use client";

import { useState } from 'react';
import { User, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { StatusCard } from '@/components/mobile/core/status-card';
import { BottomDock } from '@/components/mobile/ui/bottom-dock';
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
    <div className="absolute inset-0 w-full h-full bg-[#151419] flex flex-col px-5 pt-4 font-sans overflow-hidden">
      <UnifiedHeader />

      <div className="flex-1 overflow-y-auto pb-24">
        {/* StatusCard as Context Anchor */}
        <div className="mt-4 mb-8">
          <StatusCard />
        </div>

        {/* Avatar Section - High-End Symmetry */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-[#1F1E23] border-2 border-white/5 flex items-center justify-center overflow-hidden transition-all group-hover:border-white/10 shadow-xl">
              <User className={`w-14 h-14 text-white/10 transition-opacity duration-300 ${formData.avatarUrl && !imageLoading ? 'opacity-0' : 'opacity-100'}`} />

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
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-indigo-600 text-white shadow-lg transition-all active:scale-90 hover:bg-indigo-700 border-2 border-[#151419]"
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
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center">
              <Badge variant="outline" className="text-white/60 border-white/20 text-[9px] font-mono uppercase tracking-widest bg-[#1F1E23]">
                Pelaksana
              </Badge>
            </div>
          </div>
        </div>

        {/* Form Fields - Professional English */}
        <div className="space-y-6 mb-12">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="bg-[#1F1E23] border-white/5 text-white rounded-xl h-12 focus:ring-white/20 transition-all"
              disabled={isLoading || isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-white/40 uppercase tracking-wider ml-1">Username</Label>
            <Input
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="bg-[#1F1E23] border-white/5 text-white rounded-xl h-12 focus:ring-white/20 transition-all"
              disabled={isLoading || isSubmitting}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={async () => {
              await handleSave();
            }}
            disabled={isSaveDisabled}
            className="w-full h-14 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20 border-none"
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
            </div>
          </Button>

          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full h-14 rounded-2xl bg-[#1F1E23] text-white border-white/5 hover:bg-[#2A292F] font-semibold transition-all active:scale-[0.98]"
          >
            Back
          </Button>
        </div>
      </div>

      <BottomDock variant="profile" />
    </div>
  );
}
