import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white flex flex-col overflow-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-[#0f0a1e]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <span className="font-display font-bold text-white text-xl tracking-tight">e-cabin</span>
        <div className="flex items-center gap-3">
          <Link
            href="/seller/login"
            className="px-4 py-2 text-sm font-semibold text-white/60 hover:text-white transition"
          >
            Giriş Yap
          </Link>
          <Link
            href="/seller/register"
            className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 hover:from-lavender-400 hover:to-purple-400 text-white rounded-xl transition"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </nav>

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-lavender-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 relative">
        <div className="inline-flex items-center gap-2 bg-lavender-500/10 border border-lavender-500/30 text-lavender-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 bg-lavender-400 rounded-full animate-pulse" />
          Yapay Zeka Destekli Sanal Deneme
        </div>
        <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight max-w-3xl">
          Müşterilerin kıyafeti{" "}
          <span className="bg-gradient-to-r from-lavender-300 via-lavender-400 to-purple-400 bg-clip-text text-transparent">
            giymeden
          </span>{" "}
          satın alsın
        </h1>
        <p className="text-white/40 mt-5 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Mağazana tek satır kod ekle, müşterilerin e-cabin ile saniyeler içinde kıyafeti
          üzerinde görsün. İade oranını düşür, satışı artır.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/seller/register"
            className="px-8 py-3.5 font-semibold text-base bg-gradient-to-r from-lavender-500 to-purple-500 hover:from-lavender-400 hover:to-purple-400 text-white rounded-2xl transition shadow-xl shadow-lavender-900/50"
          >
            Ücretsiz Başla →
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 font-semibold text-base bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white rounded-2xl transition"
          >
            Nasıl çalışır?
          </a>
        </div>
        <p className="mt-4 text-xs text-white/20">Kredi kartı gerekmez. 5 dakikada kurulum.</p>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-16 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lavender-400 text-xs font-semibold uppercase tracking-widest mb-2">Nasıl Çalışır?</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">3 adımda canlıya al</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "01",
                icon: "📦",
                title: "Ürünlerini ekle",
                desc: "Shopify mağazanı bağla veya ürün görsellerini yükle. 5 dakika sürer.",
              },
              {
                num: "02",
                icon: "⚡",
                title: "Kodu yapıştır",
                desc: "Sana özel 1 satır script kodunu Shopify temanıza ekle. Geliştirici gerekmez.",
              },
              {
                num: "03",
                icon: "✨",
                title: "Müşterilerin dener",
                desc: "Alışverişçiler ürün sayfasında butonu görür, fotoğraf yükler, kıyafeti üzerinde görür.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative bg-white/5 border border-white/10 rounded-3xl p-7 hover:border-lavender-500/30 transition"
              >
                <div className="absolute top-5 right-6 font-display font-bold text-5xl text-lavender-500/10 select-none leading-none">
                  {step.num}
                </div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lavender-400 text-xs font-semibold uppercase tracking-widest mb-2">Özellikler</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">Neden e-cabin?</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: "🪟",
                title: "Web sitenden çıkmadan",
                desc: "Müşteri sayfayı terk etmez. Buton tıklanınca yan panel açılır, deneme biter, alışverişe devam eder.",
              },
              {
                icon: "🤖",
                title: "Yapay zeka destekli",
                desc: "Gerçekçi kıyafet deneme görseli saniyeler içinde üretilir. Renk, desen ve kumaş dokusu korunur.",
              },
              {
                icon: "🔧",
                title: "Kurulum 5 dakika",
                desc: "Shopify uyumlu, 1 satır kod. Teknik bilgi gerekmez, geliştirici tutmana gerek yok.",
              },
              {
                icon: "👗",
                title: "Her kıyafet çalışır",
                desc: "Elbise, ceket, üst, aksesuar — katalogdaki her ürünü ekleyebilirsin. Sınır yok.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 rounded-3xl p-7 hover:border-lavender-500/30 transition flex gap-5"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-lavender-500/10 border border-lavender-500/20 rounded-2xl flex items-center justify-center text-2xl">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base mb-1">{f.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 py-16 relative">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-lavender-500/20 to-purple-500/10 border border-lavender-500/30 rounded-3xl p-12 text-center">
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-lavender-500/5 blur-xl" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-3 relative">
            Markana e-cabin&apos;i ücretsiz ekle
          </h2>
          <p className="text-white/40 mb-8 relative">
            Kredi kartı gerekmez. 5 dakikada kurulum.
          </p>
          <Link
            href="/seller/register"
            className="inline-block px-10 py-4 font-semibold text-base bg-gradient-to-r from-lavender-500 to-purple-500 hover:from-lavender-400 hover:to-purple-400 text-white rounded-2xl transition shadow-xl shadow-lavender-900/50 relative"
          >
            Ücretsiz Başla →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
        <span>e-cabin © 2025</span>
        <div className="flex items-center gap-6">
          <span className="hover:text-white/40 transition cursor-pointer">Gizlilik</span>
          <Link href="/seller/login" className="hover:text-white/40 transition">
            Marka Girişi →
          </Link>
        </div>
      </footer>
    </div>
  );
}
