import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Nav from "@/components/nav";

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tryons } = await supabase
    .from("tryons").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <Nav />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 relative">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl text-white">Geçmiş Denemeler</h1>
          <Link
            href="/tryon"
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition"
          >
            Yeni Dene
          </Link>
        </div>

        {!tryons || tryons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-white/30">
            <span className="text-6xl">👗</span>
            <p className="font-medium text-white/50">Henüz deneme yok</p>
            <Link href="/tryon" className="mt-2 px-6 py-3 text-sm font-semibold bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 transition">
              İlk denemeyi yap
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tryons.map((tryon) => (
              <a
                key={tryon.id}
                href={tryon.result_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-lavender-500/40 transition"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={tryon.result_image_url}
                    alt="Try-on result"
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-lavender-400">{tryon.source_type === "avatar" ? "Avatar" : "Fotoğraf"}</p>
                  <p className="text-xs text-white/30 mt-0.5">{new Date(tryon.created_at).toLocaleDateString("tr-TR")}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
