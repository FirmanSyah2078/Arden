"use client"

import { Upload, Info, Clock, ShieldCheck, Trash2, Undo2, CalendarDays, Loader2, CheckCircle2, CircleDashed, Save } from "lucide-react"
import { useProfile } from "@/hooks/settings/use-profile" 

export default function ProfileForm() {
  const { 
    formData, isLoading, isSubmitting, isSaveDisabled, isDirty,
    isAvatarRemoved, hasOriginalAvatar,
    getInitials, handleChange, handleSave, handleRemoveAvatar, handleUndoAvatar,
    handleFileChange,
    fileInputRef,       
    handleUploadClick   
  } = useProfile()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-62.5 gap-3 animate-pulse">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <span className="text-[13px] font-medium text-muted-foreground tracking-wide">
          Loading profile...
        </span>
      </div>
    )
  }

  const inputClass = "w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-[13px] text-white placeholder:text-white/30 outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 hover:border-white/30 shadow-none transition-all duration-300"

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-4">
      
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-2 text-[12px] text-white/70">
        <Info className="size-4 shrink-0 text-white/50" />
        <p className="leading-relaxed">
          Update your photo and personal details used across ARDEN.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-5 pt-2">
        <div className="relative cursor-pointer">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40 transition-colors hover:border-white/20">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-white/10 to-transparent text-3xl font-medium tracking-tight text-white/40 uppercase select-none">
                {getInitials(formData.name)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center gap-2">

            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />

            <button 
              onClick={handleUploadClick}
              className="group flex items-center gap-2 rounded-md border border-transparent bg-white px-4 py-1.5 text-xs font-medium text-black transition-all duration-300 shadow-lg shadow-white/5 hover:bg-gray-200 active:bg-transparent active:border-white/40 active:text-white active:scale-95"
            >
              <Upload className="size-3.5 transition-transform duration-300 group-hover:ar-float" /> 
              Upload Photo
            </button>

            {isAvatarRemoved ? (
              <button 
                onClick={handleUndoAvatar}
                className="group flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400 transition-all hover:bg-amber-500/20"
              >
                <Undo2 className="size-3.5 group-hover:ar-bounce-x" /> Undo
              </button>
            ) : (
              <button 
                onClick={handleRemoveAvatar}
                disabled={!formData.avatarUrl}
                className="group flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed"
              >
                <Trash2 className="size-3.5 group-hover:ar-tada" /> Remove
              </button>
            )}

          </div>
          <p className="text-[11px] text-white/40 text-center">
            Recommended: 256x256px (JPG, PNG). Max size 2MB.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] text-white/60 hover:text-white/90 transition-colors">
            <ShieldCheck className="size-3 text-emerald-400/80" />
            <span className="font-medium">{formData.role}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] text-white/60 hover:text-white/90 transition-colors">
            <CalendarDays className="size-3 text-white/40" />
            <span className="font-medium">{formData.createdAt}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] text-white/60 hover:text-white/90 transition-colors">
            <Clock className="size-3 text-white/40" />
            <span className="font-medium">{formData.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[13px] font-medium text-white/90">Full Name</label>
          <input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-[13px] font-medium text-white/90">Username</label>
            <div className="flex w-full items-center overflow-hidden rounded-md border border-white/10 bg-black/20 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all duration-300">
              <span className="flex select-none items-center px-3 text-[13px] text-white/40 border-r border-white/10 bg-white/5">@</span>
              <input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-[13px] text-white placeholder:text-white/30 outline-none focus:outline-none shadow-none"
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
              className={inputClass}
              placeholder="Not configured yet"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-white/40">
          {isDirty ? (
            <><CircleDashed className="size-3.5 text-amber-500 animate-spin-slow" /> Unsaved changes</>
          ) : (
            <><CheckCircle2 className="size-3.5 text-emerald-500/80" /> All changes saved</>
          )}
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaveDisabled}
          className="group flex items-center justify-center min-w-25 gap-2 rounded-md bg-white px-5 py-2 text-[13px] font-medium text-black shadow-lg shadow-white/5 transition-all duration-300 hover:bg-gray-200 disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
             <><Loader2 className="size-4 animate-spin" /> Saving</>
          ) : (
             <><Save className="size-4 group-hover:ar-bounce-x" /> Save</>
          )}
        </button>
      </div>
      
    </div>
  )
}