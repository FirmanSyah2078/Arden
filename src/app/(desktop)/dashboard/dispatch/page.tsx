// src/app/(desktop)/dashboard/dispatch/page.tsx
"use client";

import { useCommunications, DEFAULT_WARNING_MESSAGE } from "@/hooks/communications/use-communications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, MessageSquareWarning, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DispatchPage() {
  const { settings, isLoading, isSaving, isDraftModified, handleChange, handleSave } = useCommunications();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-background selection:bg-primary/20">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-1 w-full">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-foreground font-jakarta">Dispatch</h1>
            <p className="text-sm text-muted-foreground leading-relaxed w-full font-inter">
              Manage notification templates and system alert formats for administrative violations.
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-linear-to-r from-border via-border/50 to-transparent" />
      </header>

      <main className="flex-1 w-full pb-8">
        <div className="mx-auto max-w-4xl w-full">
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="rounded-3xl border border-border/60 bg-card shadow-lg overflow-hidden">
              <CardHeader className="border-b border-border/40 bg-muted/5 pb-4">
                <CardTitle className="text-[16px] font-bold tracking-tight font-jakarta">Menstrual Warning Format</CardTitle>
                <CardDescription className="text-[12px] text-muted-foreground font-inter">This text will be recorded in the student's administrative violation history.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between p-4 border border-border/40 bg-muted/5 rounded-2xl transition-colors hover:bg-muted/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MessageSquareWarning className="size-4 text-minimal" />
                      <div className="text-[13px] font-bold font-jakarta text-foreground">Use Custom Message</div>
                    </div>
                    <p className="text-[12px] text-muted-foreground font-inter">Toggle to write your own warning text instead of the system default.</p>
                  </div>
                  <Switch disabled={isLoading} checked={settings.isNotificationActive} onCheckedChange={(val) => handleChange("isNotificationActive", val)} />
                </div>

                <div className="space-y-2.5 relative">
                  <div className="text-[13px] font-bold text-foreground/80 font-jakarta pl-1">Warning Message Content</div>
                  <div className="relative">
                    <textarea 
                      id="message" spellCheck={false} disabled={!settings.isNotificationActive || isLoading}
                      value={settings.isNotificationActive ? settings.warningMessage : DEFAULT_WARNING_MESSAGE} 
                      onChange={(e) => handleChange("warningMessage", e.target.value)}
                      placeholder="Enter custom warning message..."
                      className={cn(
                        "w-full min-h-20 p-4 bg-background/60 border border-border/50 hover:border-foreground/30 focus:bg-background focus-visible:bg-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-foreground/50 rounded-xl shadow-inner text-[13px] text-foreground transition-all duration-300 resize-y font-inter",
                        (!settings.isNotificationActive || isLoading) && "opacity-50 cursor-not-allowed bg-background/40 text-muted-foreground",
                        isLoading && "animate-pulse text-transparent"
                      )}
                    />
                    {!settings.isNotificationActive && !isLoading && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-muted/20 border border-border/50 rounded-md text-[10px] font-bold uppercase tracking-widest text-muted-foreground shadow-sm pointer-events-none font-inter">
                        <Info className="size-3" /> System Default
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/5 flex justify-end border-t border-border/40 p-4">
                <Button type="submit" disabled={isSaving || isLoading || !isDraftModified} className={cn("h-9 px-5 rounded-lg font-bold text-[12px] transition-colors shadow-sm group", (isSaving || isLoading || !isDraftModified) ? "bg-muted text-muted-foreground pointer-events-none" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                  {isSaving ? "Updating..." : <><Save className="size-3.5 mr-2 group-hover:ar-bounce-x" /> Update Format</>}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}