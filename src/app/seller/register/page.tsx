"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SellerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"account" | "brand">("account");

  // Account
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Brand
  const [brandName, setBrandName] = useState("");
  const [slug, setSlug] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toSlug(val: string) {
    return val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  async function handleAccountNext(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Şifre en az 8 karakter olmalı."); return; }
    setError("");
    setStep("brand");
  }

  async function handleBrandSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) { setError("Marka URL'si gerekli."); return; }
    setError("");
    setLoading(true);

    const res = await fetch("/api/seller/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, brandName, slug, websiteUrl }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Bir hata oluştu.");
      return;
    }

    router.push("/seller/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a1e] px-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-lavender-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <a href="/" className="font-display font-bold text-white text-2xl tracking-tight block mb-6">e-cabin</a>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lavender-500/10 border border-lavender-500/20 rounded-full text-xs text-lavender-400 mb-4">
            Marka Kaydı
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Markana Kaydol</h1>
          <p className="text-white/40 mt-1 text-sm">
            {step === "account" ? "Adım 1 / 2 — Hesap Bilgileri" : "Adım 2 / 2 — Marka Bilgileri"}
          </p>
        </div>

        {/* Progress */}
        <div className="w-full bg-white/10 rounded-full h-1 mb-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-lavender-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: step === "account" ? "50%" : "100%" }} />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          {step === "account" ? (
            <form onSubmit={handleAccountNext} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/60">E-posta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="marka@email.com"
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/60">Şifre (min 8 karakter)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
                />
              </div>
              {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <button type="submit" className="bg-gradient-to-r from-lavender-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-lavender-400 hover:to-purple-400 transition">
                Devam Et →
              </button>
            </form>
          ) : (
            <form onSubmit={handleBrandSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/60">Marka Adı</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => { setBrandName(e.target.value); setSlug(toSlug(e.target.value)); }}
                  required
                  placeholder="Örn: Zara, Koton..."
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/60">Marka URL'si</label>
                <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-white/10 focus-within:ring-2 focus-within:ring-lavender-500/50 focus-within:border-lavender-500/50">
                  <span className="px-3 py-3 bg-white/5 text-white/30 text-sm border-r border-white/10 whitespace-nowrap">e-cabin.app/b/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(toSlug(e.target.value))}
                    required
                    placeholder="marka-adiniz"
                    className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-white/20 outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/60">Web Sitesi (opsiyonel)</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://markaniz.com"
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
                />
              </div>
              {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep("account"); setError(""); }}
                  className="flex-1 py-3 font-semibold bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition">
                  ← Geri
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-gradient-to-r from-lavender-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-60">
                  {loading ? "Kaydediliyor..." : "Hesap Oluştur"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Zaten hesabın var mı?{" "}
          <Link href="/seller/login" className="font-semibold text-lavender-400 hover:text-lavender-300">Giriş yap</Link>
        </p>
      </div>
    </div>
  );
}
