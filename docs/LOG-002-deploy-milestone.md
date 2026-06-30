# LOG-002: Deploy Milestone — Vercel Live

## Status

Selesai. Production live.

## Catatan

Tanggal live: 2026-06-28
Platform: Vercel
Repository: https://github.com/triniaga-git/product_studio01
Target embed: www.triniaga.my.id

## Yang Sudah Selesai Saat Live

### Kode & Build
- Build production bersih: 151.72 KB gzip (initial), 241.22 KB gzip (Three.js lazy)
- `embed.js`: 917 bytes gzip
- 20/20 unit + component tests passed
- Zero import cycles (dikonfirmasi graphify)
- Zustand store sebagai hub state terpusat

### Infrastruktur
- Git repository diinisialisasi dan di-push ke `triniaga-git/product_studio01`
- `vercel.json` SPA fallback sudah aktif (route `/embed` tidak 404)
- `VITE_ALLOWED_ORIGINS` diset di Vercel dashboard
- Graphify knowledge graph terpasang (528 nodes, 539 edges)

### Fitur yang Live
- Flat editor (corner-pin warp, upload JPG/PNG, capture PNG)
- Embed widget (`embed.js`, iframe, postMessage)
- 3D three-panel view (Panel A warp, Panel B Three.js, Panel C simulasi)
- Shape switcher: Silinder, Kotak, Cincin, Bola
- Templates: `wallet-01` (flat), `mug-01` (3D), `belt-buckle-01` (3D placeholder)
- Design system: CSS tokens, dark studio backdrop

### Dokumentasi
- `specs/` lengkap: requirement, design, events, product-schema, rendering-roadmap
- `docs/FEAT-001` — spec produk kepala ikat pinggang
- `docs/FEAT-002` — spec fitur text input layer (belum diimplementasi)
- `docs/LOG-001` — improvement analysis 15 temuan

---

## Yang Masih Terbuka (Post-Launch)

Item dari LOG-001 yang belum diselesaikan, urut prioritas:

| # | Item | Prioritas |
|---|---|---|
| 1 | Fix `sendToHost` target `"*"` → host origin | Critical |
| 2 | ✅ `VITE_ALLOWED_ORIGINS` sudah diset | Selesai |
| 3 | Fix `get-preview` silent-fail mode 3D | Critical |
| 4 | Sanitasi `productId` dari host command | High |
| 5 | Verifikasi visual warp formula di browser production | Medium |
| 6 | Validasi isi warp points (x/y number) | Medium |
| 7 | Validasi field `name` di productLoader | Medium |
| 8 | Dynamic product list (`public/templates/index.json`) | Medium |
| 9 | Cache compose canvas di FlatEditor | Medium |
| 10–15 | Lihat LOG-001 untuk item Low priority | Low |

---

## Next Milestone

1. **Fix 3 bug critical** (LOG-001 item 1, 3, 4) sebelum embed ke triniaga.my.id
2. **Verifikasi warp** di URL Vercel production
3. **Embed snippet** dipasang di halaman produk triniaga.my.id
4. **Model GLB belt-buckle** dibuat di Blender

## Metadata

- Last updated: 2026-06-28
- Version: 1.0.0
