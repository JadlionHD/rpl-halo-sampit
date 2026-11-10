# RPL Halo Sampit (Bun + Hono)

Proyek aplikasi web "Halo Sampit" untuk memenuhi tugas **Jobsheet 1 Praktikum Rekayasa Perangkat Lunak** (Prodi D3 Teknologi Informasi, Politeknik Sampit).

Aplikasi ini dibangun menggunakan runtime **Bun** dan framework web **Hono (TypeScript)** dengan menerapkan siklus *Vibe Coding* terkendali.

## Identitas Mahasiswa
- **Nama:** Hendra Gunawan
- **NIM:** 24554010026
- **Kelas:** Semester 5

## Fitur Aplikasi
1. **Beranda Sapaan (`/`):**
   - Menampilkan judul "Halo Sampit!".
   - Salam dinamis berdasarkan jam lokal server (Pagi, Siang, Sore, Malam).
   - Menampilkan tanggal dan jam server terkini (`DD-MM-YYYY HH:mm:ss`).
   - Formulir input nama dengan metode HTTP `POST` yang merespons dengan sapaan "Halo, <nama>!".
   - Dilengkapi proteksi sanitasi XSS (menggunakan `hono/html` auto-escaping).
   - Validasi sisi server pembatasan nama maksimal 50 karakter.
2. **Halaman Tentang (`/tentang`):**
   - Berisi informasi identitas pembuat aplikasi dan teknologi yang digunakan.
3. **Pengujian Otomatis (`bun test`):**
   - Unit test untuk logika penentuan salam waktu dan integritas rute HTTP.

## Prasyarat
- [Bun](https://bun.sh/) (versi >= 1.0, diuji pada Bun v1.4.4)

## Cara Menjalankan

1. **Instalasi Dependensi:**
   ```bash
   bun install
   ```

2. **Menjalankan Server Pengembangan (dengan auto-reload):**
   ```bash
   bun run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000).

3. **Menjalankan Pengujian Otomatis:**
   ```bash
   bun test
   ```
