# LOG-001: Improvement Analysis — Pre-Launch Review

## Status

Terdokumentasi. Sebagian sudah diselesaikan. Vercel live 2026-06-28.

## Konteks

Review ini dilakukan sebelum deployment ke `www.triniaga.my.id`. Analisis mencakup
seluruh source code (`src/`), spec (`specs/`), dan steering (`steering/`) untuk
mengidentifikasi gap antara kondisi saat ini dan kondisi yang layak production.

Tanggal review: 2026-06-28
Versi yang direview: 1.4.0

---

## Temuan

Temuan diurutkan dari prioritas tertinggi ke terendah.

### 1. `sendToHost` memakai target `"*"` — kebocoran data ke semua origin

**Kategori:** Security / Bug
**Prioritas:** Critical
**Lokasi:** `src/lib/postMessage.ts:27`

`window.parent.postMessage(message, "*")` mengirim `design-saved` (berisi base64 PNG
desain pengguna) ke semua origin tanpa pembatasan. Jika studio di-embed di halaman yang
memuat iframe dari domain lain, data bocor.

**Rekomendasi fix:**
Capture origin host saat pertama kali menerima pesan valid dari `handleHostCommand`,
lalu gunakan origin tersebut sebagai target `postMessage`. Alternatif: baca origin
dari URL param yang diset oleh `embed.js`.

---

### 2. VITE_ALLOWED_ORIGINS kosong = semua postMessage ditolak di production

**Kategori:** Security / Config
**Prioritas:** Critical — wajib sebelum deploy
**Status:** ✅ Diselesaikan — `VITE_ALLOWED_ORIGINS` sudah diset di Vercel dashboard (2026-06-28)
**Lokasi:** `src/lib/postMessage.ts:21`, `steering/environment.md`

Jika `VITE_ALLOWED_ORIGINS` tidak diset di Vercel, `isOriginAllowed()` selalu
return `false` dan semua command dari host diabaikan tanpa pesan error yang jelas.

**Rekomendasi fix:**
- Set env var di Vercel: `VITE_ALLOWED_ORIGINS=https://www.triniaga.my.id`
- Tambahkan warning di console jika array kosong saat `NODE_ENV=production`
- Dokumentasikan di README sebagai deployment checklist

---

### 3. `get-preview` silent-fail untuk mode 3D

**Kategori:** Bug
**Prioritas:** Critical
**Lokasi:** `src/components/EmbedPage.tsx:38–45`

Handler `get-preview` melakukan `querySelector(".flat-editor-canvas-wrap canvas")`.
Untuk produk mode `3d`, elemen ini tidak ada — host menunggu respons tanpa batas waktu
(hang). Tidak ada `studio-error` yang dikirim.

**Rekomendasi fix:**
Gunakan `currentProduct.mode` untuk memilih canvas yang benar, atau minimal kirim
`studio-error` jika canvas tidak ditemukan agar host tidak hang.

---

### 4. Sanitasi `productId` dari host command

**Kategori:** Security
**Prioritas:** High
**Lokasi:** `src/components/EmbedPage.tsx:19–22`

`command.payload.productId` langsung diteruskan ke `loadProduct()` yang membangun
URL `/templates/${productId}/config.json`. Payload tidak divalidasi format-nya.

**Rekomendasi fix:**
Tambahkan guard sebelum pass ke loader:
```ts
if (!/^[a-z0-9-]+$/.test(command.payload.productId)) return;
```

---

### 5. `validateProduct` tidak memvalidasi isi setiap warp point

**Kategori:** Bug
**Prioritas:** Medium
**Lokasi:** `src/lib/productLoader.ts:60–65`

Validasi hanya memastikan array punya 4 elemen. Jika JSON berisi `[null, null, null, null]`
atau `[{"x":"abc","y":0}, ...]`, validasi lolos tapi runtime crash saat warp dihitung.

**Rekomendasi fix:**
Tambah validasi per elemen — setiap item harus object dengan `x: number` dan `y: number`.

---

### 6. `validateProduct` tidak memvalidasi field `name`

**Kategori:** Spec Gap
**Prioritas:** Medium
**Lokasi:** `src/lib/productLoader.ts:45–47`

TypeScript type mewajibkan `name: string` tapi loader tidak memvalidasi keberadaannya.
Jika `config.json` tidak punya field `name`, UI menampilkan `undefined` di product tab.

**Rekomendasi fix:**
Tambahkan `typeof candidate.name !== "string"` ke blok validasi di `validateProduct()`.

---

### 7. PRODUCTS di StudioApp hardcoded — tidak sinkron dengan template di `public/`

**Kategori:** Maintainability / Bug
**Prioritas:** Medium
**Lokasi:** `src/components/StudioApp.tsx:11–14`

Daftar produk di UI hardcoded. Template baru yang ditambahkan ke `public/templates/`
tidak otomatis muncul di tab, dan mode yang ditampilkan bisa berbeda dari `config.json`.

**Rekomendasi fix (jangka pendek):**
Buat `public/templates/index.json` berisi daftar semua produk. `StudioApp` fetch file
ini saat mount. Tidak perlu backend.

**Rekomendasi fix (jangka panjang):**
Phase 5 Supabase sudah merencanakan dynamic product loading. Catat sebagai known-issue
di `specs/task.md` dengan referensi ke Phase 5.

---

### 8. Verifikasi visual warp formula — masih tertunda

**Kategori:** Pending Verification
**Prioritas:** Medium — wajib sebelum demo klien
**Status:** ⚠️ Vercel live — perlu dicek visual di URL production sebelum demo klien
**Lokasi:** `src/lib/warp.ts`, `specs/task.md:44`, `docs/adr/ADR-001-warp-engine.md`

