# Lingkungan Pengembangan

## Prasyarat

- Node.js >= 18.
- npm >= 9.
- Git.
- Browser modern untuk testing.

## Setup Lokal

```bash
git clone <repo-url>
cd product-customizer-studio
npm install
npm run dev
```

Dev server default:

```text
http://localhost:5173
```

## Embed Development

Untuk menguji embed script:

```bash
npm run build:embed
npm run dev
```

Lalu buka demo host lokal:

```text
http://localhost:5173/demo-host.html
```

## Environment Variables

MVP static tidak membutuhkan environment variable.

Future Supabase:

```text
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=ey...
```

Security configuration:

```text
VITE_ALLOWED_ORIGINS=https://example.com,https://shop.example.com
```

`VITE_ALLOWED_ORIGINS` dipakai oleh Communication Layer untuk validasi origin pada `postMessage`. Lihat `specs/events.md` untuk kontrak origin whitelist dan contoh implementasinya, serta `specs/task.md` Phase 2 untuk task terkait.

Jangan commit `.env.local`.

## Recommended Tools

- VSCode.
- ESLint extension.
- Prettier extension.
- Chrome atau Edge DevTools.
- Playwright browser dependencies.
- Blender untuk future 3D asset preparation.

## Metadata

- Last updated: 2026-06-20
- Version: 1.1.0
