"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pencil,
  Trash2,
  User as UserIcon,
  Droplets,
  CheckCircle2,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CoreTable } from "@/components/dashboard/directory/core-table"
import { GenericCreateDialog } from "@/components/dashboard/directory/dialog/create"
import { GenericEditDialog } from "@/components/dashboard/directory/dialog/edit"
import { GenericDeleteDialog } from "@/components/dashboard/directory/dialog/delete"
import { ImportDialog } from "@/components/dashboard/directory/dialog/import"

import { useStudents, StudentWithStatus } from "@/hooks/directory/use-students"
import { useDashboard } from "@/contexts/cont-dashboard"

export default function StudentsPage() {
  const {
    data,
    isLoading,
    studentFields, 
    openCreate,
    setOpenCreate,
    openImport,
    setOpenImport,
    editData,
    setEditData,
    deleteData,
    setDeleteData,
    refreshData, 
  } = useStudents()

  const { activeRole, isReady } = useDashboard()
  const isReadOnly = activeRole.plan === "Read-Only"

  React.useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto"
      document.body.style.overflow = "auto"
      document.body.removeAttribute("data-scroll-locked")
    }
  }, [])

  const columns = React.useMemo<ColumnDef<StudentWithStatus>[]>(() => [
    {
      id: "profile",
      meta: { className: "w-[50px] pr-0 pl-6" },
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Avatar className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-transparent">
            <AvatarImage src="" />
            <AvatarFallback className="bg-transparent text-[10px] font-bold text-pink-400">
              {row.original.full_name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      accessorKey: "full_name", 
      header: "Students Name",
      meta: { className: "pl-3 text-left min-w-[150px]" },
      cell: ({ row }) => (
        <span className="text-sm tracking-tight text-white">
          {row.original.full_name}
        </span>
      ),
    },
    {
      accessorKey: "icode",
      header: "ID Code",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="border-white/10 font-mono text-[10px] tracking-wider text-white/50"
          >
            {row.original.icode || "-"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "nis",
      header: "NIS",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className="border-white/10 bg-white/5 font-mono text-[10px] text-gray-400"
          >
            {row.original.nis || "-"}
          </Badge>
        </div>
      ),
    },
    {
      accessorFn: (row) => {
        const cls = row.tbl_classes as any;
        if (!cls) return "No Class";
        // Gabungkan 10 + MIPA 1 untuk fitur Search
        return `${cls.grade_level || ''} ${cls.class_name || ''}`.trim();
      }, 
      id: "class_name", 
      header: "Class",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => {
        const cls = row.original.tbl_classes as any;
        
        // Merakit text untuk ditampilkan di Badge
        const displayText = cls 
          ? `${cls.grade_level || ''} ${cls.class_name || ''}`.trim() 
          : "No Class";

        return (
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/5 text-[10px] font-bold tracking-tight text-gray-400"
            >
              {displayText}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "status",
      header: "Status",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => {
        const isHaid = row.original.is_menstruating
        return (
          <div className="flex justify-center">
            {isHaid ? (
              <Badge className="h-6 gap-1.5 border-pink-500/20 bg-pink-500/10 pr-2.5 pl-1.5 text-pink-500 transition-colors hover:bg-pink-500/20">
                <Droplets className="h-3 w-3 fill-pink-500/20" />
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  Haid: Day {row.original.menstruation_day}
                </span>
              </Badge>
            ) : (
              <Badge className="h-6 gap-1.5 border-emerald-500/20 bg-emerald-500/10 pr-2.5 pl-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  Sholat
                </span>
              </Badge>
            )}
          </div>
        )
      },
    },
    ...((isReadOnly
      ? []
      : [
          {
            id: "actions",
            header: "Action",
            meta: { className: "text-center px-4 w-[120px]" },
            cell: ({ row }: { row: any }) => (
              <TooltipProvider delayDuration={0}>
                <div className="flex justify-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-indigo-400"
                        onClick={() =>
                          console.log("Profile", row.original.full_name)
                        }
                      >
                        <UserIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="border-white/10 bg-black text-[10px] text-indigo-400">
                      View Profile
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-blue-400"
                        onClick={() => setEditData(row.original)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="border-white/10 bg-black text-[10px] text-blue-400">
                      Edit Data
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-red-400"
                        onClick={() => setDeleteData(row.original)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="border-white/10 bg-black text-[10px] text-red-400">
                      Delete
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            ),
          },
        ]) as ColumnDef<StudentWithStatus>[]),
  ], [isReadOnly, setEditData, setDeleteData]);

  if (!isReady) return null

  return (
    <CoreTable
      title="Student Directory"
      description="Manage student records, academic profiles, and class placements."
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Search by name, nis, or class..."
      onCreate={!isReadOnly ? () => setOpenCreate(true) : undefined}
      onImport={!isReadOnly ? () => setOpenImport(true) : undefined}
    >
      <GenericCreateDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        title="Add New Student"
        endpoint="/api/student" 
        fields={studentFields} 
        onSuccess={refreshData} 
      />
      <ImportDialog open={openImport} onOpenChangeAction={setOpenImport} />

      {editData && (
        <GenericEditDialog
          open={!!editData}
          onOpenChange={(open) => !open && setEditData(null)}
          title="Edit Student Data"
          endpoint="/api/student" 
          initialData={editData as unknown as Record<string, unknown>}
          idField="id_student" 
          fields={studentFields} 
          onSuccess={refreshData} 
        />
      )}

      {deleteData && (
        <GenericDeleteDialog
          open={!!deleteData}
          onOpenChange={(open) => !open && setDeleteData(null)}
          title="Delete Student"
          description={
            <span>
              Are you sure?{" "}
              <b className="text-white">{deleteData.full_name}</b> will be
              deleted.
            </span>
          }
          endpoint="/api/student" 
          id={deleteData.id_student} 
          itemName={deleteData.full_name} 
          onSuccess={refreshData} 
        />
      )}
    </CoreTable>
  )
}