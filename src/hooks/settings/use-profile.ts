import { useState, useEffect, useRef } from "react"
// 🔥 IMPORT LIBRARY KOMPRESI
import imageCompression from 'browser-image-compression';

export interface UserProfileData {
  avatarUrl: string | null;
  name: string;
  username: string;
  email: string;
  role: string;
  createdAt: string; 
  lastUpdated: string;
}

export function useProfile() {
  const [originalData, setOriginalData] = useState<UserProfileData | null>(null)
  const [formData, setFormData] = useState<UserProfileData>({
    avatarUrl: null,
    name: "",
    username: "",
    email: "",
    role: "",
    createdAt: "-",
    lastUpdated: "-",
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string): string => {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  const handleChange = <K extends keyof UserProfileData>(field: K, value: UserProfileData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  // 🔥 FIX: Ubah fungsi ini menjadi async untuk proses kompresi
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Batas Awal (Bisa kita naikkan ke 5MB, karena toh nanti diperas)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 5MB sebelum dikompresi.");
      return;
    }

    try {
      // 2. Setting Mesin Pemeras Gambar
      const options = {
        maxSizeMB: 0.2,          // Target maksimal 200 KB (Sangat hemat!)
        maxWidthOrHeight: 512,   // Resolusi diubah max 512x512px (Cocok untuk foto profil bundar)
        useWebWorker: true,      // Menggunakan thread terpisah agar browser tidak lag
      }

      // 3. Proses "Diperas dan Dijemur"
      const compressedFile = await imageCompression(file, options);
      
      // (Opsional) Kamu bisa melihat ukuran sebelum dan sesudah di console browser
      console.log(`Ukuran asli: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Setelah kompresi: ${(compressedFile.size / 1024).toFixed(2)} KB`);

      // 4. Buat URL Preview dari hasil perasan
      const previewUrl = URL.createObjectURL(compressedFile);
      handleChange("avatarUrl", previewUrl);
      setSelectedFile(compressedFile); // Simpan file super ringan ini untuk dikirim ke Supabase
      
    } catch (error) {
      console.error("Gagal mengkompresi gambar:", error);
      alert("Terjadi kesalahan saat memproses gambar.");
    }
  }

  const handleRemoveAvatar = () => {
    handleChange("avatarUrl", null); 
    setSelectedFile(null); 
  }

  const handleUndoAvatar = () => {
    if (originalData) {
      handleChange("avatarUrl", originalData.avatarUrl);
      setSelectedFile(null); 
    }
  }

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await fetch('/api/user/me');
        const json = await res.json();
        
        if (json.status === 'success' && json.data) {
          const dbData = json.data;
          
          let lastLoginStr = '-';
          if (dbData.last_login) {
            const ll = new Date(dbData.last_login);
            if (!isNaN(ll.getTime())) lastLoginStr = ll.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
          }
            
          let createdAtStr = '-';
          if (dbData.created_at) {
            const ca = new Date(dbData.created_at);
            if (!isNaN(ca.getTime())) createdAtStr = ca.toLocaleString('en-US', { month: 'short', year: 'numeric' });
          }

          const initialData: UserProfileData = {
            avatarUrl: dbData.foto_url || null,
            name: dbData.name, 
            username: dbData.username,
            email: "", 
            role: dbData.role || 'Unknown',
            createdAt: createdAtStr,
            lastUpdated: lastLoginStr
          };

          setOriginalData(initialData); 
          setFormData(initialData);     
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyProfile();
  }, []);

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      let finalAvatarUrl = formData.avatarUrl;

      // Jika ada file fisik, upload file super ringan ini ke Supabase
      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", selectedFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData
        });
        
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || uploadJson.status === 'fail') {
          throw new Error(uploadJson.message || "Gagal mengunggah foto ke Storage");
        }

        finalAvatarUrl = uploadJson.data.url; 
      }

      // KEMUDIAN baru simpan URL-nya ke Database Prisma
      const payload = { ...formData, avatarUrl: finalAvatarUrl };
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (json.status === 'success') {
        window.location.reload(); 
      } else {
        alert(`Gagal: ${json.message}`);
      }
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDirty = (originalData ? (
    formData.name !== originalData.name ||
    formData.username !== originalData.username ||
    formData.email !== originalData.email ||
    formData.avatarUrl !== originalData.avatarUrl
  ) : false) || selectedFile !== null;

  const hasOriginalAvatar = originalData?.avatarUrl != null;
  const isAvatarRemoved = hasOriginalAvatar && formData.avatarUrl === null;
  const isSaveDisabled = isSubmitting || !isDirty || !formData.name || !formData.username;

  return {
    formData, originalData, isLoading, isSubmitting, isSaveDisabled, isDirty,
    isAvatarRemoved, hasOriginalAvatar,
    getInitials, handleChange, handleSave, handleRemoveAvatar, handleUndoAvatar,
    handleFileChange,
    fileInputRef,
    handleUploadClick
  }
}