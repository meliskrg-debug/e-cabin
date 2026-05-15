import Link from "next/link";
import Image from "next/image";

const POSE_URL = "https://edvjerpjsivradrragij.supabase.co/storage/v1/object/public/avatars/2da17cb4-8237-4c7a-8c3e-a6294376259b/Gemini_Generated_Image_hwgh6hwgh6hwgh6h.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0a1e] text-white flex flex-col overflow-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-[#0f0a1e]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <span className="font-display font-bold text-white text-xl tracking-tight">e-cabin</span>
        <div className="flex gap-3">
          <Link href="/tryon" className="px-5 py-2 text-sm font-semibold bg-lavender-500 hover:bg-lavender-400 text-white rounded-xl transition">
            Başla
          </Link>
        </div>
      </nav>

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-lavender-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Başlık */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-lavender-500/10 border border-lavender-500/30 text-lavender-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 bg-lavender-400 rounded-full animate-pulse" />
            Yapay Zeka Destekli
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight">
            Sanal Deneme Kabinine
            <br />
            <span className="bg-gradient-to-r from-lavender-300 via-lavender-400 to-purple-400 bg-clip-text text-transparent">
              Hoşgeldin
            </span>
          </h1>
          <p className="text-white/40 mt-4 text-base max-w-md mx-auto">
            Avatarınla ya da kendi fotoğrafınla istediğin kıyafeti saniyeler içinde dene.
          </p>
        </div>

        {/* 2 Panel */}
        <div className="w-full max-w-3xl grid grid-cols-2 gap-4 items-stretch">

          {/* Sol — Kabin */}
          <div className="animate-fade-in-up flex flex-col items-center justify-center text-center gap-6 px-4" style={{ animationDelay: "0ms" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-lavender-500/20 blur-3xl rounded-full" />
              <div className="relative bg-white/5 border border-white/10 rounded-2xl px-6 py-8 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-lavender-500/20 border border-lavender-500/30 rounded-2xl flex items-center justify-center text-3xl">
                  🪞
                </div>
                <div>
                  <p className="text-lavender-300 text-xs font-semibold uppercase tracking-widest mb-1">e-cabin</p>
                  <h2 className="font-display font-bold text-white text-xl leading-tight">
                    Sanal<br />Deneme<br />Kabini
                  </h2>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-lavender-500/50 to-transparent" />
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { icon: "👗", label: "Elbise" },
                    { icon: "🧥", label: "Ceket" },
                    { icon: "👚", label: "Üst" },
                    { icon: "👟", label: "Ayakkabı" },
                    { icon: "👜", label: "Aksesuar" },
                    { icon: "🩱", label: "Etek" },
                  ].map((cat) => (
                    <Link
                      key={cat.label}
                      href="/tryon"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 hover:bg-lavender-500/20 hover:border-lavender-500/40 hover:text-lavender-300 transition"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </Link>
                  ))}
                </div>
                <p className="text-white/20 text-xs">
                  Kıyafeti giymeden önce nasıl durduğunu gör
                </p>
              </div>
            </div>

            <Link
              href="/tryon"
              className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition shadow-xl shadow-lavender-900/50"
            >
              Ücretsiz Başla ✨
            </Link>
            <Link href="/tryon" className="text-xs text-white/30 hover:text-white/60 transition">
              Zaten hesabın var mı? Giriş yap
            </Link>
          </div>

          {/* Sağ — Fotoğraf Yükle */}
          <div className="animate-fade-in-up bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col hover:border-lavender-500/40 transition" style={{ animationDelay: "200ms" }}>
            <div className="flex-1 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-purple-400/20 blur-2xl rounded-full" />
              <div className="absolute top-3 left-3 right-3 z-20">
                <p className="text-xs text-white/30">Fotoğrafın yeterli</p>
                <h3 className="font-display font-bold text-white text-base">Resmini Yükle, Dene</h3>
              </div>
              <Image
                src={POSE_URL}
                alt="Örnek poz"
                width={400}
                height={600}
                className="w-full h-auto object-contain relative z-10 opacity-80"
              />
              <div className="absolute bottom-3 left-3 right-3 z-20">
                <Link
                  href="/tryon"
                  className="block text-center py-2.5 text-sm font-semibold bg-white/5 border border-white/10 text-white/70 rounded-xl hover:bg-white/10 hover:text-white transition backdrop-blur-sm"
                >
                  Hemen Dene
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
