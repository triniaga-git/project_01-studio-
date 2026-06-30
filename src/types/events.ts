// Kontrak postMessage sesuai specs/events.md
// Jangan ubah shape ini tanpa memperbarui specs/events.md terlebih dahulu.

export type StudioMessage<TType extends string, TPayload> = {
  type: TType;
  payload: TPayload;
};

// ---- Studio -> Host ----

export type StudioReadyMessage = StudioMessage<
  "studio-ready",
  { productId: string | null }
>;

export type ProductLoadedMessage = StudioMessage<
  "product-loaded",
  { productId: string; mode: "flat" | "3d" }
>;

export type PreviewCapturedMessage = StudioMessage<
  "preview-captured",
  { image: string; mimeType: "image/png"; productId: string }
>;

export type DesignSavedMessage = StudioMessage<
  "design-saved",
  {
    image: string;
    mimeType: "image/png";
    productId: string;
    warpPoints?: [
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number },
    ];
  }
>;

export type StudioErrorMessage = StudioMessage<
  "studio-error",
  { code: string; message: string }
>;

export type StudioToHostMessage =
  | StudioReadyMessage
  | ProductLoadedMessage
  | PreviewCapturedMessage
  | DesignSavedMessage
  | StudioErrorMessage;

// ---- Host -> Studio ----

export type SetProductCommand = StudioMessage<
  "set-product",
  { productId: string }
>;

export type GetPreviewCommand = StudioMessage<"get-preview", Record<string, never>>;

export type ResetDesignCommand = StudioMessage<"reset-design", Record<string, never>>;

export type HostToStudioCommand =
  | SetProductCommand
  | GetPreviewCommand
  | ResetDesignCommand;
