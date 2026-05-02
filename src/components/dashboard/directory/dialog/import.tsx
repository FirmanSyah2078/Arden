"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { FileSpreadsheet, Download, UploadCloud, Loader2, Database, Eye, Pencil, Check, AlertCircle, Braces } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

const validateAndFormatRow = (name: string, nis: string, grade: string, className: string, rowIndex: string | number) => {
  const cleanName = name.trim()
  let cleanNis = nis.trim().replace(/\s+/g, '') 
  const cleanGrade = grade.trim()
  const cleanClass = className.trim()

  if (!cleanName) throw new Error(`Baris ${rowIndex}: Nama Lengkap wajib diisi.`)
  if (!cleanClass) throw new Error(`Baris ${rowIndex}: Nama Kelas wajib diisi.`)

  if (!cleanNis) throw new Error(`Baris ${rowIndex}: NIS wajib diisi.`)
  if (!/^\d{6,}$/.test(cleanNis)) {
    throw new Error(`Baris ${rowIndex}: NIS harus berupa angka minimal 6 digit (Ditemukan: '${cleanNis}').`)
  }

  if (!cleanGrade) throw new Error(`Baris ${rowIndex}: Tingkat (Grade) wajib diisi.`)
  if (!/^\d{1,2}$/.test(cleanGrade)) {
    throw new Error(`Baris ${rowIndex}: Tingkat (Grade) harus angka maksimal 2 digit (Ditemukan: '${cleanGrade}').`)
  }

  return {
    'Nama Lengkap': toTitleCase(cleanName),
    'NIS': cleanNis,
    'Nama Kelas': `${cleanGrade} ${cleanClass}`.trim()
  }
}

