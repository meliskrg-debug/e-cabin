"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type Garment = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active: boolean;
  external_product_url: string | null;
  created_at: string;
};

const CATEGORIES = [
  { key: "elbise", label: "Elbise" },
  { key: "ust", label: "Üst" },
  { key: "ceket", label: "Ceket" },
  { key: "pantolon", label: "Pantolon" },
  { key: "etek", label: "Etek" },
  { key: "ayakkabi", label: "Ayakkabı" },
  { key: "aksesuar", label: "Aksesuar" },
  { key: "diger", label: "Diğer" },
];

export default function SellerGarmentsPage() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("diger");
  const [externalUrl, setExternalUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/seller/garments");
    const d = await r.json();
    setGarments(d.garments || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    e.target.value = "";
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !name) return;
    setUploading(true);
    const form = new FormData();
    form.append("image", file);
    form.append("name", name);
    form.append("category", category);
    if (externalUrl) form.append("external_product_url", externalUrl);
    await fetch("/api/seller/garments", { method: "POST", body: form });
    setUploading(false);
    setShowModal(false);
    setName(""); setCategory("diger"); setExternalUrl(""); setFile(null); setPreview(null);
    load();
  }

  async function handleDelete(id: string) {
    await fetch("/api/seller/garments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  async function handleShopifyImport() {
    setImporting(true);
    setImportResult(null);
    const res = await fetch("/api/seller/shopify/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopifyDomain: "touchmeluxury.com" }),
    });
    const data = await res.json();
    setImporting(false);
    if (res.ok) {
      setImportResult(`${data.imported} ürün aktarıldı${data.skipped ? `, ${data.skipped} atlandı` : ""}.`);
      load();
    } else {
      setImportResult("Hata: " + (data.error || "Bilinmeyen hata"));
    }
  }

  async function handleToggle(id: string, current: boolean) {
    await fetch("/api/seller/garments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !current }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <nav className="sticky top-0 z-10 bg-[#0f0a1e]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-display font-bold text-white text-xl tracking-tight">e-cabin</a>
          <span className="px-2 py-0.5 text-xs bg-lavender-500/20 border border-lavender-500/30 text-lavender-400 rounded-full">Marka Paneli</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/seller/dashboard" className="text-sm font-medium text-white/50 hover:text-white transition">Dashboard</Link>
          <Link href="/seller/embed" className="text-sm font-medium text-white/50 hover:text-white transition">Embed Kodu</Link>
        </div>
      </nav>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Upload modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1030] border border-white/10 rounded-3xl p-8 w-full max-w-md mx-4">
            <h3 className="font-display font-bold text-white text-lg mb-6">Ürün Ekle</h3>
            <form onSubmit={handleUpload} className="flex flex-col gap-4">

              {/* Image picker */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-2xl h-40 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-lavender-500/50 transition overflow-hidden relative"
              >
                {preview ? (
                  <Image src={preview} alt="Önizleme" fill className="object-contain p-2" />
                ) : (
                  <>
                    <span className="text-3xl">📷</span>
                    <span className="text-sm text-white/40">Görsel seç</span>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Ürün Adı</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Örn: Siyah Mini Elbise"
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 transition" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Kategori</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-lavender-500/50 transition">
                  {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Ürün Sayfası URL (opsiyonel)</label>
                <input type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} placeholder="https://markaniz.com/urun/..."
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 transition" />
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => { setShowModal(false); setPreview(null); setFile(null); }}
                  className="flex-1 py-3 font-semibold bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition">
                  İptal
                </button>
                <button type="submit" disabled={!file || !name || uploading}
                  className="flex-1 py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-40">
                  {uploading ? "Yükleniyor..." : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-3xl text-white">Ürün Kataloğu</h1>
          <div className="flex gap-3">
            <button onClick={handleShopifyImport} disabled={importing}
              className="px-5 py-2.5 text-sm font-semibold bg-white/5 border border-white/10 text-white/70 rounded-xl hover:bg-white/10 hover:text-white transition disabled:opacity-40 flex items-center gap-2">
              {importing ? "Aktarılıyor..." : "🛍️ Shopify'dan Aktar"}
            </button>
            <button onClick={() => setShowModal(true)}
              className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition">
              + Ürün Ekle
            </button>
          </div>
        </div>
        {importResult && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm bg-lavender-500/10 border border-lavender-500/20 text-lavender-300">
            {importResult}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-white/30">Yükleniyor...</div>
        ) : garments.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 flex flex-col items-center gap-4 text-white/30">
            <span className="text-5xl">👗</span>
            <p className="text-sm font-medium text-white/50">Henüz ürün eklenmedi.</p>
            <button onClick={() => setShowModal(true)}
              className="mt-2 px-6 py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition">
              İlk Ürünü Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {garments.map((g) => (
              <div key={g.id} className={`group relative bg-white/5 border rounded-2xl overflow-hidden transition ${g.is_active ? "border-white/10 hover:border-lavender-500/40" : "border-white/5 opacity-50"}`}>
                <div className="relative aspect-[3/4] bg-white/5">
                  <Image src={g.image_url} alt={g.name} fill className="object-contain p-1" />
                </div>

                {/* Active toggle */}
                <button
                  onClick={() => handleToggle(g.id, g.is_active)}
                  className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold transition ${g.is_active ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/10 text-white/30 border border-white/10"}`}
                >
                  {g.is_active ? "Aktif" : "Pasif"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(g.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>

                <div className="p-2.5">
                  <p className="text-xs font-semibold text-white truncate">{g.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">{CATEGORIES.find(c => c.key === g.category)?.label}</p>
                  <Link
                    href={`/seller/embed?garment=${g.id}`}
                    className="block text-center text-xs font-semibold text-lavender-400 bg-lavender-500/10 hover:bg-lavender-500/20 rounded-lg py-1.5 mt-2 transition"
                  >
                    Embed Al
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
