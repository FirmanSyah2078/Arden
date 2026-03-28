"use client"

import * as React from "react"
import { UserCircle, Shield, Link as LinkIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

// Import form tabs
import ProfileForm from "./tabs/profile-form"
import SecurityForm from "./tabs/security-form"
import ConnectionsForm from "./tabs/connections-form"
// Import ornamen kustom
import { Ornament } from "@/components/ornament" 

const settingsNav = [
  { id: "profile", name: "Profile", icon: UserCircle },
  { id: "security", name: "Security", icon: Shield },
  { id: "connections", name: "Connections", icon: LinkIcon },
]

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = React.useState("profile")

  const renderContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileForm />
      case "security": return <SecurityForm />
      case "connections": return <ConnectionsForm />
      default: return <ProfileForm />
    }
  }

  const activeMenu = settingsNav.find((item) => item.id === activeTab) || settingsNav[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-125 md:max-w-187.5 border-white/10 bg-background shadow-2xl rounded-xl">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your ARDEN settings here.
        </DialogDescription>
        
        <SidebarProvider className="items-start">
          {/* --- SIDEBAR KIRI --- */}
          <Sidebar collapsible="none" className="hidden relative md:flex w-55 border-r border-white/5 bg-[#0a0a0a]/20 overflow-hidden">
            <SidebarContent className="relative z-10">
              <SidebarGroup>
                <div className="px-4 py-5 space-y-1">
                  <h4 className="text-sm font-semibold tracking-tight text-white">Settings</h4>
                  <p className="text-xs text-sidebar-foreground/60">Manage your account</p>
                </div>
                <SidebarGroupContent>
                  <SidebarMenu className="px-2">
                    {settingsNav.map((item) => {
                      const isActive = activeTab === item.id
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={cn(
                              "cursor-pointer transition-colors duration-300 hover:bg-white/5 data-[active=true]:bg-white/5 focus-visible:ring-0 outline-none border-none h-8 mb-0.5",
                              !isActive && "sidebar-shine group/menu-item"
                            )}
                            onClick={(e) => {
                              e.preventDefault()
                              setActiveTab(item.id)
                            }}
                          >
                            <button className="w-full flex items-center justify-start gap-2.5">
                              <item.icon className={cn("size-4 shrink-0 transition-all", isActive ? "text-white" : "text-sidebar-foreground/50")} />
                              <span className={cn("text-[13px] font-medium", isActive ? "text-white" : "text-sidebar-foreground/70")}>
                                {item.name}
                              </span>
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            {/* ORNAMEN DI POJOK BAWAH SIDEBAR */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <Ornament className="w-full h-full" />
            </div>
          </Sidebar>

          {/* --- KONTEN KANAN --- */}
          {/* 🔥 Kunci simpelnya Shadcn: Pakai tinggi statis (h-[500px]) di tag main */}
          <main className="flex h-125 flex-1 flex-col overflow-hidden bg-background/50">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/5 px-6 backdrop-blur-md">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage className="text-muted-foreground font-medium capitalize text-[13px]">
                      Settings
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block text-white/20" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="transition-colors capitalize font-medium text-foreground text-[13px]">
                      {activeMenu.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>

            {/* Area Scrollable Form */}
            <div className="flex flex-1 flex-col overflow-y-auto p-6 scroll-smooth no-scrollbar">
              <div className="max-w-xl mx-auto w-full pb-8">
                {renderContent()}
              </div>
            </div>
          </main>

        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}