import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toolbar } from "../Toolbar";

describe("Toolbar", () => {
  it("memanggil onReset saat tombol Reset diklik", () => {
    const onReset = vi.fn();
    render(
      <Toolbar
        onUpload={vi.fn()}
        onReset={onReset}
        onSave={vi.fn()}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Reset"));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it("menonaktifkan semua kontrol saat disabled=true", () => {
    render(
      <Toolbar
        onUpload={vi.fn()}
        onReset={vi.fn()}
        onSave={vi.fn()}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        disabled
      />,
    );
    expect(screen.getByText("Reset")).toBeDisabled();
    expect(screen.getByText("Save")).toBeDisabled();
  });
});
