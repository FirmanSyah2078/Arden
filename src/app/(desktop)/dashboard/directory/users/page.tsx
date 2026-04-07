"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ShieldCheck,
  Circle,
  Pencil,
  Trash2,
  KeyRound,
  UserCog,
  UserCheck,
  UserX,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { User } from "@/types/api"

import { CoreTable } from "@/components/dashboard/directory/core-table"
import { GenericCreateDialog } from "@/components/dashboard/directory/dialog/create"
import { GenericEditDialog } from "@/components/dashboard/directory/dialog/edit"
import { GenericDeleteDialog } from "@/components/dashboard/directory/dialog/delete"
import { ResetPasswordDialog } from "@/components/dashboard/directory/dialog/reset"

import { useUsers } from "@/hooks/directory/use-users"
import { useDashboard } from "@/contexts/cont-dashboard"

export default function UsersPage() {
  const {
    data,
    currentUser,
    isLoading,
    createFields,
    editFields,
    openCreate,
    setOpenCreate,
    editUser,
    setEditUser,
    deleteUser,
    setDeleteUser,
    resetUser,
    setResetUser,
    refreshData, 
  } = useUsers()

  const { activeRole, isReady } = useDashboard()
  const isReadOnly = activeRole.plan === "Read-Only"

  React.useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto"
      document.body.style.overflow = "auto"
      document.body.removeAttribute("data-scroll-locked")
    }
  }, [])

  const uniformBadgeClass =
    "gap-1.5 border-white/5 bg-[#121212] hover:bg-[#1a1a1a] text-[10px] font-semibold text-gray-300 py-1 transition-colors"

  // 🔥 FIX: Wajib dibungkus useMemo agar Search berfungsi & animasi sel tidak ngaco!
  const columns = React.useMemo<ColumnDef<User>[]>(() => [
    {
      id: "profile",
      meta: { className: "w-[50px] pr-0 pl-6" }, 
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Avatar className="h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-transparent">
            <AvatarImage
              src={row.original.photo_url || ""}
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="flex items-center justify-center bg-transparent text-[10px] font-normal text-gray-500">
              {row.original.name.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      meta: { className: "pl-3 text-left min-w-[180px]" }, 
      cell: ({ row }) => (
        <span className="text-sm font-medium tracking-tight text-white">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      meta: { className: "text-left px-4" },
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium tracking-tight text-gray-500">
          @{row.original.username}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      meta: { className: "text-center px-4" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className={uniformBadgeClass}>
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            {row.original.role}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Account",
      meta: { className: "text-center px-4" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className={uniformBadgeClass}>
            {row.original.is_active ? (
              <>
                <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> ACTIVE
              </>
            ) : (
              <>
                <UserX className="h-3.5 w-3.5 text-red-500" /> RESTRICTED
              </>
            )}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "is_online",
      header: "Presence",
      meta: { className: "text-center px-4" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className={uniformBadgeClass}>
            <Circle
              className={cn(
                "h-2.5 w-2.5 fill-current",
                row.original.is_online
                  ? "animate-pulse text-emerald-500"
                  : "text-gray-600"
              )}
            />
            {row.original.is_online ? "ONLINE" : "OFFLINE"}
          </Badge>
        </div>
      ),
    },
    ...((isReadOnly
      ? []
      : [
          {
            id: "actions",
            header: "Action",
            meta: { className: "text-center px-4 w-[140px]" },
            cell: ({ row }: { row: any }) => {
              const targetUser = row.original
              const isSelf = currentUser?.username === targetUser.username
              const isPeerAdmin =
                currentUser?.role === "Admin" && targetUser.role === "Admin"

              if (isSelf) {
                return (
                  // 🔥 FIX: Animasi ledakan dibuang. Cukup Glowing saja!
                  <div className="flex justify-center">
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-indigo-500/30 bg-indigo-500/10 px-2 py-1 text-[10px] text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]"
                    >
                      <UserCog className="h-3.5 w-3.5" /> YOUR ACCOUNT
                    </Badge>
                  </div>
                )
              }

              const disableEditDelete = isPeerAdmin

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
                          className={cn(
                            "h-8 w-8",
                            disableEditDelete
                              ? "cursor-not-allowed text-gray-600 opacity-30"
                              : "text-gray-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="border-white/10 bg-black text-[10px] text-white">
                        {disableEditDelete
                          ? "Cannot edit fellow Admin"
                          : "Edit User"}
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
                      <TooltipContent className="border-white/10 bg-black text-[10px] text-white">
                        Reset Password
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={disableEditDelete}
                          onClick={() => setDeleteUser(targetUser)}
                          className={cn(
                            "h-8 w-8",
                            disableEditDelete
                              ? "cursor-not-allowed text-gray-600 opacity-30"
                              : "text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="border-white/10 bg-black text-[10px] text-white">
                        {disableEditDelete
                          ? "Cannot delete fellow Admin"
                          : "Delete User"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
              )
            },
          },
        ]) as ColumnDef<User>[]),
  ], [currentUser, isReadOnly, setEditUser, setDeleteUser, setResetUser]); // Dependensi

  if (!isReady) return null

  return (
    <>
      <CoreTable
        title="User Directory"
        description="Manage system accounts, user roles, and access privileges."
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchPlaceholder="Search by name or username..."
        onCreate={!isReadOnly ? () => setOpenCreate(true) : undefined}
      >
        <GenericCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          title="Register New User"
          endpoint="/api/user"
          fields={createFields}
          onSuccess={refreshData} 
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
            onSuccess={refreshData} 
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
            description={
              <span>
                Are you sure? This will permanently delete{" "}
                <b>{deleteUser.name}</b>.
              </span>
            }
            endpoint="/api/user"
            id={deleteUser.id_user}
            onSuccess={refreshData} 
          />
        )}
      </CoreTable>
    </>
  )
}