import { describe, it, expect } from "vitest";
import { isOriginAllowed } from "../postMessage";

describe("isOriginAllowed", () => {
  it("menerima localhost di mode development", () => {
    expect(isOriginAllowed("http://localhost:5173")).toBe(true);
  });

  it("mengabaikan origin yang tidak dikenal", () => {
    expect(isOriginAllowed("https://evil.example.com")).toBe(false);
  });
});
