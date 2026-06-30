// 3D Product Viewport — Active Scope (specs/requirement.md Phase 4)
// Pipeline: Upload → Warp interaktif (Panel A) → 3D Texture (Panel B) → Render (Panel C)

import {
  Component, Suspense, useCallback, useEffect,
  useRef, useState, type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Product } from "../../types/product";
import { warpImageToQuad } from "../../lib/warp";
import type { WarpPoint } from "../../types/product";

// ─────────────────────────────────────
// Types & constants
// ─────────────────────────────────────
type Props  = { product: Product; uploadedImage: string | null };
type Shape  = "cylinder" | "box" | "torus" | "sphere";

const SHAPES: { id: Shape; label: string; icon: string }[] = [
  { id: "cylinder", label: "Silinder", icon: "🫙" },
  { id: "box",      label: "Kotak",    icon: "📦" },
  { id: "torus",    label: "Cincin",   icon: "💍" },
  { id: "sphere",   label: "Bola",     icon: "🔵" },
];

const BLANK_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI6QAAAABJRU5ErkJggg==";

// Canvas size for Panel A
const CW = 300, CH = 240;

const DEFAULT_PTS = (): [WarpPoint, WarpPoint, WarpPoint, WarpPoint] => [
  { x: 36,  y: 32  },
  { x: 264, y: 32  },
  { x: 264, y: 208 },
  { x: 36,  y: 208 },
];

