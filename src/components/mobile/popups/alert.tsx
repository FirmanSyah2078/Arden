"use client"

import { useEffect, useState } from "react"
import { Clock, Loader2, CheckCircle2, AlertCircle, User } from "lucide-react"
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
    "idle" | "success" | "error"
  >(initialStatus)
  const [errorMessage, setErrorMessage] = useState("")
  const [scanTime, setScanTime] = useState("")
  const [gatekeeperStatus, setGatekeeperStatus] = useState("")

  const { submitAttendance, isLoadingHistory: loading } = useAttendance()

  useEffect(() => {
    if (isOpen) {
      setScanTime(formatTime(new Date()))
      setErrorMessage("")
      setGatekeeperStatus("")
      setProcessStatus(initialStatus || "idle")
    }
  }, [isOpen, initialStatus])

  const handleProcess = async () => {
    if (!absensiStatus?.id) return
    setErrorMessage("")

    try {
      const isManual = absensiStatus.message === "Manual Entry"
      const payload = {
        id_student: parseInt(absensiStatus.id),
        time: sholatTime,
        status: absensiStatus.icode || "Pure",
        method: isManual ? "MANUAL" : "SCAN",
        remarks: isManual ? absensiStatus.remarks : "",
        date: new Date(),
      }

      const response = await submitAttendance(payload)
      if (response.status === "success") {
        setProcessStatus("success")
        setGatekeeperStatus(response.data?._gatekeeperStatus || "")
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
      case "success":
        return {
          title: "Success!",
          subtitle: "Attendance data has been saved.",
          icon: (
            <CheckCircle2 className="animate-in zoom-in h-14 w-14 text-emerald-400 duration-500" />
          ),
          btnClass: "bg-indigo-600 text-white hover:bg-indigo-500",
          textCol: "text-emerald-400",
        }
      case "error":
        return {
          title: "Failed!",
          subtitle: "An error occurred while saving data.",
          icon: (
            <AlertCircle className="animate-in shake h-14 w-14 text-red-400 duration-300" />
          ),
          btnClass: "bg-red-500 text-white hover:bg-red-400",
          textCol: "text-red-400",
        }
      default:
        return {
          title: "Confirmation",
          subtitle: "Please review the student details.",
          icon: <User className="h-14 w-14 text-white/20" />,
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
        className="w-[92%] max-w-sm overflow-hidden rounded-3xl border-none bg-[#151419] p-6 text-white shadow-2xl"
      >
        <DialogTitle className="sr-only">{config.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {config.subtitle}
        </DialogDescription>

        {/* Status Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative mb-6 rounded-full border border-white/5 bg-[#1F1E23] p-5 shadow-inner">
            <div className="absolute inset-0 rounded-full bg-white/5 blur-xl" />
            {config.icon}
          </div>
          <h2 className={`text-2xl font-bold tracking-tight ${config.textCol}`}>
            {config.title}
          </h2>
          <p className="mt-2 font-mono text-[10px] tracking-widest text-white/30 uppercase">
            {config.subtitle}
          </p>
        </div>

        {/* User Info Card (Symmetry Style) */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/5 bg-[#1F1E23] p-5 shadow-sm">
          <div className="relative z-10 flex flex-col gap-5">
            <div>
              <p className="mb-1 text-[10px] font-bold tracking-wider text-white/40 uppercase">
                Student Name
              </p>
              <p className="mb-4 text-lg leading-tight font-bold text-white">
                {absensiStatus?.full_name}
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="mb-0.5 text-[10px] font-bold tracking-wider text-white/40 uppercase">
                    Class
                  </p>
                  <p className="font-mono text-sm text-white">
                    {absensiStatus?.class_name}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/5"></div>
                <div>
                  <p className="mb-0.5 text-[10px] font-bold tracking-wider text-white/40 uppercase">
                    Student ID (NIS)
                  </p>
                  <p className="font-mono text-sm text-white">
                    {absensiStatus?.nis}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timing Display */}
        <div className="mb-10 flex gap-3">
          <div className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/5 bg-[#1F1E23] p-3 shadow-sm">
            <Clock size={14} className="text-white/40" />
            <span className="font-mono text-xs text-white">
              {scanTime} <span className="text-white/30">WIB</span>
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-white/5 bg-[#1F1E23] p-3 shadow-sm">
            <span className="text-xs font-bold tracking-wide text-white uppercase">
              {sholatTime}
            </span>
          </div>
        </div>
        {processStatus === "success" && gatekeeperStatus && (
          <div className="mb-8 flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase ${
                gatekeeperStatus === "Normal"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {gatekeeperStatus === "Normal" ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <AlertCircle className="size-3" />
              )}
              Gatekeeper: {gatekeeperStatus}
            </span>
          </div>
        )}
        {processStatus === "error" && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-[10px] font-medium tracking-wide text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Primary Action */}
        <div className="flex flex-col gap-3">
          {processStatus === "success" ? (
            <Button
              className={`w-full ${config.btnClass} h-14 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98]`}
              onClick={handleCloseAndResume}
            >
              Done
            </Button>
          ) : (
            <>
              <Button
                className={`w-full ${config.btnClass} h-14 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98]`}
                onClick={handleProcess}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "Save Attendance"
                )}
              </Button>
              {!loading && (
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-2xl border-white/10 bg-transparent text-xs text-white/60 transition-all hover:bg-white/5 hover:text-white"
                  onClick={handleCloseAndResume}
                >
                  Cancel & Rescan
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
