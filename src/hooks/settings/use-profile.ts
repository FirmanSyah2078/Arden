import { useState, useEffect } from "react"

export interface UserProfileData {
  avatarUrl: string | null;
  name: string;      // Berubah jadi name
  username: string;
  email: string;
  role: string;
  createdAt: string; // Tambahan created_at
  lastUpdated: string;
}

export function useProfile() {
  // 1. STATE ORIGINAL (Penyimpanan data asli dari DB)
  const [originalData, setOriginalData] = useState<UserProfileData | null>(null)
  
  // 2. STATE FORM (Yang diedit user)
  const [formData, setFormData] = useState<UserProfileData>({
    avatarUrl: null,
    name: "",
    username: "",
    email: "",
    role: "",
    createdAt: "-",
    lastUpdated: "-",
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // FUNGSI: Ambil Inisial (CUMA 1 HURUF AWAL)
  const getInitials = (name: string): string => {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  // FUNGSI: Handle Perubahan Input (Dinamis untuk string atau null)
  const handleChange = <K extends keyof UserProfileData>(field: K, value: UserProfileData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  // LOGIKA AVATAR: Remove & Undo
  const handleRemoveAvatar = () => {
    handleChange("avatarUrl", null); 
  }

  const handleUndoAvatar = () => {
    if (originalData) {
      handleChange("avatarUrl", originalData.avatarUrl);
    }
  }

  // AMBIL DATA DARI DB
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await fetch('/api/user/me');
        const json = await res.json();
        
        if (json.status === 'success' && json.data) {
          const dbData = json.data;
          const lastLoginStr = dbData.last_login 
            ? new Date(dbData.last_login).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-';
            
          const createdAtStr = dbData.created_at 
            ? new Date(dbData.created_at).toLocaleString('id-ID', { month: 'short', year: 'numeric' }) : '-';

          const initialData: UserProfileData = {
            avatarUrl: dbData.foto_url || null,
            name: dbData.name, 
            username: dbData.username,
            email: "", // Nanti diambil dari relasi tbl_connections
            role: dbData.role || 'Unknown',
            createdAt: createdAtStr,
            lastUpdated: lastLoginStr
          };

          setOriginalData(initialData); // Simpan aslinya
          setFormData(initialData);     // Masukkan ke form
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyProfile();
  }, []);

  // SIMPAN DATA
  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const json = await res.json();
      if (json.status === 'success') {
        window.location.reload(); 
      } else {
        alert(`Gagal: ${json.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false)
    }
  }

  // 🔥 LOGIKA DIRTY STATE (Apakah ada yang diubah?)
  const isDirty = originalData ? (
    formData.name !== originalData.name ||
    formData.username !== originalData.username ||
    formData.email !== originalData.email ||
    formData.avatarUrl !== originalData.avatarUrl
  ) : false;

  // 🔥 LOGIKA UNDO AVATAR
  const hasOriginalAvatar = originalData?.avatarUrl != null;
  const isAvatarRemoved = hasOriginalAvatar && formData.avatarUrl === null;

  // Tombol simpan hanya menyala JIKA ada perubahan DAN field wajib terisi
  const isSaveDisabled = isSubmitting || !isDirty || !formData.name || !formData.username;

  return {
    formData, originalData, isLoading, isSubmitting, isSaveDisabled, isDirty,
    isAvatarRemoved, hasOriginalAvatar,
    getInitials, handleChange, handleSave, handleRemoveAvatar, handleUndoAvatar
  }
}