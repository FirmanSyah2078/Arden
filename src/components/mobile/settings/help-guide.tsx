'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface HelpGuideProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function HelpGuide({ isOpen, setIsOpen }: HelpGuideProps) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent 
                showCloseButton={false}
                className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-white/10 text-white p-6 shadow-2xl"
            >
                <div className="flex flex-col h-full w-full">
                    <div className="flex flex-col gap-1 mb-8 pb-4 border-b border-white/10">
                        <DialogTitle className="text-xl font-bold tracking-tight">
                            Pusat Panduan Operasional
                        </DialogTitle>
                        <DialogDescription className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                            Operational Guidelines Center
                        </DialogDescription>
                    </div>
                    <ScrollArea className="flex-1 h-[60vh]">
                        <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-in fade-in duration-500">
                            <p className="text-white/20 text-xs font-mono italic">Content coming soon...</p>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
