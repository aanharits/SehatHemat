# Architecture Document: SehatHemat

Document ini menyajikan referensi arsitektur dan best-practices untuk proyek **SehatHemat** berdasarkan teknologi: **Next.js App Router**, **Prisma**, **Shadcn UI**, dan integrasi **Google Gemini API**. Panduan ini dirumuskan menggunakan panduan resmi dari referensi Context7 MCP untuk menjaga standar pengembangan aplikasi Fullstack.

## 1. Project Organization (Next.js App Router)

Proyek ini telah dikonfigurasi menggunakan arsitektur **App Router (`src/app`)**.

### Struktur Panduan:
- `src/app/` -> Hierarki folder ini merepresentasikan rute (Routing File-system Next.js). Semua _Server Components_ menjadi rute standar jika diberi nama `page.tsx`.
- `src/app/dashboard/` -> File dashboard berada di rute `/dashboard`. Route ini memilik `layout.tsx` khusus persisten untuk Sidebar, dan `page.tsx`.
- `src/app/api/` -> Berisi Next.js Route Handlers (pengganti API routes dari Pages Router). Setiap file `route.ts` bisa merespons *HTTP methods* (GET, POST).
- `src/components/` -> Folder untuk React components yang bisa dipakai berulang.
  - `ui/` -> Folder khusus untuk _Shadcn UI Components_. Jangan mengubah komponen dasar di dalamnya kecuali perlu custom styling level core.
- `src/lib/` -> Fungsi utility. Tempat memanggil prisma singleton klien, utils helper seperti *clsx/tailwind-merge*.

## 2. Shadcn UI & Tailwind CSS

### Konfigurasi Shadcn
Shadcn bukan berupa npm package yang berukuran masif (seperti Bootstrap atu MUI), melainkan kode (komponen `.tsx`) ditempatkan langsung ke dalam proyek sumber di `src/components/ui/`. 

- **Customization**: Anda bebas mengubah tag, class, atau styling dari masing-masing komponen di `ui/`.
- **Tema dan Warna**: Tema tersimpan di `src/app/globals.css` (.root css variables) dengan plugin tailwind.

## 3. Database ORM: Prisma + Supabase

Supabase adalah provider pengelola database PostgreSQL kita, dan kita mengakses tabel Supabase (seperti tabel `ingridients`) melalui Prisma.

### Cara Kerja Prisma Terhubung ke Supabase
- **Direct Link**: Untuk menjalankan migrasi, Prisma menggunakan String `DIRECT_URL`.
- **Connection Pool**: Untuk runtime Next.js, Prisma memakai string `DATABASE_URL` (dengan suffix port 6543 dan `?pgbouncer=true`). *Catatan: pastikan koneksi pooling tetap aktif.*

### Introspeksi (Pull dari Supabase yang Sudah Ada)
Jika ada tabel baru di Supabase, Anda wajib memperbarui Prisma di level lokal. Gunakan instruksi:
```bash
npx prisma db pull
npx prisma generate
```
Agar ORM mengenali skema (misal model `Ingredient` atau `ingridients`).

## 4. Google Gemini Integrasi

Google Gemini dihubungkan via Next.js Route Handlers (`src/app/api/generate/route.ts`).
Berdasarkan Next.js App Router API practices:
- **Server Side**: Proses generate dengan gemini AI berjalan **secara lokal di server** lewat Node.js / Edge Runtime, sehingga menyembunyikan API key Google dari console browser / akses klien (client-side).
- Gunakan fetch API standard via UI untuk meminta *prompt* AI dan menerima *response*.
