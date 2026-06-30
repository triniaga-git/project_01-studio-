# FEAT-001: Produk — Kepala Ikat Pinggang (belt-buckle-01)

## Status

Draft. Template terdaftar. Model 3D (GLB) belum dibuat — saat ini memakai primitive placeholder.

## Deskripsi Produk

Kepala ikat pinggang tipe **ratchet/click** berbahan plastik ABS tekstur granular matte hitam.
Mekanisme: flap dibuka untuk kunci sabuk, ditutup untuk mengunci. Bukan buckle lubang tradisional.

Produk ini adalah salah satu item utama di katalog **triniaga.my.id**.

## Dimensi Fisik

| Bagian | Ukuran | Keterangan |
|---|---|---|
| Panjang total | 61mm | Termasuk mekanisme ratchet bawah |
| Panjang bodi tanpa permukaan atas | 45mm | Frame bawah saja |
| **Panjang area desain** | **38mm** | Area efektif yang bisa di-print |
| Lebar total | 42mm | — |
| **Lebar area desain** | **38mm** | Area efektif yang bisa di-print |
| Tebal flap atas | ±10mm | Permukaan yang didesain |
| Lebar slot tali | 32mm | Lebar tali ikat pinggang yang masuk ke buckle |

**Catatan penting:** Angka 32mm pada foto referensi awal adalah lebar slot tali (bukan tinggi produk).
Tebal flap atas ±10mm — ini yang terlihat saat produk dipegang.

## Area Desain

- **Bentuk:** persegi panjang rounded corner — hampir persegi (38mm × 38mm)
- **Rasio:** 1:1 (persegi sempurna untuk keperluan praktis)
- **Canvas template yang direkomendasikan:** 500 × 500 px
- **Permukaan:** flap atas saja — frame dan mekanisme bawah tidak di-print
- **Material permukaan:** plastik ABS tekstur granular/speckle hitam matte

## Contoh Desain yang Sudah Diproduksi

Teks **"ipeka"** (lowercase semua, font brush/handwriting, warna putih) di atas dasar hitam:

- ✅ Kontras putih-hitam: excellent — sangat terbaca
- ✅ Ukuran font: proporsional terhadap area 38×38mm
- ⚠️ Posisi teks: idealnya center vertikal & horizontal di area desain (pada produk pertama posisi terlalu ke atas)
- ✅ Karakter font brush: sesuai untuk brand casual/playful

### Panduan Posisi Desain untuk Pengguna

```
Area desain: 38mm × 38mm
Canvas virtual: 500 × 500 px

Margin aman yang direkomendasikan: 20px dari setiap sisi
Area efektif untuk teks/gambar: 460 × 460 px (dari titik 20,20 ke 480,480)

Teks pendek (1 baris): gunakan font size 120–160px, posisi center
Logo/ikon: maksimal 400×400px, center
```

## Bagian-bagian Produk

### 1. Flap Atas (Area Desain) ← Fokus utama
- Persegi panjang rounded corner
- Dimensi: ±42mm × 38mm (flap penuh), area cetak 38×38mm
- Tekstur permukaan: granular speckle plastik
- **Satu-satunya permukaan yang di-print**
- UV unwrap Blender: **Project from View (Top)** — sangat straightforward

### 2. Frame Mekanisme Bawah
- Panjang 45mm, lebar 42mm
- Berisi slot ratchet dan lubang tali
- Tidak ada area desain di bagian ini
- Untuk model 3D: bisa simplified geometry (tidak terlihat dari view utama atas)

### 3. Slot Tali (Lubang Bawah)
- Lebar 32mm — sesuai lebar tali ikat pinggang standar
- Tidak perlu detail tinggi untuk preview realtime

## Status Template

| Asset | Status | Keterangan |
|---|---|---|
| `config.json` | ✅ Ada | Mode 3d, primitive://box sebagai placeholder |
| `thumb.jpg` | ⬜ Belum | Gunakan foto produk jadi sebagai thumb sementara |
| `model.glb` | ⬜ Belum | Butuh modeling di Blender dulu |
| `textures/normal.jpg` | ⬜ Belum | Normal map granular plastik dari ambientCG |
| `textures/roughness.jpg` | ⬜ Belum | Roughness map |

## Panduan Modeling Blender

### Target LOD untuk Realtime (Level 3)

Fokus pada flap atas yang terlihat dari view kamera default (sedikit dari atas-depan).
Frame bawah bisa simplified — tidak terlihat detail saat preview.

### Langkah Modeling

**Step 1 — Flap Atas:**
```
Add → Mesh → Cube
Scale: X = 38mm, Y = 38mm, Z = 10mm
Bevel semua edge: radius 3mm, 3 segmen
Tekstur: Principled BSDF
  - Base Color: #1A1A1A
  - Roughness: 0.85
  - Metallic: 0.0
Normal Map: Noise Texture (Scale: 80–120) → Bump → Normal
```

**Step 2 — UV Unwrap Area Desain:**
```
Pilih face atas flap
UV Unwrap → Project from View (Top)
Scale UV island hingga mengisi seluruh UV space (0,0)–(1,1)
Face sisi dan bawah: pack ke sudut kecil, tidak dipakai desain
```

**Step 3 — Frame Bawah (Simplified):**
```
Add → Mesh → Cube
Scale: X = 42mm, Y = 45mm, Z = 32mm
Posisi: tepat di bawah flap
Boolean modifier: lubang slot tali 32mm (Add Cylinder → Boolean Difference)
Material: sama dengan flap, tanpa normal map detail
```

**Step 4 — Export:**
```
File → Export → glTF 2.0 (.glb)
Opsi:
  ✓ Draco Mesh Compression
  ✓ Normals
  ✓ UVs
  ✓ Materials
Output: public/templates/belt-buckle-01/model.glb
```

### Konfigurasi Kamera Default di Blender (untuk thumb.jpg)

```
Posisi: sedikit dari atas-depan (elevation ~30°, azimuth ~20°)
Alasan: memperlihatkan permukaan flap (area desain) secara maksimal
        sekaligus menunjukkan dimensi/volume produk
HDRI: studio atau indoor (neutral light)
```

## Update config.json saat model.glb siap

Saat `model.glb` sudah dibuat di Blender dan ditempatkan di folder template,
update `config.json` dari:

```json
"modelUrl": "primitive://box"
```

menjadi:

```json
"modelUrl": "/templates/belt-buckle-01/model.glb"
```

## Folder Template

```
public/templates/belt-buckle-01/
├── config.json          ✅ Ada
├── thumb.jpg            ⬜ Belum (gunakan foto produk sementara)
├── model.glb            ⬜ Belum (output Blender)
└── textures/            ⬜ Opsional
    ├── normal.jpg
    └── roughness.jpg
```

## Referensi

- Dimensi dan spec: sesi review 2026-06-28
- Contoh produk jadi: foto "ipeka" — konfirmasi area cetak, kontras, dan proporsi font
- Spec schema: `specs/product-schema.md`
- Rendering roadmap: `specs/rendering-roadmap.md` Level 3–4
- Teknologi 3D: Three.js + @react-three/fiber + useGLTF (drei)

## Metadata

- Last updated: 2026-06-28
- Version: 1.0.0
