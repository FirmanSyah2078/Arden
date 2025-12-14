import { supabase } from "@/lib/supabase"; // Sesuaikan path jika folder kamu beda

export default async function TestDBPage() {
  // 1. Coba ambil semua data dari tabel 'tbl_kelas'
  const { data: kelas, error } = await supabase
    .from('tbl_kelas')
    .select('*');

  // 2. Tampilkan di layar
  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Tes Koneksi Supabase 🚀</h1>

      {/* Jika Error */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <p>Gagal konek: {error.message}</p>
        </div>
      )}

      {/* Jika Berhasil */}
      {kelas && kelas.length > 0 ? (
        <div className="space-y-4">
          <p className="text-green-600 font-medium">✅ Sukses! Data ditemukan:</p>
          <ul className="list-disc pl-5">
            {kelas.map((item) => (
              <li key={item.id_kelas}>
                Kelas: <b>{item.nama_kelas}</b> (Wali: {item.wali_kelas})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">Koneksi berhasil, tapi tabel masih kosong.</p>
      )}
    </div>
  );
}