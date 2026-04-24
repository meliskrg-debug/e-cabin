# CLAUDE.md — Sanal Kıyafet Deneme Uygulaması

> Bu dosya **Claude Code'un ana yönerge dosyasıdır**. Claude Code bu projede çalıştığında bu dosyayı **en baştan sona okumak zorundadır**. Tüm mimari kararlar, API anahtarları, sistem promptları ve adım adım kurulum talimatları burada yer alır.

---

## 🎯 PROJE ÖZETİ

Kullanıcıların kendi **dijital avatarını** oluşturup, üzerine farklı **kıyafetleri sanal olarak deneyebildiği** bir web uygulaması.

**Teknoloji Yığını:**
- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend:** Next.js API Routes (serverless)
- **Veritabanı + Auth + Storage:** Supabase (MCP ile bağlanacak)
- **Görsel AI:** Nano Banana 2 (`gemini-3.1-flash-image-preview`) — Google Gemini API
- **Renk teması:** Açık mor / lavanta tonları (şık, minimal, modern)

**Ana Akış:**
1. Kullanıcı kayıt olur (Supabase Auth)
2. Avatar oluşturur → 2 yüz fotoğrafı + 1 boy fotoğrafı + ölçüler → Nano Banana 2 → avatar kaydedilir
3. Kıyafet dener → kıyafet fotoğrafı yükler → "avatarla dene" ya da "galeriden başka fotoğraf kullan" → Nano Banana 2 → sonuç gösterilir

---

## 📌 CLAUDE CODE İÇİN TEMEL KURALLAR

**Claude, aşağıdaki kuralları asla unutma:**

1. **Kullanıcı sıfırdan başlıyor, hiçbir şey bilmiyor.** Her komutu tek tek açıkla, çalıştırması için hazır ver.
2. **API anahtarı almak için adım adım rehberlik et.** Aşağıdaki "KURULUM" bölümünü sırayla takip ettir.
3. **Sistem promptları SABİT, kod içinde tanımlı olmalı.** Kullanıcı değiştirmeyecek. Değişkenler `${değişken}` şeklinde enjekte edilecek.
4. **İki ayrı sistem promptu var:** Biri avatar oluşturma için (`AVATAR_SYSTEM_PROMPT`), biri kıyafet deneme için (`TRYON_SYSTEM_PROMPT`). Aşağıda aynen verilmiştir.
5. **Nano Banana 2 model adı:** `gemini-3.1-flash-image-preview` (başka model kullanma).
6. **Tüm gizli anahtarlar `.env.local`'de tutulur.** Asla koda gömülmez, asla git'e push'lanmaz.
7. **Supabase MCP bağlıdır.** Tablo oluşturmak, şema sorgulamak için MCP araçlarını kullan — elle SQL yazma.
8. **Renk paleti açık mor / lavanta.** Aşağıdaki `TASARIM` bölümüne bak.
9. Her önemli adımın sonunda kullanıcıya **"şimdi şunu çalıştır / test et"** diye doğrulama yaptır.

---

## 🚀 KURULUM — KULLANICIYA ADIM ADIM ANLATILACAK

> **Claude Code: Bu bölümdeki her adımı kullanıcıya TEK TEK sor ve tamamlandığını doğrulat. Atla geçme.**

### ADIM 1 — Gemini (Nano Banana 2) API Anahtarını Al

1. Tarayıcıdan **https://aistudio.google.com/apikey** adresine git.
2. Google hesabınla giriş yap.
3. **"Create API key"** butonuna tıkla.
4. Mevcut bir Google Cloud projesi seç veya yeni bir tane oluştur.
5. **ÖNEMLİ:** Nano Banana 2 modeli ücretli bir API anahtarı gerektirir. "Set up Billing" adımını tamamla (kredi kartı gerekir).
6. Oluşan anahtarı kopyala — bu `GEMINI_API_KEY` olacak.
7. Anahtarı güvenli bir yere not al, kimseyle paylaşma.

**Doğrulama:** Kullanıcıdan "API anahtarımı aldım" onayını al, sonra devam et.

### ADIM 2 — Supabase Projesi Oluştur

