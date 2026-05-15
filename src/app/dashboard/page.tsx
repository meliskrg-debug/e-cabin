import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/nav";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: avatars } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const activeAvatar = avatars?.[0] || null;

  const { count: tryonCount } = await supabase
    .from("tryons").select("*", { count: "exact", head: true }).eq("user_id", user!.id);

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <Nav />

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 relative">
        <h1 className="font-display font-bold text-3xl text-white mb-8">Merhaba 👋</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Avatar Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <h2 className="font-display font-bold text-white text-lg">Fotoğrafın</h2>
            {activeAvatar ? (
              <>
                <div className="max-w-[200px] mx-auto w-full rounded-2xl overflow-hidden bg-white/5">
                  <Image src={activeAvatar.avatar_url} alt="Fotoğrafım" width={400} height={600} className="w-full h-auto object-contain" />
                </div>
                <Link
                  href="/onboarding"
                  className="text-center py-2.5 text-sm font-medium bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition"
                >
                  Fotoğrafı Güncelle
                </Link>
              </>
            ) : (
              <>
                <div className="aspect-[3/4] rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-white/30">
                  <span className="text-5xl">📷</span>
                  <span className="text-sm font-medium">Henüz fotoğraf yok</span>
                </div>
                <Link
                  href="/onboarding"
                  className="text-center py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition"
                >
                  Fotoğraf Yükle
                </Link>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-4">
            {[
              { href: "/tryon", icon: "👗", title: "Kıyafet Dene", desc: "Beğendiğin kıyafeti avatarınla veya kendi fotoğrafınla dene." },
              { href: "/wardrobe", icon: "👚", title: "Dolabım", desc: "Kıyafetlerini kaydet, tek tıkla avatarında dene." },
              { href: "/tryon/history", icon: "🗂", title: "Geçmiş Denemeler", desc: `${tryonCount ? `${tryonCount} deneme kayıtlı` : "Henüz deneme yok"} — hepsini gör.` },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4 hover:bg-white/8 hover:border-lavender-500/30 transition group"
              >
                <div className="w-11 h-11 bg-lavender-500/10 border border-lavender-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-lavender-500/20 transition">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">{item.title}</h3>
                  <p className="text-white/40 text-sm mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
