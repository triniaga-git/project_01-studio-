import { describe, it, expect, beforeEach } from "vitest";
import { useStudioStore } from "../../store/studioStore";
import type { Product } from "../../types/product";

const mockProduct: Product = {
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
};

beforeEach(() => {
  // Reset store ke state awal sebelum setiap test
  useStudioStore.setState({
    currentProduct: null,
    uploadedImage: null,
    warpConfiguration: null,
    previewStatus: "idle",
    errorMessage: null,
  });
});

describe("studioStore", () => {
  it("setProduct mengisi currentProduct dan warpConfiguration dari template", () => {
    useStudioStore.getState().setProduct(mockProduct);
    const state = useStudioStore.getState();
    expect(state.currentProduct?.id).toBe("wallet-01");
    expect(state.warpConfiguration?.points).toHaveLength(4);
    expect(state.previewStatus).toBe("idle");
  });

  it("setUploadedImage mengubah previewStatus menjadi dirty", () => {
    useStudioStore.getState().setProduct(mockProduct);
    useStudioStore.getState().setUploadedImage("data:image/png;base64,abc");
    const state = useStudioStore.getState();
    expect(state.uploadedImage).toBe("data:image/png;base64,abc");
    expect(state.previewStatus).toBe("dirty");
  });

  it("setWarpPoint mengupdate titik yang benar", () => {
    useStudioStore.getState().setProduct(mockProduct);
    useStudioStore.getState().setWarpPoint(0, { x: 99, y: 77 });
    const points = useStudioStore.getState().warpConfiguration?.points;
    expect(points?.[0]).toEqual({ x: 99, y: 77 });
    expect(points?.[1]).toEqual({ x: 420, y: 100 }); // tidak berubah
  });

  it("resetDesign mengembalikan warpPoints ke default template", () => {
    useStudioStore.getState().setProduct(mockProduct);
    useStudioStore.getState().setWarpPoint(0, { x: 0, y: 0 });
    useStudioStore.getState().setUploadedImage("data:image/png;base64,abc");
    useStudioStore.getState().resetDesign();
    const state = useStudioStore.getState();
    expect(state.uploadedImage).toBeNull();
    expect(state.warpConfiguration?.points[0]).toEqual({ x: 120, y: 90 });
    expect(state.previewStatus).toBe("idle");
  });

  it("previewStatus berubah dari dirty ke capturing lalu ready", () => {
    useStudioStore.getState().setProduct(mockProduct);
    useStudioStore.getState().setUploadedImage("data:image/png;base64,abc");
    expect(useStudioStore.getState().previewStatus).toBe("dirty");

    useStudioStore.getState().setPreviewStatus("capturing");
    expect(useStudioStore.getState().previewStatus).toBe("capturing");

    useStudioStore.getState().setPreviewStatus("ready");
    expect(useStudioStore.getState().previewStatus).toBe("ready");
  });

  it("setError mengubah previewStatus menjadi error dan menyimpan pesan", () => {
    useStudioStore.getState().setError("Produk tidak ditemukan.");
    const state = useStudioStore.getState();
    expect(state.previewStatus).toBe("error");
    expect(state.errorMessage).toBe("Produk tidak ditemukan.");
  });

  it("setProduct menghapus uploadedImage dari sesi sebelumnya", () => {
    useStudioStore.getState().setProduct(mockProduct);
    useStudioStore.getState().setUploadedImage("data:image/png;base64,abc");
    useStudioStore.getState().setProduct(mockProduct);
    expect(useStudioStore.getState().uploadedImage).toBeNull();
  });
});
