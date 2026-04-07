import { useState, useEffect, useMemo, useCallback } from "react"
import { User } from "@/types/api"
import { FieldConfig } from "@/components/dashboard/directory/dialog/create"

export function useUsers() {
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [openCreate, setOpenCreate] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [resetUser, setResetUser] = useState<User | null>(null)

  const fetchUsersAndMe = useCallback(async () => {
    setIsLoading(true);
    try {
      const [usersRes, meRes] = await Promise.all([
        fetch("/api/user").then(res => res.json()),
        fetch("/api/user/me", { cache: "no-store" }).then(res => res.json())
      ]);

      let fetchedUsers: User[] = usersRes.status === 'success' ? usersRes.data : [];
      const me: User | null = meRes.status === 'success' ? meRes.data : null;

      if (me) setCurrentUser(me);

      const roleWeight: Record<string, number> = {
        'Admin': 1,
        'Pemantau': 2,
        'Pelaksana': 3
      };

      fetchedUsers.sort((a, b) => {
        if (me && a.username === me.username) return -1;
        if (me && b.username === me.username) return 1;

        const weightA = roleWeight[a.role] || 99;
        const weightB = roleWeight[b.role] || 99;

        if (weightA !== weightB) {
          return weightA - weightB;
        }
        return a.name.localeCompare(b.name);
      });

      setData(fetchedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersAndMe();
    const handleProfileUpdate = () => {
      fetchUsersAndMe();
    };

    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('profile-updated', handleProfileUpdate);
  }, [fetchUsersAndMe]);

  // 🔥 FIX 1: Tambah required:true ke role. Tambah halfWidth agar password & role bersebelahan
  const createFields: FieldConfig[] = useMemo(() => [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "username", label: "Username", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true, halfWidth: true },
    { 
      name: "role", label: "Role", type: "select", required: true, halfWidth: true,
      options: [{label:"Admin", value:"Admin"}, {label:"Pemantau", value:"Pemantau"}, {label:"Pelaksana", value:"Pelaksana"}] 
    }
  ], [])

  // 🔥 FIX 2: Hapus readOnly di username, ubah label is_active jadi Status, kasih halfWidth
  const editFields: FieldConfig[] = useMemo(() => [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "username", label: "Username", type: "text", required: true }, // readOnly dihapus
    { 
      name: "role", label: "Role", type: "select", required: true, halfWidth: true,
      options: [{label:"Admin", value:"Admin"}, {label:"Pemantau", value:"Pemantau"}, {label:"Pelaksana", value:"Pelaksana"}] 
    },
    {
      name: "is_active", label: "Status", type: "select", required: true, halfWidth: true,
      options: [{label:"Active", value:"true"}, {label:"Restricted / Banned", value:"false"}]
    }
  ], [])

  return {
    data, currentUser, isLoading,
    createFields, editFields,
    openCreate, setOpenCreate,
    editUser, setEditUser,
    deleteUser, setDeleteUser,
    resetUser, setResetUser,
    refreshData: fetchUsersAndMe 
  }
}