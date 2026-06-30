# ADR-001: Warp Engine Implementation

## Status

Accepted for MVP.

## Context

MVP membutuhkan corner-pin warp untuk menempelkan gambar pengguna ke produk datar. Ini adalah risiko teknis terbesar karena library canvas umum biasanya kuat untuk transformasi dasar, tetapi tidak selalu menyediakan perspective warp yang stabil.

Opsi yang dipertimbangkan:

- Fabric.js custom transform.
- Perspective.js.
- PixiJS.
- WebGL shader.
- Konva.
- Server-side rendering.

## Decision

MVP menggunakan Fabric.js sebagai interaction layer dan custom perspective transform untuk corner-pin warp.

Server rendering tidak digunakan.

Three.js/WebGL tidak digunakan untuk flat editor MVP.

## Rationale

- Fabric.js matang untuk object selection, drag, scale, rotate, dan canvas export.
- Custom perspective transform memberi kontrol penuh atas corner-pin behavior.
- MVP tetap client-side dan ringan.
- Implementasi 3D tidak perlu memengaruhi flat editor.
- Server rendering menambah biaya dan kompleksitas yang tidak sesuai dengan scope MVP.

## Consequences

- Tim perlu membuat helper khusus untuk perspective transform.
- Perlu unit test untuk warp point calculation.
- Perlu manual QA pada browser utama.
- Jika performa atau kualitas warp tidak memadai, opsi fallback adalah PixiJS/WebGL shader untuk area warp saja.

## Non-Goals

- Tidak membuat file siap cetak resolusi produksi.
- Tidak mengejar UV mapping 3D pada MVP.
- Tidak membuat server render pipeline.
