"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";


function EmbedInner() {
  const searchParams = useSearchParams();
  const garmentId = searchParams.get("g");

  const [step, setStep] = useState<"upload" | "loading" | "result">("upload");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!garmentId) { setError("Ürün bulunamadı."); return; }
    if (!photo) { setError("Fotoğraf seç."); return; }

    setError("");
    setStep("loading");

    try {
      const formData = new FormData();
      formData.append("sourceType", "gallery");

      const gRes = await fetch(`/api/public/garment/${garmentId}`);
      const gData = await gRes.json();
      if (!gData.garment?.image_url) { setError("Ürün görseli alınamadı."); setStep("upload"); return; }
      formData.append("garmentUrl", gData.garment.image_url);
      formData.append("galleryImage", photo);

      const res = await fetch("/api/tryon", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok || !json.tryon?.result_image_url) {
        setError("Deneme yapılamadı. Tekrar dene.");
        setStep("upload");
        return;
      }

      setResultUrl(json.tryon.result_image_url);
      setStep("result");
    } catch {
      setError("Bağlantı hatası. Tekrar dene.");
      setStep("upload");
    }
  }

  const hasPhoto = photo !== null;

  if (step === "loading") {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-white px-6">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        <div className="text-center">
          <p className="font-semibold text-gray-800">Deneme hazırlanıyor...</p>
          <p className="text-sm text-gray-400 mt-1">Bu 20–60 saniye sürebilir</p>
        </div>
      </div>
    );
  }

  if (step === "result" && resultUrl) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-800 text-sm">e-cabin ile dene</span>
          <button
            onClick={() => { setStep("upload"); setResultUrl(null); setPhoto(null); setPhotoPreview(null); }}
            className="text-sm text-purple-600 font-medium hover:text-purple-800 transition"
          >
            Tekrar Dene
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="rounded-2xl overflow-hidden">
            <Image src={resultUrl} alt="Deneme sonucu" width={600} height={900} className="w-full h-auto object-contain" />
          </div>
          <a
            href={resultUrl}
            download="e-cabin-deneme.png"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
          >
            İndir
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <span className="font-semibold text-gray-800 text-sm">e-cabin ile dene</span>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4 flex flex-col gap-5">
        {/* Step label */}
        <div>
          <p className="font-semibold text-gray-800 text-sm">1. Fotoğrafını yükle</p>
          <p className="text-xs text-gray-400 mt-0.5">Net, önden çekilmiş bir fotoğraf seç.</p>
        </div>

        {/* Upload area */}
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-purple-400 transition bg-gray-50 overflow-hidden"
          style={{ minHeight: "160px" }}
        >
          <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
          {photoPreview ? (
            <Image src={photoPreview} alt="Seçilen fotoğraf" width={300} height={400} className="max-h-48 w-auto object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
              <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm font-medium text-gray-600">Fotoğraf seç veya sürükle</span>
              <span className="text-xs text-gray-400">JPG, PNG • Max 10MB</span>
            </div>
          )}
        </label>

        {/* Tips */}
        <div className="flex flex-col gap-2">
          {[
            "İyi aydınlatılmış bir fotoğraf kullanın",
            "Vücudunuzun tamamı görünsün",
            "Düz bir zemin ve arka plan tercih edin",
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-2 text-xs text-gray-400">
              <span className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {tip}
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      </div>

      {/* CTA */}
      <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={handleSubmit}
          disabled={!hasPhoto}
          className="w-full py-3.5 font-semibold text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Fotoğrafı yükle ve devam et
        </button>
        <div className="flex justify-center gap-6 mt-3">
          <span className="text-xs text-gray-300 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            e-cabin nasıl çalışır?
          </span>
          <span className="text-xs text-gray-300 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Gizliliğin bizim için önemli
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense>
      <EmbedInner />
    </Suspense>
  );
}
