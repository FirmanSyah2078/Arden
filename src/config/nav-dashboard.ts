import {
  LayoutDashboard,
  BookUser,
  School,
  FileText,
  BookOpen,
  ShieldAlert,
  Eye,
  Terminal,  // Icon untuk Logs
  GanttChart,   // Untuk Planning
  Waves,        // Untuk Phases
  Satellite,    // Untuk Dispatch
  Waypoints,    // Untuk Bridges
  Hexagon       // Untuk Globals
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
      label: "Workspace",
      items: [
        { title: "Home", url: "/dashboard", icon: LayoutDashboard, variant: "default" },
        { title: "Classes", url: "/dashboard/class", icon: School, variant: "default" },
        {
          title: "Directory",
          url: "#",
          icon: BookUser,
          variant: "collapsible",
          items: [
            { title: "Students", url: "/dashboard/directory/students" },
            { title: "Classes", url: "/dashboard/directory/classes" },
            { title: "Users", url: "/dashboard/directory/users" },
          ]
        },
        { title: "Recapitulation", url: "/dashboard/rekapitulasi", icon: FileText, variant: "default" },
      ],
    },
    {
      label: "Structure", // Fondasi Sistem
      items: [
        {
          title: "Planning",
          url: "/dashboard/planning",
          icon: GanttChart,
          variant: "default"
        },
        {
          title: "Phases",
          url: "/dashboard/phases",
          icon: Waves,
          variant: "default"
        },
        {
          title: "Dispatch",
          url: "/dashboard/dispatch",
          icon: Satellite,
          variant: "default"
        },
        {
          title: "Bridges",
          url: "/dashboard/bridges",
          icon: Waypoints,
          variant: "default"
        },
        {
          title: "Globals",
          url: "/dashboard/globals",
          icon: Hexagon,
          variant: "default"
        },
      ],
    },
    {
      label: "Support & Resources", // Area Dokumentasi & Log
      items: [
        { title: "Documentation", url: "/dashboard/docs", icon: BookOpen, variant: "default" },
        { title: "System Logs", url: "/dashboard/logs", icon: Terminal, variant: "default" },
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
// 3. FUNGSI PINTAR: INJEKSI STATUS AKTIF (Dynamic Hydration)
// Fungsi ini dipanggil oleh AppSidebar. Dia akan mengecek URL saat ini (pathname)
// lalu membuat Ayah & Anak menyala secara otomatis.
// ============================================================================
export function getDynamicMenus(pathname: string, roleName: string) {
  const menus = roleMenus[roleName] || roleMenus["Pemantau"];

  return menus.map((group) => ({
    ...group,
    items: group.items.map((item) => {

      // LOGIKA UNTUK VARIANT 1 (COLLAPSIBLE / PUNYA ANAK)
      if (item.variant === "collapsible" && item.items) {
        // Cek apakah ada SALAH SATU anak yang URL-nya cocok dengan pathname sekarang
        const isParentActive = item.items.some((sub) => pathname.includes(sub.url));

        return {
          ...item,
          isActive: isParentActive, // 🔥 Ayah otomatis NYALA & TERBUKA jika anak aktif
          items: item.items.map((sub) => ({
            ...sub,
            isActive: pathname === sub.url, // 🔥 Anak nyala jika URL-nya persis sama
          })),
        };
      }

      // LOGIKA UNTUK VARIANT DEFAULT / ACTION (TIDAK PUNYA ANAK)
      return {
        ...item,
        isActive: pathname === item.url, // Nyala jika URL pas
      };
    }),
  }));
}

// ============================================================================
// 4. FUNGSI PINTAR PENCARI BREADCRUMB OTOMATIS
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