---
trigger: always_on
description: Memastikan AI mematuhi panduan steering bahasa, teknologi, dan struktur proyek.
---

## Panduan Steering Proyek

Setiap kali Anda (AI Agent) mengerjakan tugas, menulis kode, melakukan komit, atau memperbarui dokumentasi di proyek ini, Anda **wajib** mematuhi aturan kemudi (*steering guidelines*) berikut:

- **Bahasa (Bilingual):** Patuhi aturan di [language.md](file:///d:/Data_chris/project/project_01/steering/language.md). Selalu gunakan Bahasa Indonesia untuk komunikasi, diskusi, penjelasan, dan dokumentasi proyek. Gunakan English untuk semua penulisan kode (variabel, tipe data, fungsi, nama file) dan pesan komit (*git commit messages*).
- **Teknologi & Performa:** Patuhi keputusan wajib di [tech.md](file:///d:/Data_chris/project/project_01/steering/tech.md). Terutama aturan bahwa Three.js wajib dimuat secara *lazy-loaded* (tidak boleh masuk *initial bundle*), dan memori tekstur WebGL lama wajib di-*dispose* untuk mencegah kebocoran memori.
- **Struktur Proyek:** Jangan pernah memindahkan, menghapus, atau membuat folder baru di luar aturan struktur yang telah disepakati di [structure.md](file:///d:/Data_chris/project/project_01/steering/structure.md).
- **Spesifikasi & Task:** Sebelum menulis kode untuk sebuah fitur, selalu periksa spesifikasinya di folder `specs/` (misalnya [requirement.md](file:///d:/Data_chris/project/project_01/specs/requirement.md) dan [design.md](file:///d:/Data_chris/project/project_01/specs/design.md)) agar tidak melampaui batas ruang lingkup (*boundaries*) proyek.