Sign error sudah diperbaiki secara teori (v7) dan unit test sudah ada untuk koefisien
`a` dan `e`. Tapi verifikasi visual di browser belum dilakukan. Ini item pertama yang
perlu diselesaikan sebelum demo ke triniaga.my.id.

**Langkah verifikasi:**
1. Jalankan `npm run dev`
2. Buka `http://localhost:5173/?product=wallet-01`
3. Upload gambar
4. Pastikan gambar tampil di posisi yang benar (tidak off-screen, tidak terbalik)
5. Geser 4 warp point — pastikan mapping mengikuti sudut yang digeser

---

### 9. `redraw()` membuat canvas baru setiap frame drag — GC pressure

**Kategori:** Performance
**Prioritas:** Medium
**Lokasi:** `src/components/FlatEditor.tsx:34–36`

`document.createElement("canvas")` dipanggil setiap kali `redraw()` dieksekusi
(setiap pixel drag). Pada dragging terus-menerus ini membuat ratusan canvas per detik.

**Rekomendasi fix:**
Cache compose canvas sebagai `useRef`, init sekali di `useEffect`, dan
`clearRect` sebelum setiap pemakaian.

---

### 10. Panel C setInterval 80ms berjalan meski tidak ada desain aktif

**Kategori:** Performance
**Prioritas:** Low
**Lokasi:** `src/features/3d/Product3DViewer.tsx` — `AIEnhancedPanel`

Interval berjalan terus bahkan saat canvas kosong (`textureUrl === BLANK_URL`).
Memicu canvas 2D operations sia-sia tiap 80ms.

**Rekomendasi fix:**
Hentikan interval saat `textureUrl === BLANK_URL` atau suspend saat tab tidak aktif
via `document.visibilitychange`.

---

### 11. Error message tidak hilang otomatis setelah operasi berhasil

**Kategori:** UX
**Prioritas:** Low
**Lokasi:** `src/components/StudioApp.tsx:150–152`

Jika error muncul (mis. file terlalu besar) lalu pengguna upload file yang valid,
status bar error tetap tampil karena `setUploadedImage` tidak reset `errorMessage`.

**Rekomendasi fix:**
Tambahkan `errorMessage: null` ke action `setUploadedImage` di store.

---

### 12. Tidak ada konfirmasi sebelum "Hapus desain"

**Kategori:** UX
**Prioritas:** Low
**Lokasi:** `src/components/StudioApp.tsx:123–125`

Tombol langsung memanggil `resetDesign()` tanpa konfirmasi. Pengguna yang sudah
lama menyusun desain bisa kehilangan hasil kerja secara tidak sengaja.

**Rekomendasi fix:**
Double-click confirmation, atau tooltip "Klik lagi untuk konfirmasi" dengan state lokal.

---

### 13. ESLint dikonfigurasi tapi Prettier belum di-setup

**Kategori:** DX
**Prioritas:** Low
**Lokasi:** `specs/task.md:8`

Phase 0 item "Setup ESLint dan Prettier" belum selesai. Tanpa Prettier,
format kode inkonsisten antar contributor.

**Rekomendasi fix:**
Tambahkan `.prettierrc` dan script `"format": "prettier --write src/"` di `package.json`.

---

### 14. Belum ada `.env.example`

**Kategori:** DX
**Prioritas:** Low
**Lokasi:** `steering/environment.md`

Developer baru tidak tahu env var apa yang dibutuhkan tanpa membaca `steering/environment.md`.

**Rekomendasi fix:**
Buat `.env.example` di root dengan template lengkap, termasuk komentar untuk
variabel yang belum aktif (Supabase, dll.).

---

### 15. `Product3DViewer.tsx` melebihi 400 baris

**Kategori:** Maintainability
**Prioritas:** Low (catat, jangan refactor sekarang)
**Lokasi:** `src/features/3d/Product3DViewer.tsx`, `steering/structure.md:78`

Steering sudah mengantisipasi ini — pecah saat ada perubahan besar berikutnya,
bukan sekarang hanya karena ukuran.

---

## Ringkasan Prioritas

| # | Item | Prioritas | Effort |
|---|---|---|---|
| 1 | Fix `sendToHost` target dari `"*"` ke host origin | Critical | Quick |
| 2 | Set `VITE_ALLOWED_ORIGINS` + deploy Vercel | Critical | Quick |
| 3 | Verifikasi visual warp formula di browser | Critical | Quick |
| 4 | Sanitasi `productId` dari host command | High | Quick |
| 5 | Fix `get-preview` untuk mode 3D | High | Medium |
| 6 | Validasi isi warp points (x/y harus number) | Medium | Quick |
| 7 | Validasi field `name` di loader | Medium | Quick |
| 8 | Buat `public/templates/index.json` untuk dynamic product list | Medium | Medium |
| 9 | Cache compose canvas di `FlatEditor` | Medium | Quick |
| 10 | Suspend Panel C interval saat tidak ada desain | Low | Quick |
| 11 | Reset `errorMessage` saat upload berhasil | Low | Quick |
| 12 | Konfirmasi sebelum "Hapus desain" | Low | Quick |
| 13 | Setup Prettier | Low | Quick |
| 14 | Buat `.env.example` | Low | Quick |
| 15 | Pecah `Product3DViewer.tsx` jadi sub-modul | Low | Medium |

## Metadata

- Last updated: 2026-06-28
- Version: 1.1.0