// ─────────────────────────────────────
// Panel A — single-canvas editable warp
// ─────────────────────────────────────
// Uses ONE canvas for both drawing and pointer events.
// Points stored in a ref (not state) for smooth dragging without re-renders.
// Emits warped texture only on pointerup to avoid hammering TextureLoader.
function EditableWarpPanel({
  uploadedImage,
  onWarpComplete,
}: {
  uploadedImage: string | null;
  onWarpComplete: (dataUrl: string | null) => void;
}) {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const imgRef        = useRef<HTMLImageElement | null>(null);
  const ptsRef        = useRef<[WarpPoint, WarpPoint, WarpPoint, WarpPoint]>(DEFAULT_PTS());
  const dragIdxRef    = useRef(-1);

  // ── draw everything onto the single canvas ──
  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pts = ptsRef.current;

    ctx.clearRect(0, 0, CW, CH);

    // 1. product surface background
    ctx.fillStyle = "#C9A574";
    ctx.beginPath();
    ctx.roundRect(10, 10, CW - 20, CH - 20, 12);
    ctx.fill();

    // 2. uploaded image corner-pin warped
    // FIX: gunakan canvas perantara berukuran CW×CH sebelum warp,
    // persis seperti FlatEditor pakai compose canvas 500×500.
    // Memanggil warpImageToQuad langsung dengan img.naturalWidth yang besar
    // (mis. 4000×3000) menyebabkan matriks affine menghasilkan koordinat negatif
    // sehingga gambar digambar off-screen dan tidak terlihat.
    if (imgRef.current) {
      const img = imgRef.current;

      // Buat canvas perantara ukuran tetap (CW×CH)
      const compose    = document.createElement("canvas");
      compose.width    = CW;
      compose.height   = CH;
      const cctx       = compose.getContext("2d");
      if (cctx) {
        // Gambar img ke compose dengan cover-fit (tidak distorsi)
        const ar  = img.naturalWidth / img.naturalHeight;
        let dw    = CW;
        let dh    = CW / ar;
        if (dh < CH) { dh = CH; dw = CH * ar; }
        cctx.drawImage(img, (CW - dw) / 2, (CH - dh) / 2, dw, dh);
      }

      // Warp compose canvas (selalu CW×CH) ke quad
      warpImageToQuad(ctx, compose, CW, CH, pts);
    }

    // 3. quad outline
    ctx.strokeStyle = "rgba(24,95,165,0.8)";
    ctx.lineWidth   = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    ctx.lineTo(pts[1].x, pts[1].y);
    ctx.lineTo(pts[2].x, pts[2].y);
    ctx.lineTo(pts[3].x, pts[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. corner handles
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, dragIdxRef.current === i ? 11 : 8, 0, Math.PI * 2);
      ctx.fillStyle   = "#ffffff";
      ctx.fill();
      ctx.lineWidth   = 2.5;
      ctx.strokeStyle = "#185FA5";
      ctx.stroke();
    });
  }

  function emitWarped() {
    if (!canvasRef.current || !imgRef.current) return;
    onWarpComplete(canvasRef.current.toDataURL("image/png"));
  }

  // Load new image whenever uploadedImage prop changes
  useEffect(() => {
    if (!uploadedImage) {
      imgRef.current = null;
      ptsRef.current = DEFAULT_PTS();
      redraw();
      onWarpComplete(null);
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      // FIX Bug 2: selalu reset warp points ke default saat gambar baru diupload.
      // Titik yang miring dari interaksi sebelumnya bisa menyebabkan quad degenerate
      // dan gambar tidak terlihat (atau sangat terdistorsi) pada upload berikutnya.
      ptsRef.current = DEFAULT_PTS();
      redraw();
      emitWarped();
    };
    img.onerror = () => {
      console.error("[EditableWarpPanel] Gagal memuat gambar.");
    };
    img.src = uploadedImage;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImage]);

  // ── pointer helpers ──
  function getPos(e: React.PointerEvent<HTMLCanvasElement>): WarpPoint {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (CW / rect.width),
      y: (e.clientY - rect.top)  * (CH / rect.height),
    };
  }

  function hitTest(pos: WarpPoint): number {
    const pts = ptsRef.current;
    for (let i = 0; i < 4; i++) {
      const dx = pos.x - pts[i].x, dy = pos.y - pts[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < 20) return i;
    }
    return -1;
  }

  function onDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const idx = hitTest(getPos(e));
    if (idx < 0) return;
    dragIdxRef.current = idx;
    canvasRef.current!.setPointerCapture(e.pointerId);
    redraw();
  }

  function onMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (dragIdxRef.current < 0) return;
    const pos = getPos(e);
    ptsRef.current[dragIdxRef.current] = {
      x: Math.max(0, Math.min(CW, pos.x)),
      y: Math.max(0, Math.min(CH, pos.y)),
    };
    redraw(); // Panel A updates live during drag
  }

  function onUp() {
    if (dragIdxRef.current < 0) return;
    dragIdxRef.current = -1;
    redraw();
    emitWarped(); // Panel B/C update only on release
  }

  function resetWarp() {
    ptsRef.current = DEFAULT_PTS();
    redraw();
    emitWarped();
  }

  return (
    <div style={{ position: "relative", lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        style={{
          display: "block", width: "100%", height: "auto",
          cursor: "crosshair", borderRadius: 12, touchAction: "none",
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      />
      <button
        type="button"
        onClick={resetWarp}
        className="warp-reset-btn"
      >
        Reset
      </button>
      {!uploadedImage && (
        <div className="panel-placeholder">
          <span className="panel-placeholder-icon">⊹</span>
          <span className="panel-placeholder-text">
            Upload desain, lalu geser 4 sudut untuk mapping
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────
// Three.js shape mesh
// ─────────────────────────────────────
function ShapeMesh({
  shape, textureUrl, offsetX, offsetY, texScale, autoRotate, onGl,
}: {
  shape: Shape; textureUrl: string;
  offsetX: number; offsetY: number; texScale: number;
  autoRotate: boolean;
  onGl: (gl: THREE.WebGLRenderer) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef   = useRef<THREE.MeshStandardMaterial | null>(null);
  const texRef   = useRef<THREE.Texture | null>(null);
  const { gl }   = useThree();

  useEffect(() => { onGl(gl); }, [gl, onGl]);

  // Reload texture via TextureLoader (handles data URLs, avoids drei cache)
  useEffect(() => {
    let cancelled = false;
    const loader  = new THREE.TextureLoader();
    loader.load(textureUrl, (tex) => {
      if (cancelled) { tex.dispose(); return; }
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(texScale, texScale);
      tex.offset.set(offsetX, offsetY);
      texRef.current?.dispose();
      texRef.current = tex;
      if (matRef.current) {
        matRef.current.map = tex;
        matRef.current.needsUpdate = true;
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textureUrl]);

  // Update repeat/offset without full texture reload
  useEffect(() => {
    if (!texRef.current) return;
    texRef.current.repeat.set(texScale, texScale);
    texRef.current.offset.set(offsetX, offsetY);
    texRef.current.needsUpdate = true;
    if (matRef.current) matRef.current.needsUpdate = true;
  }, [texScale, offsetX, offsetY]);

  useFrame((_, dt) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += dt * 0.5;
  });

  const mat   = <meshStandardMaterial ref={matRef} roughness={0.38} metalness={0.04} />;
  const white = <meshStandardMaterial color="#EDEAE2" roughness={0.5} />;

  return (
    <group ref={groupRef}>
      {shape === "cylinder" && (
        <>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.82, 0.82, 1.9, 80]} />{mat}
          </mesh>
          {[-0.96, 0.96].map((y, i) => (
            <mesh key={i} position={[0, y, 0]}>
              <cylinderGeometry args={[0.82, 0.82, 0.04, 80]} />{white}
            </mesh>
          ))}
          <mesh position={[0.97, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.33, 0.083, 20, 36, Math.PI]} />{white}
          </mesh>
        </>
      )}
      {shape === "box" && (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.6, 1.6]} />{mat}
        </mesh>
      )}
      {shape === "torus" && (
        <mesh castShadow receiveShadow>
          <torusGeometry args={[1.0, 0.36, 32, 120]} />{mat}
        </mesh>
      )}
      {shape === "sphere" && (
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.0, 80, 80]} />{mat}
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.12, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} /><shadowMaterial opacity={0.2} />
      </mesh>
    </group>
  );
}

// Error boundary
class ModelBoundary extends Component<
  { children: ReactNode; onError: (m: string) => void }, { err: boolean }
> {
  constructor(props: { children: ReactNode; onError: (m: string) => void }) {
    super(props); this.state = { err: false };
  }
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch() { this.props.onError("Gagal memuat scene 3D."); }
  render() { return this.state.err ? null : this.props.children; }
}

// ─────────────────────────────────────
// Panel C — AI-enhanced render snapshot
// ─────────────────────────────────────
function AIEnhancedPanel({
  glRef,
}: {
  glRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
}) {
  const outRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const src = glRef.current?.domElement;
      const dst = outRef.current;
      if (!src || !dst) return;
      dst.width = src.width; dst.height = src.height;
      const ctx = dst.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(src, 0, 0);

      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      const sg = ctx.createRadialGradient(
        dst.width * .5, dst.height * .88, 0,
        dst.width * .5, dst.height * .88, dst.width * .36,
      );
      sg.addColorStop(0, "rgba(0,0,0,.45)");
      sg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sg; ctx.fillRect(0, 0, dst.width, dst.height);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const hg = ctx.createRadialGradient(
        dst.width * .78, dst.height * .15, 0,
        dst.width * .78, dst.height * .15, dst.width * .42,
      );
      hg.addColorStop(0, "rgba(255,255,255,.42)");
      hg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hg; ctx.fillRect(0, 0, dst.width, dst.height);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "soft-light";
      const wg = ctx.createRadialGradient(
        dst.width * .3, dst.height * .2, 0,
        dst.width * .3, dst.height * .2, dst.width * .8,
      );
      wg.addColorStop(0, "rgba(255,220,140,.18)");
      wg.addColorStop(1, "rgba(255,220,140,0)");
      ctx.fillStyle = wg; ctx.fillRect(0, 0, dst.width, dst.height);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      const vg = ctx.createRadialGradient(
        dst.width * .5, dst.height * .5, dst.width * .22,
        dst.width * .5, dst.height * .5, dst.width * .72,
      );
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,.32)");
      ctx.fillStyle = vg; ctx.fillRect(0, 0, dst.width, dst.height);
      ctx.restore();
    }, 80);
    return () => clearInterval(id);
  }, [glRef]);

  return (
    <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", lineHeight: 0 }}>
      <canvas
        ref={outRef}
        style={{
          display: "block", width: "100%", height: "auto",
          filter: "contrast(1.1) saturate(1.22) brightness(1.05)",
        }}
      />
      <div className="ai-label"><span>✦</span> AI-enhanced mockup (simulasi)</div>
    </div>
  );
}

