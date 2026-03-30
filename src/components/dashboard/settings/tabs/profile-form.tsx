"use client"

import { Upload, Info, Clock, ShieldCheck, Trash2, Undo2, CalendarDays } from "lucide-react"
import { useProfile } from "@/hooks/settings/use-profile" 

export default function ProfileForm() {
  const { 
    formData, isLoading, isSubmitting, isSaveDisabled, isDirty,
    isAvatarRemoved, hasOriginalAvatar,
    getInitials, handleChange, handleSave, handleRemoveAvatar, handleUndoAvatar
  } = useProfile()

  if (isLoading) {
    return <div className="text-white/50 text-sm animate-pulse">Memuat data profil ARDEN...</div>
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-4">
      
      {/* --- INFO CARD --- */}
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-[13px] text-white/70">
        <Info className="size-4 shrink-0 text-white/50" />
        <p className="leading-relaxed">
          Update your photo and personal details used across ARDEN.
        </p>
      </div>

      {/* --- AVATAR & METADATA --- */}
      <div className="flex flex-col items-center justify-center space-y-5 pt-2">
        <div className="relative group cursor-pointer">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-black/40 shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:border-white/40">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-white/10 to-transparent text-3xl font-bold tracking-tight text-white/40 uppercase select-none">
                {getInitials(formData.name)}
              </div>
            )}
          </div>
          <div className="absolute inset-0 -z-10 rounded-full bg-white/5 blur-xl group-hover:bg-white/20 transition-all duration-500" />
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">
            
            {/* Tombol Upload (Efek Hover Scale) */}
            <button className="flex items-center gap-2 rounded-md bg-white px-4 py-1.5 text-xs font-medium text-black transition-all hover:bg-white/90 hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
              <Upload className="size-3.5" /> Upload Photo
            </button>

            {/* Tombol Remove / Undo Pintar */}
            {isAvatarRemoved ? (
              <button 
                onClick={handleUndoAvatar}
                className="flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition-all hover:bg-amber-500/20 hover:scale-105 active:scale-95"
              >
                <Undo2 className="size-3.5" /> Undo
              </button>
            ) : (
              <button 
                onClick={handleRemoveAvatar}
                disabled={!formData.avatarUrl}
                className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <Trash2 className="size-3.5" /> Remove
              </button>
            )}

          </div>
          <p className="text-[11px] text-white/40 text-center">
            Recommended: 256x256px (JPG, PNG). Max size 2MB.
          </p>
        </div>

        {/* User Metadata Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] text-white/60">
            <ShieldCheck className="size-3 text-emerald-400/80" />
            <span>{formData.role}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] text-white/60">
            <CalendarDays className="size-3 text-white/40" />
            <span>Joined: {formData.createdAt}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] text-white/60">
            <Clock className="size-3 text-white/40" />
            <span>Last Login: {formData.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* --- INPUT FORM --- */}
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[13px] font-medium text-white/90">Full Name</label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-[13px] font-medium text-white/90">Username</label>
            <div className="flex w-full items-center overflow-hidden rounded-md border border-white/10 bg-black/20 focus-within:border-white/30 focus-within:ring-1 focus-within:ring-white/20 transition-all">
              <span className="flex select-none items-center px-3 text-[13px] text-white/40 border-r border-white/10 bg-white/5">@</span>
              <input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[13px] font-medium text-white/90">Email <span className="text-white/30 font-normal">(Optional)</span></label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
              placeholder="Not configured yet"
            />
          </div>
        </div>
      </div>

      {/* --- SUBMIT BUTTON PINTAR --- */}
      <div className="flex items-center justify-between pt-2">
        {/* Indikator Status (Opsional, sangat bagus untuk UX) */}
        <span className="text-[11px] text-white/40">
          {isDirty ? "Unsaved changes" : "All changes saved"}
        </span>
        
        <button 
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="rounded-md bg-white px-5 py-2 text-[13px] font-medium text-black shadow-lg shadow-white/10 transition-all duration-300 hover:bg-white/90 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving changes..." : "Save Profile Changes"}
        </button>
      </div>
      
    </div>
  )
}