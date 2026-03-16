import {
  LayoutDashboard,
  Database,
  School,
  FileText,
  Settings2,
  BookOpen,
  ShieldAlert,
  Eye
} from "lucide-react";
import { type NavItemType } from "@/components/dashboard/nav-group";

// ============================================================================
// 1. DEFINISI ROLE ARDEN (SISTEM HIERARKI KASTA)
// ============================================================================
export const systemRoles = [
  { name: "Admin", logo: ShieldAlert, plan: "Full Access", level: 100 },
  { name: "Pemantau", logo: Eye, plan: "Read-Only", level: 50 },
];

// ============================================================================
// 2. MAPPING MENU BERDASARKAN ROLE
// ============================================================================
export const roleMenus: Record<string, { label: string; items: NavItemType[] }[]> = {
  Admin: [
    {
      label: "Management",
      items: [
        { title: "Home", url: "/dashboard", icon: LayoutDashboard, variant: "default" },
        { title: "Classes", url: "/dashboard/class", icon: School, variant: "default" },
        { title: "Database", url: "/dashboard/database", icon: Database, variant: "default" },
        { title: "Recapitulation", url: "/dashboard/rekapitulasi", icon: FileText, variant: "default" },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Settings", url: "/dashboard/settings", icon: Settings2, variant: "default" },
        { title: "Documentation", url: "/dashboard/docs", icon: BookOpen, variant: "default" },
      ],
    },
  ],
  Pemantau: [
    {
      label: "Overview",
      items: [
        { title: "Home", url: "/dashboard", icon: LayoutDashboard, variant: "default" },
        { title: "Recapitulation", url: "/dashboard/rekapitulasi", icon: FileText, variant: "default" },
      ],
    },
  ]
};

// ============================================================================
// 3. FUNGSI PINTAR PENCARI BREADCRUMB OTOMATIS
// ============================================================================
export function getActiveBreadcrumb(pathname: string, roleName: string) {
  const menus = roleMenus[roleName] || roleMenus["Pemantau"];

  for (const group of menus) {
    for (const item of group.items) {
      // Cek apakah menu utama cocok dengan URL (Persis sama)
      if (item.url === pathname) {
        return { label: group.label, title: item.title };
      }
      // Cek apakah sub-menu (collapsible) cocok dengan URL
      if (item.items) {
        for (const sub of item.items) {
          if (sub.url === pathname) {
            return {
              label: group.label,
              title: item.title,
              subTitle: sub.title,
            };
          }
        }
      }
    }
  }

  // Fallback jika halaman tidak ada di daftar menu (contoh: 404 atau /profile)
  return { label: "System", title: "Overview" };
}