# Dokumen Evaluasi dan Laporan Praktikum — Jobsheet 1

- **Mata Kuliah:** Rekayasa Perangkat Lunak (3 SKS)
- **Topik:** Menyiapkan Lingkungan Kerja dan Membangun Aplikasi Web Pertama dengan Vibe Coding Terkendali
- **Stack Teknologi:** Bun 1.4 + Hono 4 (TypeScript)
- **Nama Mahasiswa:** [Isi Nama Anda]
- **NIM:** [Isi NIM Anda]
- **Kelas:** [Isi Kelas Anda]

---

## I. Jawaban Pertanyaan Evaluasi (Bagian 7 Jobsheet 1)

### 1. Sebutkan enam langkah siklus vibe coding terkendali. Mengapa langkah Tinjau tidak boleh dilewati?
**Jawaban:**
Enam langkah siklus *vibe coding* terkendali adalah:
1. **Spesifikasi:** Menentukan fitur kecil yang ingin dibangun beserta kriteria penerimaannya (*acceptance criteria*).
2. **Prompt:** Merumuskan instruksi terstruktur mencakup Konteks, Tujuan, Batasan, dan Format Keluaran.
3. **Generate:** Membiarkan asisten AI menghasilkan atau memodifikasi kode.
4. **Jalankan:** Menjalankan aplikasi secara langsung dan menguji skenario sesuai kriteria penerimaan.
5. **Tinjau (Review):** Membaca baris demi baris perubahan kode untuk memutuskan apakah kode tersebut Diterima, Diubah, atau Ditolak.
6. **Commit:** Menyimpan perubahan ke Git dengan pesan yang bermakna serta mencatatnya dalam Jurnal *Vibe Coding*.

**Mengapa langkah Tinjau tidak boleh dilewati?**
AI sering kali menghasilkan kode yang tampak meyakinkan (*hallucination* atau sintaks tampak benar) namun memiliki celah tersembunyi, seperti kerentanan keamanan (XSS, SQL Injection), penggunaan paket/dependensi asing yang tidak dibutuhkan (*dependency bloat*), membocorkan data kredensial, atau menambahkan logika di luar spesifikasi. Langkah **Tinjau** adalah gerbang kontrol kualitas di mana pengembang manusia memverifikasi kebenaran logika, kepatuhan arsitektur, dan keamanan sistem sebelum kode disimpan ke repositori.

---

### 2. Mengapa folder `node_modules` (atau `.venv` pada Python) tidak di-commit ke GitHub, dan apa fungsi `package.json` / `bun.lock` sebagai gantinya?
**Jawaban:**
- **Alasan tidak di-commit:**
  1. **Ukuran Berkas yang Sangat Besar:** Direktori `node_modules` dapat memuat ribuan berkas dengan ukuran puluhan hingga ratusan megabyte. Mengunggahnya akan memperlambat operasi Git (*clone*, *push*, *pull*) dan membebani ruang penyimpanan repositori.
  2. **Platform Dependency (Ketidakcocokan Lintas OS):** Beberapa pustaka memiliki kompilasi biner asli (*native bindings*) yang spesifik untuk arsitektur OS tertentu (misalnya Windows x64 vs Linux ARM64). Dependensi yang di-commit dari satu OS belum tentu dapat berjalan di OS rekan tim lainnya.
- **Fungsi `package.json` dan `bun.lock`:**
  Sebagai manifes deklaratif yang mencatat nama pustaka dan versi pastinya. Siapa pun anggota tim yang mengklon repositori cukup menjalankan satu perintah `bun install` untuk merekonstruksi seluruh direktori `node_modules` secara identik, cepat, dan sesuai dengan arsitektur sistem operasi masing-masing.

---

### 3. Apa perbedaan permintaan GET dan POST pada aplikasi “Halo Sampit”? Bagian kode mana yang membedakannya?
**Jawaban:**
- **GET:** Digunakan untuk meminta data/halaman dari server secara *idempotent* (tidak mengubah status server). Parameter data dikirimkan melalui URL (query string) dan terlihat jelas pada *address bar* peramban. Pada aplikasi ini, GET digunakan saat pertama kali membuka halaman beranda untuk mengambil formulir dan waktu server.
- **POST:** Digunakan untuk mengirimkan data dari klien ke server untuk diproses. Data masukan (seperti kolom input `nama`) dikirimkan di dalam *body request* HTTP, sehingga tidak terpampang pada URL dan tidak tersimpan pada riwayat pencarian peramban.

