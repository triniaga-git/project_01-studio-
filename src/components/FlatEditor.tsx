import { useEffect, useRef } from "react";
import { Canvas, Circle } from "fabric";
import { useStudioStore } from "../store/studioStore";
import { warpImageToQuad } from "../lib/warp";
import { sendToHost } from "../lib/postMessage";


const CW = 540, CH = 400, COMPOSE = 500;

export function FlatEditor() {
  const warpRef     = useRef<HTMLCanvasElement | null>(null);
  const interactRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef   = useRef<Canvas | null>(null);
  const handlesRef  = useRef<Circle[]>([]);
  const bgImgRef    = useRef<HTMLImageElement | null>(null);
  const upImgRef    = useRef<HTMLImageElement | null>(null);

  const product           = useStudioStore((s) => s.currentProduct);
  const warpConfiguration = useStudioStore((s) => s.warpConfiguration);
  const uploadedImage     = useStudioStore((s) => s.uploadedImage);
  const setWarpPoint      = useStudioStore((s) => s.setWarpPoint);
  const setImageTransform = useStudioStore((s) => s.setImageTransform);
  const setPreviewStatus  = useStudioStore((s) => s.setPreviewStatus);
  const setError          = useStudioStore((s) => s.setError);
  const resetDesign       = useStudioStore((s) => s.resetDesign);

  function redraw() {
    const ctx    = warpRef.current?.getContext("2d");
    const config = useStudioStore.getState().warpConfiguration;
    if (!ctx) return;
    ctx.clearRect(0, 0, CW, CH);
    if (bgImgRef.current) ctx.drawImage(bgImgRef.current, 0, 0, CW, CH);
    if (upImgRef.current && config) {
      const compose   = document.createElement("canvas");
      compose.width   = COMPOSE;
      compose.height  = COMPOSE;
      const cctx      = compose.getContext("2d")!;
      cctx.save();
      cctx.translate(COMPOSE / 2 + config.imageX, COMPOSE / 2 + config.imageY);
      cctx.rotate((config.imageRotation * Math.PI) / 180);
      cctx.scale(config.imageScale, config.imageScale);
      const img = upImgRef.current;
      const dw  = Math.min(COMPOSE * 0.9, img.width);
      const dh  = dw * (img.height / img.width);
      cctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      cctx.restore();
      warpImageToQuad(ctx, compose, COMPOSE, COMPOSE, config.points);
    }
  }

  useEffect(() => {
    if (!interactRef.current) return;
    const cv = new Canvas(interactRef.current, {
      selection: false, width: CW, height: CH, backgroundColor: "transparent",
    });
    fabricRef.current = cv;
    return () => { cv.dispose(); fabricRef.current = null; };
  }, []);

  useEffect(() => {
    const cv = fabricRef.current;
    if (!product?.flat || !cv) return;
    handlesRef.current.forEach((c) => cv.remove(c));
    handlesRef.current = [];
    product.flat.warpPoints.forEach((pt, idx) => {
      const c = new Circle({
        left: pt.x, top: pt.y, radius: 9,
        fill: "#ffffff", stroke: "#0057FF", strokeWidth: 2.5,
        originX: "center", originY: "center",
        hasControls: false, hasBorders: false, hoverCursor: "grab",
      });
      c.on("moving", () => {
        setWarpPoint(idx as 0|1|2|3, { x: c.left ?? 0, y: c.top ?? 0 });
        redraw();
      });
      cv.add(c);
      handlesRef.current.push(c);
    });
    cv.requestRenderAll();
    const img  = new Image();
    img.onload = () => { bgImgRef.current = img; redraw(); };
    img.onerror = () => setError("Gagal memuat background produk.");
    img.src = product.flat.backgroundImage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    if (!uploadedImage) { upImgRef.current = null; redraw(); return; }
    const img  = new Image();
    img.onload = () => { upImgRef.current = img; redraw(); };
    img.src    = uploadedImage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImage]);

  useEffect(() => {
    if (!warpConfiguration) return;
    handlesRef.current.forEach((c, i) => {
      const p = warpConfiguration.points[i];
      if (c.left !== p.x || c.top !== p.y) c.set({ left: p.x, top: p.y });
    });
    fabricRef.current?.requestRenderAll();
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warpConfiguration]);

  function zoom(delta: number) {
    const cur = useStudioStore.getState().warpConfiguration;
    if (!cur) return;
    setImageTransform({ imageScale: Math.max(0.2, Math.min(4, cur.imageScale + delta)) });
  }

  function save() {
    setPreviewStatus("capturing");
    const dataUrl = warpRef.current?.toDataURL("image/png");
    if (!dataUrl) { setError("Gagal capture preview."); return; }
    setPreviewStatus("ready");
    const productId = useStudioStore.getState().currentProduct?.id ?? "";
    sendToHost({
      type: "design-saved",
      payload: { image: dataUrl, mimeType: "image/png", productId,
        warpPoints: useStudioStore.getState().warpConfiguration?.points },
    });
  }

  if (!product) return <div className="status-area">Memuat produk…</div>;

  return (
    <div className="flat-editor">
      <div className="flat-toolbar">
        <button type="button" className="toolbar-button" onClick={() => zoom(-0.1)} aria-label="Zoom out">−</button>
        <button type="button" className="toolbar-button" onClick={() => zoom(0.1)} aria-label="Zoom in">+</button>
        <button type="button" className="toolbar-button" onClick={resetDesign}>Reset</button>
        <button type="button" className="toolbar-button primary" onClick={save}>Simpan</button>
      </div>
      <div className="flat-editor-canvas-wrap"
        style={{ position: "relative", width: CW, height: CH, maxWidth: "100%" }}>
        <canvas ref={warpRef} width={CW} height={CH}
          style={{ position: "absolute", left: 0, top: 0, maxWidth: "100%", height: "auto" }} />
        <canvas ref={interactRef} style={{ position: "absolute", left: 0, top: 0 }} />
      </div>
    </div>
  );
}
