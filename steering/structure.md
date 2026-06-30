# Struktur Proyek

Struktur ini dirancang agar MVP flat editor, embed script, 3D viewport (active scope), dan future admin tetap terpisah modulnya.

```text
/
├── public/
│   ├── embed.js
│   ├── demo-host.html
│   ├── _redirects
│   └── templates/
│       ├── wallet-01/
│       │   ├── background.jpg
│       │   ├── thumb.jpg
│       │   └── config.json
│       └── mug-01/
│           ├── thumb.jpg
│           └── config.json
├── src/
│   ├── components/
│   │   ├── StudioApp.tsx
│   │   ├── FlatEditor.tsx
│   │   ├── Toolbar.tsx
│   │   └── EmbedPage.tsx
│   ├── features/
│   │   ├── flat/
│   │   ├── embed/
│   │   ├── product/
│   │   └── 3d/
│   │       └── Product3DViewer.tsx
│   ├── lib/
│   │   ├── postMessage.ts
│   │   ├── productLoader.ts
│   │   └── warp.ts
│   ├── store/
│   │   └── studioStore.ts
│   ├── types/
│   │   ├── events.ts
│   │   └── product.ts
│   ├── setupTests.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── specs/
│   ├── requirement.md
│   ├── design.md
│   ├── task.md
│   ├── product-schema.md
│   ├── events.md
│   ├── testing.md
│   └── rendering-roadmap.md
├── steering/
│   ├── product.md
│   ├── structure.md
│   ├── tech.md
│   ├── language.md
│   ├── environment.md
│   └── docguide.md
├── docs/
│   ├── 001-INDEX.md
│   └── adr/
│       └── ADR-001-warp-engine.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
├── CONTRIBUTING.md
└── README.md
```

## Organization Rules

- MVP flat code berada di `src/features/flat`.
- Embed-specific code berada di `src/features/embed`.
- `src/features/product` disediakan untuk hook/komponen spesifik product selection di masa depan; loading dan validasi product config (`productLoader.ts`) berada di `src/lib`.
- 3D viewport code berada di `src/features/3d/Product3DViewer.tsx`. Sudah diimplementasi (Active Scope). Wajib tetap lazy-loaded sesuai `steering/tech.md` — tidak boleh masuk initial bundle.
- `Product3DViewer.tsx` berisi seluruh three-panel view (EditableWarpPanel, ShapeMesh, AIEnhancedPanel) dalam satu file karena ketiga panel tightly coupled via texture pipeline. Jika file melebihi 400 baris, pertimbangkan memecahnya menjadi sub-modul di `src/features/3d/`.
- Shared low-level helpers berada di `src/lib` (termasuk `warp.ts` yang dipakai oleh `FlatEditor` maupun `EditableWarpPanel`).
- Shared TypeScript contracts berada di `src/types`.
- Zustand store berada di `src/store`.
- `EmbedPage.tsx` adalah halaman React yang dirender **di dalam iframe** pada route `/embed`. Ini berbeda dari `public/embed.js`, yang berjalan di halaman host dan bertugas membuat iframe tersebut. Lihat `specs/design.md` bagian "Embed Page" dan "Embed Script" untuk detail tanggung jawab masing-masing.
- Future admin code tidak dibuat sampai Phase 5 dimulai (lihat `specs/task.md`) — digerbang karena butuh Supabase yang belum dibangun.
- `vercel.json` dan `public/_redirects` sudah ada untuk SPA fallback agar route `/embed` tidak 404 saat diakses langsung di Vercel maupun Netlify.

## Metadata

- Last updated: 2026-06-26
- Version: 1.3.0
