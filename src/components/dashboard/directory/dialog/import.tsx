"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { FileSpreadsheet, Download, UploadCloud, Loader2, Database, Eye, Pencil, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

export function ImportDialog({
  open,
  onOpenChangeAction
}: {
  open: boolean,
  onOpenChangeAction: (v: boolean) => void
}) {
  const [activeTab, setActiveTab] = useState("excel")
  const [file, setFile] = useState<File | null>(null)
  const [jsonData, setJsonData] = useState<Record<string, unknown>[]>([])

  const [sqlMode, setSqlMode] = useState<"edit" | "preview">("edit")

  const placeholderSql = "-- Paste your SQL INSERT statement here..."
  
  // 🔥 FIX: Template SQL diperbarui untuk mendukung Grade (10, 11, 12)
  const simpleTemplateSql = `INSERT INTO tbl_students (full_name, nis, grade_level, class_name) VALUES
('Siti Aminah', '100123', 10, 'MIPA 1'),
('Dewi Sartika', '100124', 11, 'IPS 2');`

  const [sqlCode, setSqlCode] = useState("")

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!open) resetState()
  }, [open])

  const resetState = () => {
    setFile(null)
    setJsonData([])
    setSqlCode("")
    setSqlMode("edit")
    setIsSuccess(false)
    setProgress(0)
    setErrorMsg(null)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (loading) {
      setProgress(10)
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 5 : prev))
      }, 200)
    }
    return () => clearInterval(interval)
  }, [loading])

  useEffect(() => {
    setErrorMsg(null)
  }, [sqlCode, file, activeTab])

  // 1. Download Template Excel (Disesuaikan dengan Format Baru)
  const handleDownloadTemplate = () => {
    const templateData = [
      { "Full Name": "Siti Aminah", "NIS": "100123", "Grade": "10", "Class Name": "MIPA 1" },
      { "Full Name": "Dewi Sartika", "NIS": "100124", "Grade": "11", "Class Name": "IPS 2" },
    ]
    const classRefData = [
      { "Available Grades": "10, 11, 12", "Available Classes": "MIPA 1, IPS 2, etc." },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(templateData), "Student Data Input")
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(classRefData), "Reference")
    XLSX.writeFile(wb, "ARDEN_Student_Template.xlsx")
  }

  // 2. Handle File Excel (SUPER ROBUST NORMALIZATION)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null)
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        if (typeof bstr !== "string") throw new Error("Failed to read file")
        const wb = XLSX.read(bstr, { type: "binary" })
        const ws = wb.Sheets[wb.SheetNames[0]]
        
        // Baca data raw
        const rawData = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[]

        if (rawData.length === 0) throw new Error("Excel file is empty!")

        // 🔥 PROSES NORMALISASI HEADER SUPER TANGGUH
        const formattedData = rawData.map((row, index) => {
          const normalizedRow: Record<string, string> = {}
          
          // Sapu bersih semua header: hilangkan spasi depan/belakang, jadikan lowercase
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim().toLowerCase().replace(/\s+/g, ' ')
            normalizedRow[cleanKey] = String(row[key]).trim()
          })

          // Deteksi cerdas berbagai kemungkinan nama kolom
          const fullName = normalizedRow['full name'] || normalizedRow['nama lengkap'] || normalizedRow['nama'] || ''
          const nis = normalizedRow['nis'] || normalizedRow['no induk'] || ''
          const grade = normalizedRow['grade'] || normalizedRow['tingkat'] || normalizedRow['grade level'] || ''
          const className = normalizedRow['class name'] || normalizedRow['nama kelas'] || normalizedRow['kelas'] || ''

          if (!fullName || !nis) {
            throw new Error(`Data tidak lengkap pada baris ${index + 2}. Nama dan NIS wajib diisi.`)
          }

          // Gabungkan Grade dan Class (misal: "10" + "MIPA 1" = "10 MIPA 1")
          // Jika di excel cuma ada 1 kolom yang digabung ("10 MIPA 1"), ini tetap aman.
          const combinedClass = `${grade} ${className}`.trim()

          if (!combinedClass) {
            throw new Error(`Data Kelas kosong pada baris ${index + 2}.`)
          }

          return {
            'Nama Lengkap': toTitleCase(fullName),
            'NIS': nis,
            'Nama Kelas': combinedClass // Lempar format gabungan ke API Backend
          }
        })

        setJsonData(formattedData)
        toast.info(`${formattedData.length} rows ready.`)

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to parse Excel file"
        setErrorMsg(msg)
        setFile(null)
      }
    }
    reader.readAsBinaryString(selectedFile)
  }

  // 3. PARSE SQL (Disesuaikan dengan Format 4 Argumen)
  const parseSqlToJson = (sql: string) => {
    if (!sql.trim()) throw new Error("SQL code is empty.")
    if (!sql.toUpperCase().includes("INSERT INTO")) throw new Error("Syntax must contain 'INSERT INTO tbl_students...'")
    if (!sql.toUpperCase().includes("VALUES")) throw new Error("Syntax must contain 'VALUES'")

    const parts = sql.split(/VALUES/i)
    if (parts.length < 2) throw new Error("Invalid SQL format. Make sure 'VALUES' exists.")

    const valuesOnly = parts[1] 

    const regex = /\(([^)]+)\)/g
    const matches = valuesOnly.match(regex)

    if (!matches || matches.length === 0) throw new Error("No data values found. Use format ('Name', 'NIS', Grade, 'Class').")

    return matches.map((match, index) => {
      const content = match.slice(1, -1) 
      const rowParts = content.split(",").map(s => s.trim().replace(/^'|'$/g, "")) 

      // 🔥 Sekarang menuntut 4 bagian (Name, NIS, Grade, Class)
      if (rowParts.length < 4) throw new Error(`Incomplete data at row ${index + 1}. Requires Name, NIS, Grade, and Class.`)

      const grade = rowParts[2] || ""
      const className = rowParts[3] || ""

      return {
        'Nama Lengkap': toTitleCase(rowParts[0] || ""), 
        'NIS': rowParts[1] || "",
        'Nama Kelas': `${grade} ${className}`.trim() // Lempar gabungan
      }
    })
  }

  const handleImport = async () => {
    setLoading(true)
    setErrorMsg(null)
    setIsSuccess(false)

    try {
      let payload: Record<string, unknown>[] = []

      if (activeTab === "excel") {
        if (jsonData.length === 0) throw new Error("No file selected or file is empty.")
        payload = jsonData
      } else {
        payload = parseSqlToJson(sqlCode)
      }

      const res = await fetch("/api/student/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok || json.status === 'fail') throw new Error(json.message || "Import failed from server.")

      setProgress(100)
      setIsSuccess(true)
      toast.success(`Success! ${json.count} records imported.`)

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "System error occurred"
      setErrorMsg(msg)
      setLoading(false)
      setProgress(0)
    }
  }

  const toggleSqlMode = () => {
    if (sqlMode === 'edit') {
      if (!sqlCode.trim()) setSqlCode(simpleTemplateSql)
      setSqlMode('preview')
    } else {
      setSqlMode('edit')
    }
  }

  const isImportDisabled = loading || (activeTab === 'excel' && !file) || (activeTab === 'sql' && (!sqlCode.trim() || sqlMode === 'preview'))

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) onOpenChangeAction(v) }}>
      <DialogContent className="sm:max-w-xl bg-[#0a0a0a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription className="text-gray-400">
            Bulk import using Excel or simple SQL Queries.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="excel" onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/5">
            <TabsTrigger value="excel" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Excel Import</TabsTrigger>
            <TabsTrigger value="sql" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">SQL Import</TabsTrigger>
          </TabsList>

          {/* TAB EXCEL */}
          <TabsContent value="excel" className="mt-4 space-y-4">
             <div className="flex items-center justify-between p-3 border border-indigo-500/20 bg-indigo-500/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-full">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-white">Data Format</p>
                    <p className="text-xs text-gray-400">Download the required Excel template</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleDownloadTemplate} className="group border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white">
                  <Download className="w-4 h-4 mr-2 group-hover:ar-bounce-x" /> Template
                </Button>
             </div>

             <div className="relative group">
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  disabled={loading || isSuccess} 
                />
                
                <div className={`h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200
                  ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 hover:bg-white/5 hover:border-white/20'}
                `}>
                   {file ? (
                     <div className="flex flex-col items-center gap-1 animate-in zoom-in-50 duration-300">
                        <div className="p-3 bg-emerald-500/10 rounded-full mb-1">
                           <FileSpreadsheet className="w-8 h-8 text-emerald-500 animate-pulse" />
                        </div>
                        <span className="text-sm font-semibold text-emerald-400 max-w-62.5 truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {jsonData.length} rows ready
                        </span>
                        <span className="text-[10px] text-gray-600 italic mt-2">
                          (Click to replace file)
                        </span>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-white/5 rounded-full group-hover:bg-indigo-500/10 transition-colors">
                           <UploadCloud className="w-8 h-8 text-gray-500 group-hover:text-indigo-400 transition-colors group-hover:ar-float" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400 group-hover:text-gray-300 font-medium">
                            Click or drag Excel file here
                          </p>
                          <p className="text-xs text-gray-600">
                            Format: .xlsx, .xls, .csv
                          </p>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </TabsContent>

          {/* TAB SQL */}
          <TabsContent value="sql" className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3 border border-indigo-500/20 bg-indigo-500/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-full">
                  <Database className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">SQL Query</p>
                  {/* 🔥 FIX: Update Instruksi Format di UI */}
                  <p className="text-xs text-gray-400">Format: (Name, NIS, Grade, Class)</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={toggleSqlMode} disabled={loading || isSuccess} className="group border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white">
                {sqlMode === 'edit' ? <><Eye className="w-4 h-4 mr-2 group-hover:ar-bounce-x" /> Preview</> : <><Pencil className="w-4 h-4 mr-2 group-hover:ar-tada" /> Edit</>}
              </Button>
            </div>

            <div className="relative group h-40">
              {sqlMode === 'edit' ? (
                <textarea
                  className="w-full h-full bg-[#050505] border border-white/10 rounded-lg p-4 text-xs font-mono text-gray-300 outline-none focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50 transition-colors resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent placeholder:text-gray-600"
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  placeholder={placeholderSql}
                  spellCheck={false}
                  disabled={loading || isSuccess}
                />
              ) : (
                <div className="w-full h-full bg-[#050505] border border-white/10 rounded-lg p-4 relative overflow-hidden group/code">
                  <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap overflow-y-auto h-full scrollbar-thin scrollbar-thumb-white/10">{sqlCode}</pre>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4 bg-white/10" />

        <DialogFooter className="flex items-center justify-between w-full gap-4">
          <div className="flex-1 h-full flex items-center overflow-hidden">
            {loading ? (
              <div className="w-full space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold"><span>Processing...</span><span>{progress}%</span></div>
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>
            ) : errorMsg ? (
              <div className="flex items-start gap-2 text-red-400 bg-red-500/10 px-3 py-2 rounded-md border border-red-500/20 w-full animate-in fade-in slide-in-from-bottom-1">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> 
                <span className="text-xs font-medium wrap-break-word whitespace-normal text-left leading-tight">
                  {errorMsg}
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-600 italic">Ready to import</span>
            )}
          </div>

          <div className="flex gap-2">
            {!isSuccess && (
              <Button variant="outline" onClick={() => onOpenChangeAction(false)} className="border-white/10 bg-transparent hover:bg-white/5 text-gray-300 transition-colors" disabled={loading}>
                Cancel
              </Button>
            )}

            {isSuccess ? (
              <Button className="group bg-emerald-600 hover:bg-emerald-700 text-white min-w-30 transition-all" onClick={() => window.location.reload()}>
                <Check className="w-4 h-4 mr-2 group-hover:ar-tada" /> Done
              </Button>
            ) : (
              <Button
                className="group bg-indigo-600 hover:bg-indigo-700 text-white min-w-30 transition-all"
                onClick={handleImport}
                disabled={isImportDisabled}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2 group-hover:ar-float" />}
                {loading ? 'Importing...' : 'Import Data'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}