**Bagian kode yang membedakannya (pada Hono):**
```typescript
// Menangani permintaan GET saat halaman pertama kali dibuka
app.get("/", (c) => {
  return c.html(...);
});

// Menangani permintaan POST saat tombol formulir diklik
app.post("/", async (c) => {
  const body = await c.req.parseBody(); // Mengambil data nama dari Request Body
  const nama = body.nama;
  return c.html(...);
});
```

---

### 4. Mengapa `maxlength` pada HTML saja tidak cukup untuk membatasi masukan pengguna?
**Jawaban:**
Atribut `maxlength="50"` pada tag `<input>` adalah validasi di sisi klien (*client-side validation*). Validasi ini berjalan di peramban pengguna dan **dapat dengan mudah dilewati atau dimanipulasi oleh siapa pun**, misalnya:
1. Membuka *Developer Tools* (F12) $\rightarrow$ *Inspect Element* $\rightarrow$ mengubah nilai `maxlength="50"` menjadi `maxlength="500"`.
2. Mengirimkan permintaan HTTP POST langsung menggunakan *tools* seperti Postman, cURL, atau skrip otomatis tanpa melalui antarmuka web.

Oleh karena itu, **validasi sisi server (*server-side validation*)** seperti pemotongan string `rawNama.slice(0, 50)` bersifat mutlak wajib sebagai garis pertahanan utama aplikasi web guna memastikan integritas data dan keamanan basis data.

---

### 5. Sebutkan dua risiko vibe coding yang Anda temui atau bayangkan setelah praktikum ini, beserta cara mengendalikan masing-masing.
**Jawaban:**
1. **Risiko 1: Over-Reliance & Celah Keamanan Tersembunyi (Hidden Vulnerabilities)**
   - *Deskripsi:* Pengembang malas membaca kode dan langsung menerima keluaran AI mentah-mentah, padahal kode mungkin rentan terhadap XSS, injeksi, atau kebocoran variabel global.
   - *Pengendalian:* Menerapkan prinsip *Zero Trust* pada kode hasil AI, selalu melakukan langkah **Tinjau** sebelum commit, serta menulis tes otomatis (*unit testing*) untuk menguji kasus-kasus batas (*edge cases*).
2. **Risiko 2: Dependensi Liar (*Hallucinated / Excessive Packages*)**
   - *Deskripsi:* AI sering menyarankan untuk menginstal pustaka pihak ketiga baru yang tidak perlu atau bahkan tidak terverifikasi demi menyelesaikan tugas sederhana yang sebenarnya cukup dengan pustaka bawaan standar.
   - *Pengendalian:* Memberikan instruksi **Batasan (*Constraints*)** yang tegas pada *prompt* (misalnya: *"Hanya gunakan pustaka standar dan Hono bawaan, tanpa pustaka eksternal tambahan"*), serta selalu mengecek berkas `package.json` sebelum menjalankan perintah instalasi.

---

## II. Hasil Latihan Mandiri (Bagian 6 Jobsheet 1)

1. **Halaman Baru (`/tentang`):**
   - Telah ditambahkan rute `app.get('/tentang')` yang memuat profil mahasiswa, kampus, dan teknologi Bun + Hono.
   - Terdapat navigasi dua arah antara beranda (`/`) dan halaman tentang (`/tentang`).
2. **Validasi Sisi Server:**
   - Diimplementasikan pemotongan string `rawNama.slice(0, 50)`.
   - Telah dibuktikan dengan unit test: input sepanjang 80 karakter terpotong otomatis menjadi 50 karakter.
3. **Eksperimen Prompt:**
   - *Prompt Singkat ("Buatkan aplikasi web Halo Sampit"):* Menghasilkan kode umum yang kadang menyertakan template engine pihak ketiga, tidak memiliki sanitasi XSS yang jelas, dan gaya kodenya tidak seragam.
   - *Prompt Terstruktur (Konteks, Tujuan, Batasan, Format):* Menghasilkan kode modular yang ringkas, tepat menggunakan `hono/html`, tidak memuat dependensi berlebih, dan langsung siap dijalankan.
