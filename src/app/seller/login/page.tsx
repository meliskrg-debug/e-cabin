"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SellerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) {
      setError("Kod gönderilemedi: " + error.message);
    } else {
      setStep("code");
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError("Kod hatalı veya süresi dolmuş.");
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lavender-500/10 border border-lavender-500/20 rounded-full text-xs text-lavender-400 mb-4">
            Marka Paneli
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Hoş geldin</h1>
          <p className="text-white/40 mt-1 text-sm">
            {step === "email" ? "E-postana doğrulama kodu gönderelim" : `${email} adresine kod gönderdik`}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          {step === "email" ? (
            <form onSubmit={handleSendCode} className="flex flex-col gap-5">
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
              {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <button type="submit" disabled={loading}
                className="bg-gradient-to-r from-lavender-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-60">
                {loading ? "Gönderiliyor..." : "Kod Gönder"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white/60">6 haneli kod</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  placeholder="123456"
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-2xl text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition tracking-[0.5em] text-center font-mono"
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
              <button type="submit" disabled={loading || code.length < 6}
                className="bg-gradient-to-r from-lavender-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-60">
                {loading ? "Doğrulanıyor..." : "Giriş Yap"}
              </button>
              <button type="button" onClick={() => { setStep("email"); setCode(""); setError(""); }}
                className="text-sm text-white/30 hover:text-white/60 transition">
                ← E-postayı değiştir
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