1. **https://supabase.com** adresine git, "Start your project" de.
2. GitHub ile giriş yap (en kolayı).
3. **"New Project"** → Organization seç → proje adı: `virtual-tryon` → güçlü bir database şifresi belirle (kaydet!) → region: `Central EU (Frankfurt)` (Türkiye'ye en yakın).
4. Proje oluşunca sol menüden **Project Settings → API** sekmesine git. Şu 2 değeri kopyala:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ bu gizli, asla frontend'e koyma)
5. **Project Settings → General** sekmesinden **Project Reference ID**'yi kopyala (MCP için lazım).

**Doğrulama:** 4 değer de (URL, anon key, service role key, project ref) elinde mi?

### ADIM 3 — Supabase Kişisel Erişim Belirteci (MCP için)

1. **https://supabase.com/dashboard/account/tokens** sayfasına git.
2. **"Generate new token"** → isim: `claude-code-mcp` → oluştur.
3. Çıkan token'ı kopyala → `SUPABASE_ACCESS_TOKEN` olarak sakla.

### ADIM 4 — Supabase MCP'yi Claude Code'a Bağla

Proje dizininde terminal aç ve şunu çalıştır:

```bash
claude mcp add --transport http supabase \
  "https://mcp.supabase.com/mcp?project_ref=SENİN_PROJECT_REF_ID&read_only=false" \
  --header "Authorization: Bearer SENİN_SUPABASE_ACCESS_TOKEN"
```

> `SENİN_PROJECT_REF_ID` ve `SENİN_SUPABASE_ACCESS_TOKEN` yerlerini gerçek değerlerinle değiştir.

Sonra Claude Code'u yeniden başlat ve `/mcp` yazarak Supabase'in bağlandığını doğrula.

### ADIM 5 — Proje Kurulumu

```bash
npx create-next-app@latest virtual-tryon --typescript --tailwind --app --src-dir --import-alias "@/*"
cd virtual-tryon
npm install @supabase/supabase-js @supabase/ssr @google/genai zod react-hook-form @hookform/resolvers
npx shadcn@latest init
npx shadcn@latest add button input label card toast dialog avatar form textarea progress
```

### ADIM 6 — `.env.local` Dosyası

Proje kökünde `.env.local` oluştur, içine:

```env
# Gemini (Nano Banana 2)
GEMINI_API_KEY=buraya_gemini_anahtarın

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

`.gitignore`'da `.env.local` olduğunu doğrula (zaten Next.js bunu ekliyor).

---

## 🗄️ VERİTABANI ŞEMASI

> **Claude Code: Aşağıdaki şemayı Supabase MCP kullanarak oluştur.** Tek tek `execute_sql` ile veya migration olarak uygula.

### Tablolar

**`profiles`** — Kullanıcı profili (auth.users ile 1-1 ilişkili)
```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Kullanıcı kendi profilini görebilir" on public.profiles
  for select using (auth.uid() = id);
create policy "Kullanıcı kendi profilini güncelleyebilir" on public.profiles
  for update using (auth.uid() = id);
```

**`avatars`** — Oluşturulmuş dijital avatarlar
```sql
create table public.avatars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  avatar_url text not null,           -- Supabase Storage public URL
  height_cm int,
  bust_cm int,
  waist_cm int,
  hips_cm int,
  extra_notes text,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.avatars enable row level security;

create policy "Kullanıcı kendi avatarlarını görebilir" on public.avatars
  for all using (auth.uid() = user_id);
```

**`tryons`** — Deneme sonuçları
```sql
create table public.tryons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  avatar_id uuid references public.avatars(id) on delete set null,
  source_type text not null check (source_type in ('avatar','gallery')),
  source_image_url text not null,     -- avatar veya galeri görseli
  garment_image_url text not null,    -- kıyafet görseli
  result_image_url text not null,     -- sonuç görseli
  created_at timestamptz default now()
);
alter table public.tryons enable row level security;

create policy "Kullanıcı kendi denemelerini görebilir" on public.tryons
  for all using (auth.uid() = user_id);
```

### Storage Bucket'ları

Supabase MCP ile aşağıdakileri oluştur:

1. **`user-uploads`** (private) — Kullanıcının yüklediği orijinal fotoğraflar (yüz, boy, kıyafet).
2. **`avatars`** (public) — Üretilen avatarlar.
3. **`tryons`** (public) — Deneme sonuç görselleri.

Her bucket için RLS policy: kullanıcı sadece kendi klasörüne (`/{user_id}/...`) yazabilsin, okuyabilsin.

### Profil Tetikleyicisi

```sql
-- Yeni kullanıcı kayıt olduğunda profiles tablosuna satır ekle
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();
```

---

## 🧠 SİSTEM PROMPTLARI — SABİT, KODA GÖMÜLÜ

> **Claude Code: Bu iki promptu `src/lib/prompts.ts` dosyasına aynen yerleştir. Kullanıcıdan gelen bilgiler `${...}` ile enjekte edilecek. Promptları kullanıcı değiştirmeyecek.**

### 1) AVATAR_SYSTEM_PROMPT — Dijital Avatar Oluşturma

```ts
// src/lib/prompts.ts

