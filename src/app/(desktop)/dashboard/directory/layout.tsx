export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 pb-12 sm:p-6">

      <div className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>
      
    </div>
  )
}