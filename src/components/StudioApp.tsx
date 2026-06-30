import { Suspense, lazy, useEffect, useRef } from "react";
import { useStudioStore } from "../store/studioStore";
import { loadProduct, ProductLoadError } from "../lib/productLoader";
import { sendToHost } from "../lib/postMessage";
import { FlatEditor } from "./FlatEditor";

const Product3DViewer = lazy(() =>
  import("../features/3d/Product3DViewer").then((m) => ({ default: m.Product3DViewer })),
);

const PRODUCTS = [
  { id: "wallet-01", label: "Wallet 01", mode: "flat" },
  { id: "mug-01",    label: "Mug 01",    mode: "3d" },
];

const MAX_UPLOAD = 20 * 1024 * 1024;

function getProductIdFromUrl(): string {
  return new URLSearchParams(window.location.search).get("product") ?? "wallet-01";
}

export function StudioApp() {
  const currentProduct   = useStudioStore((s) => s.currentProduct);
  const uploadedImage    = useStudioStore((s) => s.uploadedImage);
  const previewStatus    = useStudioStore((s) => s.previewStatus);
  const errorMessage     = useStudioStore((s) => s.errorMessage);
  const setProduct       = useStudioStore((s) => s.setProduct);
  const setError         = useStudioStore((s) => s.setError);
  const setUploadedImage = useStudioStore((s) => s.setUploadedImage);
  const resetDesign      = useStudioStore((s) => s.resetDesign);
  const fileInputRef     = useRef<HTMLInputElement>(null);

  function doLoad(productId: string) {
    loadProduct(productId)
      .then((product) => {
        setProduct(product);
        sendToHost({ type: "product-loaded", payload: { productId: product.id, mode: product.mode } });
        const url = new URL(window.location.href);
        url.searchParams.set("product", productId);
        window.history.replaceState(null, "", url.toString());
      })
      .catch((err: unknown) => {
        const msg  = err instanceof ProductLoadError ? err.message : "Gagal memuat produk.";
        const code = err instanceof ProductLoadError ? err.code    : "PRODUCT_LOAD_FAILED";
        setError(msg);
        sendToHost({ type: "studio-error", payload: { code, message: msg } });
      });
  }

  useEffect(() => {
    const id = getProductIdFromUrl();
    sendToHost({ type: "studio-ready", payload: { productId: id } });
    doLoad(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpload(file: File) {
    if (file.size > MAX_UPLOAD) { setError("File terlalu besar. Maks 20 MB."); return; }
    if (!["image/jpeg","image/png"].includes(file.type)) { setError("Format harus JPG atau PNG."); return; }
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.onerror = () => setError("Gagal membaca file.");
    reader.readAsDataURL(file);
  }

  const modeLabel = currentProduct
    ? currentProduct.mode === "3d" ? "Level 3 — 3D viewport" : "Level 1 — Flat editor"
    : "Memuat…";

  return (
    <div className="studio-app">

      {/* ── Header ── */}
      <header className="studio-header">
        <div className="studio-header-left">
          <span className="studio-logo">Customizer Studio</span>
          <span className="studio-badge">{modeLabel}</span>
        </div>
        {currentProduct && (
          <span className="studio-product-id">
            {currentProduct.id} · {currentProduct.mode}
          </span>
        )}
      </header>

      {/* ── Product tabs ── */}
      <nav className="product-switcher" aria-label="Pilih produk">
        {PRODUCTS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`switcher-btn${currentProduct?.id === p.id ? " active" : ""}`}
            onClick={() => doLoad(p.id)}
          >
            {p.label}
            <span className="switcher-mode">{p.mode}</span>
          </button>
        ))}
      </nav>

      {/* ── Toolbar ── */}
      {currentProduct && (
        <div className="global-toolbar">
          <button
            type="button"
            className="toolbar-button primary"
            onClick={() => fileInputRef.current?.click()}
          >
            ↑ Upload desain
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
              e.target.value = "";
            }}
          />
          {uploadedImage && (
            <button type="button" className="toolbar-button" onClick={resetDesign}>
              Hapus desain
            </button>
          )}
          {uploadedImage && (
            <span className="upload-indicator">
              <span className="upload-dot" />
              Desain aktif
            </span>
          )}
        </div>
      )}

      {/* ── Editor ── */}
      <main className="editor-area">
        {!currentProduct ? (
          <div className="status-area">Memuat produk…</div>
        ) : currentProduct.mode === "flat" ? (
          <FlatEditor />
        ) : (
          <Suspense fallback={<div className="status-area">Memuat 3D viewport…</div>}>
            <Product3DViewer product={currentProduct} uploadedImage={uploadedImage} />
          </Suspense>
        )}
      </main>

      {/* ── Status bar ── */}
      {previewStatus === "error" && errorMessage && (
        <div className="statusbar error" role="alert">{errorMessage}</div>
      )}
    </div>
  );
}
