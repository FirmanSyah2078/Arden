// src/components/dashboard/nav-group.tsx
"use client"

import { useState } from "react"
import {
  ChevronRight,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"

export const navItemVariants = cva("", {
  variants: {
    variant: {
      default: "",
      collapsible: "",
      action: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface NavItemType extends VariantProps<typeof navItemVariants> {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
    isActive?: boolean
    icon?: LucideIcon
  }[]
}

// =========================================================================
// VARIANT 1: COLLAPSIBLE ITEM (Punya Sub-menu)
// =========================================================================
function NavCollapsibleItem({ item }: { item: NavItemType }) {
  const { state, setOpen, isMobile } = useSidebar()
  const [isOpen, setIsOpen] = useState(item.isActive || false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (state === "collapsed" && open && !isMobile) {
      setOpen(true)
    }
    setIsOpen(open)
  }

  // 🔥 SIDEBAR KECIL: FLYOUT MENU COMPACT
  if (state === "collapsed" && !isMobile) {
    return (
      <SidebarMenuItem>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              tooltip={isDropdownOpen ? undefined : item.title}
              isActive={item.isActive || isDropdownOpen}
              className={cn(
                "border-none transition-colors duration-300 outline-none select-none hover:bg-white/5 focus-visible:ring-0 data-[active=true]:bg-white/5",
                !(item.isActive || isDropdownOpen) && "sidebar-shine"
              )}
            >
              {item.icon && (
                <item.icon
                  className={cn(
                    "transition-all duration-300",
                    item.isActive || isDropdownOpen
                      ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                      : "text-sidebar-foreground/50 hover:text-white"
                  )}
                />
              )}
              <span className="text-sm font-medium">{item.title}</span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="start"
            sideOffset={10}
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="animate-in fade-in zoom-in-95 w-36 rounded-xl border-white/10 bg-[#0a0a0a] p-1.5 text-white shadow-2xl"
          >
            {item.items?.map((subItem) => (
              <DropdownMenuItem
                key={subItem.title}
                asChild
                className={cn(
                  "relative mb-1 h-7 cursor-pointer overflow-hidden rounded-md text-[13px] font-medium transition-colors outline-none select-none last:mb-0",
                  subItem.isActive
                    ? "bg-primary/10 text-primary"
                    :
                      "sidebar-shine text-white/70 hover:bg-white/2 hover:text-white focus:bg-white/4 focus:text-white"
                )}
              >
                <Link
                  href={subItem.url || "#"}
                  className="flex w-full items-center gap-2.5 px-2"
                >
                  {subItem.icon && (
                    <subItem.icon
                      className={cn(
                        "size-4",
                        subItem.isActive
                          ? "text-primary"
                          : "text-sidebar-foreground/50"
                      )}
                    />
                  )}
                  <span>{subItem.title}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  // 🔥 SIDEBAR TERBUKA ATAU LAYAR HP: AKORDEON NORMAL
  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={handleOpenChange}
      className="group/collapsible"
    >
      <SidebarMenuItem className="group/menu-item">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={item.isActive && !isOpen}
            className={cn(
              "border-none bg-transparent transition-colors duration-300 outline-none select-none hover:bg-white/5 focus-visible:ring-0 data-[active=true]:bg-white/5 data-[state=open]:bg-transparent",
              !(item.isActive && !isOpen) && "sidebar-shine"
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  "transition-all duration-300",
                  item.isActive || isOpen
                    ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    : "text-sidebar-foreground/50 group-hover/menu-item:text-white group-hover/menu-item:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                )}
              />
            )}
            <span
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                item.isActive || isOpen
                  ? "text-white"
                  : "text-sidebar-foreground/70"
              )}
            >
              {item.title}
            </span>
            <ChevronRight className="text-sidebar-foreground/50 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={subItem.isActive}
                  className={cn(
                    "h-8 border-none transition-colors duration-300 outline-none select-none hover:bg-white/5 focus-visible:ring-0 data-[active=true]:bg-white/5",
                    !subItem.isActive && "sidebar-shine"
                  )}
                >
                  <Link
                    href={subItem.url || "#"}
                    className="flex items-center gap-2.5"
                  >
                    {subItem.icon && (
                      <subItem.icon
                        className={cn(
                          "size-3.5",
                          subItem.isActive
                            ? "text-white"
                            : "text-sidebar-foreground/40"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "text-[13px] font-medium transition-colors duration-300",
                        subItem.isActive
                          ? "text-white"
                          : "text-sidebar-foreground/70 hover:text-white"
                      )}
                    >
                      {subItem.title}
                    </span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

// =========================================================================
// KOMPONEN UTAMA: NAV GROUP
// =========================================================================
export function NavGroup({
  label,
  items,
}: {
  label?: string
  items: NavItemType[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="text-sidebar-foreground/50 font-sans text-xs font-medium capitalize select-none">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const variant = item.variant || "default"

          if (variant === "collapsible") {
            return <NavCollapsibleItem key={item.title} item={item} />
          }

          if (variant === "action") {
            return (
              <SidebarMenuItem key={item.title} className="group/menu-item">
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                  className={cn(
                    "border-none transition-colors duration-300 outline-none select-none hover:bg-white/5 focus-visible:ring-0 data-[active=true]:bg-white/5",
                    !item.isActive && "sidebar-shine"
                  )}
                >
                  <Link href={item.url || "#"}>
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "transition-all duration-300",
                          item.isActive
                            ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                            : "text-sidebar-foreground/50 group-hover/menu-item:text-white group-hover/menu-item:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors duration-300",
                        item.isActive
                          ? "text-white"
                          : "text-sidebar-foreground/70"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction className="text-sidebar-foreground/50 transition-colors select-none hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:ring-0">
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-48 rounded-xl border-white/10 bg-[#0a0a0a] p-1.5 text-white shadow-2xl"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    {/* 🔥 Samakan warnanya dan pasang sidebar-shine */}
                    <DropdownMenuItem className="sidebar-shine relative mb-0.5 h-8 cursor-pointer overflow-hidden rounded-md text-[13px] font-medium text-white/70 transition-colors outline-none select-none hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                      <Folder className="text-muted-foreground mr-2 h-4 w-4" />
                      <span>View Project</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="sidebar-shine relative mb-0.5 h-8 cursor-pointer overflow-hidden rounded-md text-[13px] font-medium text-white/70 transition-colors outline-none select-none hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white">
                      <Forward className="text-muted-foreground mr-2 h-4 w-4" />
                      <span>Share Project</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-white/10" />

                    {/* Tombol Delete biarkan merah, tapi rapikan kodenya */}
                    <DropdownMenuItem className="h-8 cursor-pointer rounded-md text-[13px] font-medium text-red-500 transition-colors outline-none select-none hover:bg-red-500/10 hover:text-red-500 focus:bg-red-500/10 focus:text-red-500">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            )
          }

          // ==========================================
          // VARIANT 3: DEFAULT (Link Polos)
          // ==========================================
          return (
            <SidebarMenuItem key={item.title} className="group/menu-item">
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.isActive}
                className={cn(
                  "border-none transition-colors duration-300 outline-none select-none hover:bg-white/5 focus-visible:ring-0 data-[active=true]:bg-white/5",
                  !item.isActive && "sidebar-shine"
                )}
              >
                <Link href={item.url || "#"}>
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "transition-all duration-300",
                        item.isActive
                          ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                          : "text-sidebar-foreground/50 group-hover/menu-item:text-white group-hover/menu-item:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      item.isActive
                        ? "text-white"
                        : "text-sidebar-foreground/70"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
