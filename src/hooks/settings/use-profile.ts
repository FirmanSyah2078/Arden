import { useState, useEffect, useRef } from "react"

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
  
  // State untuk menyimpan file fisik asli
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 🔥 Logika DOM (Jembatan Input File)
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

  // Fungsi untuk menangani pemilihan file & membuat Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi Ukuran Maksimal 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar! Maksimal 2MB.");
      return;
    }

    // Buat URL bayangan (Preview Lokal)
    const previewUrl = URL.createObjectURL(file);
    handleChange("avatarUrl", previewUrl);
    setSelectedFile(file); // Simpan file fisiknya untuk di-upload nanti
  }

  const handleRemoveAvatar = () => {
    handleChange("avatarUrl", null); 
    setSelectedFile(null); // Hapus file dari antrean
  }

  const handleUndoAvatar = () => {
    if (originalData) {
      handleChange("avatarUrl", originalData.avatarUrl);
      setSelectedFile(null); // Hapus file dari antrean
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

      // Jika ada file fisik, siap-siap upload ke Supabase Storage
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

      // Simpan seluruh data ke Database Prisma
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
    fileInputRef,       // Lemparkan jembatan ref ke UI
    handleUploadClick   // Lemparkan fungsi klik ke UI
  }
}