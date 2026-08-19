'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useDock } from '@/context/dock-context';
import Qr, { QrHandle } from '@/app/(mobile)/type/qr';
import { Manual } from '../type/manual';
import { Alert } from '../popups/alert';
import { Form } from '../popups/form';
import { AttendanceStatusResponse, StudentMobile } from '@/types/api';
import { useSholat } from '@/hooks/mobile/use-sholat';
import { useProfile } from '@/hooks/settings/use-profile';
import {
  saveStudentCache,
  searchStudentCache,
} from "@/lib/offline/student-cache"

interface ManagerProps {
  className?: string;
  onOpenHistory?: () => void;
  onLogout?: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export const Manager = ({
  className = '',
  onOpenHistory,
  onLogout,
  isMenuOpen,
  setIsMenuOpen
}: ManagerProps) => {
  const { mode, setMode } = useDock();
  const [search, setSearch] = useState('');
  const [data, setData] = useState<StudentMobile[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [manualResult, setManualResult] = useState<AttendanceStatusResponse | undefined>(undefined);
  const [notifOpen, setNotifOpen] = useState(false);
  const [inputFormOpen, setInputFormOpen] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);

  const qrRef = useRef<QrHandle>(null);
  const { activeScanner } = useSholat();
  const { formData } = useProfile();

  useEffect(() => {
    if (!navigator.onLine) return

    const preloadStudents = async () => {
      try {
        const res = await fetch("/api/student?limit=1000")

        if (!res.ok) return

        const json = await res.json()

        if (json.status === "success" && Array.isArray(json.data)) {
          const students = json.data.map((s: any) => ({
            id_student: s.id_student,
            full_name: s.full_name,
            nis: s.nis,
            class_name:
              s.tbl_classes?.class_name || s.class_name || "Unknown",
            icode: s.icode || "",
          }))

          saveStudentCache(students)
        }
      } catch {
        // Preload gagal tidak boleh mengganggu halaman /go
      }
    }

    void preloadStudents()
  }, [])

  useEffect(() => {
    const handleShutter = () => handleCamAction();
    window.addEventListener('start-qr-camera', handleShutter);
    return () => window.removeEventListener('start-qr-camera', handleShutter);
  }, []);

  useEffect(() => {
    if (mode !== 'manual') return;
    if (!search.trim()) { setData([]); setHasMore(false); setIsLoading(false); return; }
    setIsLoading(true);
    const timer = setTimeout(async () => {
      const localResults = searchStudentCache(search)

      if (!navigator.onLine) {
        setHasMore(localResults.length > 15)
        setData(localResults.slice(0, 15))
        setIsLoading(false)
        return
      }
      try {
        const res = await fetch(
          `/api/student?prm=${encodeURIComponent(search)}&limit=16`,
        )

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const json = await res.json()

        if (json.status === "success" && Array.isArray(json.data)) {
          const students = json.data.map((s: any) => ({
            id_student: s.id_student,
            full_name: s.full_name,
            nis: s.nis,
            class_name: s.tbl_classes?.class_name || s.class_name || "Unknown",
            icode: s.icode || "",
          }))

          saveStudentCache(students)
          setHasMore(students.length > 15)
          setData(students.slice(0, 15))
        } else {
          setData([])
          setHasMore(false)
        }
      } catch {
        setHasMore(localResults.length > 15)
        setData(localResults.slice(0, 15))
      } finally {
        setIsLoading(false)
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search, mode]);

  const handleToggleMode = async () => {
    if (mode === 'scan') {
      await qrRef.current?.stop();
    }
    setMode(mode === 'scan' ? 'manual' : 'scan');
    setSearch('');
    setIsMenuOpen(false);
  };

  const handleCamAction = async () => {
    if (qrRef.current?.isScanning) {
      await qrRef.current?.stop();
    } else {
      await qrRef.current?.start();
    }
    setIsMenuOpen(false);
  };

  return (
    <div className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#151419] ${className}`}>

      <div className="relative min-h-0 w-full flex-1">
        {mode === 'scan' ? (
          <div
            key="scan-view"
            className="h-full w-full animate-in fade-in duration-220 ease-out"
          >
            <Qr ref={qrRef} sholat={activeScanner} onCamActive={setIsCamActive} />
          </div>
        ) : (
          <div
            key="manual-view"
            className="flex h-full min-h-0 w-full flex-col animate-in fade-in duration-220 ease-out"
          >
            <Manual
              search={search}
              setSearch={setSearch}
              data={data}
              hasMore={hasMore}
              isLoading={isLoading}
              onFocus={() => { }}
              onBlur={() => { }}
              handleSelect={(s) => {
                setManualResult({ id: String(s.id_student), full_name: s.full_name, nis: s.nis, class_name: s.class_name, status: 'idle', message: 'Manual Entry' });
                setInputFormOpen(true);
              }}
              setPick={setManualResult}
              setOpenForm={setInputFormOpen}
            />
          </div>
        )}
      </div>

      <Form
        key={manualResult?.id}
        isOpen={inputFormOpen}
        setIsOpen={setInputFormOpen}
        dataStudent={manualResult}
        setPick={setManualResult}
        sholat={activeScanner}
        setSuccessPopup={setNotifOpen}
      />
      <Alert isOpen={notifOpen} absensiStatus={manualResult} setOpen={setNotifOpen} sholatTime={activeScanner as unknown as string} />
    </div>
  );
};
