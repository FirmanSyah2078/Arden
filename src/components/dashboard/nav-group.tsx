"use client";

import { useState } from "react";
import {
  ChevronRight,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/sidebar";
import Link from "next/link";

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
});

export interface NavItemType extends VariantProps<typeof navItemVariants> {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    isActive?: boolean; 
  }[];
}

// =========================================================================
// VARIANT 1: COLLAPSIBLE ITEM (Punya Sub-menu)
// =========================================================================
function NavCollapsibleItem({ item }: { item: NavItemType }) {
  const [isOpen, setIsOpen] = useState(item.isActive || false);

  return (
    <Collapsible
      asChild
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem className="group/menu-item">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={item.title} 
            isActive={item.isActive && !isOpen}
            className={cn(
              "select-none transition-colors duration-300 hover:bg-white/5 focus-visible:ring-0 outline-none border-none bg-transparent data-[state=open]:bg-transparent",
              !(item.isActive && !isOpen) && "sidebar-shine"
            )}
          >
            {item.icon && (
              <item.icon 
                className={cn(
                  "transition-all duration-300",
                  (item.isActive || isOpen)
                    ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                    : "text-sidebar-foreground/50 group-hover/menu-item:text-white group-hover/menu-item:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                )} 
              />
            )}
            {/* 🔥 TYPOGRAPHY FIX: text-sm, font-medium, tracking-tight */}
            <span className={cn(
              "text-sm font-medium tracking-tight transition-colors duration-300", 
              (item.isActive || isOpen) ? "text-white" : "text-sidebar-foreground/70"
            )}>
              {item.title}
            </span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 text-sidebar-foreground/50" />
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
                    "select-none transition-colors duration-300 hover:bg-white/5 focus-visible:ring-0 outline-none border-none",
                    !subItem.isActive && "sidebar-shine"
                  )}
                >
                  <Link href={subItem.url || "#"}>
                    {/* 🔥 TYPOGRAPHY FIX SUB-MENU */}
                    <span className={cn(
                      "text-sm font-medium tracking-tight transition-colors duration-300", 
                      subItem.isActive ? "text-white" : "text-sidebar-foreground/70 hover:text-white"
                    )}>
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
  );
}

// =========================================================================
// KOMPONEN UTAMA: NAV GROUP
// =========================================================================
export function NavGroup({
  label,
  items,
}: {
  label?: string;
  items: NavItemType[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="select-none text-sidebar-foreground/50 font-sans text-[11px] uppercase tracking-[0.2em] font-semibold">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const variant = item.variant || "default";

          if (variant === "collapsible") {
            return <NavCollapsibleItem key={item.title} item={item} />;
          }

          // ==========================================
          // VARIANT 2: ACTION (Punya Titik Tiga)
          // ==========================================
          if (variant === "action") {
            return (
              <SidebarMenuItem key={item.title} className="group/menu-item">
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={item.isActive}
                  className={cn(
                    "select-none transition-colors duration-300 hover:bg-white/5 focus-visible:ring-0 outline-none border-none",
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
                    {/* 🔥 TYPOGRAPHY FIX */}
                    <span className={cn(
                      "text-sm font-medium tracking-tight transition-colors duration-300", 
                      item.isActive ? "text-white" : "text-sidebar-foreground/70"
                    )}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      className="select-none text-sidebar-foreground/50 hover:text-white hover:bg-white/10 focus-visible:ring-0 focus-visible:bg-white/10 focus-visible:text-white transition-colors"
                    >
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-48 rounded-lg bg-[#0a0a0a] border-white/10 text-white shadow-2xl"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer transition-colors text-sm font-medium">
                      <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>View Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer transition-colors text-sm font-medium">
                      <Forward className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="focus:bg-red-500/10 focus:text-red-500 text-red-500 cursor-pointer transition-colors text-sm font-medium">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
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
                  "select-none transition-colors duration-300 hover:bg-white/5 focus-visible:ring-0 outline-none border-none",
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
                  {/* 🔥 TYPOGRAPHY FIX */}
                  <span className={cn(
                    "text-sm font-medium tracking-tight transition-colors duration-300", 
                    item.isActive ? "text-white" : "text-sidebar-foreground/70"
                  )}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}