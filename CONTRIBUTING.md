# Contributing

## Setup Lokal

```bash
git clone <repo-url>
cd product-customizer-studio
npm install
npm run dev
```

Buka `http://localhost:5173` untuk mode full app, atau `http://localhost:5173/embed?product=wallet-01` untuk mode embed.

## Menguji Embed

```bash
npm run dev
# Buka http://localhost:5173/demo-host.html
```

## Menambah Produk Baru

1. Buat folder di `public/templates/<product-id>/`.
2. Tambahkan `config.json` sesuai kontrak di `specs/product-schema.md`.
3. Untuk produk flat: tambahkan `background.jpg` dan `thumb.jpg`.
4. Untuk produk 3D: simpan file `*.glb` di folder yang sama, daftarkan di `modelUrl`.

## Menjalankan Test

```bash
npm test                # run sekali
npm run test:watch      # watch mode
npm run typecheck       # TypeScript check
```

## Menambah Fitur Baru

1. Baca `specs/requirement.md` untuk pastikan fitur masuk MVP atau Active Scope.
2. Update `specs/task.md` jika ada task baru.
3. Ikuti aturan bahasa di `steering/language.md`.
4. Ikuti struktur folder di `steering/structure.md`.
5. Buat ADR di `docs/adr/` jika keputusan teknis baru sulit dibalik.
6. Jangan menambahkan Three.js/Supabase/Blender tanpa memperbarui `steering/tech.md`.