// ─────────────────────────────────────
// Main component
// ─────────────────────────────────────
export function Product3DViewer({ product, uploadedImage }: Props) {
  const [shape,      setShape]      = useState<Shape>("cylinder");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [texOffsetX, setTexOffsetX] = useState(0);
  const [texOffsetY, setTexOffsetY] = useState(0);
  const [texScale,   setTexScale]   = useState(1);
  const [warpedTex,  setWarpedTex]  = useState<string | null>(null);
  const [loadError,  setLoadError]  = useState<string | null>(null);

  const glRef    = useRef<THREE.WebGLRenderer | null>(null);
  const dragTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const handleGl  = useCallback((gl: THREE.WebGLRenderer) => { glRef.current = gl; }, []);

  // Reset warped texture whenever upload changes
  useEffect(() => { setWarpedTex(null); }, [uploadedImage]);

  if (!product.model3d) return <div className="status-error">Produk tidak memiliki model3d.</div>;
  if (loadError)         return <div className="status-error">{loadError}</div>;

  // Pipeline: warped (from Panel A) → raw upload → blank
  const textureUrl = warpedTex ?? uploadedImage ?? BLANK_URL;

  function startDrag() { clearTimeout(dragTimer.current); setAutoRotate(false); setIsDragging(true); }
  function endDrag()   { setIsDragging(false); dragTimer.current = setTimeout(() => setAutoRotate(true), 2000); }

  return (
    <div className="viewer-3d-wrap">

      {/* shape switcher */}
      <div className="shape-switcher">
        {SHAPES.map((s) => (
          <button key={s.id} type="button"
            className={`shape-btn${shape === s.id ? " active" : ""}`}
            onClick={() => setShape(s.id)}
          >{s.icon} {s.label}</button>
        ))}
      </div>

      {/* tiga panel */}
      <div className="three-view-grid">

        {/* Panel A */}
        <div className="view-panel">
          <p className="panel-label">
            <span className="panel-index">A</span>
            Hasil warp
            <span style={{ fontWeight: 400, color: "var(--text-3)", marginLeft: 4, textTransform: "none", letterSpacing: 0 }}>· geser 4 sudut</span>
          </p>
          <div className="panel-canvas-wrap panel-light">
            <EditableWarpPanel
              uploadedImage={uploadedImage}
              onWarpComplete={setWarpedTex}
            />
          </div>
        </div>

        {/* Panel B */}
        <div className="view-panel">
          <p className="panel-label">
            <span className="panel-index">B</span>
            Viewport 3D
          </p>
          <div className="panel-canvas-wrap panel-dark viewport-3d"
            onPointerDown={startDrag} onPointerUp={endDrag} onPointerLeave={endDrag}>
            <Canvas
              camera={{ position: [0, 0.3, 4.2], fov: 36 }}
              shadows
              gl={{ preserveDrawingBuffer: true, antialias: true }}
              style={{ background: "transparent", display: "block" }}
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[3, 4, 3]} intensity={1.0} castShadow />
              <directionalLight position={[-3, -1, -2]} intensity={0.28} />
              <pointLight position={[0, 4, 2]} intensity={0.35} color="#fff8f0" />
              <Suspense fallback={null}>
                <ModelBoundary onError={setLoadError}>
                  <ShapeMesh
                    shape={shape}
                    textureUrl={textureUrl}
                    offsetX={texOffsetX}
                    offsetY={texOffsetY}
                    texScale={texScale}
                    autoRotate={autoRotate}
                    onGl={handleGl}
                  />
                </ModelBoundary>
              </Suspense>
              <OrbitControls enablePan={false} minDistance={2} maxDistance={8} autoRotate={false} />
            </Canvas>
          </div>
          <p className="panel-hint">
            {isDragging ? "memutar…" : autoRotate ? "rotasi otomatis · drag untuk kontrol" : "drag untuk memutar"}
          </p>
        </div>

        {/* Panel C */}
        <div className="view-panel">
          <p className="panel-label">
            <span className="panel-index">C</span>
            Hasil render
          </p>
          <div className="panel-canvas-wrap panel-dark">
            <AIEnhancedPanel glRef={glRef} />
          </div>
        </div>

      </div>

      {/* texture fine-tuning */}
      <div className="viewer-3d-controls">
        <label className="ctrl-label">
          <span className="ctrl-label-row"><span className="ctrl-name">Scale</span><span className="ctrl-value">{texScale.toFixed(2)}×</span></span>
          <input type="range" min="0.3" max="2" step="0.05" value={texScale}
            onChange={(e) => setTexScale(Number(e.target.value))} />
        </label>
        <label className="ctrl-label">
          <span className="ctrl-label-row"><span className="ctrl-name">Offset X</span><span className="ctrl-value">{texOffsetX.toFixed(2)}</span></span>
          <input type="range" min="-1" max="1" step="0.05" value={texOffsetX}
            onChange={(e) => setTexOffsetX(Number(e.target.value))} />
        </label>
        <label className="ctrl-label">
          <span className="ctrl-label-row"><span className="ctrl-name">Offset Y</span><span className="ctrl-value">{texOffsetY.toFixed(2)}</span></span>
          <input type="range" min="-1" max="1" step="0.05" value={texOffsetY}
            onChange={(e) => setTexOffsetY(Number(e.target.value))} />
        </label>
      </div>

    </div>
  );
}
