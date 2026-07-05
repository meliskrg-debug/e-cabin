# e-cabin — Proje Devir Belgesi

> Hazırlanma tarihi: 2026-06-29  
> Teslim eden: Melis Karaağaç (meliskrg@gmail.com)  
> GitHub: git@github.com:meliskrg-debug/e-cabin.git  
> Production: https://e-cabin.vercel.app

---

## 1. Projeye Genel Bakış

e-cabin, **moda e-ticaret markalarına** yönelik bir B2B SaaS platformudur.  
Markalar, ürün sayfalarına tek satır JavaScript kodu ekleyerek müşterilerine **yapay zeka destekli sanal deneme kabini** sunar. Müşteri kendi fotoğrafını yükler, yapay zeka kıyafeti üzerinde gösterir.

### İki Ayrı Kullanıcı Grubu

| Grup | Açıklama | Giriş |
|---|---|---|
| **Son kullanıcılar** | Müşteriler, `/embed` iframe'i üzerinden kıyafet dener | Giriş gerektirmez (anonim da çalışır) |
| **Marka sahipleri** | Seller panelden ürün yükler, embed kodu alır | `/seller/login` (e-posta + şifre) |

---

## 2. Teknoloji Yığını

| Katman | Teknoloji | Versiyon |
|---|---|---|
| Framework | Next.js App Router | 14.x |
| Dil | TypeScript | 5.x |
| CSS | TailwindCSS | 4.x (CSS-first config, `@theme` block) |
| Bileşenler | shadcn/ui (radix-ui tabanlı) | — |
| Auth + DB + Storage | Supabase | JS SDK 2.x |
| Yapay Zeka | Google GenAI (Gemini) | `@google/genai` 1.x |
| Model | `gemini-3.1-flash-image-preview` | — |
| Deployment | Vercel | Hobby plan |
| Repo | GitHub (SSH auth) | — |

### Önemli Paketler

```
@google/genai        → Gemini (Nano Banana 2) entegrasyonu
@supabase/ssr        → Server-side Supabase client (SSR uyumlu)
@supabase/supabase-js → Supabase JS client
replicate            → (kurulu ama aktif değil, ileride kullanılabilir)
sharp                → Sunucu tarafı görsel işleme
react-hook-form      → Form yönetimi
zod                  → Şema doğrulama
```

---

## 3. Ortam Değişkenleri (.env.local)

Aşağıdaki değişkenlerin tamamı `.env.local` dosyasında tanımlıdır.  
**Bu dosya git'te yoktur, devir sırasında ayrıca iletilecektir.**

```env
# Gemini API (Nano Banana 2 — görsel üretim)
GEMINI_API_KEY=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://edvjerpjsivradrragij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...          # Browser-safe, public
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # SADECE sunucu tarafı API route'larında!
```

> **Güvenlik notu:** `SUPABASE_SERVICE_ROLE_KEY` RLS'i bypass eder.  
> Sadece `src/app/api/**` içinde kullanılır, asla client tarafına geçmez.

---

## 4. Supabase Veritabanı Şeması

### Proje Bilgileri
- **URL:** `https://edvjerpjsivradrragij.supabase.co`
- **Project ID:** `edvjerpjsivradrragij`

### Tablolar

#### `profiles` — Son kullanıcı profilleri
```sql
id          uuid PK → auth.users(id)
email       text
full_name   text
created_at  timestamptz
```
> Trigger: `on_auth_user_created` → yeni auth user oluşunca profiles'a satır ekler.

#### `avatars` — Kullanıcı dijital avatarları
```sql
id          uuid PK
user_id     uuid → auth.users
avatar_url  text              -- Supabase Storage public URL
pose        text              -- 'front', 'back' vb.
height_cm   int
bust_cm     int
waist_cm    int
hips_cm     int
extra_notes text
is_active   boolean
created_at  timestamptz
```

