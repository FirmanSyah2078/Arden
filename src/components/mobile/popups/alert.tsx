'use client';

import { useEffect, useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAttendance } from '@/hooks/mobile/use-attendance'; 

import { formatTime } from '@/lib/date';
import { AttendanceStatusResponse, DailyPrayer } from '@/types/api';

interface AlertProps {
    isOpen: boolean;
    absensiStatus: AttendanceStatusResponse | undefined;
    setOpen: (value: boolean) => void;
    onScanUlang?: () => void;
    sholatTime?: string;
    initialStatus?: 'idle' | 'success';
}

export function Alert({ isOpen, absensiStatus, setOpen, onScanUlang, sholatTime = 'Dhuhr', initialStatus = 'idle' }: AlertProps) {
    const [processStatus, setProcessStatus] = useState<'idle' | 'success' | 'error'>(initialStatus);
    const [errorMessage, setErrorMessage] = useState('');
    const [scanTime, setScanTime] = useState('');

    const { submitAttendance, isLoadingHistory: loading } = useAttendance();

    useEffect(() => {
        if (isOpen) {
            setScanTime(formatTime(new Date()));
            setErrorMessage('');
            setProcessStatus(initialStatus || 'idle');
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

    const getStatusConfig = () => {
        switch (processStatus) {
            case 'success':
                return {
                    title: 'Data Tersimpan',
                    subtitle: 'Absensi berhasil dicatat.',
                    textCol: 'text-emerald-400'
                };
            case 'error':
                return {
                    title: 'Gagal Simpan',
                    subtitle: 'Terjadi kesalahan sistem.',
                    textCol: 'text-red-400'
                };
            default:
                return {
                    title: 'Konfirmasi Data',
                    subtitle: 'Pastikan data sesuai.',
                    textCol: 'text-white'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent 
                showCloseButton={false}
                className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-white/10 text-white p-6 shadow-2xl"
            >
                <DialogTitle className="sr-only">
                    {config.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    {config.subtitle}
                </DialogDescription>

                <div className="flex flex-col gap-1 mb-8 pb-4 border-b border-white/10">
                    <span className={`text-xl font-bold tracking-tight ${config.textCol}`}>
                        {config.title}
                    </span>
                    <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                        {config.subtitle}
                    </span>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
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
                        <div className="flex-1 bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex items-center justify-center gap-2">
                            <Clock size={14} className="text-white/60" />
                            <span className="text-white font-mono text-sm">{scanTime} WIB</span>
                        </div>
                        <div className="flex-1 bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex items-center justify-center">
                            <span className="text-white font-bold text-sm tracking-wide uppercase">{sholatTime}</span>
                        </div>
                    </div>
                    {processStatus === 'error' && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{errorMessage}</div>}
                </div>

                <div className="flex flex-col gap-3">
                    {processStatus === 'success' ? (
                        <Button className="w-full bg-white hover:bg-gray-200 text-black font-bold h-12 rounded-2xl" onClick={handleCloseAndResume}>Tutup</Button>
                    ) : (
                        <>
                            <Button className="w-full bg-white hover:bg-gray-200 text-black font-bold h-12 rounded-2xl" onClick={handleProcess} disabled={loading}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : 'Proses Absensi'}
                            </Button>
                            {!loading && <Button variant="outline" className="w-full bg-white/5 text-white border-white/10 hover:bg-white/10 rounded-2xl h-12" onClick={handleCloseAndResume}>Batal & Scan Ulang</Button>}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
