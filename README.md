# Product Customizer Studio

Product Customizer Studio adalah embeddable widget untuk preview desain produk secara client-side. MVP menyediakan flat product editor (corner-pin warp berbasis Fabric.js). Mode 3D menyediakan three-panel view: warp interaktif, viewport Three.js, dan preview render simulasi.

## Documentation Map

- `specs/requirement.md`: scope MVP, active scope, future scope, kebutuhan fungsional dan non-fungsional.
- `specs/design.md`: arsitektur, modul aplikasi, data flow (flat & 3D), three-panel view, texture pipeline, dan UI layout.
- `specs/task.md`: breakdown tugas dengan status implementasi (`[x]` selesai, `[ ]` belum).
- `specs/product-schema.md`: kontrak data produk.
- `specs/events.md`: kontrak `postMessage` host <-> studio.
- `specs/testing.md`: strategi unit, component, dan E2E test.
- `specs/rendering-roadmap.md`: roadmap Level 1–6 dari MVP preview ke photorealistic render.
- `steering/`: panduan produk, struktur, teknologi, bahasa, environment, dan dokumentasi.
- `docs/adr/`: keputusan arsitektur.

## Status Implementasi

| Area | Status |
|---|---|
| Flat editor (corner-pin warp, upload, capture) | ✓ MVP selesai |
| Embed widget (`embed.js`, `EmbedPage`, `postMessage`) | ✓ MVP selesai |
| Static templates (`wallet-01`, `mug-01`) | ✓ Selesai |
| 3D three-panel view (Panel A/B/C) | ✓ Active Scope selesai |
| Shape switcher (Silinder, Kotak, Cincin, Bola) | ✓ Selesai |
| Texture pipeline (warp → TextureLoader → Three.js) | ✓ Selesai |
| GLTF/GLB asset nyata | ⬜ Belum (saat ini primitive placeholder) |
| PBR material + HDRI lighting | ⬜ Belum |
| Admin panel + Supabase | ⬜ Future Scope |
| Blender render + AI API | ⬜ Future Scope |

## Guardrails

- Flat editor dan 3D viewport: boleh dikembangkan paralel. Keduanya sudah berjalan client-side.
- Three.js wajib tetap lazy-loaded — tidak boleh masuk initial bundle.
- Panel C ("AI-enhanced mockup") adalah **simulasi canvas 2D**, bukan AI generatif sungguhan. Label "AI-enhanced mockup (simulasi)" wajib tampil.
- GLTF/GLB nyata harus disiapkan secara terpisah (Blender atau sumber model 3D) sebelum `mug-01` bisa pakai model asli.
- Admin panel dan Supabase: ditahan sampai MVP dan 3D viewport benar-benar stabil.
- Level 5 (Blender render) dan Level 6 (AI API): butuh infrastruktur yang belum dibangun.
- Jaga `embed.js` tetap kecil dan bebas dependency berat (aktual: 917 bytes gzip).

## Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
                  # ?product=wallet-01 → flat editor
                  # ?product=mug-01   → 3D three-panel view
npm test          # 18 unit + component tests
npm run build     # production build
```

## Metadata

- Last updated: 2026-06-26
- Version: 1.3.0