#### `tryons` — Deneme sonuçları
```sql
id                uuid PK
user_id           uuid → auth.users (nullable — anonim deneme)
avatar_id         uuid → avatars (nullable)
source_type       text  -- 'avatar' | 'gallery'
source_image_url  text
garment_image_url text
result_image_url  text
created_at        timestamptz
```

#### `photos` — Kullanıcının yüklediği fotoğraflar
```sql
id         uuid PK
user_id    uuid → auth.users
photo_url  text
created_at timestamptz
```

#### `brands` — Marka sahipleri (B2B)
```sql
id             uuid PK
owner_user_id  uuid → auth.users
name           text
slug           text UNIQUE       -- URL-friendly marka adı
website_url    text
logo_url       text
plan           text              -- 'free', 'starter', vb.
created_at     timestamptz
```

#### `brand_garments` — Markanın ürün kataloğu
```sql
id                    uuid PK
brand_id              uuid → brands
name                  text
image_url             text          -- Storage'daki ürün görseli
category              text          -- 'dress', 'top', 'diger', vb.
shopify_handle        text          -- Shopify ürün handle'ı (widget eşleştirme için)
shopify_domain        text          -- örn: "touchmeluxury.myshopify.com"
external_product_url  text          -- ürün sayfası linki
is_active             boolean
created_at            timestamptz
```

### Storage Bucket'ları

| Bucket | Erişim | İçerik |
|---|---|---|
| `user-uploads` | Private | Kullanıcının yüklediği orijinal fotoğraflar |
| `avatars` | Public | Üretilen dijital avatarlar |
| `tryons` | Public | Try-on sonuç görselleri |
| `brand-garments` | Public | Markaların ürün görselleri |

> **Path yapısı:** `{user_id}` veya `{brand_id}` prefix'iyle klasörlenir.  
> RLS policy: Kullanıcı sadece kendi klasörüne yazabilir.

---

## 5. Sayfa Yapısı ve Routing

```
/                          → B2B landing page (beyaz/mor tema)
/seller/login              → Marka girişi (e-posta + şifre)
/seller/register           → Marka kayıt (2 adım: hesap + marka bilgileri)
/seller/reset-password     → Şifre sıfırlama (magic link ile gelinen sayfa)
/seller/dashboard          → Marka paneli ana sayfa (ürün sayısı, istatistikler)
/seller/garments           → Ürün listesi, yükleme, silme, aktif/pasif toggle
/seller/embed              → Embed kod üreticisi

/login                     → Son kullanıcı girişi
/signup                    → Son kullanıcı kaydı
/onboarding                → Avatar oluşturma sihirbazı (3 adım)
/dashboard                 → Son kullanıcı ana sayfası
/tryon                     → Kıyafet deneme ekranı
/tryon/history             → Geçmiş denemeler
/profile                   → Kullanıcı profili
/wardrobe                  → Gardırop

/embed                     → Widget iframe (herkese açık, auth gerekmez)
                              ?g={garmentId} parametresiyle çalışır
```

---

## 6. API Route'ları

### Kamuya Açık (Auth gerektirmez)

