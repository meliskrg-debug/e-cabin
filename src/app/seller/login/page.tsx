"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SellerLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/seller/dashboard` },
    });
    setLoading(false);
    if (error) {
      setError("Bir hata oluştu. Tekrar dene.");
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a1e] px-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-lavender-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <a href="/" className="font-display font-bold text-white text-2xl tracking-tight block mb-6">e-cabin</a>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lavender-500/10 border border-lavender-500/20 rounded-full text-xs text-lavender-400 mb-4">
            Marka Paneli
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Hoş geldin</h1>
          <p className="text-white/40 mt-1 text-sm">E-postana giriş linki gönderelim</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          {sent ? (
            <div className="text-center flex flex-col gap-4">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-2xl mx-auto">
                ✉️
              </div>
              <div>
                <p className="text-white font-semibold">Mail gönderildi!</p>
                <p className="text-white/40 text-sm mt-1">
                  <span className="text-lavender-400">{email}</span> adresine giriş linki gönderdik. Linke tıkla, panele gir.
                </p>
              </div>
              <button onClick={() => setSent(false)} className="text-xs text-white/30 hover:text-white/50 transition">
                Farklı e-posta dene
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-lavender-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-60"
              >
                {loading ? "Gönderiliyor..." : "Giriş Linki Gönder ✉️"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Hesabın yok mu?{" "}
          <Link href="/seller/register" className="font-semibold text-lavender-400 hover:text-lavender-300">
            Marka olarak kaydol
          </Link>
        </p>
      </div>
    </div>
  );
}