export const AVATAR_SYSTEM_PROMPT = ({
  heightCm,
  bustCm,
  waistCm,
  hipsCm,
  extraNotes,
}: {
  heightCm?: number;
  bustCm?: number;
  waistCm?: number;
  hipsCm?: number;
  extraNotes?: string;
}) => `You are a professional digital avatar generator. Your task is to create ONE photorealistic, full-body digital avatar of a single person based on the reference images provided.

STRICT REQUIREMENTS:
- Preserve the EXACT facial identity from the face reference photos (same eyes, nose, mouth shape, skin tone, hair color and style). Subject consistency is critical.
- Use the full-body reference photo to understand posture and overall body type.
- The avatar must be a clean, front-facing, full-body shot from head to toe, standing in a natural relaxed pose, arms slightly away from the body.
- Background: solid soft neutral studio backdrop (very light warm gray, #F5F3F0). No shadows on the floor, no props, no text.
- Lighting: soft, even, diffused studio lighting. No harsh shadows on the face.
- Clothing: neutral, form-fitting base outfit — plain light gray fitted t-shirt and plain mid-gray fitted shorts/leggings — so the body silhouette is visible for later virtual try-on. Do NOT add patterns, logos, or accessories.
- Camera: full-body framing, eye-level, 50mm lens feel, photorealistic, sharp focus on the person.
- Output: a single photorealistic image. No collage, no multiple views, no text overlays.

BODY MEASUREMENTS (use these to shape the body proportions accurately):
- Height: ${heightCm ? `${heightCm} cm` : "not specified — infer from reference"}
- Bust: ${bustCm ? `${bustCm} cm` : "not specified — infer from reference"}
- Waist: ${waistCm ? `${waistCm} cm` : "not specified — infer from reference"}
- Hips: ${hipsCm ? `${hipsCm} cm` : "not specified — infer from reference"}
- Additional notes from user: ${extraNotes?.trim() || "none"}

Generate the avatar now.`;
```

### 2) TRYON_SYSTEM_PROMPT — Sanal Kıyafet Deneme

```ts
export const TRYON_SYSTEM_PROMPT = () =>
`You are a professional virtual try-on image generator. You will receive TWO reference images:
1) PERSON IMAGE — a photo of a person (this may be a generated digital avatar OR a real user photo). Preserve this person's face, body, pose, skin tone, and hair EXACTLY.
2) GARMENT IMAGE — a photo of a clothing item/accessory (may be on a hanger, flat-lay, mannequin, or worn by a model).

TASK:
Dress the person from image 1 in the garment from image 2 as realistically as possible, as if they are wearing it in a photoshoot.

STRICT REQUIREMENTS:
- Keep the person's identity 100% intact: face, hair, skin tone, body proportions, pose — DO NOT modify them.
- Transfer the garment's color, pattern, texture, fabric, cut, and all design details (buttons, zippers, prints, logos) accurately onto the person.
- Respect the garment's real-world fit: drape, wrinkles, how fabric falls on the body, natural shadows where the fabric folds.
- If the garment covers an area already covered by other clothing in the person image, replace that area naturally. Leave uncovered body parts (skin, other existing clothing not overlapped) exactly as they were.
- Lighting and shadows on the garment must match the lighting direction in the person image.
- Background: keep the ORIGINAL background from the person image unchanged.
- Output: a single photorealistic image, same framing and aspect ratio as the person image. No text, no watermarks, no collages, no before/after splits.

Generate the try-on result now.`;
```

---

## 🔌 NANO BANANA 2 ENTEGRASYONU

> **Claude Code: Tüm Gemini çağrıları SUNUCU TARAFINDA (API Route) yapılır. Asla frontend'den anahtar ifşa etme.**

### SDK Kurulumu
```bash
npm install @google/genai
```

### Yardımcı: `src/lib/nanobanana.ts`

```ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = "gemini-3.1-flash-image-preview";

