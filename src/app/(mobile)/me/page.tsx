"use client";

import { useState } from 'react';
import { User, Camera, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UnifiedHeader } from '@/components/mobile/ui/unified-header';
import { useProfile } from '@/hooks/settings/use-profile';
import { useRouter } from 'next/navigation';

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8 py-8">
      <div className="flex flex-col items-center gap-5">
        <div className="h-32 w-32 animate-pulse rounded-full bg-[#1F1E23]" />
        <div className="h-3 w-20 animate-pulse rounded-full bg-[#1F1E23]" />
      </div>

      <div className="space-y-4 rounded-3xl border border-white/8 bg-[#1F1E23] p-5">
        <div className="h-3 w-28 animate-pulse rounded-full bg-zinc-800" />
        <div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-800/60" />
        <div className="h-12 w-full animate-pulse rounded-2xl bg-zinc-800/60" />
      </div>

      <div className="space-y-3">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#1F1E23]" />
        <div className="h-14 w-full animate-pulse rounded-2xl bg-[#1F1E23]" />
      </div>
    </div>
  )
}

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
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            {/* Avatar Section - Symmetry Luxury (UNCHANGED — udah perfect) */}
            <div className="flex flex-col items-center py-12 gap-6">
              <div className="relative">
                {/* Aura Glow Effect */}
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl scale-110" />

                <div className="w-32 h-32 rounded-full bg-[#1F1E23] border-2 border-white/10 overflow-hidden relative z-10 shadow-2xl transition-transform duration-500">
                  {!formData?.avatarUrl ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-white/10" />
                    </div>
                  ) : (
                    <>
                      {/* Symmetry Blurred BG Glow - Exact Mirror of StatusCard */}
                      <img
                        src={formData.avatarUrl}
                        alt="Blur"
                        className={`absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-40 transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-40'}`}
                      />

                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#1F1E23] z-20">
                          <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                      <img
                        src={formData.avatarUrl}
                        alt="Profile"
                        className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
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

            {/* Form Section — grouped card, icon tile + divider (search bar language) */}
            <div className="rounded-3xl border border-white/8 bg-[#1F1E23] p-5">
              <div className="space-y-4">
                {/* Full Name */}
                <div className="group space-y-2">
                  <Label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 transition-colors group-focus-within:text-indigo-400">
                    Full Name
                  </Label>
                  <div className="flex h-12 w-full items-center rounded-2xl border border-white/10 bg-[#141317] p-1.5 pr-4 transition-all duration-300 group-focus-within:border-indigo-500/60">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A292F] text-zinc-400 transition-colors duration-300 group-focus-within:bg-indigo-600 group-focus-within:text-white">
                      <User size={16} strokeWidth={2.2} />
                    </div>
                    <div className="mx-2.5 h-5 w-px shrink-0 bg-white/10" />
                    <Input
                      value={formData?.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-[14px] font-medium text-white shadow-none outline-none placeholder:text-white/25 ring-0! ring-offset-0! dark:bg-transparent focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isLoading || isSubmitting}
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="group space-y-2">
                  <Label className="ml-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 transition-colors group-focus-within:text-indigo-400">
                    Username
                  </Label>
                  <div className="flex h-12 w-full items-center rounded-2xl border border-white/10 bg-[#141317] p-1.5 pr-4 transition-all duration-300 group-focus-within:border-indigo-500/60">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A292F] text-zinc-400 transition-colors duration-300 group-focus-within:bg-indigo-600 group-focus-within:text-white">
                      <AtSign size={16} strokeWidth={2.2} />
                    </div>
                    <div className="mx-2.5 h-5 w-px shrink-0 bg-white/10" />
                    <Input
                      value={formData?.username || ''}
                      onChange={(e) => handleChange('username', e.target.value)}
                      placeholder="Your username"
                      className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-[14px] font-medium text-white shadow-none outline-none placeholder:text-white/25 ring-0! ring-offset-0! dark:bg-transparent focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isLoading || isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons — solid, no glow */}
            <div className="mt-8 flex flex-col gap-3">
              <Button
                onClick={async () => {
                  await handleSave();
                }}
                disabled={isSaveDisabled}
                className="h-14 w-full rounded-2xl border-none bg-indigo-600 font-bold text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-40"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
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
                className="h-14 w-full rounded-2xl border border-white/10 bg-[#1F1E23] font-semibold text-zinc-300 transition-all hover:bg-[#2A292F] hover:text-white active:scale-[0.98]"
              >
                {isDirty ? 'Cancel' : 'Back'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
