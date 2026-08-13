// 🔥 Satu sumber data siswi yang dipakai bareng oleh IdentityCardPanel
// & ValidationHubPanel — biar keduanya selalu nampilin siswi yang sama,
// bukan dua instance data yang kebetulan mirip.

export interface IdentityCardData {
  name: string
  nis: string
  kelas: string
  angkatan: string
  waliKelas: string
  validUntil: string
  photoSrc: string
  qrData: string
  icode: string
}

export const DEFAULT_CARD_DATA: IdentityCardData = {
  name: "Daniel Voss",
  nis: "23.0145.RPL",
  kelas: "XII RPL 2",
  angkatan: "2023 / 2026",
  waliKelas: "Ibu Sari Wulandari, S.Pd",
  validUntil: "07 / 2027",
  photoSrc: "/photo.jpg",
  qrData: "https://emberline.academy/verify/23.0145.RPL",
  icode: "ARD-O98HYnhj",
}
