import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/nav";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: tryons }, { data: photos }] = await Promise.all([
    supabase.from("tryons").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("photos").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <Nav />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 relative flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display font-bold text-3xl text-white">Profilim</h1>
          <Link
            href="/tryon"
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition"
          >
            Yeni Dene
          </Link>
        </div>

        {/* Denemelerim */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="font-display font-bold text-white text-lg mb-4">Denemelerim</h2>
          {!tryons || tryons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-white/30">
              <span className="text-5xl">👗</span>
              <p className="text-sm text-white/50">Henüz deneme yok</p>
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
                      alt="Deneme sonucu"
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-white/30">{new Date(tryon.created_at).toLocaleDateString("tr-TR")}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Kayıtlı Fotoğraflar */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="font-display font-bold text-white text-lg mb-4">Kayıtlı Fotoğraflar</h2>
          {!photos || photos.length === 0 ? (
            <div className="py-10 text-center text-white/30 text-sm">
              Dene sayfasından fotoğraf yüklediğinde buraya kaydedilir.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {photos.map((p) => (
                <div key={p.id} className="rounded-2xl overflow-hidden border border-white/10">
                  <Image src={p.photo_url} alt="" width={200} height={300} className="w-full h-auto object-contain bg-white/5" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
