import { useRef, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";

export default function ImageDropzone({
  onFileSelect,
  disabled = false,
  accept = "image/jpeg,image/png,image/webp",
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
          : isDragging
            ? "border-brand-500 bg-brand-50/80 scale-[1.01]"
            : "border-slate-300 bg-white hover:border-brand-400 hover:bg-brand-50/40"
      }`}
      aria-label="Upload image"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-violet-100 text-brand-600">
        {isDragging ? (
          <ImageIcon className="h-8 w-8" aria-hidden="true" />
        ) : (
          <Upload className="h-8 w-8" aria-hidden="true" />
        )}
      </div>

      <p className="text-lg font-semibold text-slate-900">
        {isDragging ? "Drop your image here" : "Drag & drop your image"}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        or <span className="font-medium text-brand-600">browse files</span>
      </p>
      <p className="mt-4 text-xs text-slate-400">
        Supports JPG, PNG, WEBP — max 12 MB
      </p>
    </div>
  );
}
