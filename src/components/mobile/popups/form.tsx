'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Droplet, Sparkles, Loader2, MessageSquare, Edit3 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Form as FormUI, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from '@/components/ui/input';
import { AttendanceStatusResponse, DailyPrayer } from '@/types/api';

const formSchema = z.object({
  status: z.enum(['Haid', 'Suci']),
  remarks: z.string().optional(),
}).refine((data) => {
  if (data.status === 'Haid' && (!data.remarks || data.remarks.trim() === '')) return false;
  return true;
}, { message: 'Keterangan wajib diisi untuk status Haid', path: ['remarks'] });

interface FormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  dataStudent: AttendanceStatusResponse | undefined;
  setPick: (data: AttendanceStatusResponse) => void;
  setSuccessPopup: (value: boolean) => void;
  sholat: DailyPrayer;
}

const REMARKS_OPTIONS = [
  'Lupa Bawa Kartu',
  'Kartu Hilang',
  'Sakit',
  'Dispen/Izin',
  'Lainnya'
];

export function Form({ isOpen, setIsOpen, dataStudent, setPick, setSuccessPopup, sholat }: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { status: 'Haid', remarks: '' },
  });

  const watchStatus = form.watch("status");
  const watchRemarks = form.watch("remarks");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!dataStudent) return;
    setPick({
      ...dataStudent,
      status: 'idle',
      message: 'Manual Entry',
      icode: values.status,
      remarks: values.status === 'Suci' ? 'Hadir Sholat' : values.remarks
    });
    setSuccessPopup(true);
    setIsOpen(false);
    form.reset();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-white/10 text-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <AlertDialogTitle className="sr-only">Konfirmasi Manual</AlertDialogTitle>
        <AlertDialogDescription className="sr-only">Konfirmasi status kehadiran untuk {dataStudent?.full_name}</AlertDialogDescription>

        {!dataStudent ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="animate-spin text-white/40" size={32} />
            <p className="text-xs text-white/40">Menyiapkan form...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1 mb-8 pb-4 border-b border-white/10">
              <span className="text-xl font-bold tracking-tight text-white">Konfirmasi Manual</span>
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                Manual Attendance Confirmation
              </span>
            </div>

            <FormUI {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-white/3 p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-1">Nama Siswi</p>
                    <p className="text-white font-bold text-lg leading-tight mb-4">{dataStudent.full_name}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">Kelas</p>
                        <p className="text-white font-mono text-sm">{dataStudent.class_name}</p>
                      </div>
                      <div className="h-8 w-px bg-white/10"></div>
                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">NIS</p>
                        <p className="text-white font-mono text-sm">{dataStudent.nis}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <label className="text-white/40 text-[10px] uppercase tracking-wider font-bold block mb-1">Status Kehadiran</label>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-3">
                          <div className="relative flex items-center justify-center">
                            <RadioGroupItem value="Haid" id="r-haid" className="peer sr-only" />
                            <label htmlFor="r-haid" className="flex flex-col items-center justify-center w-full p-3 rounded-2xl border border-white/5 bg-white/3 peer-data-[state=checked]:border-white/40 peer-data-[state=checked]:bg-white/10 transition-all cursor-pointer hover:bg-white/5 group">
                              <Droplet className="w-5 h-5 mb-1 text-red-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold text-white">Haid</span>
                              <span className="text-[9px] text-white/30 mt-0.5 leading-none">Berhalangan</span>
                            </label>
                          </div>
                          <div className="relative flex items-center justify-center">
                            <RadioGroupItem value="Suci" id="r-suci" className="peer sr-only" />
                            <label htmlFor="r-suci" className="flex flex-col items-center justify-center w-full p-3 rounded-2xl border border-white/5 bg-white/3 peer-data-[state=checked]:border-white/40 peer-data-[state=checked]:bg-white/10 transition-all cursor-pointer hover:bg-white/5 group">
                              <Sparkles className="w-5 h-5 mb-1 text-green-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold text-white">Sholat</span>
                              <span className="text-[9px] text-white/30 mt-0.5 leading-none">Kondisi Suci</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchStatus === 'Haid' && (
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-white/40 text-[10px] uppercase tracking-widest font-bold block">Keterangan / Alasan</FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {REMARKS_OPTIONS.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => field.onChange(option)}
                                  className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all border whitespace-nowrap ${watchRemarks === option
                                    ? 'bg-white/10 border-white/40 text-white shadow-inner ring-1 ring-white/20'
                                    : 'bg-white/3 border-white/10 text-white/40 hover:text-white/60'
                                    }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                            {watchRemarks === 'Lainnya' && (
                              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="relative flex-1">
                                  <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30" />
                                  <Input
                                    placeholder="Tuliskan alasan..."
                                    className="pl-8 bg-white/2 border-white/10 text-white text-xs h-11 rounded-xl focus-visible:ring-white/20"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex flex-col gap-3 pt-4">
                  <Button type="submit" className="w-full rounded-2xl h-12 bg-white text-black hover:bg-white/90 font-bold transition-all active:scale-[0.98] shadow-lg">
                    Proses
                  </Button>
                  <AlertDialogCancel className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl h-12 mt-0 transition-all active:scale-[0.98]">
                    Ulangi
                  </AlertDialogCancel>
                </div>
              </form>
            </FormUI>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
