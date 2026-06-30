# Breakdown Tugas

Dokumen ini memisahkan pekerjaan MVP, Active Scope (rendering roadmap Level 1-4, boleh paralel dengan MVP), dan Future Scope (admin/Supabase/Level 5-6, masih digerbang infrastruktur) agar AI coding agent tidak membangun fitur yang infrastrukturnya belum ada.

## Phase 0: Project Foundation

- [x] Setup React + Vite + TypeScript.
- [ ] Setup ESLint dan Prettier.
- [x] Setup Vitest.
- [x] Setup React Testing Library.
- [ ] Setup Playwright.
- [x] Setup folder sesuai `steering/structure.md`.
- [x] Tambahkan static sample product di `public/templates`.
- [x] Definisikan TypeScript type untuk `Product`.

## Phase 1: MVP Flat Studio

- [x] Install dan integrasikan Fabric.js.
- [x] Buat Zustand store untuk studio state.
- [x] Buat loader untuk static product config.
- [x] Buat komponen `StudioApp`.
- [x] Buat komponen `FlatEditor`.
- [x] Render product background image.
- [x] Implementasi upload JPG/PNG.
- [x] Validasi ukuran file maksimal 20 MB.
- [x] Render uploaded image di canvas.
- [x] Implementasi 4 warp control points.
- [ ] Pastikan warp control point dapat diakses lewat elemen overlay (mis. `data-testid`) selain interaksi langsung di canvas Fabric.js, agar dapat ditarget Playwright untuk E2E.
- [x] Implementasi custom perspective transform.
- [x] Implementasi drag warp points.
- [x] Implementasi drag image.
- [x] Implementasi scale image.
- [x] Implementasi rotate image.
- [x] Implementasi reset design.
- [x] Implementasi capture canvas menjadi PNG.
- [x] Tambahkan unit test untuk product config validation.
- [x] Tambahkan component test untuk upload flow.

## Phase 2: MVP Embed Widget

- [x] Buat `public/embed.js` atau build entry khusus embed.
- [x] Buat route/page `/embed` dengan komponen `EmbedPage.tsx`.
- [x] `embed.js` membaca atribut script.
- [x] `embed.js` membuat iframe.
- [x] `embed.js` meneruskan `data-product` ke URL iframe.
- [x] Implementasi event `studio-ready`.
- [x] Implementasi event `product-loaded`.
- [x] Implementasi command `set-product`.
- [x] Implementasi command `get-preview`.
- [x] Implementasi event `preview-captured`.
- [x] Implementasi event `design-saved`.
- [x] Implementasi event `studio-error` untuk kegagalan load product config (lihat Error Flow di `specs/design.md`).
- [x] Implementasi origin whitelist menggunakan `VITE_ALLOWED_ORIGINS` (lihat `steering/environment.md`).
- [x] Buat `demo-host.html` untuk pengujian integrasi.
- [ ] Tambahkan Playwright test untuk embed flow.

## Phase 3: MVP Polish & Deployment

- [x] Optimasi initial bundle (main: 151 KB gzip, Three.js lazy: 241 KB gzip, embed.js: 917 bytes gzip).
- [x] Pastikan `embed.js` kurang dari 5 KB gzip. (917 bytes gzip aktual)
- [x] Tambahkan loading dan error state (status bar error, Suspense fallback).
- [x] Tambahkan responsive layout (three-panel stack di mobile, max-width 1040px).
- [ ] Uji Chrome, Edge, Firefox, dan Safari jika tersedia.
- [x] Build production.
- [x] Deploy ke Vercel atau Netlify. (Vercel — live 2026-06-28)
- [ ] Dokumentasikan cara embed untuk host developer.

## Phase 3.1: Full Redesign — Bold & Modern (Selesai)

Design system baru dengan CSS token system, dark studio backdrop sebagai signature element,
dan copy yang konsisten (active voice, Bahasa Indonesia). Lihat `specs/design.md` bagian Design System.

- [x] Definisikan CSS token system (`--bg`, `--text`, `--accent #0057FF`, `--studio #141414`, dll.).
- [x] Redesign header: logo + badge level + product id monospace.
- [x] Redesign product tabs: underline style, neutral untuk embedding.
- [x] Redesign global toolbar: CTA hitam penuh, secondary border halus.
- [x] Dark studio backdrop untuk Panel B dan C (`background: #141414`).
- [x] Panel A: background light (`#EDE8DF`), warp control point `stroke: #0057FF`.
- [x] Label panel: uppercase tracked A/B/C index (bukan dot warna).
- [x] Shape switcher: pill group style, background hitam saat aktif.
- [x] Redesign controls bar: label uppercase monospace, nilai biru.
- [x] Custom range slider: thumb hitam di atas track abu.
- [x] AI badge: semi-transparent di atas dark panel (subtle, bukan mencolok).
- [x] Placeholder Panel A: ikon + teks, pointer-events none.
- [x] Copy: "Simpan" (bukan "Save"), "Hapus desain" (bukan "Reset"), "Desain aktif" (bukan "Desain diunggah").
- [x] Warp reset button: class `warp-reset-btn`, konsisten dengan design system.

