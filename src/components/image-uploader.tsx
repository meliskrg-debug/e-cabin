"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  label: string;
  hint?: string;
  onChange: (file: File | null) => void;
  accept?: string;
}

export default function ImageUploader({ label, hint, onChange, accept = "image/*" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Dosya 8 MB'dan büyük olamaz.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-lavender-800">{label}</span>
      {hint && <span className="text-xs text-lavender-500">{hint}</span>}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative aspect-[3/4] rounded-2xl border-2 border-dashed border-lavender-200 bg-lavender-50 hover:border-lavender-400 hover:bg-lavender-100 transition cursor-pointer overflow-hidden flex items-center justify-center"
      >
        {preview ? (
          <Image src={preview} alt="preview" fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-lavender-400 select-none">
            <span className="text-3xl">📷</span>
            <span className="text-xs font-medium">Fotoğraf seç veya sürükle</span>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
