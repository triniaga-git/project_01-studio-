# Persyaratan Produk

Dokumen ini mendefinisikan scope Product Customizer Studio sebagai dasar Spec Driven Development (SDD). Tujuan utamanya adalah menjaga implementasi tetap fokus pada MVP sebelum memperluas ke 3D, admin, dan backend dinamis.

## MVP Scope

Fitur berikut wajib menjadi prioritas implementasi awal.

- Upload image dari perangkat pengguna.
- Flat editor untuk produk datar berbasis canvas.
- Corner-pin warp dengan 4 titik kontrol.
- Transformasi gambar dasar: drag, scale, rotate.
- Real-time preview setiap kali gambar atau titik warp berubah.
- Save/capture preview sebagai PNG.
- Embed widget berbasis iframe.
- Komunikasi host <-> studio melalui `postMessage`.
- Produk awal dimuat dari static template di `public/templates`.

## Active Scope — Rendering Roadmap Level 1-4

Fitur berikut **boleh dikerjakan paralel** dengan penyelesaian MVP flat editor. Sudah divalidasi lewat prototype interaktif (client-side, tanpa backend), sehingga tidak lagi digerbang oleh status selesai/belum-nya MVP.

- Enhanced 2D mockup layer (shadow, highlight, masking, blend mode) untuk produk flat, mengikuti Level 2 di `specs/rendering-roadmap.md`.
- 3D product editor/viewport dengan GLTF/GLB dan UV mapping (Level 3), termasuk kontrol texture offset dan texture scale.
- PBR material browser-based (roughness, metallic, normal map, ambient occlusion) dan HDRI environment lighting (Level 4).
- Semua tetap client-side, lazy-loaded, dan tidak masuk initial bundle MVP (lihat `steering/tech.md`).

## Future Scope

Fitur berikut tidak boleh dibangun kecuali scope proyek berubah secara eksplisit. Berbeda dengan Active Scope di atas, bagian ini butuh infrastruktur yang belum dibangun sama sekali (baru tervalidasi sebagai simulasi alur UI/UX, bukan sistem nyata).

- Server-side photorealistic render via Blender (Level 5) — butuh job queue dan render worker sungguhan.
- AI-enhanced mockup generation (Level 6) — butuh integrasi AI API sungguhan, bukan filter simulasi.
- Admin panel untuk manajemen produk.
- Supabase backend dan Supabase Storage.
- Multi-layer editor.
- Akun pengguna, order, checkout, atau integrasi e-commerce penuh.
- Print-ready rendering (file cetak resolusi produksi).

## Kebutuhan Fungsional MVP

### Studio Flat Customizer

- Pengguna dapat mengunggah gambar JPG atau PNG.
- Batas ukuran upload MVP: maksimal 20 MB.
- Sistem menampilkan produk datar menggunakan background image.
- Gambar pengguna ditempel ke area template menggunakan corner-pin warp.
- Pengguna dapat mengubah 4 titik warp secara visual dengan drag and drop.
- Pengguna dapat menggeser, memperbesar, memperkecil, dan memutar gambar.
- Preview diperbarui secara langsung setelah perubahan.
- Pengguna dapat menyimpan hasil preview sebagai gambar statis PNG.

### Embeddable Widget

- Studio berjalan sebagai aplikasi terisolasi di iframe.
- Website host dapat menanamkan widget menggunakan satu tag script.
- `embed.js` membuat iframe dan meneruskan parameter produk ke studio.
- Parameter embed MVP:
  - `data-product`
  - `data-lang`
  - `data-width`
  - `data-height`
  - `data-container`
- Studio dan host berkomunikasi melalui kontrak event di `specs/events.md`.
- CSS studio tidak boleh memengaruhi CSS website host.

### Product Template Static

- MVP menggunakan file statis di `public/templates`.
- Setiap produk memiliki `config.json`.
- Produk flat wajib memiliki:
  - `id`
  - `name`
  - `mode: "flat"`
  - `flat.backgroundImage`
  - `flat.warpPoints`

## Active Functional Requirements — Rendering Roadmap Level 1-4

### Enhanced 2D Mockup

- Layer Level 2 dibangun mengikuti urutan di `specs/rendering-roadmap.md`, boleh paralel dengan penyelesaian MVP flat editor.
- Tidak menambah dependency 3D (Three.js tetap tidak dimuat pada layer ini).
- Tidak mengubah kontrak `specs/product-schema.md` untuk mode `"flat"`.
- Tetap berjalan client-side, tidak membutuhkan server rendering.

