// src/lib/offline/attendance-queue.ts

export type AttendancePayload = {
  id_student: number
student_name: string
student_nis: string
class_name: string
time: string
status: string
method: 'Manual'|'Scan QR'
remarks?: string
captured_at: string
  client_request_id: string
}

export type QueuedAttendance = {
  id: string
  payload: AttendancePayload
  created_at: string
  retry_count: number
}

const DB_NAME = 'arden-offline-db'
  const STORE_NAME = 'attendance-queue'
  const DB_VERSION = 1

  function createId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        reject(new Error('IndexedDB tidak tersedia di browser ini.'))
        return
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded =
          () => {
            const database = request.result

            if (!database.objectStoreNames.contains(STORE_NAME)) {
              const store = database.createObjectStore(STORE_NAME, {
                keyPath: 'id',
              })

              store.createIndex('created_at', 'created_at', {
                unique: false,
              })
            }
          }

                request.onsuccess =
              () => {
                resolve(request.result)
              }

                    request.onerror = () => {
                reject(request.error ?? new Error('Gagal membuka IndexedDB.'))
              }
    })
  }

  export async function addAttendanceToQueue(
      payload: AttendancePayload,
      ): Promise<QueuedAttendance> {
    const database = await openDatabase()

  const item: QueuedAttendance = {
    id: createId(),
    payload,
    created_at: new Date().toISOString(),
    retry_count: 0,
  }

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  store.add(item)

  transaction.oncomplete = () => resolve()
    transaction.onerror = () => {
      reject(transaction.error ?? new Error('Gagal menyimpan antrean absensi.'))
    }
    transaction.onabort = () => {
    reject(transaction.error ?? new Error('Antrean absensi dibatalkan.'))
    }
  })

    database.close()

    return item
  }

  export async function getPendingAttendance(): Promise<QueuedAttendance[]> {
    const database = await openDatabase()

  const items = await new Promise<QueuedAttendance[]>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly')
  const store = transaction.objectStore(STORE_NAME)
  const request = store.getAll()

    request.onsuccess = () => {
      resolve(request.result as QueuedAttendance[])
    }

    request.onerror = () => {
    reject(request.error ?? new Error('Gagal membaca antrean absensi.'))
    }
  })

    database.close()

    return items.sort(
        (a, b) => a.created_at.localeCompare(b.created_at),
    )
  }

  export async function removeAttendanceFromQueue(id: string): Promise<void> {
  const database = await openDatabase()

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  store.delete(id)

  transaction.oncomplete = () => resolve()
    transaction.onerror = () => {
      reject(transaction.error ?? new Error('Gagal menghapus antrean absensi.'))
    }
    transaction.onabort = () => {
    reject(transaction.error ?? new Error('Penghapusan antrean dibatalkan.'))
    }
  })

    database.close()
  }

  export async function clearAttendanceQueue(): Promise<void> {
  const database = await openDatabase()

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite')
  const store = transaction.objectStore(STORE_NAME)

  store.clear()

  transaction.oncomplete = () => resolve()
    transaction.onerror = () => {
      reject(transaction.error ?? new Error('Gagal mengosongkan antrean absensi.'))
    }
    transaction.onabort = () => {
    reject(transaction.error ?? new Error('Pengosongan antrean dibatalkan.'))
    }
  })

    database.close()
  }