| Endpoint | Method | Açıklama |
|---|---|---|
| `/api/public/garment/[id]` | GET | Garment ID'ye göre ürün getir |
| `/api/public/garment/by-handle` | GET | `?domain=&handle=` — Shopify widget için ürün eşleştir |
| `/api/tryon` | POST | Anonim deneme (sonuç base64 olarak döner, DB'ye yazılmaz) |
| `/api/auth/callback` | GET | Supabase magic link callback |

### Auth Gerektirenler — Son Kullanıcı

| Endpoint | Method | Açıklama |
|---|---|---|
| `/api/avatar/create` | POST | Avatar oluştur (Gemini çağrısı) |
| `/api/avatar/back` | POST | Arka pose avatar oluştur |
| `/api/avatar/poses` | GET | Kullanıcının avatarlarını listele |
| `/api/tryon` | POST | Deneme yap + DB'ye kaydet |
| `/api/tryons` | GET | Geçmiş denemeler |
| `/api/photos` | GET/POST | Fotoğraf yönetimi |
| `/api/wardrobe` | GET | Gardırop |
| `/api/profile/route` | GET/PATCH | Profil bilgileri |
| `/api/profile/avatar` | PATCH | Aktif avatar değiştir |

### Auth Gerektirenler — Marka Paneli

| Endpoint | Method | Açıklama |
|---|---|---|
| `/api/seller/register` | POST | Yeni marka kaydı (admin client kullanır) |
| `/api/seller/brand` | GET/PATCH | Marka bilgileri |
| `/api/seller/garments` | GET/POST/DELETE/PATCH | Ürün CRUD |
| `/api/seller/shopify/import` | POST | Shopify ürün import |

---

## 7. Widget Sistemi (`public/widget.js`)

Markaların herhangi bir web sitesine (Shopify, WordPress, özel site) yerleştirdiği JavaScript dosyasıdır.

### Nasıl Çalışır?

1. Marka, ürün sayfasına şu kodu ekler:
```html
<!-- Shopify (otomatik eşleştirme) -->
<script src="https://e-cabin.vercel.app/widget.js"
        data-ecabin-shop="markaadi.myshopify.com"></script>

<!-- Manuel (belirli ürün) -->
<script src="https://e-cabin.vercel.app/widget.js"
        data-ecabin-garment="GARMENT_UUID"></script>
```

2. Widget.js:
   - `window.__ecabinLoaded` flag'i ile çift yüklemeyi önler
   - Shopify modunda: `/api/public/garment/by-handle?domain=&handle=` çağırarak ürünü eşleştirir
   - "e-cabin ile dene" butonunu "Sepete ekle" butonunun altına ekler
   - Butona tıklanınca: overlay + soldan kayan panel açılır
   - Panel içinde: `/embed?g={garmentId}` iframe'i yükler

3. `/embed` sayfası:
   - Giriş gerektirmez (anonim çalışır)
   - Müşteri fotoğraf yükler
   - `/api/tryon` çağrılır (kayıtsız kullanıcı için base64 döner)
   - Sonuç gösterilir, indir butonu çıkar

### Shopify Handle Eşleştirme
`/api/public/garment/by-handle` endpoint'i Türkçe karakter normalizasyonu yapar.  
`ı→i, ğ→g, ş→s, ö→o, ü→u, ç→c` dönüşümü `normalizeHandle()` fonksiyonunda.

---

## 8. Yapay Zeka Entegrasyonu

### Model
**`gemini-3.1-flash-image-preview`** (Google GenAI — ücretli, kredi kartı gerektirir)

### Wrapper: `src/lib/nanobanana.ts`
```typescript
generateImage({
  prompt: string,
  referenceImages: [{ mimeType, data /* base64 */ }]
}) → Promise<{ mimeType, data }>
```

### Sistem Promptları: `src/lib/prompts.ts`

**`AVATAR_SYSTEM_PROMPT`** — Dijital avatar oluşturma
- 3 referans görsel girer: 2 yüz fotoğrafı + 1 boy fotoğrafı
- Ölçüler (boy, göğüs, bel, kalça) inject edilir
- Çıktı: stüdyo arka planlı, tam boy, nötr kıyafetli avatar

**`TRYON_SYSTEM_PROMPT`** — Sanal kıyafet deneme
- 2 referans görsel: person image + garment image
- Kıyafeti kişinin üzerine gerçekçi şekilde giydiriyor
- Çıktı: tek görsel, orijinal arka plan korunur

### Sunucu Tarafı Kural
**Tüm Gemini çağrıları `src/app/api/**` içinde yapılır.**  
`GEMINI_API_KEY` asla client-side kod/bundle'a geçmez.

### Vercel Limitleri
- Hobby plan: max `maxDuration = 300` saniye (5 dakika) — `/api/tryon`'da kullanılıyor
- Hobby plan: 12 concurrent serverless function
- Gemini görsel üretimi yaklaşık 15-40 saniye sürer

---

## 9. Kimlik Doğrulama Akışları

### Son Kullanıcılar
- **Kayıt:** `/signup` → Supabase `signUp` (e-posta + şifre)
- **Giriş:** `/login` → `signInWithPassword`
- **Oturum yönetimi:** `src/lib/supabase/middleware.ts` → `updateSession()` her request'te çalışır

### Marka Sahipleri (Seller)
- **Kayıt:** `/seller/register` → 2 adım UI → `/api/seller/register` → `adminClient.auth.admin.createUser()` (e-posta onayı olmadan anında aktif)
- **Giriş:** `/seller/login` → `signInWithPassword` (e-posta + şifre)
- **Şifre sıfırlama:** "Şifremi unuttum" → `resetPasswordForEmail()` → mail → `/seller/reset-password` → `updateUser({ password })`
- **Mevcut admin:** meliskrg@gmail.com — şifre devir sırasında iletilecek

> **Not:** Supabase ücretsiz planda e-posta gönderimi saatte 2 ile sınırlıdır.  
> Production'da özel SMTP (Resend, SendGrid vb.) yapılandırılmalıdır.  
> Supabase Dashboard → Authentication → SMTP Settings

### Auth Callback
`/api/auth/callback` → magic link / OAuth callback handler  
Supabase `exchangeCodeForSession` çağırır, `/seller/dashboard`'a yönlendirir.

---

## 10. Middleware ve Rota Koruması

`src/lib/supabase/middleware.ts` içindeki `updateSession()` her request'te çalışır.

**Korunan rotalar:** `/dashboard`, `/tryon`, `/profile`, `/wardrobe`, `/onboarding`  
**Korunan seller rotaları:** `/seller/dashboard`, `/seller/garments`, `/seller/embed`  
**Public rotalar:** `/`, `/login`, `/signup`, `/seller/login`, `/seller/register`, `/embed`, `/api/public/**`

---

## 11. Deployment

### Vercel (Production)
- **URL:** https://e-cabin.vercel.app
- **Repo:** https://github.com/meliskrg-debug/e-cabin (private)
- **Branch:** `main` → otomatik deploy
- **Plan:** Hobby (ücretsiz)

### Vercel Ortam Değişkenleri
Dashboard'da → Settings → Environment Variables'a şunlar eklenmiş:
```
GEMINI_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### GitHub SSH
Repo'ya SSH ile push yapılıyor:
```bash
git remote -v
# origin  git@github.com:meliskrg-debug/e-cabin.git
```

### Yerel Geliştirme
```bash
git clone git@github.com:meliskrg-debug/e-cabin.git
cd e-cabin
npm install
# .env.local dosyasını oluştur (yukarıdaki env vars)
npm run dev
# http://localhost:3000
```

---

## 12. Landing Page Yapısı (`src/app/page.tsx`)

Beyaz/mor B2B tema (`#4A1FA8` primary, `bg-white` zemin):

1. **Nav** — Logo + Fiyatlar + Marka Girişi + Ücretsiz Başla
2. **Hero** — Sol metin, sağ CSS widget mockup (demo-before.jpg + demo-after.png)
3. **Gerçek Entegrasyon** — Browser frame mockup, biancoenero.com.tr Rosalinda Dress
4. **Demo bant** — Mor arka plan, 3 adım açıklama
5. **4 Değer Kartı** — Daha Güvenli / Kendi Üzerinde / Daha Az İade / Kolay Entegrasyon
6. **Nasıl Çalışır** — 3 adım (markalar için)
7. **Fiyatlandırma** — Starter / Professional / Enterprise + Kurucu Marka Programı
8. **CTA Banner** — Ücretsiz Başla butonu
9. **Footer**

---

## 13. Önemli Tasarım Kararları

### Tema
- **Landing page:** `bg-white`, deep purple `#4A1FA8`
- **Seller panel:** `bg-[#0f0a1e]` (koyu), lavanta tonları
- CSS renk değişkenleri `src/app/globals.css` `@theme` bloğunda tanımlı (Tailwind v4 stili)
- Font: `Plus Jakarta Sans` (display) — Google Fonts CDN üzerinden layout.tsx'te yüklü

### TailwindCSS v4
Standart `tailwind.config.ts` **yok**. Tailwind 4 CSS-first yaklaşımı kullanıyor:
```css
/* globals.css */
@import "tailwindcss";
@theme {
  --color-lavender-500: #9F7AEA;
  /* ... */
}
```

### Next.js Image Optimizasyonu
`next.config.mjs`'de izin verilen dış hostname'ler:
- `edvjerpjsivradrragij.supabase.co` (Supabase storage)
- `cdn.shopify.com` (Shopify ürün görselleri)

Yeni hostname eklenmesi gerekirse `next.config.mjs` → `images.remotePatterns`'e eklenecek.

### widget.js Cache
`no-cache, no-store, must-revalidate` — Shopify sitelerinde eski sürümün cache'lenmesini önler.

### Embed iframe İzinleri
`/embed` sayfası için `X-Frame-Options: ALLOWALL` ve `Content-Security-Policy: frame-ancestors *`  
(`next.config.mjs` → `headers()`)

---

## 14. Bilinen Sorunlar ve Yapılacaklar

### Kritik
- [ ] **Supabase SMTP ayarlanmamış** — Şifre sıfırlama e-postaları saatte 2 ile sınırlı. Resend veya SendGrid ile özel SMTP eklenecek.
- [ ] **`maxDuration: 300`** — Vercel Hobby'de fonksiyon başına max 300 sn. Yoğun kullanımda Vercel Pro'ya geçiş gerekebilir.

### Orta Öncelik
- [ ] **Try-on istatistikleri** — `brand_garments.tryons(count)` join'i şu an çalışmıyor, seller dashboard'da 0 gösteriyor. `tryons` tablosuna `garment_id` kolonu eklenip join düzeltilecek.
- [ ] **Rate limiting** — Kullanıcı başına günlük try-on limiti yok. Supabase edge function veya middleware ile eklenecek.
- [ ] **Shopify import** — `/api/seller/shopify/import` var ama UI henüz tam değil.
- [ ] **Replicate entegrasyonu** — `src/lib/replicate.ts` mevcut ama aktif değil.

### Düşük Öncelik
- [ ] Marka logosu yükleme UI'ı tamamlanmamış
- [ ] `/wardrobe` sayfası iskelet halde
- [ ] Fiyatlandırma sayfasındaki CTA butonları gerçek ödeme entegrasyonuna bağlanacak

---

## 15. Mevcut Markalar (Production Data)

| Marka | Owner | Slug | Website |
|---|---|---|---|
| Touchme | meliskrg@gmail.com | touchme | touchmeluxury.com.tr |

> Touchme'nin Shopify mağazasında widget aktif: `touchmeluxury.myshopify.com`  
> Garment'lar seller dashboard'dan yönetiliyor.

---

## 16. Güvenlik Kontrol Listesi

- [x] `SUPABASE_SERVICE_ROLE_KEY` sadece API route'larında
- [x] `GEMINI_API_KEY` sadece sunucu tarafında
- [x] Tüm tablolarda RLS aktif
- [x] Storage yazma: `{user_id}/` veya `{brand_id}/` prefix'iyle kilitli
- [x] `/embed` anonim erişime açık ama DB yazmaz (guest modda base64 döner)
- [x] Seller route'ları auth kontrolü yapıyor
- [ ] CSRF koruması (Next.js built-in form action ile kısmen var, API'larda eksik)
- [ ] Input sanitizasyon (Zod ile kısmen var, tüm route'larda değil)

---

## 17. Hızlı Referans

### Supabase Admin Paneli
https://supabase.com/dashboard/project/edvjerpjsivradrragij

### Vercel Dashboard
https://vercel.com/meliskrg-debug/e-cabin

### GitHub Repo
https://github.com/meliskrg-debug/e-cabin

### Canlı Site
https://e-cabin.vercel.app

### Seller Panel
https://e-cabin.vercel.app/seller/login

---

*Bu döküman projenin 2026-06-29 tarihindeki durumunu yansıtmaktadır.*
