import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/seller/login");

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("owner_user_id", user.id)
    .single();

  if (!brand) redirect("/seller/register");

  const { count: garmentCount } = await supabase
    .from("brand_garments")
    .select("*", { count: "exact", head: true })
    .eq("brand_id", brand.id);

  // Try-on stats: count tryons that used brand garments
  const { count: tryonCount } = await supabase
    .from("brand_garments")
    .select("tryons(count)", { count: "exact", head: true })
    .eq("brand_id", brand.id);

  const stats = [
    { label: "Toplam Ürün", value: garmentCount ?? 0, icon: "👗", href: "/seller/garments" },
    { label: "Bu Ay Deneme", value: 0, icon: "✨", href: null },
    { label: "Aktif Embed", value: garmentCount ?? 0, icon: "🔗", href: "/seller/embed" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      {/* Seller Nav */}
      <nav className="sticky top-0 z-10 bg-[#0f0a1e]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-display font-bold text-white text-xl tracking-tight">e-cabin</a>
          <span className="px-2 py-0.5 text-xs bg-lavender-500/20 border border-lavender-500/30 text-lavender-400 rounded-full">Marka Paneli</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/seller/garments" className="text-sm font-medium text-white/50 hover:text-white transition">Ürünler</Link>
          <Link href="/seller/embed" className="text-sm font-medium text-white/50 hover:text-white transition">Embed Kodu</Link>
          <form action="/api/auth/signout" method="post">
            <button className="text-sm font-medium text-white/30 hover:text-white/60 transition">Çıkış</button>
          </form>
        </div>
      </nav>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 relative">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white">Hoş geldin, {brand.name} 👋</h1>
          <p className="text-white/40 mt-1 text-sm">{brand.website_url || "Web sitesi eklenmemiş"}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-display font-bold text-3xl text-white">{s.value}</div>
              <div className="text-white/40 text-sm mt-1">{s.label}</div>
              {s.href && (
                <Link href={s.href} className="text-xs text-lavender-400 hover:text-lavender-300 mt-2 block">
                  Görüntüle →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/seller/garments" className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/8 hover:border-lavender-500/30 transition group">
            <div className="w-11 h-11 bg-lavender-500/10 border border-lavender-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-lavender-500/20 transition">
              👗
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">Ürün Ekle / Yönet</h3>
              <p className="text-white/40 text-sm mt-0.5">Kataloğuna ürün görseli yükle, aktif/pasif yap.</p>
            </div>
          </Link>

          <Link href="/seller/embed" className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4 hover:bg-white/8 hover:border-lavender-500/30 transition group">
            <div className="w-11 h-11 bg-lavender-500/10 border border-lavender-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-lavender-500/20 transition">
              🔗
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">Embed Kodunu Al</h3>
              <p className="text-white/40 text-sm mt-0.5">Ürün sayfalarına "e-cabin ile dene" butonu ekle.</p>
            </div>
          </Link>
        </div>

        {/* Onboarding checklist */}
        {(garmentCount ?? 0) === 0 && (
          <div className="mt-6 bg-lavender-500/5 border border-lavender-500/20 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">🚀 Başlamak için 3 adım</h3>
            <div className="flex flex-col gap-3">
              {[
                { done: true, text: "Marka hesabı oluşturuldu" },
                { done: (garmentCount ?? 0) > 0, text: "İlk ürünü yükle", href: "/seller/garments" },
                { done: false, text: "Embed kodunu kopyala ve siteye ekle", href: "/seller/embed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${item.done ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/30"}`}>
                    {item.done ? "✓" : (i + 1)}
                  </div>
                  {item.href && !item.done ? (
                    <Link href={item.href} className="text-sm text-lavender-400 hover:text-lavender-300">{item.text} →</Link>
                  ) : (
                    <span className={`text-sm ${item.done ? "text-white/50 line-through" : "text-white/60"}`}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
