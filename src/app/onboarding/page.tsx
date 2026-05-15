"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/image-uploader";

export default function OnboardingPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!photo) return;
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("body", photo);

    const res = await fetch("/api/avatar/create", { method: "POST", body: formData });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Bir hata oluştu.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col items-center justify-center px-4 py-12">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-lavender-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <a href="/" className="font-display font-bold text-white text-2xl tracking-tight mb-6 block">e-cabin</a>
          <h1 className="font-display font-bold text-2xl text-white">Fotoğrafını Yükle</h1>
          <p className="text-white/40 mt-2 text-sm">
            Tam boy, sade kıyafetle, öne bakış bir fotoğraf yükle.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm flex flex-col gap-6">
          <div className="max-w-[200px] mx-auto w-full">
            <ImageUploader label="Boy Fotoğrafı" hint="Baş-ayak arası, öne bakış" onChange={setPhoto} />
          </div>

          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={!photo || loading}
            className="w-full py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-40"
          >
            {loading ? "Kaydediliyor..." : "Kaydet ve Devam Et →"}
          </button>
        </div>
      </div>
    </div>
  );
}