export async function generateImage({
  prompt,
  referenceImages, // [{ mimeType, data (base64) }]
}: {
  prompt: string;
  referenceImages: { mimeType: string; data: string }[];
}): Promise<{ mimeType: string; data: string }> {
  const parts: any[] = [
    ...referenceImages.map((img) => ({
      inlineData: { mimeType: img.mimeType, data: img.data },
    })),
    { text: prompt },
  ];

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
  });

  const candidates = response.candidates || [];
  for (const cand of candidates) {
    for (const part of cand.content?.parts || []) {
      if (part.inlineData?.data) {
        return {
          mimeType: part.inlineData.mimeType || "image/png",
          data: part.inlineData.data,
        };
      }
    }
  }
  throw new Error("Nano Banana 2 returned no image.");
}
```

### API Route — Avatar Oluştur (`src/app/api/avatar/create/route.ts`)

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateImage } from "@/lib/nanobanana";
import { AVATAR_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const face1 = form.get("face1") as File;
  const face2 = form.get("face2") as File;
  const body  = form.get("body")  as File;
  const heightCm = Number(form.get("heightCm")) || undefined;
  const bustCm   = Number(form.get("bustCm"))   || undefined;
  const waistCm  = Number(form.get("waistCm"))  || undefined;
  const hipsCm   = Number(form.get("hipsCm"))   || undefined;
  const extraNotes = (form.get("extraNotes") as string) || "";

  const toRef = async (f: File) => ({
    mimeType: f.type,
    data: Buffer.from(await f.arrayBuffer()).toString("base64"),
  });

  const prompt = AVATAR_SYSTEM_PROMPT({ heightCm, bustCm, waistCm, hipsCm, extraNotes });
  const image = await generateImage({
    prompt,
    referenceImages: [await toRef(face1), await toRef(face2), await toRef(body)],
  });

  // Storage'a yükle
  const path = `${user.id}/avatar-${Date.now()}.png`;
  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, Buffer.from(image.data, "base64"), { contentType: image.mimeType, upsert: false });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

  // DB kaydı
  await supabase.from("avatars").update({ is_active: false }).eq("user_id", user.id);
  const { data: row, error } = await supabase.from("avatars").insert({
    user_id: user.id,
    avatar_url: publicUrl,
    height_cm: heightCm, bust_cm: bustCm, waist_cm: waistCm, hips_cm: hipsCm,
    extra_notes: extraNotes, is_active: true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ avatar: row });
}
```