### Mode 3D (Viewport) — Diimplementasi

- Gambar pengguna dapat diaplikasikan sebagai texture ke model 3D primitif.
- **Three-panel view** — tampilan tiga panel berdampingan:
  - Panel A (Hasil warp): canvas 2D interaktif dengan 4 titik sudut yang dapat digeser untuk corner-pin warp. Hasil warp otomatis menjadi tekstur Panel B.
  - Panel B (Viewport 3D): Three.js canvas interaktif, auto-rotate, drag untuk kontrol manual.
  - Panel C (Hasil render): snapshot Panel B dengan efek shadow, highlight, vignette, color grading — simulasi canvas 2D, bukan AI generatif.
- **Shape switcher** — pengguna dapat mengganti objek 3D tanpa reload: Silinder, Kotak, Cincin, Bola.
- Kontrol texture: scale, offset X, offset Y via slider reaktif.
- Texture pipeline: Upload → Warp (Panel A, `pointerup`) → `TextureLoader` → Three.js mesh → Panel C snapshot.
- 3D assets lazy-loaded dan tidak masuk initial bundle MVP.
- Label wajib "AI-enhanced mockup (simulasi)" di Panel C untuk membedakan dari AI generatif sungguhan.

## Future Functional Requirements

Bagian ini butuh infrastruktur yang belum dibangun sama sekali — beda dengan Active Functional Requirements di atas yang murni client-side.

### Admin & Backend

- Admin dapat menambahkan produk baru.
- Admin dapat mengunggah background image untuk produk flat.
- Admin dapat mengatur default warp points.
- Admin dapat mengunggah model GLTF/GLB untuk produk 3D.
- Data produk dapat disimpan di Supabase pada fase backend.

### Server-Side Render & AI Enhancement (Level 5-6)

Fase ini hanya boleh dimulai setelah job queue, Blender render worker, dan integrasi AI API sungguhan dibangun — bukan lagi sekadar simulasi UI/alur kerja.

- Server-side render via Blender dapat dipakai untuk output kualitas tinggi (Level 5).
- AI-enhanced mockup generation dapat dievaluasi untuk meningkatkan realisme visual (Level 6), dengan label "AI-enhanced mockup" wajib pada output publik.
- Hasil photorealistic tetap diposisikan sebagai mockup visual, bukan jaminan output produksi fisik.

## Kebutuhan Non-Fungsional

### Security

- Studio wajib berjalan di iframe.
- Komunikasi `postMessage` wajib memvalidasi origin.
- Allowed origins dikonfigurasi secara eksplisit.
- Pesan dari origin yang tidak dikenal wajib diabaikan.
- Data upload pengguna diproses client-side pada MVP.

### Performance

- Initial JS studio MVP target: kurang dari 500 KB gzip.
- `embed.js` target: kurang dari 5 KB gzip.
- First render target: kurang dari 2 detik pada koneksi normal.
- 3D dependencies tidak boleh masuk ke bundle awal MVP.
- Capture preview dilakukan client-side tanpa server rendering.

### Compatibility

- Browser target: Chrome, Edge, Firefox, dan Safari versi modern.
- Touch interaction wajib dipertimbangkan untuk drag warp point (Panel A) dan drag rotate (Panel B).
- WebGL dibutuhkan untuk mode 3D (Active Scope). Flat editor tidak membutuhkan WebGL.

### Maintainability

- TypeScript digunakan untuk seluruh source code.
- Product schema wajib mengikuti `specs/product-schema.md`.
- State management wajib memakai Zustand sejak MVP.
- Testing strategy mengikuti `specs/testing.md`.

## Out of Scope MVP

Daftar ini spesifik untuk MVP flat editor (Phase 0-3 di `specs/task.md`). Level 1-4 rendering roadmap bukan bagian dari MVP, tapi juga bukan "dilarang" — statusnya Active Scope terpisah (lihat bagian Active Scope di atas).

- Checkout, cart, payment, dan order management.
- Login atau user account.
- Server-side rendering preview.
- Admin panel.
- Supabase.
- Server-side photorealistic render via Blender (Level 5).
- AI-enhanced mockup generation (Level 6).
- Print-ready rendering (file cetak resolusi produksi).

## Metadata

- Last updated: 2026-06-26
- Version: 1.3.0
