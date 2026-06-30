# Event Contract

Dokumen ini mendefinisikan kontrak `postMessage` antara Studio App di iframe dan website host.

## Security Rule

Semua penerima event wajib memvalidasi `event.origin`.

```ts
const allowedOrigins = [
  "https://example.com",
  "https://shop.example.com"
];

window.addEventListener("message", (event) => {
  if (!allowedOrigins.includes(event.origin)) {
    return;
  }

  // handle trusted message
});
```

Pada development, allowed origin lokal boleh ditambahkan secara eksplisit.

```ts
const developmentOrigins = [
  "http://localhost:5173",
  "http://localhost:4173"
];
```

## Shared Envelope

Semua message wajib memakai struktur berikut.

```ts
export type StudioMessage<TType extends string, TPayload> = {
  type: TType;
  payload: TPayload;
};
```

## Studio -> Host Events

### `studio-ready`

Dikirim setelah iframe siap menerima perintah.

```ts
{
  type: "studio-ready",
  payload: {
    productId: string | null;
  }
}
```

### `product-loaded`

Dikirim setelah product template berhasil dimuat.

```ts
{
  type: "product-loaded",
  payload: {
    productId: string;
    mode: "flat" | "3d";
  }
}
```

### `preview-captured`

Dikirim setelah host meminta preview atau pengguna melakukan capture.

```ts
{
  type: "preview-captured",
  payload: {
    image: string;
    mimeType: "image/png";
    productId: string;
  }
}
```

### `design-saved`

Dikirim saat pengguna menekan save.

```ts
{
  type: "design-saved",
  payload: {
    image: string;
    mimeType: "image/png";
    productId: string;
    warpPoints?: [
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number },
      { x: number; y: number }
    ];
  }
}
```

### `studio-error`

Dikirim saat terjadi error yang perlu diketahui host.

```ts
{
  type: "studio-error",
  payload: {
    code: string;
    message: string;
  }
}
```

## Host -> Studio Commands

### `set-product`

Meminta studio mengganti produk aktif.

```ts
{
  type: "set-product",
  payload: {
    productId: string;
  }
}
```

### `get-preview`

Meminta studio mengirim capture preview terbaru.

```ts
{
  type: "get-preview",
  payload: {}
}
```

### `reset-design`

Meminta studio menghapus gambar upload dan mengembalikan warp ke default.

```ts
{
  type: "reset-design",
  payload: {}
}
```

## Implementation Notes

- Gunakan union type untuk semua event.
- Unknown event type harus diabaikan.
- Payload harus divalidasi sebelum dipakai.
- Jangan mengirim object Fabric.js, canvas instance, atau data internal lain ke host.
- Base64 image boleh dipakai untuk MVP, tetapi Blob/Object URL dapat dievaluasi jika ukuran payload menjadi masalah.
