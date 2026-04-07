'use client';

import { useEffect, useState } from 'react';
import { AttendanceStatusResponse } from '@/types/api';
import { ScanLine, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAttendance } from '@/hooks/mobile/use-attendance'; 

import { formatTime } from '@/lib/date';

interface AlertProps {
    isOpen: boolean;
    absensiStatus: AttendanceStatusResponse | undefined;
    setOpen: (value: boolean) => void;
    onScanUlang?: () => void;
    sholatTime?: string;
    initialStatus?: 'idle' | 'success';
}

export function Alert({ isOpen, absensiStatus, setOpen, onScanUlang, sholatTime = 'Dhuhr', initialStatus = 'idle' }: AlertProps) {
    const [show, setShow] = useState(isOpen);
    const [processStatus, setProcessStatus] = useState<'idle' | 'success' | 'error'>(initialStatus);
    const [errorMessage, setErrorMessage] = useState('');
    const [scanTime, setScanTime] = useState('');

    const { submitAttendance, isLoadingHistory: loading } = useAttendance();

    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => setShow(true), 0);

            // Set current time locked to WIB
            setScanTime(formatTime(new Date()));

            setErrorMessage('');
            setProcessStatus(initialStatus || 'idle');
            return () => clearTimeout(t);
        } else {
            const timer = setTimeout(() => setShow(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, initialStatus]); 

    const handleProcess = async () => {
        if (!absensiStatus?.id) return;
        setErrorMessage('');

        try {
            const isManual = absensiStatus.message === 'Manual Entry';
            const payload = {
                id_student: parseInt(absensiStatus.id),
                time: sholatTime,
                status: isManual ? absensiStatus.icode : 'Haid',
                method: isManual ? 'MANUAL' : 'SCAN',
                remarks: isManual ? absensiStatus.remarks : '',
                date: new Date(),
            };

            const response = await submitAttendance(payload);
            if (response.status === 'success') {
                setProcessStatus('success');
            } else {
                setProcessStatus('error');
                setErrorMessage(response.message || 'Gagal memproses data.');
            }
        } catch {
            setProcessStatus('error');
            setErrorMessage('Terjadi kesalahan koneksi.');
        }
    };

    const handleCloseAndResume = () => {
        if (processStatus === 'success') {
            toast.success("Data Berhasil Disimpan", { description: `${absensiStatus?.full_name} - ${sholatTime}`, duration: 3000, position: 'top-center' });
        }
        setOpen(false);
        onScanUlang?.();
    };

    if (!show) return null;

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`w-[85%] max-w-sm rounded-4xl p-6 bg-[#151419] border border-[#27272A] shadow-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <div className="flex flex-col items-center text-center gap-4 mb-6">
                    <div className={`p-4 rounded-full border-2 transition-all duration-500 ${processStatus === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : processStatus === 'error' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-white'}`}>
                        {processStatus === 'success' ? <CheckCircle2 size={32} /> : processStatus === 'error' ? <XCircle size={32} /> : <ScanLine size={32} />}
                    </div>
                    <div><h2 className="text-xl font-bold text-white">{processStatus === 'success' ? 'Data Tersimpan' : 'Konfirmasi Data'}</h2><p className="text-xs text-white/40 mt-1">{processStatus === 'success' ? 'Absensi berhasil dicatat.' : 'Pastikan data sesuai.'}</p></div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-[#1F1E23] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -mr-4 -mt-4"></div>
                        <div className="relative z-10">
                            <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-1">Nama Siswi</p>
                            <p className="text-white font-bold text-lg leading-tight mb-4">{absensiStatus?.full_name}</p>
                            <div className="flex items-center gap-4">
                                <div><p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">Kelas</p><p className="text-white font-mono text-sm">{absensiStatus?.class_name}</p></div>
                                <div className="h-8 w-px bg-white/10"></div>
                                <div><p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">NIS</p><p className="text-white font-mono text-sm">{absensiStatus?.nis}</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1 bg-[#1F1E23] p-3 rounded-xl border border-white/5 flex items-center justify-center gap-2"><Clock size={14} className="text-indigo-400" /><span className="text-white font-mono text-sm">{scanTime} WIB</span></div>
                        <div className="flex-1 bg-[#1F1E23] p-3 rounded-xl border border-white/5 flex items-center justify-center"><span className="text-white font-bold text-sm tracking-wide uppercase">{sholatTime}</span></div>
                    </div>
                    {processStatus === 'error' && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{errorMessage}</div>}
                </div>

                <div className="flex flex-col gap-3">
                    {processStatus === 'success' ? (
                        <Button className="w-full bg-white hover:bg-gray-200 text-black font-bold h-12 rounded-xl" onClick={handleCloseAndResume}>Tutup</Button>
                    ) : (
                        <>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-xl" onClick={handleProcess} disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : 'Proses Absensi'}
                            </Button>
                            {!loading && <button className="w-full py-3 text-xs text-white/40 hover:text-white transition-colors" onClick={handleCloseAndResume}>Batal & Scan Ulang</button>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}