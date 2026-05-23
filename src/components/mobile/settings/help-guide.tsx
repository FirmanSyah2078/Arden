'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useDock } from '@/context/dock-context';

export default function HelpGuide() {
  const { isHelpOpen, setIsHelpOpen } = useDock();

  return (
    <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-[92%] max-w-sm rounded-3xl bg-[#151419] border-white/10 text-white p-6 shadow-2xl"
      >
        <div className="flex flex-col h-full w-full">
          {/* Header Section - Professional English */}
          <div className="flex flex-col gap-1 mb-8 pb-4 border-b border-white/10">
            <DialogTitle className="text-xl font-bold tracking-tight">
              Operational Guidelines Center
            </DialogTitle>
            <DialogDescription className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
              System Operational Documentation
            </DialogDescription>
          </div>
          {/* Main Content Area - Scrollable documentation */}
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
