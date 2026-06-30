# Teknologi

## MVP Stack (Diimplementasi)

- React 19.
- TypeScript.
- Vite 8.
- Fabric.js v7.
- Zustand.
- Vitest.
- React Testing Library.
- Playwright.

## Embed Script

- Vanilla JavaScript output.
- Source boleh TypeScript.
- Tidak boleh membawa React, Fabric.js, atau Three.js.
- Target ukuran: kurang dari 5 KB gzip. Aktual: 917 bytes gzip.

## Active Stack — Rendering Roadmap Level 1-4 (Diimplementasi)

Sudah diinstall dan aktif digunakan di `src/features/3d/Product3DViewer.tsx`. Wajib lazy-loaded — tidak boleh masuk initial bundle.

- Three.js.
- @react-three/fiber.
- @react-three/drei (OrbitControls).

Belum diimplementasi dari Level 4 (menunggu asset pipeline stabil):

- PBR material workflow (roughness, metallic, normal map, ambient occlusion).
- HDRI environment lighting.

## Future Stack

Baru boleh diinstall setelah infrastruktur terkait benar-benar dibangun (job queue, render worker, AI API).

- Supabase PostgreSQL.
- Supabase Storage.
- Serverless functions hanya jika benar-benar diperlukan.
- Blender untuk server-side render (Level 5).
- AI image generation/enhancement API untuk Level 6 (bukan filter lokal).

## Mandatory Decisions

- Zustand wajib untuk state management sejak MVP.
- Fabric.js wajib menjadi canvas interaction layer MVP (flat editor).
- Warp implementation mengikuti `docs/adr/ADR-001-warp-engine.md`. Fallback ke PixiJS atau WebGL shader untuk area warp saja hanya dipertimbangkan bila performa atau kualitas warp pada Fabric.js terbukti tidak memadai — bukan pilihan default.
- Three.js wajib lazy-loaded — tidak boleh masuk initial bundle.
- `THREE.TextureLoader` dipakai untuk load texture di 3D viewer, bukan `useTexture` dari drei — untuk menghindari cache issue saat textureUrl berupa data URL yang sering berubah. Texture lama wajib di-dispose untuk mencegah WebGL memory leak.
- Panel A (editable warp) menggunakan **satu canvas** untuk render dan interaksi sekaligus — bukan dual canvas — untuk menghindari masalah z-ordering dan opacity pada browser.
- Warp points di Panel A disimpan sebagai **`ref`**, bukan `useState`, agar drag tidak memicu re-render React setiap frame.
- Texture Panel B/C hanya diupdate pada `pointerup` (bukan setiap frame drag) untuk mencegah spam ke `TextureLoader`.
- `preserveDrawingBuffer: true` pada WebGL context wajib diset agar Panel C dapat snapshot canvas Panel B via `canvas.toDataURL()`.
- Supabase tidak masuk MVP maupun Active Scope.
- Server-side render (Blender) dan AI enhancement tidak masuk MVP maupun Active Scope — masih Future Stack.

## Performance Budget (Aktual)

- Initial JS studio MVP: 151.72 KB gzip (target <500 KB ✓).
- Three.js chunk (lazy): 241.23 KB gzip (tidak masuk initial bundle ✓).
- `embed.js`: 917 bytes gzip (target <5 KB ✓).
- First render: target <2 detik.
- Preview capture: client-side.
- Panel C snapshot: setiap 80ms via `setInterval` (bukan blocking interaction).

## Metadata

- Last updated: 2026-06-26
- Version: 1.3.0
