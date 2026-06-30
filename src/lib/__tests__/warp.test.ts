import { describe, it, expect, vi } from "vitest";
import { warpImageToQuad } from "../warp";
import type { WarpPoint } from "../../types/product";

const makeCtx = () => ({
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  clip: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
} as unknown as CanvasRenderingContext2D);

// Default warp points dari product-schema.md contoh wallet-01
const defaultPoints: [WarpPoint, WarpPoint, WarpPoint, WarpPoint] = [
  { x: 120, y: 90 },
  { x: 420, y: 100 },
  { x: 400, y: 320 },
  { x: 140, y: 310 },
];

describe("warpImageToQuad", () => {
  it("memanggil drawImage tepat 2 kali (2 segitiga per quad)", () => {
    const ctx = makeCtx();
    warpImageToQuad(ctx, document.createElement("canvas"), 500, 500, defaultPoints);
    expect(ctx.drawImage).toHaveBeenCalledTimes(2);
  });

  it("mereset transform ke identitas setelah selesai", () => {
    const ctx = makeCtx();
    warpImageToQuad(ctx, document.createElement("canvas"), 500, 500, defaultPoints);
    const calls = vi.mocked(ctx.setTransform).mock.calls;
    expect(calls[calls.length - 1]).toEqual([1, 0, 0, 1, 0, 0]);
  });

  it("memanggil clip sebelum drawImage untuk setiap segitiga", () => {
    const ctx = makeCtx();
    const order: string[] = [];
    vi.mocked(ctx.clip).mockImplementation(() => order.push("clip"));
    vi.mocked(ctx.drawImage).mockImplementation(() => order.push("draw"));
    warpImageToQuad(ctx, document.createElement("canvas"), 500, 500, defaultPoints);
    expect(order).toEqual(["clip", "draw", "clip", "draw"]);
  });

  it("koefisien e (translasi X) = TL.x saat source adalah persegi (0,0)-(sw,0)-(sw,sw)", () => {
    // Verifikasi fix sign error: untuk source 500×500 → dest TL=(120,90),
    // koefisien e pertama (translasi X) harus = 120 (positif), bukan -120.
    const ctx = makeCtx();
    warpImageToQuad(ctx, document.createElement("canvas"), 500, 500, defaultPoints);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstCall = (vi.mocked(ctx.setTransform).mock.calls[0] as any[]);
    // setTransform(a, b, c, d, e, f) — index 4 adalah e (translasi X)
    const e = firstCall[4] as number;
    expect(e).toBeCloseTo(120, 0);
  });

  it("koefisien a (scaling X) positif untuk dest yang lebih lebar dari kiri ke kanan", () => {
    // a harus positif agar gambar tidak digambar di koordinat negatif (off-screen)
    const ctx = makeCtx();
    warpImageToQuad(ctx, document.createElement("canvas"), 500, 500, defaultPoints);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const firstCall = (vi.mocked(ctx.setTransform).mock.calls[0] as any[]);
    const a = firstCall[0] as number;
    expect(a).toBeGreaterThan(0);
  });
});
