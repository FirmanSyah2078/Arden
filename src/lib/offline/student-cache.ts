import type {StudentMobile} from '@/types/api'

const STORAGE_KEY = 'arden-student-cache'

export function saveStudentCache(students: StudentMobile[]) {
  localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        students,
        cachedAt: new Date().toISOString(),
      }),
  )
}

export function getStudentCache():
    StudentMobile[] {
      const raw = localStorage.getItem(STORAGE_KEY)

      if (!raw) return []

          try {
        const parsed = JSON.parse(raw)

        return Array.isArray(parsed.students) ? parsed.students : []
      } catch {
        return []
      }
    }

export function searchStudentCache(query: string): StudentMobile[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return []

  return getStudentCache()
    .filter((student) => {
      const name = String(student.full_name || '').toLowerCase()
  const nis = String(student.nis || '').toLowerCase()
  const icode = String(student.icode || '').toLowerCase()

      return (
        name.includes(normalizedQuery) ||
        nis.includes(normalizedQuery) ||
        icode.includes(normalizedQuery)
      )
    })
    .slice(0, 15)
}