### API Route — Kıyafet Dene (`src/app/api/tryon/route.ts`)

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateImage } from "@/lib/nanobanana";
import { TRYON_SYSTEM_PROMPT } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const sourceType = form.get("sourceType") as "avatar" | "gallery";
  const garment = form.get("garment") as File;

  // KAYNAK GÖRSELİ (avatar VEYA galeri)
  let sourceRef: { mimeType: string; data: string };
  let sourceImageUrl: string;

  if (sourceType === "avatar") {
    const { data: active } = await supabase
      .from("avatars").select("*").eq("user_id", user.id).eq("is_active", true).single();
    if (!active) return NextResponse.json({ error: "no active avatar" }, { status: 400 });

    const res = await fetch(active.avatar_url);
    const buf = Buffer.from(await res.arrayBuffer());
    sourceRef = { mimeType: "image/png", data: buf.toString("base64") };
    sourceImageUrl = active.avatar_url;
  } else {
    const galleryFile = form.get("galleryImage") as File;
    const buf = Buffer.from(await galleryFile.arrayBuffer());
    sourceRef = { mimeType: galleryFile.type, data: buf.toString("base64") };
    // Orijinal galeri görselini de sakla
    const gpath = `${user.id}/src-${Date.now()}.png`;
    await supabase.storage.from("user-uploads").upload(gpath, buf, { contentType: galleryFile.type });
    const { data: { publicUrl } } = supabase.storage.from("user-uploads").getPublicUrl(gpath);
    sourceImageUrl = publicUrl;
  }

  const garmentBuf = Buffer.from(await garment.arrayBuffer());
  const garmentRef = { mimeType: garment.type, data: garmentBuf.toString("base64") };

  // Kıyafeti sakla
  const gpath = `${user.id}/garment-${Date.now()}.png`;
  await supabase.storage.from("user-uploads").upload(gpath, garmentBuf, { contentType: garment.type });
  const { data: { publicUrl: garmentUrl } } = supabase.storage.from("user-uploads").getPublicUrl(gpath);

  // ÜRET
  const result = await generateImage({
    prompt: TRYON_SYSTEM_PROMPT(),
    referenceImages: [sourceRef, garmentRef],
  });

  const rpath = `${user.id}/tryon-${Date.now()}.png`;
  await supabase.storage.from("tryons").upload(rpath, Buffer.from(result.data, "base64"), { contentType: result.mimeType });
  const { data: { publicUrl: resultUrl } } = supabase.storage.from("tryons").getPublicUrl(rpath);

  const { data: row } = await supabase.from("tryons").insert({
    user_id: user.id,
    source_type: sourceType,
    source_image_url: sourceImageUrl,
    garment_image_url: garmentUrl,
    result_image_url: resultUrl,
  }).select().single();

  return NextResponse.json({ tryon: row });
}
```

---

## 🎨 TASARIM — Açık Mor / Lavanta Teması

> **Claude Code: shadcn/ui temasını bu paletle özelleştir. Tüm ekranlarda tutarlı kullan.**

### Renk Paleti (Tailwind config'e eklenecek)

`tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      lavender: {
        50:  "#FAF7FF",
        100: "#F3ECFF",
        200: "#E6D7FF",
        300: "#D1B8FF",
        400: "#B794F4",
        500: "#9F7AEA",
        600: "#805AD5",
        700: "#6B46C1",
        800: "#553C9A",
        900: "#44337A",
      },
      cream: "#FDFCFF",
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      display: ["'Plus Jakarta Sans'", "Inter", "sans-serif"],
    },
  },
},
```

### Tasarım İlkeleri
- **Arka plan:** `bg-lavender-50` veya `bg-cream`
- **Kartlar:** `bg-white` + `shadow-lg shadow-lavender-200/50` + `rounded-2xl`
- **Birincil buton:** `bg-gradient-to-r from-lavender-500 to-lavender-600 text-white hover:from-lavender-600 hover:to-lavender-700`
- **İkincil buton:** `bg-lavender-100 text-lavender-700 hover:bg-lavender-200`
- **Başlıklar:** `font-display font-bold text-lavender-900`
- **Yumuşak köşeler her yerde** (`rounded-2xl`, `rounded-3xl`)
- **Fotoğraf önizlemelerinde** `aspect-[3/4]` ve `rounded-2xl overflow-hidden`
- **Yükleme:** gradient `Progress` bar + "Avatarın hazırlanıyor..." gibi samimi mesajlar
- **Boşluk:** bol bol — `p-8`, `gap-6`, nefes alsın
- **Üst navigasyon:** sticky, yarı saydam (`bg-white/70 backdrop-blur-md`), alt kenarda `border-lavender-100`

### Sayfa Yapısı
```
/                → Landing (hero + CTA "Hemen başla")
/login           → Giriş
/signup          → Kayıt
/onboarding      → Avatar oluşturma sihirbazı (3 adım)
/dashboard       → Avatar önizlemesi + hızlı erişim kartları
/tryon           → Kıyafet deneme ekranı
/tryon/history   → Geçmiş denemeler (grid, tıklanınca büyür)
```

---

## 📁 DOSYA YAPISI — ÖNERİLEN

```
virtual-tryon/
├─ CLAUDE.md                           ← bu dosya
├─ .env.local                          ← gizli anahtarlar
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx                      ← landing
│  │  ├─ login/page.tsx
│  │  ├─ signup/page.tsx
│  │  ├─ onboarding/page.tsx           ← 3 adımlı avatar sihirbazı
│  │  ├─ dashboard/page.tsx
│  │  ├─ tryon/page.tsx
│  │  ├─ tryon/history/page.tsx
│  │  └─ api/
│  │     ├─ avatar/create/route.ts
│  │     └─ tryon/route.ts
│  ├─ lib/
│  │  ├─ prompts.ts                    ← SİSTEM PROMPTLARI
│  │  ├─ nanobanana.ts                 ← Gemini wrapper
│  │  └─ supabase/
│  │     ├─ client.ts                  ← browser client
│  │     ├─ server.ts                  ← server client (cookies)
│  │     └─ middleware.ts              ← session refresh
│  ├─ components/
│  │  ├─ ui/                           ← shadcn
│  │  ├─ avatar-wizard.tsx
│  │  ├─ tryon-panel.tsx
│  │  ├─ image-uploader.tsx
│  │  └─ nav.tsx
│  └─ middleware.ts                    ← auth guard
└─ tailwind.config.ts
```

---

## 🧭 CLAUDE CODE İÇİN UYGULAMA SIRASI

> **Claude, projeyi BU SIRAYLA kur. Her adımın sonunda kullanıcıdan onay al.**

1. ✅ **Kurulum adımları** (yukarıdaki ADIM 1–6). Kullanıcının tüm anahtarları aldığını doğrula.
2. ✅ **Supabase şemasını** MCP ile oluştur (tablolar + RLS + trigger + 3 storage bucket).
3. ✅ **`src/lib/supabase/*`** dosyalarını oluştur (SSR client, middleware).
4. ✅ **`src/middleware.ts`** — oturum yoksa `/login`'e yönlendir (public: `/`, `/login`, `/signup`).
5. ✅ **Auth sayfaları** (`/login`, `/signup`) — email + şifre ile, lavanta temalı.
6. ✅ **`src/lib/prompts.ts`** — iki sistem promptu (yukarıdan kopyala).
7. ✅ **`src/lib/nanobanana.ts`** — Gemini wrapper.
8. ✅ **`/api/avatar/create`** API route.
9. ✅ **`/onboarding`** sayfası — 3 adım: (a) 2 yüz fotoğrafı, (b) 1 boy fotoğrafı, (c) ölçüler formu (hepsi opsiyonel). Progress bar + yumuşak animasyonlar.
10. ✅ **`/dashboard`** — aktif avatarı göster, "kıyafet dene" butonu.
11. ✅ **`/api/tryon`** API route.
12. ✅ **`/tryon`** sayfası — sol: kaynak seçimi (avatar veya galeri yükle), sağ: kıyafet yükle, altta "dene" butonu. Sonuç üstte büyük gösterilir.
13. ✅ **`/tryon/history`** — grid ile geçmiş denemeler.
14. ✅ **Landing (`/`)** — hero + iki ürün özelliği kartı + CTA.
15. ✅ **Son kontrol** — tüm akışı uçtan uca test et (kayıt → avatar → deneme).

---

## ⚠️ GÜVENLİK & İYİ PRATİKLER

- `GEMINI_API_KEY` ve `SUPABASE_SERVICE_ROLE_KEY` **sadece sunucu tarafında** (`app/api/*`) kullanılır.
- Tüm kullanıcı içerikli tablolarda **RLS açık** olmalı.
- Storage bucket'larında yazma yolu **kullanıcı ID'sine kilitli** olmalı (`{user_id}/...`).
- Fotoğraf yüklemelerinde maksimum boyut (ör. 8 MB) ve `image/*` MIME kontrolü yap.
- Rate limit: kullanıcı başına günde X avatar / Y deneme sınırı koy (ilerleyen aşamada).
- Hata mesajlarını kullanıcıya sade göster, sunucu logunda detay tut.
- **MCP'yi production'a bağlama** — sadece geliştirme projesiyle çalıştır.

---

## 🧪 TEST ADIMLARI

Geliştirme bitince kullanıcıya şu akışı yaptır:

1. `npm run dev` → `http://localhost:3000` aç.
2. `/signup` — yeni hesap oluştur.
3. Yönlendirme ile `/onboarding` — 2 yüz + 1 boy fotoğrafı yükle, ölçüleri gir, "Avatarımı oluştur" de. Yaklaşık 10–20 sn bekle.
4. Avatar göründü mü? ✅
5. `/tryon` — kıyafet fotoğrafı yükle → "Avatarımla dene" seç → sonuç geldi mi?
6. Aynı kıyafetle "Galeriden fotoğraf" seçeneğini dene → farklı bir kişi fotoğrafıyla çalışıyor mu?
7. `/tryon/history` — kayıtlar görünüyor mu?

Hata olursa konsolu ve Supabase loglarını birlikte incele.

---

**Son not (Claude Code'a):** Bu dosya projenin **tek doğru kaynağı**dır. Herhangi bir çelişki durumunda bu dosya geçerlidir. Kod yazarken her zaman buradaki sistem promptlarını ve renk paletini kullan, kullanıcıya adım adım ve sabırla rehberlik et.
