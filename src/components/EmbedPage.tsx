// Halaman yang dirender DI DALAM iframe pada route /embed.
// Berbeda dari public/embed.js (vanilla JS yang berjalan di halaman host).
// Lihat specs/design.md bagian "Embed Page" vs "Embed Script".

import { useEffect } from "react";
import { useStudioStore } from "../store/studioStore";
import { loadProduct, ProductLoadError } from "../lib/productLoader";
import { handleHostCommand, sendToHost } from "../lib/postMessage";
import { StudioApp } from "./StudioApp";

export function EmbedPage() {
  const setProduct = useStudioStore((s) => s.setProduct);
  const setError = useStudioStore((s) => s.setError);
  const resetDesign = useStudioStore((s) => s.resetDesign);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      handleHostCommand(event, (command) => {
        if (command.type === "set-product") {
          loadProduct(command.payload.productId)
            .then((product) => {
              setProduct(product);
              sendToHost({
                type: "product-loaded",
                payload: { productId: product.id, mode: product.mode },
              });
            })
            .catch((err: unknown) => {
              const message =
                err instanceof ProductLoadError ? err.message : "Gagal memuat produk.";
              const code = err instanceof ProductLoadError ? err.code : "PRODUCT_LOAD_FAILED";
              setError(message);
              sendToHost({ type: "studio-error", payload: { code, message } });
            });
        }

        if (command.type === "get-preview") {
          const canvas = document.querySelector<HTMLCanvasElement>(".flat-editor-canvas-wrap canvas");
          const productId = useStudioStore.getState().currentProduct?.id ?? "";
          if (canvas) {
            sendToHost({
              type: "preview-captured",
              payload: { image: canvas.toDataURL("image/png"), mimeType: "image/png", productId },
            });
          }
        }

        if (command.type === "reset-design") {
          resetDesign();
        }
      });
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [setProduct, setError, resetDesign]);

  return <StudioApp />;
}
