# Documentation Guide

Dokumen ini adalah panduan arsitektur dokumentasi proyek. Tujuannya adalah menjaga pengetahuan proyek tetap terorganisir, mudah dicari, dan konsisten ketika proyek berkembang.

## Table of Contents

1. Naming Conventions
2. Structured Documentation
3. Documentation Categories
4. File Organization
5. Best Practices

## Naming Conventions

### General Documentation

Gunakan uppercase untuk dokumen umum di root.

Contoh:

- `README.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`

### Structured Documentation

Gunakan format `PREFIX-NNN-description.md`.

Contoh:

- `CORE-001-project-overview.md`
- `PLAN-001-mvp-roadmap.md`
- `FEAT-001-flat-editor.md`
- `FRWK-001-embed-widget.md`
- `LOG-001-initial-review.md`
- `ADR-001-warp-engine.md`

### Task Completion

Gunakan format `TASK_X.Y-description.md`.

Contoh:

- `TASK_1.1-project-setup.md`
- `TASK_2.3-embed-events.md`

### Spec Documentation

Gunakan lowercase kebab-case di folder `specs/`.

Contoh:

- `requirement.md`
- `design.md`
- `task.md`
- `product-schema.md`
- `events.md`
- `testing.md`

### Index Exception

`docs/001-INDEX.md` adalah pengecualian penamaan yang disengaja: ini adalah indeks root, bukan dokumen `PREFIX-NNN-description.md` biasa, sehingga tidak mengikuti pola description kebab-case maupun kategori prefix di tabel Structured Documentation. File ini boleh diperbarui kapan pun dokumen baru ditambahkan, tanpa perlu sequence number baru.

## Structured Documentation

Structured documentation digunakan untuk dokumen panjang atau lintas fase di folder `docs/`.

| Prefix | Category | Purpose |
| --- | --- | --- |
| CORE | Core knowledge | Konsep utama proyek |
| PLAN | Planning | Roadmap, sprint, dan strategi |
| FEAT | Feature | Spesifikasi fitur detail |
| FRWK | Framework | Pola teknis dan arsitektur |
| LOG | Log | Catatan keputusan dan review |
| ADR | Architecture Decision Record | Keputusan teknis yang sulit dibalik, beserta context, rationale, dan consequences |

Rules:

- Sequence number wajib 3 digit dan zero-padded.
- Description memakai kebab-case.
- Maksimal 5 kata untuk description.
- Satu dokumen membahas satu topik utama.

Contoh baik:

```text
FEAT-001-flat-editor.md
PLAN-001-mvp-roadmap.md
```

Contoh buruk:

```text
feature flat editor.md
plan-1-roadmap-final-new.md
```

## Documentation Categories

### `specs/`

Berisi kontrak SDD yang langsung mengarahkan implementasi.

Content:

- Requirements.
- Architecture design.
- Task breakdown.
- Product schema.
- Event contract.
- Testing strategy.

### `steering/`

Berisi panduan kerja dan aturan proyek.

Content:

- Product direction.
- Structure.
- Tech stack.
- Language guide.
- Environment setup.
- Documentation guide.

### `docs/adr/`

Berisi Architecture Decision Record.

Content:

- Context.
- Decision.
- Rationale.
- Consequences.

### Root

Berisi dokumen umum yang perlu terlihat pertama.

Content:

- `README.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`

## File Organization

```text
/
├── README.md
├── specs/
├── steering/
└── docs/
    ├── adr/
    └── 001-INDEX.md
```

`docs/001-INDEX.md` dapat dibuat sebagai indeks otomatis saat jumlah dokumen bertambah.

## Examples

### Membuat Structured Doc

1. Tentukan kategori.
2. Pilih prefix.
3. Ambil sequence berikutnya.
4. Gunakan nama kebab-case.

Contoh:

```text
docs/FEAT-002-product-loader.md
```

### Membuat Spec Baru

Jika dokumen adalah kontrak implementasi, simpan di `specs/`.

Contoh:

```text
specs/security.md
```

### Membuat ADR

Jika dokumen adalah keputusan teknis, simpan di `docs/adr/`.

Contoh:

```text
docs/adr/ADR-002-state-management.md
```

## Best Practices

- Mulai dari `specs/requirement.md` sebelum coding.
- Update `specs/design.md` saat arsitektur berubah.
- Update `specs/events.md` setiap kontrak `postMessage` berubah.
- Buat ADR untuk keputusan teknis yang sulit dibalik.
- Jangan mencampur MVP dan Future Scope dalam task yang sama.
- Jangan memakai nama file seperti `final`, `new`, atau `fixed`.
- `README.md` di root hanya berisi overview singkat dan tautan ke `docs/001-INDEX.md`. Daftar dokumentasi lengkap dan terbaru dipelihara satu kali di `docs/001-INDEX.md` agar kedua dokumen tidak menjadi out-of-sync satu sama lain.

## Related Documentation

- `steering/structure.md`
- `steering/language.md`
- `specs/requirement.md`
- `specs/design.md`

## Metadata

- Last updated: 2026-06-20
- Version: 1.1.0
