"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError("Şifre güncellenemedi: " + error.message);
    } else {
      router.push("/seller/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a1e] px-4">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-lavender-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <a href="/" className="font-display font-bold text-white text-2xl tracking-tight block mb-6">e-cabin</a>
          <h1 className="text-2xl font-bold text-white font-display">Yeni şifre belirle</h1>
          <p className="text-white/40 mt-1 text-sm">Marka paneliniz için yeni bir şifre girin</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <form onSubmit={handleReset} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/60">Yeni Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="En az 6 karakter"
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-white/60">Şifre Tekrar</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Aynı şifreyi tekrar gir"
                className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
              />
            </div>
            {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
            <button type="submit" disabled={loading}
              className="bg-gradient-to-r from-lavender-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-60">
              {loading ? "Kaydediliyor..." : "Şifremi Güncelle"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