export function ImportDialog({
  open,
  onOpenChangeAction,
  onSuccessAction 
}: {
  open: boolean,
  onOpenChangeAction: (v: boolean) => void,
  onSuccessAction?: () => void 
}) {
  const [activeTab, setActiveTab] = useState("excel")
  const [file, setFile] = useState<File | null>(null)
  const [jsonData, setJsonData] = useState<Record<string, unknown>[]>([])

  const [sqlMode, setSqlMode] = useState<"edit" | "preview">("edit")

  const placeholderSql = "-- Insert your script here..."
  
  const simpleTemplateSql = `INSERT INTO tbl_students (full_name, nis, grade_level, class_name) VALUES
('Siti Aminah', '100123', '10', 'MIPA 1'),
('Dewi Sartika', '100124', '11', 'IPS 2');`

  const [sqlCode, setSqlCode] = useState("")

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const [duplicates, setDuplicates] = useState<string[]>([]) 

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
    setDuplicates([]) 
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

  const handleClose = () => {
    onOpenChangeAction(false)
    setTimeout(() => {
      document.body.style.pointerEvents = "auto"
      document.body.style.overflow = "auto"
      document.body.removeAttribute("data-scroll-locked")
      
      if (isSuccess && onSuccessAction) {
        onSuccessAction()
      }
    }, 200)
  }

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
        
        const rawData = XLSX.utils.sheet_to_json(ws, { raw: false, defval: "" }) as Record<string, unknown>[]

        if (rawData.length === 0) throw new Error("Excel file is empty!")

        const formattedData = rawData.map((row, index) => {
          const normalizedRow: Record<string, string> = {}
          
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim().toLowerCase().replace(/\s+/g, ' ')
            normalizedRow[cleanKey] = String(row[key]).trim()
          })

          const fullName = normalizedRow['full name'] || normalizedRow['nama lengkap'] || normalizedRow['nama'] || ''
          const nis = normalizedRow['nis'] || normalizedRow['no induk'] || ''
          const grade = normalizedRow['grade'] || normalizedRow['tingkat'] || normalizedRow['grade level'] || ''
          const className = normalizedRow['class name'] || normalizedRow['nama kelas'] || normalizedRow['kelas'] || ''

          return validateAndFormatRow(fullName, nis, grade, className, index + 2)
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

  const parseSqlToJson = (sql: string) => {
    if (!sql.trim()) throw new Error("SQL code is empty.")
    
    let cleanSql = sql.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim()

    if (!cleanSql.toUpperCase().includes("INSERT INTO")) throw new Error("Syntax must contain 'INSERT INTO...'")
    if (!cleanSql.toUpperCase().includes("VALUES")) throw new Error("Syntax must contain 'VALUES'")

    const parts = cleanSql.split(/VALUES/i)
    let valuesOnly = parts[1].trim()

    if (valuesOnly.endsWith(';')) valuesOnly = valuesOnly.slice(0, -1).trim()

    const tuples: string[] = []
    let currentTuple = ""
    let inQuotesGlobal = false
    let inTuple = false

    for (let i = 0; i < valuesOnly.length; i++) {
      const char = valuesOnly[i]
      const nextChar = valuesOnly[i+1]

      if (char === "'" && inQuotesGlobal && nextChar === "'") {
        currentTuple += "''"
        i++ 
        continue
      }

      if (char === "'") {
        inQuotesGlobal = !inQuotesGlobal
        if (inTuple) currentTuple += char
      } else if (char === '(' && !inQuotesGlobal) {
        if (inTuple) throw new Error("Format error: Kurung buka ganda terdeteksi.")
        inTuple = true
        currentTuple = ""
      } else if (char === ')' && !inQuotesGlobal) {
        if (!inTuple) throw new Error("Format error: Kurung tutup tanpa kurung buka.")
        inTuple = false
        tuples.push(currentTuple)
        currentTuple = ""
      } else if (inTuple) {
        currentTuple += char
      } else {
        if (char !== ',' && char.trim() !== "" && char !== ';') {
          throw new Error(`Format error: Karakter ilegal '${char}' di luar kurung data.`)
        }
      }
    }

    if (inTuple) throw new Error("Format error: Ada kurung buka yang tidak ditutup.")
    if (inQuotesGlobal) throw new Error("Format error: Ada tanda petik tunggal yang tidak ditutup.")
    if (tuples.length === 0) throw new Error("Tidak ada data yang valid ditemukan.")

    return tuples.map((tupleContent, index) => {
      const rowIndex = index + 1
      const fields: string[] = []
      let currentField = ""
      let isInsideQuotes = false
      let fieldHadQuotes = false
      let lastTokenWasComma = false

      for (let i = 0; i < tupleContent.length; i++) {
        const char = tupleContent[i]

        if (char === "'") {
          if (isInsideQuotes) {
            if (i + 1 < tupleContent.length && tupleContent[i + 1] === "'") {
              currentField += "'"
              i++ 
            } else {
              isInsideQuotes = false
            }
          } else {
            isInsideQuotes = true 
            fieldHadQuotes = true
            lastTokenWasComma = false
          }
        } else if (isInsideQuotes) {
          if (char === '(' || char === ')') continue 
          currentField += char
        } else {
          if (char === ',') {
            if (lastTokenWasComma) throw new Error(`Error Data ${rowIndex}: Koma ganda (,,) terdeteksi.`)
            if (!fieldHadQuotes) throw new Error(`Error Data ${rowIndex}: Data wajib diapit petik tunggal ('...').`)
            
            fields.push(currentField)
            currentField = ""
            fieldHadQuotes = false
            lastTokenWasComma = true
          } else if (char.trim() !== "") {
            throw new Error(`Error Data ${rowIndex}: Ditemukan karakter / angka di luar petik. Format WAJIB ('...').`)
          }
        }
      }

      if (!fieldHadQuotes && currentField === "") {
         throw new Error(`Error Data ${rowIndex}: Format gagal. Kolom berakhir gantung atau tanpa petik tunggal.`)
      }
      fields.push(currentField)

      if (fields.length !== 4) {
        throw new Error(`Error Data ${rowIndex}: Ditemukan ${fields.length} kolom, WAJIB tepat 4 kolom ('Nama', 'NIS', 'Grade', 'Kelas').`)
      }

      return validateAndFormatRow(fields[0], fields[1], fields[2], fields[3], `Data SQL ke-${rowIndex}`)
    })
  }

  const handleImport = async () => {
    setLoading(true); setErrorMsg(null); setIsSuccess(false); setDuplicates([]);
    try {
      let payload = activeTab === "excel" ? jsonData : parseSqlToJson(sqlCode);

      const res = await fetch("/api/student/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.status === 'fail') throw new Error(json.message);

      setDuplicates(json.duplicates || []); 
      setProgress(100);
      setIsSuccess(true);
      toast.success(`Import completed. ${json.count} records added.`);
    } catch (err: any) {
      setErrorMsg(err.message); setLoading(false); setProgress(0);
    }
  };

  const toggleSqlMode = () => {
    if (sqlMode === 'edit') {
      if (!sqlCode.trim()) setSqlCode(simpleTemplateSql)
      setSqlMode('preview')
    } else {
      setSqlMode('edit')
    }
  }

  const isImportDisabled = loading || (activeTab === 'excel' && !file) || (activeTab === 'sql' && (!sqlCode.trim() || sqlMode === 'preview'))

  // 🔥 Kalkulasi IDE Status
  const lineCount = sqlCode ? sqlCode.split('\n').length : 0;
  const wordCount = sqlCode.trim() ? sqlCode.trim().split(/\s+/).length : 0;

  // 🔥 Deteksi Database (Super Cerdas)
  const getDialectInfo = () => {
    const code = sqlCode.toUpperCase();
    if (!code.trim()) return { type: 'Empty', color: 'text-gray-500' };
    
    // Ciri khas PostgreSQL & Supabase
    if (code.includes('PUBLIC.') || code.includes('UUID') || code.includes('JSONB') || code.includes('RETURNING') || code.includes('TIMESTAMPTZ')) {
      return { type: 'PostgreSQL', color: 'text-blue-400' };
    }
    // Ciri khas MySQL
    if (sqlCode.includes('`') || code.includes('AUTO_INCREMENT') || code.includes('TINYINT')) {
      return { type: 'MySQL', color: 'text-orange-400' };
    }
    // SQL Dasar
    if (code.includes('INSERT INTO') || code.includes('UPDATE ') || code.includes('DELETE ')) {
      return { type: 'SQL Script', color: 'text-indigo-400' };
    }
    return { type: 'Plain Text', color: 'text-gray-400' };
  };

  const dialect = getDialectInfo();

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading && !v) handleClose() }}>
      <DialogContent className="sm:max-w-xl bg-[#0a0a0a] border-white/10 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription className="text-gray-400">
            Bulk import using Excel or strict SQL Queries.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="excel" onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/5">
            <TabsTrigger value="excel" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Excel Import</TabsTrigger>
            <TabsTrigger value="sql" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">SQL Import</TabsTrigger>
          </TabsList>

          <TabsContent value="excel" className="mt-4 space-y-4">
             <div className="flex items-center justify-between p-3 border border-white/10 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full">
                    <FileSpreadsheet className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-white">Data Format</p>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wide">Download the required template</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleDownloadTemplate} className="group border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
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
                
                <div className={`h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200
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

          <TabsContent value="sql" className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3 border border-white/10 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-full">
                  <Database className="w-4 h-4 text-gray-300" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">Query Editor</p>
                  <p className="text-[10px] text-gray-400 font-mono tracking-wide">Write or paste your script</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={toggleSqlMode} disabled={loading || isSuccess} className="group border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
                {sqlMode === 'edit' ? <><Eye className="w-4 h-4 mr-2 group-hover:ar-bounce-x" /> Preview Code</> : <><Pencil className="w-4 h-4 mr-2 group-hover:ar-tada" /> Edit Script</>}
              </Button>
            </div>

            {/* 🔥 PERBAIKAN SCROLLBAR: Pindah padding ke dalam element, w-full h-full, tambahkan mb-12 pada track agar tidak nabrak IDE Status */}
            <div className="relative group h-48 bg-[#050505] border border-white/10 rounded-lg transition-colors focus-within:border-white/20 overflow-hidden">
              
              {sqlMode === 'edit' ? (
                <textarea
                  className="w-full h-full p-4 pb-12 bg-transparent text-xs font-mono text-gray-300 outline-none resize-none overflow-y-auto 
                  [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:mt-2 [&::-webkit-scrollbar-track]:mb-12
                  [&::-webkit-scrollbar-thumb]:bg-transparent group-hover:[&::-webkit-scrollbar-thumb]:bg-white/20 focus:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full transition-colors placeholder:text-gray-600/50"
                  value={sqlCode}
                  onChange={(e) => setSqlCode(e.target.value)}
                  placeholder={placeholderSql}
                  spellCheck={false}
                  disabled={loading || isSuccess}
                />
              ) : (
                <div className="w-full h-full p-4 pb-12 bg-transparent overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:mt-2 [&::-webkit-scrollbar-track]:mb-12 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap">{sqlCode}</pre>
                </div>
              )}
              
              {/* 🔥 IDE STATUS BAR */}
              <div className="absolute bottom-3 right-3 flex items-center gap-3 text-[10px] font-mono text-gray-500 bg-[#050505] px-2 py-0.5 rounded-sm border border-white/5 pointer-events-none select-none z-10">
                <div className="flex items-center gap-1.5 transition-colors">
                  <Braces className={`w-3 h-3 ${dialect.color}`} />
                  <span className={dialect.color}>{dialect.type}</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <span>{lineCount} Lns</span>
                <div className="w-px h-3 bg-white/10" />
                <span>{wordCount} Wds</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {isSuccess && duplicates.length > 0 && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="rounded-xl border border-white/20 bg-white/8 backdrop-blur-md p-4">
              <div className="flex items-center gap-2 mb-2 text-white/90">
                <AlertCircle className="size-4 text-white" />
                <h5 className="text-[11px] font-bold uppercase tracking-wider">Duplicate Data Ignored</h5>
              </div>
              <div className="max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-[12px] text-white/70 leading-relaxed">
                  The following <b className="text-white">{duplicates.length} records</b> were already registered in the system and have been skipped to prevent redundancy:
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {duplicates.map((name, i) => (
                    <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/5 text-white/80">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between w-full gap-4 mt-6">
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
              <Button variant="outline" onClick={handleClose} className="border-white/10 bg-transparent hover:bg-white/5 text-gray-300 transition-colors" disabled={loading}>
                Cancel
              </Button>
            )}

            {isSuccess ? (
              <Button className="group bg-emerald-600 hover:bg-emerald-700 text-white min-w-30 transition-all" onClick={handleClose}>
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