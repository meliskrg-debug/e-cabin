"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Nav() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-10 bg-[#0f0a1e]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-display font-bold text-white text-xl tracking-tight">
        e-cabin
      </Link>
      <div className="flex items-center gap-5">
        <Link href="/tryon" className="text-sm font-medium text-white/50 hover:text-white transition">Dene</Link>
        <Link href="/wardrobe" className="text-sm font-medium text-white/50 hover:text-white transition">Dolabım</Link>
        <Link href="/tryon/history" className="text-sm font-medium text-white/50 hover:text-white transition">Geçmiş</Link>
        <Link href="/profile" className="text-sm font-medium text-white/50 hover:text-white transition">Profil</Link>
        <button
          onClick={handleSignOut}
          className="text-sm font-medium text-white/30 hover:text-white/60 transition"
        >
          Çıkış
        </button>
      </div>
    </nav>
  );
}
