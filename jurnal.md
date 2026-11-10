# Jurnal Vibe Coding — Jobsheet 1

- **Nama:** [Isi Nama Anda]
- **NIM:** [Isi NIM Anda]
- **Kelas:** [Isi Kelas Anda]
- **Proyek:** rpl-halo-sampit (Bun + Hono TypeScript)

---

## Log Siklus Vibe Coding

| No | Tujuan | Prompt (ringkas) | Hasil AI | Keputusan | Alasan |
|---|---|---|---|---|---|
| 1 | Membangun aplikasi web beranda "Halo Sampit" dengan formulir nama dan waktu server menggunakan Bun + Hono. | *Konteks: Mahasiswa D3 TI. Tujuan: Buat web app Hono dengan rute GET/POST untuk menampilkan sapaan "Halo Sampit", waktu server (DD-MM-YYYY HH:mm:ss), dan formulir sapaan nama. Batasan: Gunakan Bun + Hono TypeScript, tanpa DB, tanpa JS eksternal, masukan nama harus aman dari XSS.* | Kode `src/index.ts` menggunakan Hono dan modul bawaan `hono/html` untuk templating aman dari serangan XSS. | **Terima** | Kode terstruktur rapi, tidak memerlukan pustaka eksternal berlebih, dan fitur interpolasi `${nama}` pada `hono/html` secara otomatis meng-escape tag HTML berbahaya seperti `<b>tes</b>`. |
| 2 | Menambahkan fungsi penentu salam berdasarkan jam server (`salamWaktu`). | *Konteks: Aplikasi Hono Halo Sampit. Tujuan: Tambahkan fungsi salamWaktu(jam) dengan aturan: 04.00–10.59 (Selamat pagi), 11.00–14.59 (Selamat siang), 15.00–17.59 (Selamat sore), dan 18.00–03.59 (Selamat malam). Tampilkan sebelum waktu server.* | Fungsi `salamWaktu(jam: number)` ditambahkan dan dipanggil pada handler GET dan POST, disisipkan sebelum string waktu server. | **Terima** | Seluruh kondisi batas jam sesuai dengan spesifikasi Jobsheet 1 Langkah 12, dan telah diverifikasi menggunakan pengujian unit (`bun test`). |
| 3 | Latihan Mandiri: Menambahkan halaman `/tentang` dan validasi panjang masukan sisi server. | *Konteks: Aplikasi Hono Halo Sampit. Tujuan: (1) Buat rute GET /tentang dengan informasi pengembang dan tautan kembali. (2) Tambahkan pemotongan nama maksimal 50 karakter di sisi server untuk mengantisipasi bypass atribut HTML maxlength.* | Penambahan endpoint `GET /tentang` dan penambahan validasi `rawNama.slice(0, 50)` sebelum nama diproses dan ditampilkan. | **Terima** | Memberikan perlindungan ganda (client & server-side validation) dan navigasi antar halaman berfungsi dengan baik. |

---

## Ringkasan Tinjauan Keamanan & Kualitas Kode

1. **Uji Celah XSS (`<b>tes</b>`):**
   - Masukan: `<b>tes</b>`
   - Hasil di layar: Ditampilkan secara literal sebagai teks `<b>tes</b>` (bukan teks tebal).
   - Penjelasan teknis: Fungsi tag `html` dari `hono/html` secara otomatis mengubah karakter `<` menjadi `&lt;` dan `>` menjadi `&gt;`.
2. **Validasi Server-Side (Bypass `maxlength`):**
   - Pengujian: Mengirimkan string sepanjang 80 karakter melalui cURL / form tampering.
   - Hasil di server: Dipotong secara aman menjadi tepat 50 karakter pertama (`slice(0, 50)`), mencegah potensi *denial of service* atau *UI distortion*.
