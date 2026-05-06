"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PoseGenerator() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    setLoading(true);
    await fetch("/api/avatar/poses", { method: "POST" });
    setLoading(false);
    setDone(true);
    router.refresh();
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="text-center py-2.5 text-sm font-medium bg-lavender-500/20 border border-lavender-500/30 text-lavender-300 rounded-xl hover:bg-lavender-500/30 transition disabled:opacity-40"
    >
      {loading ? "Pozlar oluşturuluyor (~2dk)..." : done ? "Pozlar hazır ✓" : "3 Poz Üret"}
    </button>
  );
}
