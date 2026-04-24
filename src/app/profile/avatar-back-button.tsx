"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AvatarBackButton({ avatarId, backUrl }: { avatarId: string; backUrl: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    await fetch("/api/avatar/back", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarId }),
    });
    setLoading(false);
    router.refresh();
  }

  if (backUrl) {
    return (
      <div className="rounded-2xl overflow-hidden bg-lavender-50">
        <Image
          src={backUrl}
          alt="Avatar arka görünüm"
          width={600}
          height={900}
          className="w-full h-auto object-contain"
        />
      </div>
    );
  }

  return (
    <button
      onClick={generate}
      disabled={loading}
      className="w-full py-3 text-sm font-semibold bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition disabled:opacity-50"
    >
      {loading ? "Oluşturuluyor... (1-2 dk)" : "Arka Görünüm Oluştur"}
    </button>
  );
}
