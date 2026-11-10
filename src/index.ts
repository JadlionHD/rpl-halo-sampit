import { Hono } from "hono";
import { html } from "hono/html";

export const app = new Hono();

/**
 * Data profil pengembang dan aplikasi (Latihan Mandiri 1).
 * Silakan ubah nilai properti di bawah ini sesuai identitas Anda:
 */
export const infoPengembang = {
  nama: "Hendra Gunawan",
  nim: "24554010026",
  kelas: "Semester 5",
  mataKuliah: "Rekayasa Perangkat Lunak (D3 Teknologi Informasi)",
  kampus: "Politeknik Sampit",
  teknologi: "Bun v1.4 + Hono v4 (TypeScript)",
};

/**
 * Fungsi penentu salam berdasarkan jam (0-23).
 * Sesuai spesifikasi Langkah 12 Jobsheet 1:
 * - 04.00–10.59: Selamat pagi
 * - 11.00–14.59: Selamat siang
 * - 15.00–17.59: Selamat sore
 * - 18.00–03.59: Selamat malam
 */
export function salamWaktu(jam: number): string {
  if (jam >= 4 && jam < 11) {
    return "Selamat pagi";
  }
  if (jam >= 11 && jam < 15) {
    return "Selamat siang";
  }
  if (jam >= 15 && jam < 18) {
    return "Selamat sore";
  }
  return "Selamat malam";
}

/**
 * Memformat objek Date ke format "DD-MM-YYYY HH:mm:ss".
 */
export function getWaktuServer(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  const y = date.getFullYear();
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${d}-${m}-${y} ${h}:${min}:${s}`;
}

// Rute GET / - Menampilkan formulir dan sapaan awal
app.get("/", (c) => {
  const sekarang = new Date();
  const waktu = getWaktuServer(sekarang);
  const salam = salamWaktu(sekarang.getHours());

  return c.html(
    html`<!doctype html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Halo Sampit</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 40px auto;
              padding: 0 20px;
              line-height: 1.6;
              color: #1e293b;
            }
            h1 { color: #0f172a; margin-bottom: 8px; }
            .time-info { color: #64748b; font-size: 0.95rem; margin-bottom: 24px; }
            form {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 20px;
              border-radius: 8px;
            }
            label { font-weight: 600; display: block; margin-bottom: 6px; }
            input[type="text"] {
              width: 100%;
              box-sizing: border-box;
              padding: 10px 12px;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              font-size: 1rem;
              margin-bottom: 12px;
            }
            button {
              background: #2563eb;
              color: white;
              border: none;
              padding: 10px 18px;
              font-size: 1rem;
              border-radius: 6px;
              cursor: pointer;
            }
            button:hover { background: #1d4ed8; }
            .nav-link { margin-top: 24px; display: inline-block; color: #2563eb; text-decoration: none; }
            .nav-link:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>Halo Sampit!</h1>
          <p class="time-info">${salam}. Waktu server: ${waktu}</p>

          <form method="post" action="/">
            <label for="nama">Nama Anda:</label>
            <input type="text" id="nama" name="nama" required maxlength="50" placeholder="Masukkan nama..." />
            <button type="submit">Sapa</button>
          </form>

          <a class="nav-link" href="/tentang">&rarr; Halaman Tentang Pembuat</a>
        </body>
      </html>`
  );
});

// Rute POST / - Memproses form kirim nama
app.post("/", async (c) => {
  const body = await c.req.parseBody();
  let rawNama = typeof body.nama === "string" ? body.nama.trim() : "";

  // Validasi sisi server (Latihan Mandiri 2): batas maksimal 50 karakter
  const nama = rawNama.slice(0, 50);

  const sekarang = new Date();
  const waktu = getWaktuServer(sekarang);
  const salam = salamWaktu(sekarang.getHours());

  return c.html(
    html`<!doctype html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Halo Sampit</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 40px auto;
              padding: 0 20px;
              line-height: 1.6;
              color: #1e293b;
            }
            h1 { color: #0f172a; margin-bottom: 8px; }
            .time-info { color: #64748b; font-size: 0.95rem; margin-bottom: 24px; }
            form {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 20px;
              border-radius: 8px;
            }
            label { font-weight: 600; display: block; margin-bottom: 6px; }
            input[type="text"] {
              width: 100%;
              box-sizing: border-box;
              padding: 10px 12px;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              font-size: 1rem;
              margin-bottom: 12px;
            }
            button {
              background: #2563eb;
              color: white;
              border: none;
              padding: 10px 18px;
              font-size: 1rem;
              border-radius: 6px;
              cursor: pointer;
            }
            button:hover { background: #1d4ed8; }
            .greeting-box {
              margin-top: 20px;
              padding: 16px;
              background: #eff6ff;
              border: 1px solid #bfdbfe;
              border-radius: 6px;
              color: #1e40af;
              font-size: 1.15rem;
              font-weight: 600;
            }
            .nav-link { margin-top: 24px; display: inline-block; color: #2563eb; text-decoration: none; }
            .nav-link:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>Halo Sampit!</h1>
          <p class="time-info">${salam}. Waktu server: ${waktu}</p>

          <form method="post" action="/">
            <label for="nama">Nama Anda:</label>
            <input type="text" id="nama" name="nama" value="${nama}" required maxlength="50" placeholder="Masukkan nama..." />
            <button type="submit">Sapa</button>
          </form>

          ${nama ? html`<div class="greeting-box"><p>Halo, ${nama}!</p></div>` : ""}

          <a class="nav-link" href="/tentang">&rarr; Halaman Tentang Pembuat</a>
        </body>
      </html>`
  );
});

// Rute GET /tentang - Halaman Latihan Mandiri 1
app.get("/tentang", (c) => {
  return c.html(
    html`<!doctype html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Tentang - Halo Sampit</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 40px auto;
              padding: 0 20px;
              line-height: 1.6;
              color: #1e293b;
            }
            .card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 24px;
              border-radius: 8px;
            }
            ul { list-style-type: none; padding-left: 0; }
            li { padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
            a { color: #2563eb; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>Tentang Aplikasi & Pengembang</h1>
          <div class="card">
            <p>Aplikasi ini dikembangkan untuk memenuhi tugas <strong>Jobsheet 1 Rekayasa Perangkat Lunak</strong>.</p>
            <ul>
              <li><strong>Mata Kuliah:</strong> ${infoPengembang.mataKuliah}</li>
              <li><strong>Kampus:</strong> ${infoPengembang.kampus}</li>
              <li><strong>Teknologi:</strong> ${infoPengembang.teknologi}</li>
              <li><strong>Nama Pengembang:</strong> ${infoPengembang.nama}</li>
              <li><strong>NIM:</strong> ${infoPengembang.nim}</li>
              <li><strong>Kelas / Kelompok:</strong> ${infoPengembang.kelas}</li>
            </ul>
          </div>
          <p style="margin-top: 20px;"><a href="/">&larr; Kembali ke Beranda</a></p>
        </body>
      </html>`
  );
});

export default {
  port: 3000,
  fetch: app.fetch,
};
