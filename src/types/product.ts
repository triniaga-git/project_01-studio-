// Kontrak data produk sesuai specs/product-schema.md
// Jangan ubah shape ini tanpa memperbarui specs/product-schema.md terlebih dahulu.

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
    // Urutan wajib: top-left, top-right, bottom-right, bottom-left
    warpPoints: [WarpPoint, WarpPoint, WarpPoint, WarpPoint];
  };

  model3d?: {
    modelUrl: string;
    textureOffsetX: number;
    textureOffsetY: number;
    textureScale: number;
  };
};
