# FEAT-002: Text Input Layer — Input Teks Langsung di Studio

## Status

Terdokumentasi. Belum diimplementasi. Menunggu keputusan implementasi.

## Latar Belakang

Saat ini customer harus menyiapkan file gambar (PNG/JPG) di luar studio — menggunakan
Canva, Photoshop, atau tools lain — sebelum bisa upload ke Product Customizer Studio.
Untuk personalisasi teks sederhana (nama, tanggal, kata-kata pendek), proses ini
menambah friction yang tidak perlu.

Fitur ini memungkinkan customer mengetik teks langsung di studio tanpa meninggalkan halaman,
mempersingkat alur dari "ingin pesan" ke "lihat preview" secara signifikan.

**Konteks untuk triniaga.my.id:** Produk seperti kepala ikat pinggang (belt-buckle-01)
sangat umum dipesan dengan nama atau teks pendek — persis seperti contoh "ipeka".

## Feature Flag

Fitur ini dikendalikan oleh **feature flag** sehingga dapat diaktifkan atau dinonaktifkan
tanpa perubahan kode. Tujuannya:

- Memungkinkan evaluasi apakah fitur ini benar-benar dipakai customer.
- Menghindari UI yang crowded jika fitur tidak relevan untuk produk tertentu.
- Mudah dimatikan jika terbukti tidak berguna tanpa merusak fitur lain.

### Mekanisme Feature Flag

Flag dikontrol dari **dua level**:

#### Level 1 — Per Produk (di config.json)

Setiap template produk dapat mengaktifkan atau menonaktifkan fitur ini secara individual.

```json
{
  "id": "belt-buckle-01",
  "name": "Kepala Ikat Pinggang",
  "mode": "3d",
  "features": {
    "textInput": true
  },
  "model3d": { ... }
}
```

Jika field `features.textInput` tidak ada atau `false`, tab teks tidak muncul sama sekali.

#### Level 2 — Global via URL Parameter (untuk testing/debug)

```
?product=belt-buckle-01&feature_text=0   ← paksa nonaktif
?product=belt-buckle-01&feature_text=1   ← paksa aktif (override config)
```

Hanya berlaku di development (`import.meta.env.DEV`). Di production, URL parameter diabaikan.

#### Level 3 — Global via embed.js (opsional, future)

Host dapat menonaktifkan fitur ini untuk semua produk sekaligus via atribut embed:

```html
<script src="/embed.js"
  data-product="belt-buckle-01"
  data-features-text="false">
</script>
```

---

## Scope Fitur

### Yang Termasuk (MVP Text Input)

- Input teks satu baris (single line) — nama, kata pendek, inisial.
- Pilihan font dari daftar preset yang disediakan admin (bukan upload font sembarangan).
- Pilihan warna teks (color picker sederhana atau preset palet).
- Pilihan ukuran teks (slider atau preset S/M/L).
- Preview realtime — teks langsung terlihat di atas produk.
- Hasil teks di-render ke canvas dan diperlakukan sama seperti uploaded image.
- Teks menjadi bagian dari `design-saved` payload (sebagai gambar PNG, bukan data teks).

### Yang Tidak Termasuk (bukan scope fitur ini)

- Multi-line text / paragraf.
- Upload font custom dari pengguna.
- Efek teks (shadow, outline, gradient) — bisa jadi fitur lanjutan terpisah.
- Text editor WYSIWYG penuh.
- Simpan teks sebagai data terpisah di backend (teks selalu di-flatten ke PNG).

---

## Desain UI

### Penempatan

Toolbar global mendapat tab baru di samping tombol "↑ Upload desain":

```
[ ↑ Upload desain ]  [ Aa Tambah teks ]  [ Hapus desain ]  ● Desain aktif
```

Tombol "Aa Tambah teks" hanya muncul jika `features.textInput === true` untuk produk aktif.

### Panel Input Teks

Saat tombol "Aa Tambah teks" diklik, muncul panel input di bawah toolbar:

```
┌─────────────────────────────────────────────────────────────┐
│  Ketik teks                                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ipeka                                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Font          Ukuran       Warna                           │
│  [Brush ▾]     [M ▾]        [■ Putih ▾]                    │
│                                                             │
│                       [ Terapkan ke desain ]               │
└─────────────────────────────────────────────────────────────┘
```

### Preset Font (Tahap 1)

Font di-bundle ke aplikasi (tidak butuh Google Fonts / CDN eksternal):

| ID | Nama Tampilan | Karakter |
|---|---|---|
| `brush-01` | Casual Brush | Seperti contoh "ipeka" — santai, personal |
| `sans-bold` | Modern Bold | Tegas, corporate — Montserrat Bold |
| `serif` | Klasik | Formal, elegan |
| `monospace` | Teknikal | Kode, nomor seri |

Font default: `brush-01` (sesuai contoh produk "ipeka" yang sudah diproduksi).

### Preset Warna

```
■ Putih (#FFFFFF)   ■ Hitam (#111111)   ■ Emas (#C9A12A)
■ Perak (#A8A8A8)   ■ Merah (#E63B2E)   ○ Custom (color picker)
```

