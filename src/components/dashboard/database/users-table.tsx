"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// 🔥 IMPORT ICON TAMBAHAN UNTUK BADGE
import { ShieldCheck, Circle, Pencil, Trash2, KeyRound, UserCog, UserCheck, UserX } from "lucide-react"
import { cn } from "@/lib/utils"
import { User } from "@/types/api"

// --- GLOBAL ENGINE ---
import { DataTable } from "@/components/data-table/data-table"

// --- SMART DIALOGS ---
import { GenericCreateDialog, FieldConfig } from "./ui/create-dialog"
import { GenericEditDialog } from "./ui/edit-dialog"
import { GenericDeleteDialog } from "./ui/delete-dialog"
import { ResetPasswordDialog } from "./ui/reset-dialog" 

export function UsersDataTable({ data }: { data: User[] }) {
  const [openCreate, setOpenCreate] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [resetUser, setResetUser] = useState<User | null>(null)
  
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    fetch("/api/user/me", { cache: "no-store" })
      .then(res => res.json())
      .then(res => { 
        if (res.status === 'success') setCurrentUser(res.data) 
      })
      .catch(err => console.error("Error fetching me:", err))
  }, [])

  // --- CONFIG FIELDS ---
  const createFields: FieldConfig[] = [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "username", label: "Username", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { 
      name: "role", label: "Role", type: "select", 
      options: [{label:"Admin", value:"Admin"}, {label:"Pemantau", value:"Pemantau"}, {label:"Pelaksana", value:"Pelaksana"}] 
    }
  ]

  const editFields: FieldConfig[] = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "username", label: "Username", type: "text", readOnly: true },
    { 
      name: "role", label: "Role", type: "select", 
      options: [{label:"Admin", value:"Admin"}, {label:"Pemantau", value:"Pemantau"}, {label:"Pelaksana", value:"Pelaksana"}] 
    },
    {
      name: "is_active", label: "Account Status", type: "select",
      options: [{label:"Active", value:"true"}, {label:"Restricted / Banned", value:"false"}]
    }
  ]

  // --- STYLE UNTUK BADGE GLOBAL (Agar Seragam) ---
  const uniformBadgeClass = "gap-1.5 border-white/5 bg-[#121212] hover:bg-[#1a1a1a] text-[10px] font-semibold text-gray-300 py-1 transition-colors"

  // --- COLUMNS ---
  const columns: ColumnDef<User>[] = [
    // 1. PROFILE (Tetap tidak diubah, nyatu dengan Name)
    {
      id: "profile",
      meta: { className: "w-[50px] pr-0 pl-6" },
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Avatar className="h-9 w-9 border border-white/10 rounded-lg bg-transparent">
            <AvatarImage src={row.original.foto_url || ""} />
            <AvatarFallback className="bg-transparent text-[10px] font-bold text-gray-500">
              {row.original.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    // 2. NAME (Dibiarkan elastis untuk menyerap sisa layar)
    {
      accessorKey: "name",
      id: "Name",
      header: "Name",
      meta: { className: "pl-3 text-left min-w-[180px]" }, 
      cell: ({ row }) => (
        <span className="text-sm text-white tracking-tight font-medium">{row.original.name}</span>
      ),
    },
    // 3. USERNAME (Dikunci di 140px agar tidak terlalu lebar)
    {
      accessorKey: "username",
      id: "Username",
      header: "Username",
      meta: { className: "text-left px-4 w-[140px]" }, 
      cell: ({ row }) => (
        <span className="text-xs text-gray-500 font-mono font-medium tracking-tight">@{row.original.username}</span>
      ),
    },
    // 4. ROLE (Dikunci di 130px)
    {
      accessorKey: "role",
      id: "Role",
      header: "Role",
      meta: { className: "text-center px-4 w-[130px]" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className={uniformBadgeClass}>
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            {row.original.role}
          </Badge>
        </div>
      ),
    },
    // 5. ACCOUNT (Dikunci di 140px)
    {
      accessorKey: "is_active", 
      id: "Account",            
      header: "Account",
      meta: { className: "text-center px-4 w-[140px]" },
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <div className="flex justify-center">
            <Badge variant="outline" className={uniformBadgeClass}>
              {isActive ? (
                <><UserCheck className="h-3.5 w-3.5 text-emerald-500" /> ACTIVE</>
              ) : (
                <><UserX className="h-3.5 w-3.5 text-red-500" /> RESTRICTED</>
              )}
            </Badge>
          </div>
        )
      },
    },
    // 6. PRESENCE (Dikunci di 130px)
    {
      accessorKey: "is_online",
      id: "Presence",
      header: "Presence",
      meta: { className: "text-center px-4 w-[130px]" },
      cell: ({ row }) => {
        const isOnline = row.original.is_online;
        return (
          <div className="flex justify-center">
            <Badge variant="outline" className={uniformBadgeClass}>
              <Circle className={cn("h-2.5 w-2.5 fill-current", isOnline ? "text-emerald-500 animate-pulse" : "text-gray-600")} />
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Badge>
          </div>
        )
      },
    },
    // 7. ACTIONS (Dikunci di 140px agar icon tidak dempet)
    {
      id: "actions",
      header: "Action",
      meta: { className: "text-center px-4 w-[140px]" },
      cell: ({ row }) => {
        const targetUser = row.original;
        
        const isSelf = currentUser?.username === targetUser.username;
        const isPeerAdmin = currentUser?.role === 'Admin' && targetUser.role === 'Admin';

        if (isSelf) {
          return (
            <div className="flex justify-center">
               <Badge variant="outline" className="bg-[#121212] text-indigo-400 border-white/5 text-[10px] px-2 py-1 gap-1.5 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                  <UserCog className="w-3.5 h-3.5" /> YOUR ACCOUNT
               </Badge>
            </div>
          )
        }

        const disableEditDelete = isPeerAdmin; 

        return (
          <TooltipProvider delayDuration={0}>
            <div className="flex justify-center gap-1">
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={disableEditDelete}
                    onClick={() => setEditUser(targetUser)} 
                    className={cn("h-8 w-8", disableEditDelete ? "opacity-30 cursor-not-allowed text-gray-600" : "text-gray-400 hover:bg-white/5 hover:text-white")}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black border-white/10 text-white text-[10px]">
                  {disableEditDelete ? "Cannot edit fellow Admin" : "Edit User"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setResetUser(targetUser)} 
                    className="h-8 w-8 text-gray-400 hover:bg-amber-500/10 hover:text-amber-400"
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black border-white/10 text-white text-[10px]">Reset Password</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={disableEditDelete}
                    onClick={() => setDeleteUser(targetUser)} 
                    className={cn("h-8 w-8", disableEditDelete ? "opacity-30 cursor-not-allowed text-gray-600" : "text-gray-400 hover:bg-red-500/10 hover:text-red-400")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black border-white/10 text-white text-[10px]">
                  {disableEditDelete ? "Cannot delete fellow Admin" : "Delete User"}
                </TooltipContent>
              </Tooltip>

            </div>
          </TooltipProvider>
        )
      },
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        title="User Management"
        description="Kelola akun, role, dan hak akses pengguna sistem."
        searchPlaceholder="Cari nama atau username..."
        onCreate={() => setOpenCreate(true)}
      />

      <GenericCreateDialog 
        open={openCreate} 
        onOpenChange={setOpenCreate}
        title="Register New User"
        endpoint="/api/user"
        fields={createFields}
      />

      {editUser && (
        <GenericEditDialog 
          open={!!editUser} 
          onOpenChange={(open) => !open && setEditUser(null)} 
          title="Edit User Data"
          endpoint="/api/user"
          initialData={editUser as unknown as Record<string, unknown>}
          idField="id_user"
          fields={editFields}
        />
      )}
      
      {resetUser && (
        <ResetPasswordDialog 
          open={!!resetUser} 
          user={resetUser} 
          onOpenChange={(open) => !open && setResetUser(null)} 
        />
      )}
      
      {deleteUser && (
        <GenericDeleteDialog 
          open={!!deleteUser}
          onOpenChange={(open) => !open && setDeleteUser(null)}
          title="Delete User"
          itemName={deleteUser.name} 
          description={<span>Are you sure? This will permanently delete <b>{deleteUser.name}</b>.</span>}
          endpoint="/api/user" 
          id={deleteUser.id_user}
        />
      )}
    </>
  )
}