# Testing Strategy

Dokumen ini mendefinisikan strategi testing untuk MVP dan fase lanjutan.

## Testing Stack

- Unit test: Vitest.
- Component test: React Testing Library.
- E2E test: Playwright.
- Optional visual regression: Playwright screenshot comparison.

## Unit Test

Target utama:

- Product schema validation.
- Static product config loader.
- Event payload validation.
- Origin whitelist helper.
- Zustand store actions.
- Warp point utility functions.

Contoh coverage:

- Reject product flat tanpa `flat.backgroundImage`.
- Reject `warpPoints` yang jumlahnya bukan 4.
- Ignore message dari origin yang tidak dikenal.
- Capture status berubah dari `dirty` ke `capturing` lalu `ready`.

## Component Test

Target utama:

- `StudioApp` memilih editor berdasarkan product mode.
- `FlatEditor` menampilkan background image.
- Upload image memunculkan object pada canvas.
- Save button memicu capture callback.
- Error state tampil saat product config gagal dimuat.

## E2E Test

Target utama:

- Demo host memuat `embed.js`.
- Iframe dibuat dengan product id yang benar.
- Studio mengirim `studio-ready`.
- User upload image.
- User menggeser warp point.
- User menekan save.
- Host menerima `design-saved`.

## Manual QA Checklist

- Upload JPG berhasil.
- Upload PNG berhasil.
- File lebih dari 20 MB ditolak.
- Drag point bekerja dengan mouse.
- Drag point bekerja dengan touch.
- Reset mengembalikan warp ke default.
- Capture menghasilkan PNG yang dapat ditampilkan host.
- Unknown `postMessage` tidak menyebabkan error.
- Origin yang tidak diizinkan diabaikan.
