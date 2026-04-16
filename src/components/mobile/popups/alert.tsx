'use client';

import { useEffect, useState } from 'react';
import { Clock, Loader2, CheckCircle2, AlertCircle, User } from 'lucide-react';
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
            toast.success("Data Berhasil Disimpan", { 
                description: `${absensiStatus?.full_name} - ${sholatTime}`, 
                duration: 3000, 
                position: 'top-center' 
            });
        }
        setOpen(false);
        onScanUlang?.();
    };

    const getStatusConfig = () => {
        switch (processStatus) {
            case 'success':
                return {
                    title: 'Berhasil!',
                    subtitle: 'Data absensi telah tersimpan.',
                    icon: <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-in zoom-in duration-500" />,
                    btnClass: 'bg-white text-black hover:bg-white/90',
                    textCol: 'text-emerald-400'
                };
            case 'error':
                return {
                    title: 'Gagal!',
                    subtitle: 'Ada kendala saat menyimpan data.',
                    icon: <AlertCircle className="w-16 h-16 text-red-400 animate-in shake duration-300" />,
                    btnClass: 'bg-red-500 text-white hover:bg-red-400',
                    textCol: 'text-red-400'
                };
            default:
                return {
                    title: 'Konfirmasi',
                    subtitle: 'Periksa kembali data siswi.',
                    icon: <User className="w-16 h-16 text-white/20" />,
                    btnClass: 'bg-white text-black hover:bg-white/90',
                    textCol: 'text-white'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent
                showCloseButton={false}
                className="w-[92%] max-w-sm rounded-[40px] bg-[#151419] border-white/10 text-white p-8 shadow-2xl overflow-hidden"
            >
                <DialogTitle className="sr-only">{config.title}</DialogTitle>
                <DialogDescription className="sr-only">{config.subtitle}</DialogDescription>

                {/* Status Header */}
                <div className="flex flex-col items-center text-center mb-10">
                    <div className="mb-6 p-5 rounded-full bg-white/[0.03] border border-white/5 shadow-inner relative">
                        <div className="absolute inset-0 blur-xl bg-white/5 rounded-full" />
                        {config.icon}
                    </div>
                    <h2 className={`text-3xl font-bold tracking-tight ${config.textCol}`}>
                        {config.title}
                    </h2>
                    <p className="text-[11px] text-white/30 font-mono uppercase tracking-widest mt-2">
                        {config.subtitle}
                    </p>
                </div>

                {/* User Info Card */}
                <div className="bg-white/[0.05] backdrop-blur-md p-6 rounded-3xl border border-white/10 mb-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-white/20 rounded-l-3xl" />
                    
                    <div className="flex flex-col gap-5 relative z-10">
                        <div>
                            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-1">Nama Siswi</p>
                            <p className="text-white font-bold text-xl leading-tight tracking-tight">{absensiStatus?.full_name}</p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-1">Kelas</p>
                                <p className="text-white font-mono text-sm font-medium">{absensiStatus?.class_name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-1">NIS</p>
                                <p className="text-white font-mono text-sm font-medium">{absensiStatus?.nis}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timing Display */}
                <div className="flex gap-3 mb-10">
                    <div className="flex-1 bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex items-center justify-center gap-2 shadow-sm">
                        <Clock size={14} className="text-white/40" />
                        <span className="text-white font-mono text-xs">{scanTime} <span className="text-white/30">WIB</span></span>
                    </div>
                    <div className="flex-1 bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold text-xs tracking-wide uppercase">{sholatTime}</span>
                    </div>
                </div>

                {processStatus === 'error' && (
                    <div className="mb-8 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                        {errorMessage}
                    </div>
                )}

                {/* Primary Action */}
                <div className="flex flex-col gap-3">
                    {processStatus === 'success' ? (
                        <Button 
                            className={`w-full ${config.btnClass} font-bold h-14 rounded-2xl transition-all active:scale-[0.98] text-sm shadow-lg`} 
                            onClick={handleCloseAndResume}
                        >
                            Selesai
                        </Button>
                    ) : (
                        <>
                            <Button 
                                className={`w-full ${config.btnClass} font-bold h-14 rounded-2xl transition-all active:scale-[0.98] text-sm shadow-lg`} 
                                onClick={handleProcess} 
                                disabled={loading}
                            >
                                {loading ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
                                ) : 'Simpan Absensi'}
                            </Button>
                            {!loading && (
                                <Button 
                                    variant="outline" 
                                    className="w-full bg-transparent text-white/60 border-white/10 hover:bg-white/5 hover:text-white rounded-2xl h-12 transition-all text-xs" 
                                    onClick={handleCloseAndResume}
                                >
                                    Batal & Scan Ulang
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
