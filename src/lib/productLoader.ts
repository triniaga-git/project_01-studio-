// Memuat dan memvalidasi product config statis sesuai specs/product-schema.md
// dan specs/requirement.md bagian Product Template Static.

import type { Product } from "../types/product";

export class ProductLoadError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "ProductLoadError";
  }
}

export async function loadProduct(productId: string): Promise<Product> {
  const url = `/templates/${productId}/config.json`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new ProductLoadError(
      "PRODUCT_FETCH_FAILED",
      `Tidak dapat memuat produk "${productId}".`,
    );
  }

  if (!response.ok) {
    throw new ProductLoadError(
      "PRODUCT_NOT_FOUND",
      `Produk "${productId}" tidak ditemukan.`,
    );
  }

  const data: unknown = await response.json();
  return validateProduct(data);
}

export function validateProduct(data: unknown): Product {
  if (typeof data !== "object" || data === null) {
    throw new ProductLoadError("PRODUCT_INVALID", "Product config tidak valid.");
  }

  const candidate = data as Partial<Product>;

  if (typeof candidate.id !== "string" || candidate.id.length === 0) {
    throw new ProductLoadError("PRODUCT_INVALID", "Product config tidak memiliki id yang valid.");
  }

  if (candidate.mode !== "flat" && candidate.mode !== "3d") {
    throw new ProductLoadError("PRODUCT_INVALID", "Product mode harus 'flat' atau '3d'.");
  }

  if (candidate.mode === "flat") {
    if (!candidate.flat || typeof candidate.flat.backgroundImage !== "string") {
      throw new ProductLoadError(
        "PRODUCT_INVALID_FLAT",
        "Produk flat wajib memiliki flat.backgroundImage.",
      );
    }
    if (!Array.isArray(candidate.flat.warpPoints) || candidate.flat.warpPoints.length !== 4) {
      throw new ProductLoadError(
        "PRODUCT_INVALID_WARP_POINTS",
        "flat.warpPoints wajib berisi tepat 4 titik.",
      );
    }
  }

  if (candidate.mode === "3d" && !candidate.model3d) {
    throw new ProductLoadError(
      "PRODUCT_INVALID_3D",
      "Produk 3d wajib memiliki field model3d.",
    );
  }

  return candidate as Product;
}
