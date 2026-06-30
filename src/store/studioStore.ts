// State global studio. Wajib Zustand sesuai steering/tech.md.
// Shape persis mengikuti specs/design.md bagian State Management.

import { create } from "zustand";
import type { Product, WarpPoint } from "../types/product";

export type PreviewStatus = "idle" | "dirty" | "capturing" | "ready" | "error";

export type WarpConfiguration = {
  points: [WarpPoint, WarpPoint, WarpPoint, WarpPoint];
  imageX: number;
  imageY: number;
  imageScale: number;
  imageRotation: number;
};

export type StudioState = {
  currentProduct: Product | null;
  uploadedImage: string | null;
  warpConfiguration: WarpConfiguration | null;
  previewStatus: PreviewStatus;
  errorMessage: string | null;

  setProduct: (product: Product) => void;
  setUploadedImage: (dataUrl: string) => void;
  setWarpPoint: (index: 0 | 1 | 2 | 3, point: WarpPoint) => void;
  setImageTransform: (
    transform: Partial<Pick<WarpConfiguration, "imageX" | "imageY" | "imageScale" | "imageRotation">>,
  ) => void;
  setPreviewStatus: (status: PreviewStatus) => void;
  setError: (message: string) => void;
  resetDesign: () => void;
};

const DEFAULT_TRANSFORM = {
  imageX: 0,
  imageY: 0,
  imageScale: 1,
  imageRotation: 0,
};

export const useStudioStore = create<StudioState>((set, get) => ({
  currentProduct: null,
  uploadedImage: null,
  warpConfiguration: null,
  previewStatus: "idle",
  errorMessage: null,

  setProduct: (product) => {
    const defaultPoints = product.flat?.warpPoints;
    set({
      currentProduct: product,
      uploadedImage: null,
      warpConfiguration: defaultPoints
        ? { points: clonePoints(defaultPoints), ...DEFAULT_TRANSFORM }
        : null,
      previewStatus: "idle",
      errorMessage: null,
    });
  },

  setUploadedImage: (dataUrl) => {
    set({ uploadedImage: dataUrl, previewStatus: "dirty" });
  },

  setWarpPoint: (index, point) => {
    const current = get().warpConfiguration;
    if (!current) return;
    const points = [...current.points] as WarpConfiguration["points"];
    points[index] = point;
    set({ warpConfiguration: { ...current, points }, previewStatus: "dirty" });
  },

  setImageTransform: (transform) => {
    const current = get().warpConfiguration;
    if (!current) return;
    set({
      warpConfiguration: { ...current, ...transform },
      previewStatus: "dirty",
    });
  },

  setPreviewStatus: (status) => set({ previewStatus: status }),

  setError: (message) => set({ previewStatus: "error", errorMessage: message }),

  resetDesign: () => {
    const product = get().currentProduct;
    const defaultPoints = product?.flat?.warpPoints;
    set({
      uploadedImage: null,
      warpConfiguration: defaultPoints
        ? { points: clonePoints(defaultPoints), ...DEFAULT_TRANSFORM }
        : null,
      previewStatus: "idle",
      errorMessage: null,
    });
  },
}));

function clonePoints(
  points: [WarpPoint, WarpPoint, WarpPoint, WarpPoint],
): [WarpPoint, WarpPoint, WarpPoint, WarpPoint] {
  return points.map((p) => ({ ...p })) as [WarpPoint, WarpPoint, WarpPoint, WarpPoint];
}
