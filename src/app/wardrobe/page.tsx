"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Nav from "@/components/nav";
import Link from "next/link";

type Item = { id: string; item_url: string; name: string | null; category: string };

const ICONS: Record<string, React.ReactElement> = {
  hepsi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  elbise: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M8 2l-4 4 3 1v13a1 1 0 001 1h8a1 1 0 001-1V7l3-1-4-4"/>
      <path d="M8 2c0 2 1.5 3 4 3s4-1 4-3"/>
    </svg>
  ),
  ust: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M8 2L4 6l3 2v10h10V8l3-2-4-4"/>
      <path d="M8 2c0 2 1.5 3 4 3s4-1 4-3"/>
    </svg>
  ),
  ceket: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M7 2L3 6l3 2v12h12V8l3-2-4-4"/>
      <path d="M7 2c0 2.5 2 4 5 4s5-1.5 5-4"/>
      <path d="M12 6v14"/>
    </svg>
  ),
  pantolon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M5 3h14v5l-3 13H8L5 8V3z"/>
      <path d="M12 8v13"/>
    </svg>
  ),
  etek: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M8 3h8l3 18H5L8 3z"/>
      <path d="M7 3h10"/>
    </svg>
  ),
  ayakkabi: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M3 14c0-2 1-4 4-4h3l2-4h5c1.5 0 4 1 4 4v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"/>
      <path d="M3 14h18v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"/>
    </svg>
  ),
  aksesuar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M6 2h12l2 6H4L6 2z"/>
      <path d="M4 8v12a1 1 0 001 1h14a1 1 0 001-1V8"/>
      <path d="M9 8v3a3 3 0 006 0V8"/>
    </svg>
  ),
  diger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 8v4l3 3"/>
    </svg>
  ),
};

const CATEGORIES = [
  { key: "hepsi", label: "Hepsi" },
  { key: "elbise", label: "Elbise" },
  { key: "ust", label: "Üst" },
  { key: "ceket", label: "Ceket" },
  { key: "pantolon", label: "Pantolon" },
  { key: "etek", label: "Etek" },
  { key: "ayakkabi", label: "Ayakkabı" },
  { key: "aksesuar", label: "Aksesuar" },
  { key: "diger", label: "Diğer" },
];

const LIMIT = 10;

export default function WardrobePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [activeCategory, setActiveCategory] = useState("hepsi");
  const [uploading, setUploading] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingFile = useRef<File | null>(null);

  async function load() {
    const r = await fetch("/api/wardrobe");
    const d = await r.json();
    setItems(d.items || []);
  }

  useEffect(() => { load(); }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    pendingFile.current = f;
    setShowCatPicker(true);
    e.target.value = "";
  }

  async function handleUpload(category: string) {
    const file = pendingFile.current;
    if (!file) return;
    setShowCatPicker(false);
    setUploading(true);
    const form = new FormData();
    form.append("item", file);
    form.append("category", category);
    await fetch("/api/wardrobe", { method: "POST", body: form });
    setUploading(false);
    load();
  }

  async function handleDelete(id: string) {
    await fetch("/api/wardrobe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  const filtered = activeCategory === "hepsi"
    ? items
    : items.filter(i => i.category === activeCategory);

  const catCount = (key: string) => key === "hepsi" ? items.length : items.filter(i => i.category === key).length;

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <Nav />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Kategori seçici modal */}
      {showCatPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1030] border border-white/10 rounded-3xl p-6 w-80">
            <h3 className="font-display font-bold text-white text-lg mb-4 text-center">Kategori Seç</h3>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.filter(c => c.key !== "hepsi").map(cat => (
                <button
                  key={cat.key}
                  onClick={() => handleUpload(cat.key)}
                  className="flex flex-col items-center gap-1.5 py-3 px-2 bg-white/5 border border-white/10 rounded-2xl hover:bg-lavender-500/20 hover:border-lavender-500/40 transition"
                >
                  <span className="text-lavender-300">{ICONS[cat.key]}</span>
                  <span className="text-xs text-white/60">{cat.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowCatPicker(false)} className="w-full mt-4 py-2 text-xs text-white/30 hover:text-white/60 transition">
              İptal
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 relative">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-3xl text-white">Dolabım</h1>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/30">{items.length}/{LIMIT} kıyafet</span>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading || items.length >= LIMIT}
              className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-40"
            >
              {uploading ? "Yükleniyor..." : "+ Kıyafet Ekle"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        </div>

        {/* Kategori butonları */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition ${
                activeCategory === cat.key
                  ? "bg-lavender-500/30 border border-lavender-500/50 text-lavender-300"
                  : "bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20"
              }`}
            >
              <span>{ICONS[cat.key]}</span>
              <span>{cat.label}</span>
              {catCount(cat.key) > 0 && (
                <span className={`text-xs rounded-full px-1.5 ${activeCategory === cat.key ? "bg-lavender-500/30 text-lavender-300" : "bg-white/10 text-white/30"}`}>
                  {catCount(cat.key)}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-16 flex flex-col items-center gap-4 text-white/30">
            <span className="w-16 h-16 text-white/20">{ICONS[activeCategory] || ICONS["elbise"]}</span>
            <p className="text-sm font-medium text-white/50">
              {activeCategory === "hepsi" ? "Gardrobun boş." : `${CATEGORIES.find(c => c.key === activeCategory)?.label} kategorisinde kıyafet yok.`}
            </p>
            <button onClick={() => fileRef.current?.click()} className="mt-2 px-6 py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition">
              Kıyafet Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-lavender-500/40 transition">
                <Image src={item.item_url} alt={item.name || "Kıyafet"} width={300} height={400} className="w-full h-auto object-contain" />
                <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white/50 flex items-center gap-1">
                  <span className="w-3 h-3">{ICONS[item.category]}</span>
                  {CATEGORIES.find(c => c.key === item.category)?.label}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
                <div className="p-2">
                  <Link
                    href={`/tryon?garmentUrl=${encodeURIComponent(item.item_url)}`}
                    className="block text-center text-xs font-semibold text-lavender-400 bg-lavender-500/10 hover:bg-lavender-500/20 rounded-lg py-1.5 transition"
                  >
                    Dene
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
