"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Users, AlertTriangle, Activity } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { CoreTable } from "@/components/dashboard/directory/core-table"
import {
  GenericCreateDialog,
  FieldConfig,
} from "@/components/dashboard/directory/dialog/create"
import { GenericEditDialog } from "@/components/dashboard/directory/dialog/edit"
import { GenericDeleteDialog } from "@/components/dashboard/directory/dialog/delete"

import { useClasses, ClassWithMetrics } from "@/hooks/directory/use-classes"
import { useDashboard } from "@/contexts/cont-dashboard"

const classFields: FieldConfig[] = [
  {
    name: "class_name", 
    label: "Class Name",
    type: "text",
    placeholder: "Example: X RPL 1",
    required: true,
  },
  {
    name: "advisor",
    label: "Homeroom Teacher",
    type: "text",
    placeholder: "Teacher's Name",
    required: true, 
  },
]

export default function ClassesPage() {
  const {
    data,
    isLoading,
    openCreate,
    setOpenCreate,
    editData,
    setEditData,
    deleteData,
    setDeleteData,
    refreshData, // 🔥 AMBIL FUNGSI PENYEGAR DARI HOOK
  } = useClasses()
  const { activeRole, isReady } = useDashboard()

  const isReadOnly = activeRole.plan === "Read-Only"

  React.useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "auto"
      document.body.style.overflow = "auto"
      document.body.removeAttribute("data-scroll-locked")
    }
  }, [])

  const columns = React.useMemo<ColumnDef<ClassWithMetrics>[]>(() => [
    {
      id: "profile",
      meta: { className: "w-[50px] pr-0 pl-6" },
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Avatar className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-transparent">
            <AvatarImage src="" />
            <AvatarFallback className="bg-transparent text-[10px] font-bold text-gray-500">
              {row.original.class_name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      accessorFn: (row) => `${row.class_name} ${row.advisor || ""}`, 
      id: "class_name",
      header: "Class Name",
      meta: { className: "pl-3 text-left min-w-[120px]" },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium tracking-tight text-white">
            {row.original.class_name}
          </span>
          <span className="text-[10px] text-gray-500">
            {row.original.advisor || "No Teacher"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "total_students",
      header: "Students",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5 text-gray-300">
          <Users className="h-3.5 w-3.5 text-gray-500" />
          <span className="font-mono text-xs font-bold">
            {row.original.total_students || 0}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "active_period",
      header: "Period",
      meta: { className: "text-center px-2" },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge
            variant="outline"
            className={cn(
              "h-6 gap-1 border-pink-500/20 bg-pink-500/10 px-2 text-[10px] text-pink-400",
              row.original.active_period === 0 &&
                "border-white/10 opacity-30 grayscale"
            )}
          >
            <Activity className="h-3 w-3" />
            {row.original.active_period || 0}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "health_status",
      header: "Discipline",
      meta: { className: "text-center px-4" },
      cell: ({ row }) => {
        const status = row.original.health_status || "Excellent"
        let color = "bg-green-500/10 text-green-500 border-green-500/20"
        if (status === "Good")
          color = "bg-blue-500/10 text-blue-500 border-blue-500/20"
        if (status === "Attention")
          color = "bg-amber-500/10 text-amber-500 border-amber-500/20"
        if (status === "Critical")
          color = "bg-red-500/10 text-red-500 border-red-500/20"
        return (
          <div className="flex justify-center">
            <Badge
              className={cn(
                "rounded-md border text-[10px] font-bold tracking-wider uppercase",
                color
              )}
            >
              {status}
            </Badge>
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
            meta: { className: "text-center px-4 w-[100px]" },
            cell: ({ row }: { row: any }) => (
              <TooltipProvider delayDuration={0}>
                <div className="flex justify-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400"
                        onClick={() => setEditData(row.original)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="border-white/10 bg-black text-[10px] text-blue-400">
                      Edit Class
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
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
        ]) as ColumnDef<ClassWithMetrics>[]),
  ], [isReadOnly, setEditData, setDeleteData]);

  if (!isReady) return null

  return (
    <>
      <CoreTable
        title="Class Directory"
        description="Manage class assignments, homeroom teachers, and student distribution."
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchPlaceholder="Search by class or teacher..."
        onCreate={!isReadOnly ? () => setOpenCreate(true) : undefined}
      >
        <GenericCreateDialog
          open={openCreate}
          onOpenChange={setOpenCreate}
          title="Create New Class"
          endpoint="/api/class"
          fields={classFields}
          onSuccess={refreshData} // 🔥 SUNTIKKAN KE SINI
        />

        {editData && (
          <GenericEditDialog
            open={!!editData}
            onOpenChange={(open) => !open && setEditData(null)}
            title="Edit Class Data"
            endpoint="/api/class"
            initialData={editData as unknown as Record<string, unknown>}
            idField="id_class" 
            fields={classFields}
            onSuccess={refreshData} // 🔥 SUNTIKKAN KE SINI
          />
        )}

        {deleteData && (
          <GenericDeleteDialog
            open={!!deleteData}
            onOpenChange={(open) => !open && setDeleteData(null)}
            title="Delete Class & Students"
            description={
              <div className="space-y-2">
                <p>
                  Are you sure you want to delete{" "}
                  <b className="text-white">{deleteData.class_name}</b>?
                </p>
                <div className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <b>WARNING:</b> This action will also permanently delete{" "}
                    <b className="mx-1 text-white underline">
                      {deleteData.total_students || 0} student records
                    </b>
                    .
                  </span>
                </div>
              </div>
            }
            endpoint="/api/class"
            itemName={deleteData.class_name}
            id={deleteData.id_class || 0}
            onSuccess={refreshData} // 🔥 SUNTIKKAN KE SINI
          />
        )}
      </CoreTable>
    </>
  )
}