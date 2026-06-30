# Documentation Index

Indeks tunggal untuk seluruh dokumentasi proyek. `README.md` di root hanya berisi overview singkat dan merujuk ke halaman ini untuk daftar lengkap dan terkini (lihat `steering/docguide.md` bagian Best Practices).

## Specs

- `specs/requirement.md`: product requirements dan scope — MVP, Active Scope (Level 1-4 termasuk three-panel view dan shape switcher), Future Scope (Level 5-6, admin, Supabase).
- `specs/design.md`: architecture design — System Overview, Application Modules (termasuk 3D Product Viewer, Texture Pipeline), Data Flow (flat & 3D), UI Layout.
- `specs/task.md`: implementation task breakdown dengan status `[x]`/`[ ]` per task.
- `specs/product-schema.md`: product data contract.
- `specs/events.md`: postMessage event contract.
- `specs/testing.md`: testing strategy.
- `specs/rendering-roadmap.md`: staged rendering roadmap Level 1–6.

## Steering

- `steering/product.md`: product direction dan boundaries (sudah diimplementasi vs belum).
- `steering/structure.md`: project structure (tree aktual termasuk `features/3d/Product3DViewer.tsx`).
- `steering/tech.md`: technology decisions (stack aktual, keputusan TextureLoader, single canvas, performance budget aktual).
- `steering/language.md`: bilingual language rules.
- `steering/environment.md`: local setup dan environment variables.
- `steering/docguide.md`: documentation organization rules.

## ADR

- `docs/adr/ADR-001-warp-engine.md`: Fabric.js + custom perspective transform untuk MVP flat warp. Juga berlaku untuk Panel A (editable warp) di 3D viewer — keduanya menggunakan `lib/warp.ts` yang sama.

## Metadata

- Last updated: 2026-06-26
- Version: 1.3.0
