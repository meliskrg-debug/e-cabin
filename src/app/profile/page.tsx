import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import ProfileActions from "./profile-actions";
import AvatarBackButton from "./avatar-back-button";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: avatars }, { data: photos }] = await Promise.all([
    supabase.from("avatars").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    supabase.from("photos").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
  ]);

  const active = avatars?.find((a) => a.is_active);

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <Nav />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 relative">
        <h1 className="font-display font-bold text-3xl text-white mb-8">Profilim</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Active Avatar */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <h2 className="font-display font-bold text-white text-lg">Aktif Avatar</h2>
            {active ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-white/30 font-medium mb-1 text-center">Önden</p>
                    <div className="rounded-2xl overflow-hidden bg-white/5">
                      <Image src={active.avatar_url} alt="Avatar ön görünüm" width={600} height={900} className="w-full h-auto object-contain" priority />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/30 font-medium mb-1 text-center">Arkadan</p>
                    <AvatarBackButton avatarId={active.id} backUrl={active.avatar_back_url ?? null} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Boy", value: active.height_cm, unit: "cm" },
                    { label: "Kilo", value: active.weight_kg, unit: "kg" },
                    { label: "Göğüs", value: active.bust_cm, unit: "cm" },
                    { label: "Bel", value: active.waist_cm, unit: "cm" },
                    { label: "Kalça", value: active.hips_cm, unit: "cm" },
                  ].filter((m) => m.value).map((m) => (
                    <div key={m.label} className="bg-white/5 rounded-xl px-3 py-2 flex justify-between items-center">
                      <span className="text-xs text-white/40 font-medium">{m.label}</span>
                      <span className="text-sm font-bold text-lavender-300">{m.value}{m.unit}</span>
                    </div>
                  ))}
                </div>
                {active.extra_notes && <p className="text-xs text-white/30 italic">{active.extra_notes}</p>}
                <Link href="/onboarding" className="text-center py-2.5 text-sm font-medium bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition">
                  Yeni Avatar Oluştur
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-10 text-white/30">
                <span className="text-5xl">🧬</span>
                <span className="text-sm">Henüz avatar yok</span>
                <Link href="/onboarding" className="px-6 py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition">
                  Avatar Oluştur
                </Link>
              </div>
            )}
          </div>

          {/* Past Avatars */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <h2 className="font-display font-bold text-white text-lg">Geçmiş Avatarlar</h2>
            {!avatars || avatars.length <= 1 ? (
              <p className="text-sm text-white/30 py-4 text-center">Henüz başka avatar yok.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {avatars.map((a) => (
                  <ProfileActions key={a.id} type="avatar" avatarId={a.id} isActive={a.is_active}>
                    <div className={`relative rounded-2xl overflow-hidden border-2 transition ${a.is_active ? "border-lavender-500" : "border-white/10"}`}>
                      <Image src={a.avatar_url} alt="Avatar" width={300} height={450} className="w-full h-auto object-contain bg-white/5" />
                      {a.is_active && (
                        <div className="absolute top-2 right-2 bg-lavender-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Aktif</div>
                      )}
                    </div>
                  </ProfileActions>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Saved Photos */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-white text-lg">Kayıtlı Fotoğraflar</h2>
            <ProfileActions type="upload" />
          </div>
          {!photos || photos.length === 0 ? (
            <div className="py-10 text-center text-white/30 text-sm">
              Kayıtlı fotoğraf yok. Try-on yaparken yüklediğin fotoğraflar buraya kaydedilir.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {photos.map((p) => (
                <ProfileActions key={p.id} type="photo" photoId={p.id}>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10">
                    <Image src={p.photo_url} alt="" width={200} height={300} className="w-full h-auto object-contain bg-white/5" />
                  </div>
                </ProfileActions>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
