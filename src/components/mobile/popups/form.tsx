'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, Droplet, Sparkles, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Form as FormUI, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AttendanceStatusResponse, DailyPrayer } from '@/types/api';

const formSchema = z.object({
  status: z.enum(['Haid', 'Suci']),
  remarks: z.string().optional(),
}).refine((data) => {
  if (data.status === 'Haid' && (!data.remarks || data.remarks.trim() === '')) return false;
  return true;
}, { message: 'Wajib milih alasan kalau Haid', path: ['remarks'] });

interface FormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  dataStudent: AttendanceStatusResponse | undefined; 
  setPick: (data: AttendanceStatusResponse) => void;
  setSuccessPopup: (value: boolean) => void; 
  sholat: DailyPrayer;
}

export function Form({ isOpen, setIsOpen, dataStudent, setPick, setSuccessPopup, sholat }: FormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { status: 'Haid', remarks: '' },
  });

  const watchStatus = form.watch("status");

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
      <AlertDialogContent className="w-[90%] max-w-95 sm:max-w-100 rounded-[16px] bg-[#151419] border-[#27272A] text-white p-6">
        {!dataStudent ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="animate-spin text-white/40" size={32} />
            <p className="text-xs text-white/40">Menyiapkan form...</p>
          </div>
        ) : (
          <>
            <AlertDialogHeader className="mb-2">
              <AlertDialogTitle className="flex items-center gap-2 text-lg font-bold">
                <ClipboardList className="w-5 h-5 text-white/70" /> Konfirmasi Manual
              </AlertDialogTitle>
              <AlertDialogDescription className="sr-only">Konfirmasi untuk {dataStudent?.full_name}</AlertDialogDescription>
            </AlertDialogHeader>

            <FormUI {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="bg-[#1F1E23] p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="space-y-1"><label className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Nama Lengkap</label><div className="font-medium text-white text-base truncate">{dataStudent.full_name}</div></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[10px] uppercase tracking-wider text-white/40 font-bold">NIS</label><div className="font-mono text-white/80 text-sm">{dataStudent.nis}</div></div>
                    <div className="space-y-1"><label className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Kelas</label><div className="text-white/80 text-sm">{dataStudent.class_name}</div></div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm font-semibold text-white">Status Kehadiran</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-3">
                          <FormItem className="flex items-center justify-center space-y-0">
                            <FormControl><RadioGroupItem value="Haid" id="r-haid" className="peer sr-only" /></FormControl>
                            <label htmlFor="r-haid" className="flex flex-col items-center justify-center w-full p-3 rounded-xl border border-white/10 bg-[#1F1E23] peer-data-[state=checked]:border-red-500/50 peer-data-[state=checked]:bg-red-500/10 transition-all cursor-pointer hover:bg-white/5">
                              <Droplet className="w-6 h-6 mb-1 text-red-400" /><span className="text-xs font-medium text-white/80">Haid</span>
                            </label>
                          </FormItem>
                          <FormItem className="flex items-center justify-center space-y-0">
                            <FormControl><RadioGroupItem value="Suci" id="r-suci" className="peer sr-only" /></FormControl>
                            <label htmlFor="r-suci" className="flex flex-col items-center justify-center w-full p-3 rounded-xl border border-white/10 bg-[#1F1E23] peer-data-[state=checked]:border-green-500/50 peer-data-[state=checked]:bg-green-500/10 transition-all cursor-pointer hover:bg-white/5">
                              <Sparkles className="w-6 h-6 mb-1 text-green-400" /><span className="text-xs font-medium text-white/80">Sholat (Suci)</span>
                            </label>
                          </FormItem>
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
                      <FormItem>
                        <FormLabel className="text-sm font-semibold">Keterangan / Alasan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="bg-[#1F1E23] border-white/10 text-white h-12 rounded-xl"><SelectValue placeholder="Pilih alasan manual..." /></SelectTrigger></FormControl>
                          <SelectContent className="bg-[#1F1E23] border-[#3F3F3F] text-white">
                            <SelectItem value="Lupa Bawa Kartu">Lupa Bawa Kartu</SelectItem><SelectItem value="Kartu Hilang">Kartu Hilang</SelectItem><SelectItem value="Sakit">Sakit (UKS/Rumah)</SelectItem><SelectItem value="Dispen/Izin">Dispen / Izin Pulang</SelectItem><SelectItem value="Lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex gap-3 pt-2">
                  <AlertDialogCancel className="flex-1 bg-transparent border border-white/10 text-white hover:bg-white/5 hover:text-white rounded-xl h-12 mt-0">Ulangi</AlertDialogCancel>
                  <Button type="submit" className="flex-1 rounded-xl h-12">Proses</Button>
                </div>
              </form>
            </FormUI>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}