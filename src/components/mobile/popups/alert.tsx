"use client"

import { useEffect, useState } from "react"
import { Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAttendance } from "@/hooks/mobile/use-attendance"

import { formatTime } from "@/lib/date"
import { AttendanceStatusResponse, DailyPrayer } from "@/types/api"

interface AlertProps {
  isOpen: boolean
  absensiStatus: AttendanceStatusResponse | undefined
  setOpen: (value: boolean) => void
  onScanUlang?: () => void
  sholatTime?: string
  initialStatus?: "idle" | "success"
}

export function Alert({
  isOpen,
  absensiStatus,
  setOpen,
  onScanUlang,
  sholatTime = "Dhuhr",
  initialStatus = "idle",
}: AlertProps) {
  const [processStatus, setProcessStatus] = useState<
    "idle" | "success" | "error" | "pending"
  >(initialStatus)
  const [errorMessage, setErrorMessage] = useState("")
  const [scanTime, setScanTime] = useState("")
  const [gatekeeperStatus, setGatekeeperStatus] = useState("")

  const { submitAttendance } = useAttendance()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setScanTime(formatTime(new Date()))
      setErrorMessage("")
      setGatekeeperStatus("")
      setProcessStatus(initialStatus || "idle")
      setIsSubmitting(false)
    }
  }, [isOpen, initialStatus])

  const handleProcess = async () => {
    if (!absensiStatus?.id) return
    setErrorMessage("")

    try {
      setIsSubmitting(true)
      const isManual = absensiStatus.message === "Manual Entry"
      const payload = {
        id_student: parseInt(absensiStatus.id),
        student_name: absensiStatus.full_name,
        student_nis: absensiStatus.nis,
        class_name: absensiStatus.class_name,
        time: sholatTime,
        status: absensiStatus.icode || "Pure",
        method: isManual ? "Manual" : "Scan QR",
        remarks: isManual ? absensiStatus.remarks : "",
        date: new Date(),
      }

      const response = await submitAttendance(payload)
      if (response.status === "success") {
        setProcessStatus("success")
        setGatekeeperStatus(response.data?._gatekeeperStatus || "")
      } else if (response.status === "queued") {
        setProcessStatus("pending")
        setGatekeeperStatus("Pending sync")
      } else {
        setProcessStatus("error")
        setGatekeeperStatus("")

        // --- AGGRESSIVE HUMANIZER: No technical leaks allowed ---
        const responseText =
          typeof response === "string" ? response : JSON.stringify(response)

        const normalizedError = responseText.toLowerCase()
        let friendlyMessage = "Failed to process attendance. Please try again."

        if (normalizedError.includes("already checked in")) {
          friendlyMessage = "This student has already checked in for today."
        } else if (
          normalizedError.includes("qr scanner is closed") ||
          normalizedError.includes("proceed with manual")
        ) {
          friendlyMessage =
            "QR is closed (past +20 mins). Use Manual input instead."
        } else if (normalizedError.includes("permanently closed")) {
          friendlyMessage = "This session is now closed (past +60 mins)."
        } else if (normalizedError.includes("has not started")) {
          friendlyMessage =
            "This session has not started yet. Please wait until the scheduled time."
        } else if (
          normalizedError.includes("schedule cache") ||
          normalizedError.includes("run sync")
        ) {
          friendlyMessage =
            "Today's schedule is not ready. Please contact the admin."
        } else if (
          normalizedError.includes("not active for today") ||
          normalizedError.includes("offline today")
        ) {
          friendlyMessage = "No attendance tracking for this session today."
        } else if (normalizedError.includes("invalid prayer session")) {
          friendlyMessage = "Invalid prayer session selected."
        } else if (
          normalizedError.includes("invalid option") ||
          normalizedError.includes("expected one of")
        ) {
          friendlyMessage =
            "Invalid attendance status selected. Please check and try again."
        } else if (
          normalizedError.includes("network") ||
          normalizedError.includes("fetch") ||
          normalizedError.includes("timeout")
        ) {
          friendlyMessage = "Connection timeout. Please check your internet."
        } else if (
          normalizedError.includes("required") ||
          normalizedError.includes("missing")
        ) {
          friendlyMessage = "Some required information is missing."
        }

        setErrorMessage(friendlyMessage)
      }
    } catch (err) {
      setProcessStatus("error")
      setErrorMessage("A network connection error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseAndResume = () => {
    if (processStatus === "success") {
      toast.success("Attendance Saved Successfully", {
        description: `${absensiStatus?.full_name} - ${sholatTime}`,
        duration: 3000,
        position: "top-center",
      })
    }
    setOpen(false)
    onScanUlang?.()
  }

  // --- UI STATE MAPPING: Returns configuration based on the current process status ---
  const getStatusConfig = () => {
    switch (processStatus) {
      case "pending":
        return {
          title: "Pending sync",
          subtitle: "Will be validated when connection returns.",
          icon: (
            <Clock className="h-8 w-8 animate-pulse text-amber-400" />
          ),
          btnClass: "bg-amber-500 text-white hover:bg-amber-400",
          textCol: "text-amber-400",
        }
      case "success":
        return {
          title: "Success!",
          subtitle: "Attendance data has been saved.",
          icon: (
            <CheckCircle2 className="animate-in zoom-in h-8 w-8 text-emerald-400 duration-500" />
          ),
          btnClass: "bg-indigo-600 text-white hover:bg-indigo-500",
          textCol: "text-emerald-400",
        }
      case "error":
        return {
          title: "Failed!",
          subtitle: "Attendance could not be saved.",
          icon: (
            <AlertCircle className="animate-in shake h-8 w-8 text-red-400 duration-300" />
          ),
          btnClass: "bg-red-500 text-white hover:bg-red-400",
          textCol: "text-red-400",
        }
      default:
        return {
          title: "Review Attendance",
          subtitle: "Check the details before saving.",
          icon: null,
          btnClass: "bg-indigo-600 text-white hover:bg-indigo-500",
          textCol: "text-white",
        }
    }
  }

  const config = getStatusConfig()

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[92%] max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl border-none bg-[#151419] p-4 text-white shadow-2xl"
      >
        <DialogTitle className="sr-only">{config.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {config.subtitle}
        </DialogDescription>

        {/* Status Header */}
        <div className="mb-4 flex flex-col items-center text-center">
          {config.icon && (
            <div className="relative mb-3 rounded-full border border-white/5 bg-[#1F1E23] p-3 shadow-inner">
              {config.icon}
            </div>
          )}
          <h2 className={`text-xl font-bold tracking-tight ${config.textCol}`}>
            {config.title}
          </h2>
          <p className="mt-1 font-mono text-[10px] tracking-widest text-white/30 uppercase">
            {config.subtitle}
          </p>
        </div>

        {/* Compact attendance summary */}
        <div className="mb-4 rounded-2xl border border-white/5 bg-[#1F1E23] p-3">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
            Student
          </p>
          <p className="truncate text-base font-bold leading-tight text-white">
            {absensiStatus?.full_name}
          </p>

          <div className="mt-2 grid grid-cols-2 gap-3 border-b border-white/5 pb-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Class</p>
              <p className="truncate font-mono text-xs text-white">{absensiStatus?.class_name}</p>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">NIS</p>
              <p className="truncate font-mono text-xs text-white">{absensiStatus?.nis}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Status</p>
              <p className={`text-xs font-bold ${absensiStatus?.icode === "Menstruation" ? "text-red-400" : "text-emerald-400"}`}>
                {absensiStatus?.icode === "Menstruation" ? "Excused" : "Present"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Session</p>
              <p className="text-xs font-bold uppercase text-white">{sholatTime}</p>
            </div>
          </div>

          {absensiStatus?.icode === "Menstruation" && absensiStatus.remarks && (
            <div className="mt-3 border-t border-white/5 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Reason</p>
              <p className="mt-0.5 break-words text-xs text-white/80">{absensiStatus.remarks}</p>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
            <Clock size={13} className="text-white/40" />
            <span className="font-mono text-xs text-white">
              {scanTime} <span className="text-white/30">WIB</span>
            </span>
          </div>
        </div>
        {(processStatus === "success" || processStatus === "pending") &&
          gatekeeperStatus && (
            <div className="mb-4 flex justify-center">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase ${gatekeeperStatus === "Pending sync"
                  ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                  : gatekeeperStatus === "Normal"
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-red-500/20 bg-red-500/10 text-red-400"
                  }`}
              >
                {gatekeeperStatus === "Pending sync" ? (
                  <Clock className="size-3" />
                ) : gatekeeperStatus === "Normal" ? (
                  <CheckCircle2 className="size-3" />
                ) : (
                  <AlertCircle className="size-3" />
                )}
                Gatekeeper: {gatekeeperStatus}
              </span>
            </div>
          )}
        {processStatus === "error" && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] font-medium tracking-wide text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Primary Action */}
        <div className="flex flex-col gap-3">
          {processStatus === "success" || processStatus === "pending" ? (
            <Button
              className={`w-full ${config.btnClass} h-14 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98]`}
              onClick={handleCloseAndResume}
            >
              {processStatus === "pending" ? "Close" : "Done"}
            </Button>
          ) : (
            <>
              <Button
                className={`w-full ${config.btnClass} h-14 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98]`}
                onClick={handleProcess}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  processStatus === "error" ? "Try Again" : "Save Attendance"
                )}
              </Button>
              {!isSubmitting && (
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border border-white/5 bg-[#1F1E23] text-xs font-semibold text-white/70 transition-all hover:bg-[#2A292F] hover:text-white active:scale-[0.98]"
                  onClick={handleCloseAndResume}
                >
                  Cancel
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
