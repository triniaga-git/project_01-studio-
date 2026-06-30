import { describe, it, expect } from "vitest";
import { validateProduct, ProductLoadError } from "../productLoader";

describe("validateProduct", () => {
  it("menerima produk flat yang valid", () => {
    const product = validateProduct({
      id: "wallet-01",
      name: "Wallet 01",
      mode: "flat",
      flat: {
        backgroundImage: "/templates/wallet-01/background.jpg",
        warpPoints: [
          { x: 120, y: 90 },
          { x: 420, y: 100 },
          { x: 400, y: 320 },
          { x: 140, y: 310 },
        ],
      },
    });
    expect(product.id).toBe("wallet-01");
  });

  it("menolak produk flat tanpa flat.backgroundImage", () => {
    expect(() =>
      validateProduct({
        id: "wallet-01",
        name: "Wallet 01",
        mode: "flat",
        flat: { warpPoints: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }] },
      }),
    ).toThrow(ProductLoadError);
  });

  it("menolak warpPoints yang jumlahnya bukan 4", () => {
    expect(() =>
      validateProduct({
        id: "wallet-01",
        name: "Wallet 01",
        mode: "flat",
        flat: {
          backgroundImage: "/templates/wallet-01/background.jpg",
          warpPoints: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
        },
      }),
    ).toThrow(ProductLoadError);
  });

  it("menolak mode yang tidak dikenal", () => {
    expect(() => validateProduct({ id: "x", name: "X", mode: "vr" })).toThrow(ProductLoadError);
  });
});
