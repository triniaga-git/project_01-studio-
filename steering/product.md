# Produk: Product Customizer Studio

## Visi

Menyediakan custom design studio yang dapat disematkan ke website e-commerce atau website personalisasi produk, sehingga pemilik bisnis dapat memberi pengalaman "desain sendiri" tanpa membangun editor dari nol.

## Target Pengguna

- Pemilik bisnis merchandise, souvenir, dan hadiah personal.
- Platform print-on-demand.
- Website jasa personalisasi produk.
- Developer website yang membutuhkan widget customizer ringan.

## Value Proposition

- Embeddable: cukup satu script untuk menampilkan studio.
- Client-side preview: tidak membutuhkan render server untuk flat maupun 3D viewport.
- Isolated: iframe mencegah konflik CSS dan JavaScript.
- Flat editor MVP: corner-pin warp berbasis Fabric.js, sudah berfungsi.
- 3D three-panel view: upload desain → warp interaktif di Panel A → viewport 3D di Panel B → preview render di Panel C. Sudah diimplementasi sebagai Active Scope.
- Future-ready: schema sudah mendukung mode 3D dan backend dinamis.

## Product Boundaries

### Sudah Diimplementasi (MVP + Active Scope)

- Upload image (JPG/PNG, max 20 MB).
- Flat editor dengan corner-pin warp 4 titik.
- Capture preview PNG dan kirim via `design-saved` (flat mode).
- Embed widget (`embed.js` + `EmbedPage`) dengan `postMessage` communication.
- Product switcher UI (Wallet 01 flat / Mug 01 3D).
- Three-panel view untuk mode 3D (Panel A warp, Panel B viewport, Panel C render simulasi).
- Shape switcher: Silinder, Kotak, Cincin, Bola.
- Texture pipeline: warp canvas → `TextureLoader` → Three.js mesh.
- Panel C: simulasi canvas 2D dengan label "AI-enhanced mockup (simulasi)".
- Static templates: `wallet-01` (flat), `mug-01` (3D, primitive placeholder).
- Deploy-ready: `vercel.json` dan `public/_redirects` sudah ada.

### Active Scope (Lanjutan yang Belum Selesai)

- Load GLTF/GLB asset produk nyata (saat ini primitive placeholder `primitive://cylinder`).
- Capture WebGL preview dan kirim via `design-saved` untuk mode 3D.
- Enhanced 2D mockup (shadow/highlight overlay, Level 2) untuk flat editor.
- PBR material dan HDRI lighting (Level 4).

### Tidak Termasuk (Future Scope — butuh infrastruktur)

- Checkout, cart, payment, dan order management.
- Login atau user account.
- Admin panel.
- Supabase backend dan Supabase Storage.
- Server-side render via Blender (Level 5).
- AI-enhanced mockup generation sungguhan via API eksternal (Level 6).
- Print-ready rendering (file cetak resolusi produksi).

## Metadata

- Last updated: 2026-06-26
- Version: 1.3.0
