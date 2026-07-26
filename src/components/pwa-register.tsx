  "use client";
    
    import { useEffect } from "react";
    
    export default function PwaRegister() {
      useEffect(() => {
        if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => console.log("Service Worker terdaftar dengan scope:", registration.scope))
            .catch((error) => console.error("Pendaftaran Service Worker gagal:", error));
        }
      }, []);
    
      return null;
    }