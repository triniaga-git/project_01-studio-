# Documentation Index

Indeks tunggal untuk seluruh dokumentasi proyek. `README.md` di root hanya berisi overview singkat dan merujuk ke halaman ini (lihat `steering/docguide.md`).

## Specs

- `specs/requirement.md` — scope MVP, Active Scope (Level 1-4 termasuk three-panel view, shape switcher, design system), Future Scope (Level 5-6, admin, Supabase). v1.4.0
- `specs/design.md` — architecture design: System Overview, Application Modules, Data Flow (flat & 3D), **Design System** (CSS token, dark studio backdrop #141414, tipografi, copy guidelines), UI Layout per mode. v1.4.0
- `specs/task.md` — implementation task breakdown dengan status `[x]`/`[ ]`, termasuk **Phase 3.1 Full Redesign** yang selesai di v8. v1.4.0
- `specs/product-schema.md` — product data contract.
- `specs/events.md` — postMessage event contract.
- `specs/testing.md` — testing strategy.
- `specs/rendering-roadmap.md` — staged rendering roadmap Level 1–6.

## Steering

- `steering/product.md` — product direction dan boundaries; catatan warp formula perlu verifikasi IDE. v1.4.0
- `steering/structure.md` — project structure (tree aktual, catatan `index.css` sebagai design system). v1.4.0
- `steering/tech.md` — technology decisions: stack aktual, **Design System** (tabel CSS classes), TextureLoader, single canvas, performance budget. v1.4.0
- `steering/language.md` — bilingual language rules.
- `steering/environment.md` — local setup dan environment variables.
- `steering/docguide.md` — documentation organization rules.

## Feature Docs

- `docs/FEAT-001-belt-buckle-product.md` — Spec produk Kepala Ikat Pinggang (belt-buckle-01): dimensi fisik, area desain 38×38mm, panduan modeling Blender, status template asset. v1.0.0
- `docs/FEAT-002-text-input-layer.md` — Spec fitur input teks langsung di studio: feature flag per-produk on/off, arsitektur teknis, preset font/warna, task breakdown implementasi. v1.0.0

## ADR

- `docs/adr/ADR-001-warp-engine.md` — Fabric.js + custom perspective transform untuk MVP flat warp. Juga berlaku untuk Panel A (`EditableWarpPanel`) di 3D viewer — keduanya menggunakan `lib/warp.ts`. Catatan: sign error pada koefisien `a`, `c`, `e` sudah diperbaiki secara teori di v7; perlu verifikasi visual di browser.

## Log

- `docs/LOG-001-improvement-analysis.md` — Pre-launch improvement analysis (15 temuan: security, bug, UX, performance, DX) sebelum deployment ke triniaga.my.id. v1.1.0
- `docs/LOG-002-deploy-milestone.md` — Catatan milestone deploy live ke Vercel (2026-06-28): status fitur, infrastruktur, dan item post-launch yang masih terbuka. v1.0.0

## Metadata

- Last updated: 2026-06-28
- Version: 1.5.0
