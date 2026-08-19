"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Droplet, Sparkles, Loader2, Edit3 } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogCancel, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { Form as FormUI, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from '@/components/ui/input';
import { AttendanceStatusResponse, DailyPrayer } from '@/types/api';

// --- VALIDATION SCHEMA: Ensures remarks are provided when status is "Menstruation" ---
const formSchema = z.object({
  status: z.enum(["Menstruation", "Pure"]),
  remarks: z.string().optional(),
}).refine((data) => {
  if (data.status === 'Menstruation' && (!data.remarks || data.remarks.trim() === '')) return false;
  return true;
}, { message: 'Please provide a reason for the menstruation status', path: ['remarks'] });

interface FormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  dataStudent: AttendanceStatusResponse | undefined;
  setPick: (data: AttendanceStatusResponse) => void;
  setSuccessPopup: (value: boolean) => void;
  sholat: DailyPrayer;
}

const REMARKS_OPTIONS = [
  'Forgot Card',
  'Lost Card',
  'Sick',
  'Permitted/Leave',
  'Other'
];

export function Form({ isOpen, setIsOpen, dataStudent, setPick, setSuccessPopup, sholat }: FormProps) {
  const [isLainnya, setIsLainnya] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { status: "Pure", remarks: "" },
  });

  const watchStatus = form.watch("status");
  useEffect(() => {
    form.setValue("remarks", "");
  }, [watchStatus, form]);
  const watchRemarks = form.watch("remarks");

  // --- SUBMISSION HANDLER: Maps form values to attendance status response ---
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!dataStudent) return;
    setPick({
      ...dataStudent,
      status: 'idle',
      message: 'Manual Entry',
      icode: values.status,
      remarks: values.status === 'Pure' ? 'Attended Prayer' : values.remarks
    });
    setSuccessPopup(true);
    setIsOpen(false);
    form.reset();
    setIsLainnya(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-none text-white p-6 shadow-2xl overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <AlertDialogTitle className="sr-only">Attendance Details</AlertDialogTitle>
        <AlertDialogDescription className="sr-only">Confirm attendance status for {dataStudent?.full_name}</AlertDialogDescription>

        {!dataStudent ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="animate-spin text-white/40" size={32} />
            <p className="text-xs text-white/40">Preparing form...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 mb-6 pb-4 border-b border-white/5">
              <span className="text-xl font-bold tracking-tight text-white">
                Attendance Details
              </span>
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                Select attendance status
              </span>
            </div>

            <FormUI {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Student Info Card */}
                <div className="bg-[#1F1E23] p-5 rounded-2xl border border-white/5 relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-1">Student Name</p>
                    <p className="text-white font-bold text-lg leading-tight mb-4">{dataStudent.full_name}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">Class</p>
                        <p className="text-white font-mono text-sm">{dataStudent.class_name}</p>
                      </div>
                      <div className="h-8 w-px bg-white/5"></div>
                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">Student ID (NIS)</p>
                        <p className="text-white font-mono text-sm">{dataStudent.nis}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Status Selection */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <label className="text-white/40 text-[10px] uppercase tracking-wider font-bold block mb-1">Attendance Status</label>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-3">
                          <div className="relative flex items-center justify-center">
                            <RadioGroupItem value="Menstruation" id="r-haid" className="peer sr-only" />
                            <label htmlFor="r-haid" className="flex flex-col items-center justify-center w-full p-3 rounded-2xl border border-white/5 bg-[#1F1E23] peer-data-[state=checked]:border-red-400/50 peer-data-[state=checked]:bg-red-900/30 transition-all cursor-pointer hover:bg-[#2A292F] group">
                              <Droplet className="w-5 h-5 mb-1 text-red-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold text-white">Menstruation</span>
                              <span className="text-[9px] text-white/30 mt-0.5 leading-none">Excused</span>
                            </label>
                          </div>
                          <div className="relative flex items-center justify-center">
                            <RadioGroupItem value="Pure" id="r-suci" className="peer sr-only" />
                            <label htmlFor="r-suci" className="flex flex-col items-center justify-center w-full p-3 rounded-2xl border border-white/5 bg-[#1F1E23] peer-data-[state=checked]:border-green-400/50 peer-data-[state=checked]:bg-green-900/30 transition-all cursor-pointer hover:bg-[#2A292F] group">
                              <Sparkles className="w-5 h-5 mb-1 text-green-400 group-hover:scale-110 transition-transform" />
                              <span className="text-xs font-bold text-white">Present</span>
                              <span className="text-[9px] text-white/30 mt-0.5 leading-none">Attended prayer</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      {form.formState.errors.status && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] text-center font-medium tracking-wide">
                          {form.formState.errors.status.message}
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Conditional Remarks Section */}
                {watchStatus === 'Menstruation' && (
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel
                          className={`text-[10px] uppercase tracking-widest font-bold block ${
                            form.formState.errors.remarks ? "text-red-400" : "text-white/40"
                          }`}
                        >
                          Remarks / Reason
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {REMARKS_OPTIONS.map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    field.onChange(option === 'Other' ? '' : option);
                                    setIsLainnya(option === 'Other');
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-[10px] font-medium transition-all border whitespace-nowrap ${(option === "Other" ? isLainnya : watchRemarks === option)

                                    ? 'bg-[#2A292F] border-white/20 text-white shadow-inner ring-1 ring-white/10'
                                    : 'bg-[#1F1E23] border-white/5 text-white/40 hover:text-white/60'
                                    }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                            {isLainnya && (
                              <div className="relative flex-1 animate-in fade-in zoom-in-95 duration-300">
                                <Edit3
                                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 ${
                                    form.formState.errors.remarks ? "text-red-400" : "text-white/30"
                                  }`}
                                />
                                <Input
                                  placeholder="Write reason..."
                                  className={`pl-8 bg-[#1F1E23] text-white text-xs h-12 rounded-2xl outline-none transition-all duration-300 ring-0! ring-offset-0! ${
                                    form.formState.errors.remarks
                                      ? "border-red-400/60 focus:border-red-400 focus:ring-1 focus:ring-red-400/20"
                                      : "border-white/10 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
                                  }`}
                                  value={field.value}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        {form.formState.errors.remarks && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] text-center font-medium tracking-wide">
                            {form.formState.errors.remarks.message}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex flex-col gap-3 pt-4">
                  <Button type="submit" className="w-full rounded-2xl h-12 bg-indigo-600 text-white hover:bg-indigo-500 font-bold transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/20">
                    Review Attendance
                  </Button>
                  <AlertDialogCancel className="w-full bg-[#1F1E23] border border-white/5 text-white hover:bg-[#2A292F] rounded-2xl h-12 mt-0 transition-all active:scale-[0.98]">
                    Cancel
                  </AlertDialogCancel>
                </div>
              </form>
            </FormUI>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}