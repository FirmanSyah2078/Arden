import {getInitials} from '@/lib/utils';
import imageCompression from 'browser-image-compression';
import {useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react'
import {toast} from 'sonner';

export interface UserProfileData {
  avatarUrl: string|null;
  name: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  lastUpdated: string;
}

export function useProfile() {
  const router = useRouter();
  const [originalData, setOriginalData] = useState<UserProfileData|null>(null)
  const [formData, setFormData] = useState<UserProfileData>({
    avatarUrl: null,
    name: '',
    username: '',
    email: '',
    role: '',
    createdAt: '-',
    lastUpdated: '-',
  })

  const defaultProfile: UserProfileData = {
    avatarUrl: null,
    name: 'User',
    username: 'user',
    email: '',
    role: 'User',
    createdAt: '-',
    lastUpdated: '-',
  }

  const profile = formData || defaultProfile;

  const [selectedFile, setSelectedFile] = useState<File|null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange =
      <K extends keyof UserProfileData>(
          field: K, value: UserProfileData[K]) => {
        setFormData(prev => ({...prev, [field]: value}));
      }

  const handleFileChange =
      async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
          'File size is too large!',
          {description: 'Maximum 5MB allowed.', position: 'top-center'});
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

      handleChange('avatarUrl', previewUrl);
      setSelectedFile(compressedFile);
    } catch (error) {
      console.error('Image compression failed:', error);
      toast.error('Image compression failed', {position: 'top-center'});
    }
  }

  const handleRemoveAvatar =
      () => {
        handleChange('avatarUrl', null);
        setSelectedFile(null);
      }

  const handleUndoAvatar =
      () => {
        if (originalData) {
          handleChange('avatarUrl', originalData.avatarUrl);
          setSelectedFile(null);
        }
      }

  const resetForm =
      () => {
        if (originalData) {
          setFormData(originalData);
          setSelectedFile(null);
        }
      }

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await fetch('/api/user/me');

        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }

        const json = await res.json();

        if (json.status === 'success' && json.data) {
          const dbData = json.data;

          let lastLoginStr = '-';
          if (dbData.last_login) {
            const ll = new Date(dbData.last_login);
            if (!isNaN(ll.getTime()))
              lastLoginStr = ll.toLocaleString(
                  'en-US', {dateStyle: 'medium', timeStyle: 'short'});
          }

          let createdAtStr = '-';
          if (dbData.created_at) {
            const ca = new Date(dbData.created_at);
            if (!isNaN(ca.getTime()))
              createdAtStr =
                  ca.toLocaleString('en-US', {month: 'short', year: 'numeric'});
          }

          const initialData: UserProfileData = {
            avatarUrl: dbData.photo_url || null,
            name: dbData.name,
            username: dbData.username,
            email: '',
            role: dbData.role || 'Unknown',
            createdAt: createdAtStr,
            lastUpdated: lastLoginStr
          };

          setOriginalData(initialData);
          setFormData(initialData);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyProfile();
  }, []);

  const handleSave =
      async () => {
    setIsSubmitting(true)
    try {
      let finalAvatarUrl = formData.avatarUrl;

      if (selectedFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', selectedFile);

        const uploadRes =
            await fetch('/api/upload', {method: 'POST', body: fileFormData});

        if (uploadRes.status === 401) {
          window.location.href = '/login';
          return;
        }

        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.message);
        finalAvatarUrl = uploadJson.data.url;
      }

      const payload = {...formData, photo_url: finalAvatarUrl};
      const res = await fetch('/api/user/me', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }

      const json = await res.json();

      if (json.status === 'success') {
        // ONLY DELETE OLD AVATAR AFTER DB UPDATE SUCCESS
        if (originalData?.avatarUrl &&
            originalData.avatarUrl !== finalAvatarUrl) {
          await fetch(
              `/api/upload?url=${encodeURIComponent(originalData.avatarUrl)}`,
              {method: 'DELETE'})
              .catch(
                  e => console.error(
                      'Failed to delete old avatar, but profile updated:', e));
        }

        const updatedData = {
          ...formData,
          avatarUrl: finalAvatarUrl,
          lastUpdated: new Date().toLocaleString(
              'en-US', {dateStyle: 'medium', timeStyle: 'short'})
        };

        setOriginalData(updatedData);
        setFormData(updatedData);
        setSelectedFile(null);

        router.refresh();
        window.dispatchEvent(new Event('profile-updated'));
        toast.success('Profil berhasil diperbarui', {
          description: 'Data akun Anda telah tersinkronisasi.',
          position: 'top-center'
        });

      } else {
        toast.error(
            'Gagal memperbarui profil',
            {description: json.message, position: 'top-center'});
      }
    } catch (error: any) {
      toast.error('Gagal memperbarui profil', {
        description: error.message || 'Terjadi kesalahan jaringan.',
        position: 'top-center'
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  const isDirty =
      (originalData ? (formData.name !== originalData.name ||
                       formData.username !== originalData.username ||
                       formData.email !== originalData.email ||
                       formData.avatarUrl !== originalData.avatarUrl) :
                      false) ||
      selectedFile !== null;

  const hasOriginalAvatar = originalData?.avatarUrl != null;
  const isAvatarRemoved = hasOriginalAvatar && formData.avatarUrl === null;
  const isSaveDisabled =
      isSubmitting || !isDirty || !formData.name || !formData.username;

  return {
    formData, profile, originalData, isLoading, isSubmitting, isSaveDisabled,
        isDirty, isAvatarRemoved, hasOriginalAvatar, getInitials, handleChange,
        handleSave, handleRemoveAvatar, handleUndoAvatar, resetForm,
        handleFileChange, fileInputRef, handleUploadClick
  }
}