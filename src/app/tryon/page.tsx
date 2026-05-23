"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/nav";
import ImageUploader from "@/components/image-uploader";

type WardrobeItem = { id: string; item_url: string; name: string | null };

function TryonPageInner() {
  const searchParams = useSearchParams();
  const preloadedGarmentUrl = searchParams.get("garmentUrl");
  const preloadedGarmentId = searchParams.get("g");

  const [galleryImage, setGalleryImage] = useState<File | null>(null);
  const [garment, setGarment] = useState<File | null>(null);
  const [selectedGarmentUrl, setSelectedGarmentUrl] = useState<string | null>(preloadedGarmentUrl);
  const [brandGarmentName, setBrandGarmentName] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [garmentTab, setGarmentTab] = useState<"wardrobe" | "upload">("wardrobe");
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    fetch("/api/wardrobe").then((r) => r.json()).then((d) => setWardrobeItems(d.items || [])).catch(() => {});
    if (preloadedGarmentId) {
      fetch(`/api/public/garment/${preloadedGarmentId}`)
        .then(r => r.json())
        .then(d => {
          if (d.garment) {
            setSelectedGarmentUrl(d.garment.image_url);
            setBrandGarmentName(d.garment.name);
          }
        });
    }
  }, [preloadedGarmentId]);

  async function handleTryon() {
    setError("");
    setResultUrl(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("sourceType", "gallery");

      if (garment) formData.append("garment", garment);
      else if (selectedGarmentUrl) formData.append("garmentUrl", selectedGarmentUrl);

      if (galleryImage) formData.append("galleryImage", galleryImage);

      const res = await fetch("/api/tryon", { method: "POST", body: formData });
      if (res.status === 504 || res.status === 503) {
        setError("İşlem zaman aşımına uğradı, lütfen tekrar deneyin.");
        return;
      }
      let json: any;
      try { json = await res.json(); } catch {
        setError(`Sunucu hatası (${res.status}). Lütfen tekrar deneyin.`);
        return;
      }

      if (!res.ok) {
        setError(json.error || "Bir hata oluştu.");
      } else if (!json.tryon?.result_image_url) {
        setError("Sonuç görseli alınamadı. Lütfen tekrar deneyin.");
      } else {
        setResultUrl(json.tryon.result_image_url);
      }
    } catch (err) {
      console.error("Tryon error:", err);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  const garmentReady = garment !== null || selectedGarmentUrl !== null;
  const photoReady = galleryImage !== null;
  const canSubmit = garmentReady && photoReady;

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <Nav />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 relative">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="font-display font-bold text-3xl text-white">Kıyafet Dene</h1>
          {brandGarmentName && (
            <span className="px-3 py-1 text-xs font-semibold bg-lavender-500/20 border border-lavender-500/30 text-lavender-300 rounded-full">
              {brandGarmentName}
            </span>
          )}
        </div>

        {resultUrl && (
          <div className="mb-8 bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-white">Sonuç</h2>
              <button
                onClick={() => { setResultUrl(null); setGarment(null); setSelectedGarmentUrl(null); }}
                className="text-sm text-white/40 hover:text-white transition"
              >
                Tekrar Dene →
              </button>
            </div>
            <div className="max-w-sm mx-auto rounded-2xl overflow-hidden">
              <Image src={resultUrl} alt="Try-on result" width={600} height={900} className="w-full h-auto object-contain" />
            </div>
            <div className="flex justify-center mt-4">
              <a href={resultUrl} download="tryon-result.png" className="px-6 py-2.5 text-sm font-semibold bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition">
                İndir
              </a>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Fotoğraf */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-5">
            <h2 className="font-display font-bold text-white text-lg">Fotoğrafın</h2>
            <ImageUploader label="Kişi Fotoğrafı" hint="Kıyafetin üzerine giyileceği fotoğraf" onChange={setGalleryImage} />
          </div>

          {/* Kıyafet */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-5">
            <h2 className="font-display font-bold text-white text-lg">Kıyafet</h2>
            <div className="flex gap-2">
              <button onClick={() => { setGarmentTab("wardrobe"); setGarment(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${garmentTab === "wardrobe" ? "bg-lavender-500/20 text-lavender-300 border border-lavender-500/30" : "bg-white/5 text-white/40 hover:text-white"}`}>
                Dolabımdan Seç
              </button>
              <button onClick={() => { setGarmentTab("upload"); setSelectedGarmentUrl(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${garmentTab === "upload" ? "bg-lavender-500/20 text-lavender-300 border border-lavender-500/30" : "bg-white/5 text-white/40 hover:text-white"}`}>
                Fotoğraf Yükle
              </button>
            </div>
            {garmentTab === "wardrobe" ? (
              preloadedGarmentId && selectedGarmentUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full rounded-2xl overflow-hidden bg-white/5 border border-lavender-500/30">
                    <Image src={selectedGarmentUrl} alt={brandGarmentName || "Ürün"} width={300} height={400} className="w-full h-auto object-contain" />
                  </div>
                  {brandGarmentName && (
                    <p className="text-xs text-lavender-300 font-medium">{brandGarmentName}</p>
                  )}
                  <p className="text-xs text-white/30">Bu ürün marka kataloğundan yüklendi</p>
                </div>
              ) : wardrobeItems.length === 0 ? (
                <div className="text-center py-6 flex flex-col gap-2">
                  <p className="text-xs text-white/30">Dolabın boş.</p>
                  <a href="/wardrobe" className="text-xs font-semibold text-lavender-400 hover:text-lavender-300">
                    Kıyafet eklemek için Dolabıma git →
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {wardrobeItems.map((item) => (
                    <button key={item.id} onClick={() => setSelectedGarmentUrl(item.item_url)}
                      className={`rounded-xl overflow-hidden border-2 transition ${selectedGarmentUrl === item.item_url ? "border-lavender-500" : "border-white/10 hover:border-lavender-500/50"}`}>
                      <Image src={item.item_url} alt={item.name || ""} width={120} height={160} className="w-full h-auto object-contain bg-white/5" />
                    </button>
                  ))}
                </div>
              )
            ) : (
              <ImageUploader label="Kıyafet Fotoğrafı" hint="Askıda, düz ya da mankende olabilir" onChange={setGarment} />
            )}
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleTryon}
            disabled={!canSubmit || loading}
            className="px-12 py-4 font-semibold text-lg bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-2xl hover:from-lavender-400 hover:to-purple-400 transition shadow-xl shadow-lavender-900/50 disabled:opacity-40"
          >
            {loading ? "Kıyafet deneniyor..." : "Dene ✨"}
          </button>
        </div>

        {loading && (
          <p className="text-center text-sm text-white/30 mt-3 animate-pulse">
            Yapay zeka çalışıyor, 1–2 dakika sürebilir...
          </p>
        )}
      </main>
    </div>
  );
}

export default function TryonPage() {
  return (
    <Suspense>
      <TryonPageInner />
    </Suspense>
  );
}
