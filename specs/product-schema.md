# Product Schema

Dokumen ini mendefinisikan kontrak data produk yang digunakan oleh Studio App, static templates, dan backend di fase lanjut.

## TypeScript Contract

```ts
export type WarpPoint = {
  x: number;
  y: number;
};

export type Product = {
  id: string;
  name: string;
  mode: "flat" | "3d";
  thumbnail?: string;

  flat?: {
    backgroundImage: string;
    warpPoints: [WarpPoint, WarpPoint, WarpPoint, WarpPoint];
  };

  model3d?: {
    modelUrl: string;
    textureOffsetX: number;
    textureOffsetY: number;
    textureScale: number;
  };
};
```

## Validation Rules

- `id` wajib stabil dan unik.
- `mode` menentukan editor yang akan dirender.
- Jika `mode` bernilai `"flat"`, field `flat` wajib tersedia.
- Jika `mode` bernilai `"3d"`, field `model3d` wajib tersedia.
- `warpPoints` wajib berisi tepat 4 titik.
- Urutan `warpPoints` wajib konsisten:
  - top-left
  - top-right
  - bottom-right
  - bottom-left
- Path asset menggunakan URL relatif dari public root pada MVP.
- Backend fase lanjut boleh memakai URL publik dari Supabase Storage.

## Static Template Example

```json
{
  "id": "wallet-01",
  "name": "Wallet 01",
  "mode": "flat",
  "thumbnail": "/templates/wallet-01/thumb.jpg",
  "flat": {
    "backgroundImage": "/templates/wallet-01/background.jpg",
    "warpPoints": [
      { "x": 120, "y": 90 },
      { "x": 420, "y": 100 },
      { "x": 400, "y": 320 },
      { "x": 140, "y": 310 }
    ]
  }
}
```

## Future 3D Example

```json
{
  "id": "mug-01",
  "name": "Mug 01",
  "mode": "3d",
  "thumbnail": "/templates/mug-01/thumb.jpg",
  "model3d": {
    "modelUrl": "/templates/mug-01/mug.glb",
    "textureOffsetX": 0,
    "textureOffsetY": 0,
    "textureScale": 1
  }
}
```
