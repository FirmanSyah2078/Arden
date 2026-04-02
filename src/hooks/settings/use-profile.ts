import { useState, useEffect, useRef } from "react"
import imageCompression from 'browser-image-compression';
import { useRouter } from "next/navigation"; // 🔥 Tambahkan useRouter
import { getInitials } from "@/lib/utils";   // 🔥 Gunakan fungsi Inisial Global

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
  const router = useRouter(); // 🔥 Panggil Router
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

  const handleChange = <K extends keyof UserProfileData>(field: K, value: UserProfileData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 5MB sebelum dikompresi.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.2,          
        maxWidthOrHeight: 512,   
        useWebWorker: true,      
      }

      const compressedFile = await imageCompression(file, options);
      const previewUrl = URL.createObjectURL(compressedFile);
      
      handleChange("avatarUrl", previewUrl);
      setSelectedFile(compressedFile); 
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

      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append("file", selectedFile);

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: fileFormData });
        const uploadJson = await uploadRes.json();
        
        if (!uploadRes.ok) throw new Error(uploadJson.message);
        finalAvatarUrl = uploadJson.data.url; 
      }

      if (originalData?.avatarUrl && originalData.avatarUrl !== finalAvatarUrl) {
        await fetch(`/api/upload?url=${encodeURIComponent(originalData.avatarUrl)}`, { 
          method: 'DELETE' 
        });
      }

      const payload = { ...formData, avatarUrl: finalAvatarUrl };
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      
      if (json.status === 'success') {
        const updatedData = {
          ...formData,
          avatarUrl: finalAvatarUrl,
          lastUpdated: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
        };
        
        setOriginalData(updatedData); 
        setFormData(updatedData);     
        setSelectedFile(null);        
        
        // 🔥 FIX 1: Refresh halaman Server Components (Tabel, dsb) secara instan tanpa layar putih
        router.refresh();

        // 🔥 FIX 2: Tembakkan Custom Event agar Sidebar membaca cookie baru
        window.dispatchEvent(new Event('profile-updated'));

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
    getInitials, // 🔥 Fungsi ini dikembalikan agar bisa tetap dipakai oleh form profil
    handleChange, handleSave, handleRemoveAvatar, handleUndoAvatar,
    handleFileChange,
    fileInputRef,       
    handleUploadClick   
  }
}