---

## Arsitektur Teknis

### Alur Data

```
Customer ketik teks
       ↓
TextInputPanel → render teks ke OffscreenCanvas
       ↓
canvas.toDataURL("image/png")
       ↓
setUploadedImage(dataUrl)          ← sama persis dengan upload gambar biasa
       ↓
FlatEditor / EditableWarpPanel     ← tidak perlu tahu ini dari teks atau gambar
       ↓
design-saved payload (PNG)         ← teks sudah di-flatten, tidak bisa diedit lagi
```

**Prinsip utama:** output dari TextInputPanel adalah data URL PNG biasa.
Setelah "Terapkan ke desain" diklik, teks diperlakukan identik dengan gambar upload.
Tidak ada state teks terpisah yang perlu disimpan di Zustand atau dikirim ke host.

### Schema Update — `features` field di Product type

```ts
// src/types/product.ts
export type ProductFeatures = {
  textInput?: boolean;   // default: false jika tidak ada
};

export type Product = {
  id: string;
  name: string;
  mode: "flat" | "3d";
  thumbnail?: string;
  features?: ProductFeatures;   // ← field baru, opsional
  flat?: { ... };
  model3d?: { ... };
};
```

Field `features` bersifat opsional — produk yang tidak punya field ini tetap valid
dan berjalan normal. Tidak ada breaking change ke schema yang sudah ada.

### Komponen Baru

```
src/features/text/
└── TextInputPanel.tsx     ← panel UI input teks, preview font, color picker
```

Komponen ini:
- Hanya di-render jika `product.features?.textInput === true`
- Tidak lazy-loaded (ringan, tidak ada dependency 3D)
- Tidak mengubah `FlatEditor` atau `Product3DViewer`
- Output: panggil `setUploadedImage(dataUrl)` saat "Terapkan"

### Tidak Ada Perubahan ke

- `specs/events.md` — tidak ada event baru, teks sudah jadi PNG sebelum dikirim
- `src/lib/postMessage.ts`
- `src/store/studioStore.ts` (kecuali penambahan `features` ke Product type)
- `FlatEditor.tsx` / `Product3DViewer.tsx`

---

## Update config.json belt-buckle-01

Untuk mengaktifkan fitur ini di produk kepala ikat pinggang:

```json
{
  "id": "belt-buckle-01",
  "name": "Kepala Ikat Pinggang",
  "mode": "3d",
  "thumbnail": "/templates/belt-buckle-01/thumb.jpg",
  "features": {
    "textInput": true
  },
  "model3d": {
    "modelUrl": "primitive://box",
    "textureOffsetX": 0,
    "textureOffsetY": 0,
    "textureScale": 1
  }
}
```

Untuk menonaktifkan — hapus field `features` atau set `"textInput": false`.

---

## Panduan Evaluasi Fitur

Setelah diluncurkan, matikan fitur ini jika:

- Kurang dari 20% customer menggunakan tombol "Aa Tambah teks" dalam 30 hari
- Customer lebih memilih upload gambar meski fitur teks tersedia
- Teks yang dihasilkan tidak sesuai kualitas cetak yang diinginkan

Aktifkan secara default jika:

- Lebih dari 50% order untuk produk tertentu menggunakan input teks
- Customer memberi feedback positif tentang kemudahan

---

## Task Breakdown (saat diputuskan untuk implementasi)

- [ ] Tambahkan field `features?: ProductFeatures` ke `src/types/product.ts`
- [ ] Update `validateProduct()` di `productLoader.ts` — `features` opsional, tidak wajib
- [ ] Update `config.json` belt-buckle-01 — tambahkan `features.textInput: true`
- [ ] Buat `src/features/text/TextInputPanel.tsx`
  - [ ] Input teks (controlled)
  - [ ] Dropdown font preset
  - [ ] Slider atau dropdown ukuran (S/M/L)
  - [ ] Preset warna + custom color picker
  - [ ] Render ke OffscreenCanvas → `canvas.toDataURL()`
  - [ ] Panggil `setUploadedImage()` saat submit
- [ ] Integrasikan ke `StudioApp.tsx` — tampilkan tombol "Aa Tambah teks" jika flag aktif
- [ ] Bundle font (brush, sans-bold, serif, monospace) ke `public/fonts/`
- [ ] Unit test: TextInputPanel render output PNG tidak kosong
- [ ] Component test: tombol tidak muncul jika `features.textInput` false

---

## Dependensi Baru

Tidak ada dependency npm baru yang diperlukan. Font di-serve sebagai file statis.
`OffscreenCanvas` atau `HTMLCanvasElement` sudah tersedia di browser modern.

---

## Referensi

- Contoh kasus nyata: produk "ipeka" (belt-buckle-01) — teks pendek, font brush, putih di atas hitam
- Schema: `specs/product-schema.md`
- Store: `src/store/studioStore.ts` — `setUploadedImage()`
- Struktur folder: `steering/structure.md`

## Metadata

- Last updated: 2026-06-28
- Version: 1.0.0
