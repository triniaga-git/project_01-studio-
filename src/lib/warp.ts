// Custom perspective transform untuk corner-pin warp.
// Keputusan teknis: docs/adr/ADR-001-warp-engine.md
// Pendekatan: pecah quad jadi 2 segitiga, masing-masing dipetakan dengan affine
// transform (Canvas 2D API hanya mendukung affine, bukan true perspective per-pixel,
// tapi untuk preview MVP ini cukup meyakinkan secara visual).

import type { WarpPoint } from "../types/product";

type Point = { x: number; y: number };

function affineForTriangle(
  s0: Point,
  s1: Point,
  s2: Point,
  d0: Point,
  d1: Point,
  d2: Point,
): [number, number, number, number, number, number] {
  const { x: x0, y: y0 } = s0;
  const { x: x1, y: y1 } = s1;
  const { x: x2, y: y2 } = s2;
  const { x: u0, y: v0 } = d0;
  const { x: u1, y: v1 } = d1;
  const { x: u2, y: v2 } = d2;

  const den = x0 * (y2 - y1) + y0 * (x1 - x2) + x1 * y2 - x2 * y1;

  // Canvas 2D setTransform(a,b,c,d,e,f) memetakan piksel sumber (sx, sy) ke kanvas:
  //   canvas_x = a·sx + c·sy + e
  //   canvas_y = b·sx + d·sy + f
  //
  // Tanda yang benar:
  //   a, b  →  koefisien untuk sx (a positif, b positif)
  //   c, d  →  koefisien untuk sy (c negatif, d negatif)
  //   e, f  →  translasi       (e negatif, f negatif)
  //
  // Verifikasi untuk wallet-01 (source 500×500 → dest TL=(120,90), TR=(420,100)):
  //   a = +0.6, e = +120  →  (0,0) → x = 0.6·0 + 120 = 120 ✓
  //   (sebelumnya a = -0.6, e = -120  →  x = -120, off-screen)

  const a =  (y0 * (u2 - u1) + y1 * (u0 - u2) + y2 * (u1 - u0)) / den;
  const b =  (y0 * (v2 - v1) + y1 * (v0 - v2) + y2 * (v1 - v0)) / den;
  const c = -(x0 * (u2 - u1) + x1 * (u0 - u2) + x2 * (u1 - u0)) / den;
  const d = -(x0 * (v2 - v1) + x1 * (v0 - v2) + x2 * (v1 - v0)) / den;
  const e = -(x0 * (y2 * u1 - y1 * u2) + x1 * (y0 * u2 - y2 * u0) + x2 * (y1 * u0 - y0 * u1)) / den;
  const f = -(x0 * (y2 * v1 - y1 * v2) + x1 * (y0 * v2 - y2 * v0) + x2 * (y1 * v0 - y0 * v1)) / den;

  return [a, b, c, d, e, f];
}

function drawWarpTriangle(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  s0: Point,
  s1: Point,
  s2: Point,
  d0: Point,
  d1: Point,
  d2: Point,
): void {
  const [a, b, c, d, e, f] = affineForTriangle(s0, s1, s2, d0, d1, d2);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(d0.x, d0.y);
  ctx.lineTo(d1.x, d1.y);
  ctx.lineTo(d2.x, d2.y);
  ctx.closePath();
  ctx.clip();
  ctx.setTransform(a, b, c, d, e, f);
  ctx.drawImage(source, 0, 0);
  ctx.restore();
}

/**
 * Memetakan `source` (sudah ditransform: posisi/scale/rotation) ke dalam
 * quad `warpPoints` pada `ctx`, mengikuti urutan top-left, top-right,
 * bottom-right, bottom-left sesuai specs/product-schema.md.
 */
export function warpImageToQuad(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  warpPoints: [WarpPoint, WarpPoint, WarpPoint, WarpPoint],
): void {
  const sTL: Point = { x: 0, y: 0 };
  const sTR: Point = { x: sourceWidth, y: 0 };
  const sBR: Point = { x: sourceWidth, y: sourceHeight };
  const sBL: Point = { x: 0, y: sourceHeight };

  const [dTL, dTR, dBR, dBL] = warpPoints;

  drawWarpTriangle(ctx, source, sTL, sTR, sBR, dTL, dTR, dBR);
  drawWarpTriangle(ctx, source, sTL, sBR, sBL, dTL, dBR, dBL);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
