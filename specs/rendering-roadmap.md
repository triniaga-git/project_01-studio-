# Rendering Roadmap

Dokumen ini menjelaskan pengembangan bertahap dari preview MVP menuju hasil visual yang lebih realistis seperti produk fisik. Roadmap ini tidak mengubah scope MVP.

## Rendering Levels

### Level 1: MVP Interactive Preview

Target:

- Cepat.
- Ringan.
- Berjalan penuh di browser.
- Cocok untuk embed widget publik.

Teknologi:

- Fabric.js.
- Corner-pin warp.
- Client-side canvas capture.

Kualitas hasil:

- Mockup visual sederhana.
- Cukup untuk validasi posisi gambar.
- Belum photorealistic.

### Level 2: Enhanced 2D Mockup

Target:

- Membuat produk flat terlihat lebih natural tanpa 3D penuh.
- Tetap ringan untuk browser.

Teknologi:

- Overlay shadow.
- Overlay highlight.
- Masking.
- Blend mode.
- Optional displacement map untuk tekstur permukaan ringan.

Kualitas hasil:

- Lebih meyakinkan untuk mockup e-commerce sederhana.
- Masih terbatas pada produk datar atau semi-datar.

### Level 3: Real-Time 3D Preview

Target:

- Memberi preview interaktif untuk produk melengkung atau kompleks.
- Memakai asset 3D yang benar.

Teknologi:

- Three.js.
- @react-three/fiber.
- GLTF/GLB.
- UV mapping.
- Texture offset dan texture scale.

Kualitas hasil:

- Lebih akurat untuk bentuk produk.
- Realisme bergantung pada kualitas model, UV unwrap, material, dan lighting.

### Level 4: Browser-Based PBR Rendering

Target:

- Mendekati tampilan produk nyata langsung di browser.
- Menambahkan karakter material dan pencahayaan.

Teknologi:

- PBR material.
- Roughness map.
- Metallic map.
- Normal map.
- Ambient occlusion map.
- HDRI environment lighting.
- Real-time shadow.
- Reflection layer untuk material glossy.

Kualitas hasil:

- Cocok untuk preview premium.
- Masih dibatasi performa device pengguna.
- Harus tetap lazy-loaded dan tidak masuk bundle MVP.

### Level 5: Server-Side Photorealistic Render

Target:

- Menghasilkan output kualitas tinggi untuk marketing image atau final mockup.
- Tidak mengganggu interaksi editor.

Teknologi:

- Blender.
- Cycles atau Eevee Next.
- Serverless/job queue jika memungkinkan.
- Object storage untuk input/output render.

Kualitas hasil:

- Lebih dekat ke foto produk nyata.
- Mendukung lighting, shadow, reflection, dan material yang lebih realistis.
- Proses render async, bukan real-time.

### Level 6: AI-Enhanced Mockup Generation

Target:

- Meningkatkan realisme output akhir dengan AI post-processing.
- Membantu membuat mockup marketing lebih menarik.

Teknologi:

- AI image enhancement.
- Image-to-image generation.
- Background replacement.
- Shadow/reflection refinement.

Kualitas hasil:

- Potensial sangat realistis.
- Perlu guardrail agar desain pengguna tidak berubah secara tidak akurat.
- Harus diberi label sebagai AI-enhanced mockup jika dipakai untuk output publik.

## Development Sequence

1. Selesaikan MVP interactive preview.
2. Tambahkan enhanced 2D mockup layer jika produk flat perlu terlihat lebih natural.
3. Bangun real-time 3D preview untuk produk yang memang membutuhkan bentuk 3D.
4. Tambahkan PBR dan HDRI setelah asset pipeline stabil.
5. Evaluasi Blender render service untuk output kualitas tinggi.
6. Evaluasi AI enhancement sebagai optional post-processing.

## Asset Requirements

Photorealistic rendering membutuhkan asset yang lebih disiplin.

- Model 3D bersih dengan topology wajar.
- UV unwrap rapi.
- Texture resolusi cukup.
- PBR texture set.
- HDRI environment yang sesuai.
- Shadow catcher atau ground plane.
- Reflection setup untuk material glossy.
- Product scale yang realistis.

## Non-Goals

- Tidak masuk MVP.
- Tidak menggantikan interactive editor.
- Tidak menjamin hasil cetak fisik 100% sama.
- Tidak memproses payment, checkout, atau order.
- Tidak wajib untuk semua jenis produk.

## Decision Rule

Gunakan pendekatan paling ringan yang memenuhi kebutuhan produk:

- Produk datar sederhana: Level 1 atau Level 2.
- Produk melengkung: Level 3.
- Produk premium dengan material penting: Level 4.
- Output marketing/final mockup: Level 5.
- Output promosi yang butuh polish visual tinggi: Level 6.