## Phase 3.5: Enhanced 2D Mockup (Level 2) — Active Scope

Mengacu pada Level 2 di `specs/rendering-roadmap.md`. Boleh dikerjakan paralel dengan Phase 1-3, karena ringan (tidak butuh 3D) dan client-side penuh.

- [ ] Definisikan kebutuhan asset untuk overlay shadow dan highlight per produk flat.
- [ ] Implementasi overlay shadow di atas flat editor.
- [ ] Implementasi overlay highlight di atas flat editor.
- [ ] Implementasi masking untuk area produk non-persegi.
- [ ] Implementasi blend mode untuk hasil overlay.
- [ ] Evaluasi optional displacement map untuk tekstur permukaan ringan.
- [ ] Dokumentasikan batasan: masih mockup 2D, bukan render 3D, dan tidak mengubah `specs/product-schema.md`.

## Phase 4: 3D Product Viewport (Level 3) — Active Scope ✓ Sebagian Diimplementasi

Sudah diimplementasi dengan three-panel view, shape switcher, dan texture pipeline.

- [x] Install Three.js dan @react-three/fiber.
- [x] Install @react-three/drei.
- [x] Lazy-load 3D editor (tidak masuk initial bundle MVP).
- [x] Three-panel view: Panel A (editable warp canvas), Panel B (viewport 3D), Panel C (render simulasi).
- [x] Panel A: single-canvas corner-pin warp, warp points sebagai `ref` bukan `useState`.
- [x] Panel A emit `canvas.toDataURL()` ke Panel B hanya pada `pointerup` (bukan setiap frame drag).
- [x] Apply uploaded image sebagai texture via `THREE.TextureLoader` + data URL dari Panel A.
- [x] Dispose texture lama setiap kali tekstur baru masuk (mencegah WebGL memory leak).
- [x] Kontrol texture offset (slider Offset X dan Offset Y).
- [x] Kontrol texture scale (slider Texture scale).
- [x] Orbit controls untuk rotate/zoom model (OrbitControls + auto-rotate + drag manual).
- [x] Auto-rotate: aktif saat idle, berhenti saat drag, kembali 2 detik setelah drag selesai.
- [x] Shape switcher: Silinder, Kotak, Cincin, Bola (4 primitive geometry Three.js).
- [x] Panel C: snapshot WebGL canvas setiap 80ms + efek canvas 2D + label "AI-enhanced mockup (simulasi)".
- [x] `preserveDrawingBuffer: true` pada WebGL context untuk mendukung Panel C snapshot.
- [ ] Load GLTF/GLB product model asli (saat ini menggunakan primitive geometry — `primitive://cylinder`).
- [ ] Capture WebGL preview dan kirim via event `design-saved` ke host (saat ini hanya flat mode yang mengirim).
- [ ] Playwright test untuk 3D viewport flow.

## Phase 4.5: Browser-Based PBR (Level 4) — Active Scope

- [ ] Tambahkan dukungan PBR material metadata (roughness, metallic, normal map, ambient occlusion).
- [ ] Tambahkan HDRI lighting preset untuk scene 3D.
- [ ] Tambahkan real-time shadow untuk produk 3D.
- [ ] Tambahkan reflection layer untuk material glossy.
- [ ] Evaluasi kualitas preview Three.js dengan PBR material di device kelas menengah.

## Future Phase 5: Admin & Supabase

- [ ] Setup Supabase database.
- [ ] Setup Supabase Storage bucket.
- [ ] Buat schema `products`.
- [ ] Buat admin panel.
- [ ] Upload background image flat product.
- [ ] Simpan warp points default.
- [ ] Upload model 3D.
- [ ] Integrasikan product loader dengan Supabase.
- [ ] Fallback ke static templates jika backend tidak tersedia.

## Future Phase 6: Server-Side Render & AI Enhancement (Level 5-6)

Masih digerbang — butuh job queue, Blender render worker, dan integrasi AI API sungguhan, bukan sekadar simulasi UI/alur kerja.

- [ ] Definisikan asset requirements untuk photorealistic product.
- [ ] Buat proof of concept server-side render via Blender.
- [ ] Buat async render job flow untuk output kualitas tinggi.
- [ ] Evaluasi AI-enhanced mockup generation sebagai optional post-processing.
- [ ] Pastikan label "AI-enhanced mockup" tampil pada output publik (lihat `specs/rendering-roadmap.md`).
- [ ] Dokumentasikan batasan: mockup visual, bukan proof produksi fisik.

## Metadata

- Last updated: 2026-06-28
- Version: 1.4.0
