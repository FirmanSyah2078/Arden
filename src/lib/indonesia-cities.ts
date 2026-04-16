// src/lib/indonesia-cities.ts

export type TimezoneID = "Asia/Jakarta" | "Asia/Makassar" | "Asia/Jayapura";
export type CityType = "Kota" | "Kabupaten" | "Kota Adm.";

export interface CityData {
  name: string;
  type: CityType;
  province: string;
  timezone: TimezoneID;
}

export const INDONESIAN_CITIES: CityData[] = [
  // --- WIB (Asia/Jakarta) ---
  { name: "Banda Aceh", type: "Kota", province: "Aceh", timezone: "Asia/Jakarta" },
  { name: "Medan", type: "Kota", province: "Sumatera Utara", timezone: "Asia/Jakarta" },
  { name: "Padang", type: "Kota", province: "Sumatera Barat", timezone: "Asia/Jakarta" },
  { name: "Pekanbaru", type: "Kota", province: "Sumatera Barat", timezone: "Asia/Jakarta" },
  { name: "Palembang", type: "Kota", province: "Sumatera Selatan", timezone: "Asia/Jakarta" },
  { name: "Bengkulu", type: "Kota", province: "Bengkulu", timezone: "Asia/Jakarta" },
  { name: "Bandar Lampung", type: "Kota", province: "Lampung", timezone: "Asia/Jakarta" },
  { name: "Pangkal Pinang", type: "Kota", province: "Kep. Bangka Belitung", timezone: "Asia/Jakarta" },
  { name: "Jakarta Pusat", type: "Kota Adm.", province: "DKI Jakarta", timezone: "Asia/Jakarta" },
  { name: "Jakarta Selatan", type: "Kota Adm.", province: "DKI Jakarta", timezone: "Asia/Jakarta" },
  { name: "Jakarta Timur", type: "Kota Adm.", province: "DKI Jakarta", timezone: "Asia/Jakarta" },
  { name: "Jakarta Barat", type: "Kota Adm.", province: "DKI Jakarta", timezone: "Asia/Jakarta" },
  { name: "Jakarta Utara", type: "Kota Adm.", province: "DKI Jakarta", timezone: "Asia/Jakarta" },
  { name: "Bogor", type: "Kota", province: "Jawa Barat", timezone: "Asia/Jakarta" },
  { name: "Depok", type: "Kota", province: "Jawa Barat", timezone: "Asia/Jakarta" },
  { name: "Tangerang", type: "Kota", province: "Banten", timezone: "Asia/Jakarta" },
  { name: "Tangerang Selatan", type: "Kota", province: "Banten", timezone: "Asia/Jakarta" },
  { name: "Bekasi", type: "Kota", province: "Jawa Barat", timezone: "Asia/Jakarta" },
  { name: "Bandung", type: "Kota", province: "Jawa Barat", timezone: "Asia/Jakarta" },
  { name: "Bandung", type: "Kabupaten", province: "Jawa Barat", timezone: "Asia/Jakarta" },
  { name: "Cirebon", type: "Kota", province: "Jawa Barat", timezone: "Asia/Jakarta" },
  { name: "Semarang", type: "Kota", province: "Jawa Tengah", timezone: "Asia/Jakarta" },
  { name: "Surakarta", type: "Kota", province: "Jawa Tengah", timezone: "Asia/Jakarta" },
  { name: "Yogyakarta", type: "Kota", province: "DI Yogyakarta", timezone: "Asia/Jakarta" },
  { name: "Sleman", type: "Kabupaten", province: "DI Yogyakarta", timezone: "Asia/Jakarta" },
  { name: "Bantul", type: "Kabupaten", province: "DI Yogyakarta", timezone: "Asia/Jakarta" },
  { name: "Surabaya", type: "Kota", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Malang", type: "Kota", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Malang", type: "Kabupaten", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Blitar", type: "Kota", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Blitar", type: "Kabupaten", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Kediri", type: "Kota", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Kediri", type: "Kabupaten", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Tulungagung", type: "Kabupaten", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Jember", type: "Kabupaten", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Banyuwangi", type: "Kabupaten", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Sidoarjo", type: "Kabupaten", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Gresik", type: "Kabupaten", province: "Jawa Timur", timezone: "Asia/Jakarta" },
  { name: "Pontianak", type: "Kota", province: "Kalimantan Barat", timezone: "Asia/Jakarta" },
  { name: "Palangka Raya", type: "Kota", province: "Kalimantan Tengah", timezone: "Asia/Jakarta" },

  // --- WITA (Asia/Makassar) ---
  { name: "Banjarmasin", type: "Kota", province: "Kalimantan Selatan", timezone: "Asia/Makassar" },
  { name: "Balikpapan", type: "Kota", province: "Kalimantan Timur", timezone: "Asia/Makassar" },
  { name: "Samarinda", type: "Kota", province: "Kalimantan Timur", timezone: "Asia/Makassar" },
  { name: "Tarakan", type: "Kota", province: "Kalimantan Utara", timezone: "Asia/Makassar" },
  { name: "Denpasar", type: "Kota", province: "Bali", timezone: "Asia/Makassar" },
  { name: "Badung", type: "Kabupaten", province: "Bali", timezone: "Asia/Makassar" },
  { name: "Mataram", type: "Kota", province: "Nusa Tenggara Barat", timezone: "Asia/Makassar" },
  { name: "Kupang", type: "Kota", province: "Nusa Tenggara Timur", timezone: "Asia/Makassar" },
  { name: "Makassar", type: "Kota", province: "Sulawesi Selatan", timezone: "Asia/Makassar" },
  { name: "Palu", type: "Kota", province: "Sulawesi Tengah", timezone: "Asia/Makassar" },
  { name: "Kendari", type: "Kota", province: "Sulawesi Tenggara", timezone: "Asia/Makassar" },
  { name: "Manado", type: "Kota", province: "Sulawesi Utara", timezone: "Asia/Makassar" },
  { name: "Gorontalo", type: "Kota", province: "Gorontalo", timezone: "Asia/Makassar" },

  // --- WIT (Asia/Jayapura) ---
  { name: "Ambon", type: "Kota", province: "Maluku", timezone: "Asia/Jayapura" },
  { name: "Ternate", type: "Kota", province: "Maluku Utara", timezone: "Asia/Jayapura" },
  { name: "Jayapura", type: "Kota", province: "Papua", timezone: "Asia/Jayapura" },
  { name: "Sorong", type: "Kota", province: "Papua Barat Daya", timezone: "Asia/Jayapura" },
  { name: "Manokwari", type: "Kota", province: "Papua Barat", timezone: "Asia/Jayapura" },
  { name: "Merauke", type: "Kabupaten", province: "Papua Selatan", timezone: "Asia/Jayapura" },
  { name: "Timika", type: "Kota", province: "Papua Tengah", timezone: "Asia/Jayapura" },
];