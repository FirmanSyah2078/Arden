import type { UserProfileData } from "@/hooks/settings/use-profile"

const PROFILE_CACHE_KEY = "arden-profile-cache"
const PROFILE_QUEUE_KEY = "arden-profile-update-queue"

export type PendingProfileUpdate = {
  name: string
  username: string
  photo_url: string | null
  queuedAt: string
}

export function saveProfileCache(profile: UserProfileData) {
  localStorage.setItem(
    PROFILE_CACHE_KEY,
    JSON.stringify({ profile, cachedAt: new Date().toISOString() }),
  )
}

export function getProfileCache(): UserProfileData | null {
  const raw = localStorage.getItem(PROFILE_CACHE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    return parsed?.profile ?? null
  } catch {
    return null
  }
}

export function queueProfileUpdate(update: PendingProfileUpdate) {
  localStorage.setItem(PROFILE_QUEUE_KEY, JSON.stringify(update))
}

export function getQueuedProfileUpdate(): PendingProfileUpdate | null {
  const raw = localStorage.getItem(PROFILE_QUEUE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as PendingProfileUpdate
  } catch {
    return null
  }
}

export function clearQueuedProfileUpdate() {
  localStorage.removeItem(PROFILE_QUEUE_KEY)
}

export async function syncQueuedProfileUpdate() {
  const queued = getQueuedProfileUpdate()
  if (!queued) return { synced: false, pending: false }

  try {
    const response = await fetch("/api/user/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: queued.name,
        username: queued.username,
        photo_url: queued.photo_url,
      }),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok || result?.status !== "success") {
      if (response.status >= 400 && response.status < 500) {
        clearQueuedProfileUpdate()
        return { synced: false, pending: false, rejected: true }
      }
      return { synced: false, pending: true }
    }

    clearQueuedProfileUpdate()
    return { synced: true, pending: false }
  } catch {
    return { synced: false, pending: true }
  }
}

export {
  PROFILE_CACHE_KEY,
  PROFILE_QUEUE_KEY,
}
