"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props =
  | { type: "avatar"; avatarId: string; isActive: boolean; children: React.ReactNode }
  | { type: "photo"; photoId: string; children: React.ReactNode }
  | { type: "upload" };

export default function ProfileActions(props: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  if (props.type === "avatar") {
    return (
      <button
        onClick={async () => {
          if (props.isActive) return;
          await fetch("/api/profile/avatar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: props.avatarId }),
          });
          router.refresh();
        }}
        className="w-full text-left hover:opacity-80 transition"
      >
        {props.children}
      </button>
    );
  }

  if (props.type === "photo") {
    return (
      <div className="relative group">
        {props.children}
        <button
          onClick={async () => {
            await fetch("/api/photos", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: props.photoId }),
            });
            router.refresh();
          }}
          className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-50"
      >
        {uploading ? "Yükleniyor..." : "+ Fotoğraf Ekle"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          const form = new FormData();
          form.append("photo", file);
          await fetch("/api/photos", { method: "POST", body: form });
          setUploading(false);
          router.refresh();
        }}
      />
    </>
  );
}
