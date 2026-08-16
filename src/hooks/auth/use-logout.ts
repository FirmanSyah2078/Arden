// src/hooks/auth/use-logout.ts

export function useLogout() {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      const cookies = [
        "user_role",
        "auth_token",
        "user_name",
        "user_photo",
        "user_username",
      ];

      cookies.forEach((name) => {
        document.cookie =
          `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
      });

      localStorage.clear();

      // Bersihkan kemungkinan lock dari Radix / Shadcn
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      document.body.removeAttribute("data-scroll-locked");

      // Hard reload untuk membersihkan seluruh state client
      window.location.href = "/login";
    } catch {
      // Jika API logout gagal, tetap bersihkan sisi client
      document.body.style.pointerEvents = "auto";
      document.body.style.overflow = "auto";
      document.body.removeAttribute("data-scroll-locked");

      window.location.href = "/login";
    }
  };

  return {
    handleLogout,
  };
}