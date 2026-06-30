// Communication Layer: wrapper postMessage sesuai specs/design.md dan specs/events.md.
// Semua penerima event WAJIB memvalidasi origin (lihat specs/events.md bagian Security Rule).

import type { HostToStudioCommand, StudioToHostMessage } from "../types/events";

const developmentOrigins = ["http://localhost:5173", "http://localhost:4173"];

function getAllowedOrigins(): string[] {
  const fromEnv = (import.meta.env.VITE_ALLOWED_ORIGINS as string | undefined) ?? "";
  const configured = fromEnv
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return import.meta.env.DEV ? [...configured, ...developmentOrigins] : configured;
}

export function isOriginAllowed(origin: string): boolean {
  const allowed = getAllowedOrigins();
  // Belum ada konfigurasi origin: jangan diam-diam menerima semua pesan.
  if (allowed.length === 0) return false;
  return allowed.includes(origin);
}

export function sendToHost(message: StudioToHostMessage): void {
  if (window.parent === window) return; // tidak berjalan di dalam iframe
  window.parent.postMessage(message, "*");
}

export function handleHostCommand(
  event: MessageEvent,
  onCommand: (command: HostToStudioCommand) => void,
): void {
  if (!isOriginAllowed(event.origin)) return;

  const data: unknown = event.data;
  if (typeof data !== "object" || data === null || !("type" in data)) return;

  const type = (data as { type: unknown }).type;
  if (type === "set-product" || type === "get-preview" || type === "reset-design") {
    onCommand(data as HostToStudioCommand);
  }
  // Unknown event type diabaikan sesuai specs/events.md Implementation Notes.
}
