import type { ChangeEvent } from "react";

type ToolbarProps = {
  onUpload: (file: File) => void;
  onReset: () => void;
  onSave: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  disabled?: boolean;
};

export function Toolbar({ onUpload, onReset, onSave, onZoomIn, onZoomOut, disabled }: ToolbarProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
    event.target.value = "";
  }

  return (
    <div className="toolbar" role="toolbar" aria-label="Studio toolbar">
      <label className="toolbar-button">
        Upload
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          disabled={disabled}
          hidden
        />
      </label>
      <button type="button" onClick={onZoomOut} disabled={disabled} aria-label="Zoom out">
        −
      </button>
      <button type="button" onClick={onZoomIn} disabled={disabled} aria-label="Zoom in">
        +
      </button>
      <button type="button" onClick={onReset} disabled={disabled}>
        Reset
      </button>
      <button type="button" onClick={onSave} disabled={disabled}>
        Save
      </button>
    </div>
  );
}
