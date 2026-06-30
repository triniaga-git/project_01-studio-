# Language Guide

## Language Strategy

Proyek ini bilingual dengan aturan sederhana:

- Bahasa Indonesia untuk komunikasi, dokumentasi produk, dan penjelasan proses.
- English untuk code, API contract, technical identifiers, commit message, dan istilah teknis yang umum dipakai di engineering.

Tujuannya adalah menjaga dokumentasi tetap mudah dipahami oleh tim Indonesia tanpa membuat codebase terasa campur aduk.

## Communication & Documentation

Gunakan Bahasa Indonesia untuk:

- Dokumen `steering/`.
- Dokumen `specs/`.
- Penjelasan requirement.
- Catatan review.
- Panduan penggunaan.

Contoh baik:

```md
Pengguna dapat mengunggah gambar dan menyesuaikan titik warp pada area produk.
```

Contoh buruk:

```md
User bisa upload image dan adjust warp point di product area.
```

## Code & Technical Content

Gunakan English untuk:

- Variable name.
- Function name.
- Type name.
- File code.
- API event name.
- Error code.
- Database field.
- Environment variable.

Contoh baik:

```ts
type Product = {
  id: string;
  mode: "flat" | "3d";
};
```

Contoh buruk:

```ts
type Produk = {
  id: string;
  mode: "datar" | "3d";
};
```

## Specific Guidelines

### Code Comments

Gunakan English untuk komentar di code.

```ts
// Ignore messages from unknown origins.
```

### Git Commit Messages

Gunakan Conventional Commits dalam English.

```text
feat: add flat editor upload flow
fix: validate postMessage origin
docs: clarify MVP scope
```

### API Documentation

Penjelasan boleh Bahasa Indonesia, tetapi nama event dan payload tetap English.

```md
Event `design-saved` dikirim saat pengguna menyimpan preview.
```

### Error Messages

User-facing error dapat memakai Bahasa Indonesia.

```ts
"File terlalu besar. Maksimal ukuran upload adalah 20 MB."
```

Error code tetap English.

```ts
"UPLOAD_FILE_TOO_LARGE"
```

### Database Schema

Gunakan English.

```sql
products
product_id
background_image
warp_points
```

### Environment Variables

Gunakan uppercase English.

```text
VITE_SUPABASE_URL
VITE_ALLOWED_ORIGINS
```

## Technical Terms

Jangan terjemahkan:

| English Term | Reason |
| --- | --- |
| upload | Istilah UI umum |
| embed | Istilah teknis widget |
| iframe | Standard web term |
| postMessage | Nama API browser |
| warp | Istilah rendering |
| canvas | Standard web term |
| bundle | Istilah build |
| lazy loading | Istilah performa |
| state | Istilah React umum |
| store | Istilah state management |
| preview | Bagian dari nama event/API (`preview-captured`, `get-preview`) dan dipakai konsisten dalam bentuk Inggris di seluruh dokumen proyek |

Boleh diterjemahkan:

| English | Bahasa Indonesia |
| --- | --- |
| requirement | persyaratan |
| design | desain |
| task | tugas |
| security | keamanan |
| performance | performa |
| testing | pengujian |
| documentation | dokumentasi |

## Summary

- Bahasa Indonesia untuk komunikasi dan dokumentasi naratif.
- English untuk code dan kontrak teknis.
- Jangan menerjemahkan nama API, event, type, field, atau library — termasuk istilah yang menjadi bagian nama event seperti `preview`.
- Saat ragu, gunakan English untuk istilah yang akan muncul di code.

## Metadata

- Last updated: 2026-06-20
- Version: 1.1.0
