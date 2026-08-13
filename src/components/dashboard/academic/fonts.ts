// 🔥 F_LABEL & F_DISPLAY dipakai di IdentityCardPanel (nama font di kartu)
// DAN di ValidationHubPanel (badge icode di QR view) — makanya diangkat
// ke sini, bukan didefinisikan ulang di kedua file.

export const F_LABEL = { fontFamily: "'JetBrains Mono', monospace" }
export const F_DISPLAY = { fontFamily: "'Space Grotesk', sans-serif" }

// Font-nya sendiri cuma perlu di-load SEKALI. Suntikkan string ini lewat
// <style dangerouslySetInnerHTML> satu kali di level halaman (page.tsx),
// bukan di tiap komponen — kalau tiap komponen nyuntik @import sendiri,
// browser tetap oke (cache), tapi nggak rapi & gampang lupa update di satu
// tempat kalau nanti font-nya ganti.
export const SANDBOX_FONT_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=optional');

@keyframes nudge-x {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}
.animate-nudge-x {
  animation: nudge-x 1.5s ease-in-out infinite;
}
`
