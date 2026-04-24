"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("E-posta veya şifre hatalı.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lavender-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-lavender-900 font-display">Tekrar hoş geldin</h1>
          <p className="text-lavender-600 mt-2 text-sm">Hesabına giriş yap</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg shadow-lavender-200/50 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-lavender-800">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="sen@email.com"
                className="rounded-xl border border-lavender-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-lavender-800">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="rounded-xl border border-lavender-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-lavender-400 focus:border-transparent transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-lavender-500 to-lavender-600 text-white font-semibold py-3 rounded-xl hover:from-lavender-600 hover:to-lavender-700 transition disabled:opacity-60"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-lavender-600 mt-6">
          Hesabın yok mu?{" "}
          <Link href="/signup" className="font-semibold text-lavender-700 hover:underline">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}
