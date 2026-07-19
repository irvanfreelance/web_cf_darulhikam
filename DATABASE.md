# Panduan Migrasi dan Seeding Database

Dokumen ini menjelaskan cara menjalankan migrasi struktur database (schema) beserta data awal (seed) ke database Neon PostgreSQL untuk proyek **Assalamkubarid**.

## Prasyarat (Prerequisites)

1. Pastikan Anda memiliki berkas `.env.local` di root direktori proyek yang berisi variabel lingkungan `DATABASE_URL`.
2. Jika belum ada, Anda bisa menarik environment variables dari Vercel menggunakan perintah:
   ```bash
   vercel env pull
   ```

---

## Perintah Menjalankan Migrasi & Seed

Untuk mempermudah proses migrasi dan seeding, sebuah script helper telah ditambahkan ke `package.json`. Jalankan perintah berikut di terminal Anda:

```bash
npm run db:migrate
```

### Apa yang dilakukan perintah di atas?
Perintah tersebut akan menjalankan script **`scratch/run_migration.js`** yang secara otomatis:
1. Membaca berkas `.env.local` untuk mengambil `DATABASE_URL`.
2. Melakukan koneksi ke database Neon PostgreSQL.
3. Membaca berkas SQL migrasi di **`refs/lenteradonasi_may2026.sql`**.
4. Mengeksekusi seluruh skrip SQL migrasi dan seeding (termasuk membuat tabel, relasi, indeks, dan memasukkan data awal seperti metode pembayaran, konfigurasi NGO, kampanye, dll.).

---

## Alternatif: Menjalankan via API Route (Development Only)

Dalam mode development (`NODE_ENV !== 'production'`), Anda juga bisa memicu migrasi dengan melakukan request GET ke endpoint API migrasi.

1. Jalankan aplikasi secara lokal:
   ```bash
   npm run dev
   ```
2. Panggil API Route migrasi menggunakan `curl` atau buka URL berikut di peramban (browser) Anda:
   ```bash
   curl http://localhost:3000/api/migrate
   ```

> [!WARNING]
> Endpoint `/api/migrate` dilindungi dan tidak dapat dipanggil/dijalankan pada lingkungan Production.

---

## Berkas Terkait
* **`refs/lenteradonasi_may2026.sql`**: Berkas SQL utama yang berisi skema database dan data awal (seeds).
* **`scratch/run_migration.js`**: Script Node.js helper untuk memigrasikan database langsung dari terminal.
* **`scratch/verify_db.js`**: Script Node.js helper untuk memverifikasi jumlah baris data di setiap tabel.
