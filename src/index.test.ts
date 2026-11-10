import { describe, expect, it } from "bun:test";
import { app, getWaktuServer, infoPengembang, salamWaktu } from "./index";

describe("Logika Sapaan dan Waktu Server", () => {
  it("harus mengembalikan sapaan waktu yang tepat sesuai rentang jam", () => {
    // 04.00–10.59: Selamat pagi
    expect(salamWaktu(4)).toBe("Selamat pagi");
    expect(salamWaktu(10)).toBe("Selamat pagi");

    // 11.00–14.59: Selamat siang
    expect(salamWaktu(11)).toBe("Selamat siang");
    expect(salamWaktu(14)).toBe("Selamat siang");

    // 15.00–17.59: Selamat sore
    expect(salamWaktu(15)).toBe("Selamat sore");
    expect(salamWaktu(17)).toBe("Selamat sore");

    // 18.00–03.59: Selamat malam
    expect(salamWaktu(18)).toBe("Selamat malam");
    expect(salamWaktu(23)).toBe("Selamat malam");
    expect(salamWaktu(0)).toBe("Selamat malam");
    expect(salamWaktu(3)).toBe("Selamat malam");
  });

  it("harus menghasilkan format tanggal DD-MM-YYYY HH:mm:ss", () => {
    const fixedDate = new Date(2026, 10, 10, 8, 30, 45); // Bulan Nov = 10 (0-indexed)
    const formatted = getWaktuServer(fixedDate);
    expect(formatted).toBe("10-11-2026 08:30:45");
  });
});

describe("Endpoint Web Hono", () => {
  it("GET / harus mengembalikan HTML beranda dengan judul dan formulir", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text).toContain("Halo Sampit!");
    expect(text).toContain('name="nama"');
    expect(text).toContain("Waktu server:");
  });

  it("POST / harus merespons dengan sapaan nama", async () => {
    const formData = new FormData();
    formData.append("nama", "Budi");

    const res = await app.request("/", {
      method: "POST",
      body: formData,
    });
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text).toContain("Halo, Budi!");
  });

  it("POST / dengan input HTML '<b>tes</b>' harus di-escape secara aman (anti-XSS)", async () => {
    const formData = new FormData();
    formData.append("nama", "<b>tes</b>");

    const res = await app.request("/", {
      method: "POST",
      body: formData,
    });
    expect(res.status).toBe(200);

    const text = await res.text();
    // Harus ter-escape sehingga browser tidak merender tag <b> sebagai HTML aktif
    expect(text).toContain("&lt;b&gt;tes&lt;/b&gt;");
    expect(text).not.toContain("<div class=\"greeting-box\"><p>Halo, <b>tes</b>!</p></div>");
  });

  it("POST / dengan input > 50 karakter harus dipotong di sisi server", async () => {
    const longName = "A".repeat(80);
    const formData = new FormData();
    formData.append("nama", longName);

    const res = await app.request("/", {
      method: "POST",
      body: formData,
    });
    expect(res.status).toBe(200);

    const text = await res.text();
    const expectedTruncated = "A".repeat(50);
    expect(text).toContain(`Halo, ${expectedTruncated}!`);
    expect(text).not.toContain(`Halo, ${longName}!`);
  });

  it("GET /tentang harus menampilkan profil dan tautan navigasi", async () => {
    const res = await app.request("/tentang");
    expect(res.status).toBe(200);

    const text = await res.text();
    expect(text).toContain("Tentang Aplikasi & Pengembang");
    expect(text).toContain(infoPengembang.nama);
    expect(text).toContain(infoPengembang.nim);
    expect(text).toContain(infoPengembang.kelas);
    expect(text).toContain("Kembali ke Beranda");
  });
});
