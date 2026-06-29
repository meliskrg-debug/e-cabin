import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col overflow-hidden">

      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-purple-100 px-8 py-4 flex items-center justify-between">
        <div className="flex flex-col leading-none">
          <span className="font-display font-black text-xl tracking-[0.15em] text-[#4A1FA8]">E CABIN</span>
          <span className="text-[9px] tracking-[0.3em] text-purple-400 font-medium">— SANAL DENEME KABİNİ —</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#fiyatlandirma" className="px-4 py-2 text-sm font-semibold text-purple-700 hover:text-purple-900 transition hidden sm:block">
            Fiyatlar
          </a>
          <Link href="/seller/login" className="px-4 py-2 text-sm font-semibold text-purple-700 hover:text-purple-900 transition">
            Marka Girişi
          </Link>
          <Link href="/seller/register" className="px-5 py-2.5 text-sm font-semibold bg-[#4A1FA8] hover:bg-purple-900 text-white rounded-xl transition shadow-md shadow-purple-200">
            Ücretsiz Başla
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Sol */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold px-4 py-2 rounded-full w-fit tracking-wide">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
            YAPAY ZEKA DESTEKLİ
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-gray-900">
            Kıyafeti{" "}
            <span className="text-[#4A1FA8]">giymeden,</span>
            <br />
            kendi üzerinde gör
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            E-ticaret sitene tek satır kod ekle. Müşterilerin kendi fotoğraflarıyla kıyafeti dener — web sitenden çıkmadan, saniyeler içinde.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link href="/seller/register"
              className="px-8 py-4 font-bold text-base bg-[#4A1FA8] hover:bg-purple-900 text-white rounded-2xl transition shadow-xl shadow-purple-200 text-center">
              Markam için ücretsiz başla →
            </Link>
            <a href="#nasil-calisir"
              className="px-8 py-4 font-semibold text-base border-2 border-purple-200 text-purple-700 hover:border-purple-400 hover:bg-purple-50 rounded-2xl transition text-center">
              Nasıl çalışır? ↓
            </a>
          </div>
          <p className="text-xs text-gray-400">Kredi kartı gerekmez. 5 dakikada kurulum.</p>
        </div>

        {/* Sağ — CSS Widget Mockup */}
        <div className="relative flex items-center justify-center gap-3 md:gap-4">
          {/* Önce: Upload paneli */}
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-purple-100 border border-purple-100 w-44 md:w-52 overflow-hidden flex-shrink-0">
            {/* Panel header */}
            <div className="bg-[#4A1FA8] px-3 py-2.5 flex items-center justify-between">
              <span className="text-white text-[10px] font-bold tracking-wide">e-cabin ile dene</span>
              <span className="text-white/60 text-xs">✕</span>
            </div>
            {/* Upload area */}
            <div className="p-3 flex flex-col gap-2">
              <p className="text-[9px] font-semibold text-gray-700">1. Fotoğrafını yükle</p>
              <div className="rounded-xl overflow-hidden border border-purple-100">
                <Image src="/demo-before.jpg" alt="Örnek fotoğraf" width={200} height={280} className="w-full h-auto object-cover" />
              </div>
              {["İyi aydınlatılmış fotoğraf", "Vücudun tamamı görünsün", "Düz arka plan"].map(tip => (
                <div key={tip} className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-1.5 h-1.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[7px] text-gray-400">{tip}</span>
                </div>
              ))}
              <button className="w-full py-1.5 text-[8px] font-bold bg-[#4A1FA8] text-white rounded-lg mt-1">
                Dene ✨
              </button>
            </div>
          </div>

          {/* Ok */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#4A1FA8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <span className="text-[8px] text-purple-400 font-bold text-center">~30 sn</span>
          </div>

          {/* Sonra: Sonuç paneli */}
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-purple-100 border border-purple-100 w-44 md:w-52 overflow-hidden flex-shrink-0">
            <div className="bg-[#4A1FA8] px-3 py-2.5 flex items-center justify-between">
              <span className="text-white text-[10px] font-bold tracking-wide">e-cabin ile dene</span>
              <span className="text-purple-300 text-[9px] font-medium">Tekrar Dene</span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[9px] font-bold text-gray-800">Deneme sonucu</span>
              </div>
              {/* Result image */}
              <div className="rounded-xl overflow-hidden relative">
                <Image src="/demo-after.png" alt="Deneme sonucu" width={200} height={280} className="w-full h-auto object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="bg-purple-600/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <p className="text-[7px] text-white font-bold">Harika! Çok iyi duruyor.</p>
                    <p className="text-[6px] text-purple-200">38 size önerilir</p>
                  </div>
                </div>
              </div>
              <button className="w-full py-1.5 text-[8px] font-bold bg-purple-50 border border-purple-200 text-purple-700 rounded-lg flex items-center justify-center gap-1">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                İndir
              </button>
            </div>
          </div>

          {/* Arka dekorasyon */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40" />
        </div>
      </section>

      {/* Canlı Site Görünümü */}
      <section className="py-20 px-6 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-2">Gerçek Entegrasyon</p>
            <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900">
              Müşteri sayfadan çıkmadan, saniyeler içinde dener
            </h2>
          </div>

          {/* Browser Mockup */}
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-purple-200 border border-purple-100 max-w-4xl mx-auto">
            {/* Browser chrome */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs text-gray-400 font-mono border border-gray-200">
                biancoenero.com.tr/products/rosalinda-dress
              </div>
            </div>

            {/* Page content */}
            <div className="bg-white flex min-h-[420px]">
              {/* Sol — e-cabin widget paneli */}
              <div className="w-[260px] flex-shrink-0 border-r border-gray-100 flex flex-col">
                {/* Widget header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-800">e-cabin ile dene</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-purple-500">Tekrar Dene</span>
                    <span className="text-gray-400 text-base cursor-pointer">✕</span>
                  </div>
                </div>
                {/* Result image */}
                <div className="flex-1 relative">
                  <Image
                    src="/demo-before.jpg"
                    alt="Deneme sonucu"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                {/* İndir butonu */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <button className="w-full py-2.5 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition">
                    İndir
                  </button>
                </div>
              </div>

              {/* Sağ — Ürün sayfası */}
              <div className="flex-1 flex">
                {/* Ürün görseli */}
                <div className="w-[45%] relative bg-gray-50">
                  <Image
                    src="/demo-after.png"
                    alt="Rosalinda Dress"
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Ürün detayları */}
                <div className="flex-1 p-6 flex flex-col gap-4">
                  <h3 className="font-bold text-xl text-gray-900">Rosalinda Dress</h3>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-lg text-gray-900">6.500,00TL</span>
                    <span className="text-sm text-gray-400 line-through">8.500,00TL</span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Beden</p>
                    <div className="flex gap-2">
                      {["36","38","40"].map(s => (
                        <button key={s} className={`w-10 h-10 rounded-lg border text-sm font-semibold transition ${s === "36" ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>{s}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Adet</p>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-xl w-fit px-4 py-2">
                      <button className="text-gray-400 font-bold">−</button>
                      <span className="text-sm font-semibold w-4 text-center">1</span>
                      <button className="text-gray-400 font-bold">+</button>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gray-900 text-white text-sm font-bold rounded-xl mt-1">
                    Sepete ekle
                  </button>

                  <button className="w-full py-3 bg-[#7C3AED] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 2l-4 4 3 1v13a1 1 0 001 1h8a1 1 0 001-1V7l3-1-4-4"/>
                      <path d="M8 2c0 2 1.5 3 4 3s4-1 4-3"/>
                    </svg>
                    e-cabin ile dene
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo bant */}
      <section className="bg-[#4A1FA8] py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-3">Canlı Demo</p>
          <h2 className="font-display font-black text-2xl md:text-4xl text-white mb-4">
            Müşterilerin artık sipariş vermeden önce görebilir
          </h2>
          <p className="text-purple-200 mb-10 max-w-xl mx-auto">
            biancoenero.com.tr gibi markalar e-cabin'i kullanarak müşterilerine gerçek deneme kabini deneyimi sunuyor.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { n: "1", title: "Butona Tıkla", desc: "Ürün sayfasındaki \"e-cabin ile dene\" butonuna tıkla" },
              { n: "2", title: "Fotoğraf Yükle", desc: "Kendi fotoğrafını yükle, yapay zeka kıyafeti üzerine giydiriyor" },
              { n: "3", title: "Sonucu Gör", desc: "Saniyeler içinde gerçekçi deneme görseli hazır" },
            ].map(step => (
              <div key={step.n} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-left">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white font-black text-sm flex items-center justify-center mb-3">{step.n}</div>
                <p className="text-white font-bold text-sm mb-1">{step.title}</p>
                <p className="text-purple-200 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Değer Kartı */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-2">Neden E Cabin?</p>
            <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900">Markan için somut fark yaratır</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
                title: "DAHA GÜVENLİ ALIŞVERİŞ",
                desc: "Satın almadan önce gör, pişmanlık yaşama. Müşteri güveni artar, dönüşüm oranı yükselir.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
                title: "KENDİ ÜZERİNDE GÖR",
                desc: "Avatar değil, gerçek fotoğrafınla. Müşteri kendini görselde görünce satın alma kararı kolaylaşır.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                ),
                title: "DAHA AZ İADE",
                desc: "Beden ve görünüm uyumunu önceden test et. İade oranları düşer, müşteri memnuniyeti artar.",
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                ),
                title: "KOLAY ENTEGRASYON",
                desc: "Shopify, WordPress veya özel site — her siteye uyumlu. Tek satır kod, geliştirici gerekmez.",
              },
            ].map(card => (
              <div key={card.title} className="border border-purple-100 rounded-3xl p-7 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-50 transition flex gap-5">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#4A1FA8] flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-display font-black text-sm tracking-wide text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section id="nasil-calisir" className="py-20 px-6 bg-purple-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-500 text-xs font-bold uppercase tracking-widest mb-2">Markalar İçin</p>
            <h2 className="font-display font-black text-2xl md:text-3xl text-gray-900">3 adımda canlıya al</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", title: "Ürünlerini yükle", desc: "Marka paneline kayıt ol, ürün görsellerini yükle. 5 dakika sürer." },
              { n: "02", title: "Kodu kopyala", desc: "Sana özel embed kodunu kopyala, ürün sayfana yapıştır. Shopify, WordPress, özel site — fark etmez." },
              { n: "03", title: "Müşterilerin dener", desc: "Alışverişçiler \"e-cabin ile dene\" butonunu görür, fotoğraf yükler, kıyafeti üzerinde görür." },
            ].map(step => (
              <div key={step.n} className="relative bg-white border border-purple-100 rounded-3xl p-7 hover:border-purple-300 transition">
                <div className="absolute top-5 right-6 font-black text-5xl text-purple-100 leading-none select-none font-display">
                  {step.n}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#4A1FA8] flex items-center justify-center text-white font-black text-sm mb-4">
                  {step.n.replace("0", "")}
                </div>
                <h3 className="font-display font-black text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fiyatlandırma */}
      <section id="fiyatlandirma" className="py-20 px-6 bg-[#0d0620]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2">Fiyatlandırma</p>
            <h2 className="font-display font-black text-2xl md:text-4xl text-white mb-3">
              Markanızın e-ticaret deneyimini<br />bir üst seviyeye taşıyın
            </h2>
            <p className="text-purple-300 text-sm max-w-xl mx-auto">
              Yapay zekâ destekli sanal deneme teknolojisi ile iade oranlarınızı düşürün, dönüşümünüzü artırın.
            </p>
          </div>

          {/* 4 Kart Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Starter */}
            <div className="bg-white rounded-3xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707" />
                </svg>
              </div>
              <div>
                <p className="font-black text-sm tracking-widest text-purple-700 mb-1">STARTER</p>
                <p className="text-gray-400 text-xs leading-relaxed">Küçük butik ve yeni e-ticaret markaları için.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-3xl text-gray-900">4.990</span>
                <span className="text-sm text-gray-500">TL / Ay</span>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {["1 Web Sitesi","250 Ürüne Kadar","1.500 AI Denemesi / Ay","E Cabin Entegrasyonu","Temel Analitik Paneli","E-posta Desteği"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/seller/register" className="w-full py-3 text-center text-sm font-bold bg-[#4A1FA8] text-white rounded-2xl hover:bg-purple-900 transition">
                Hemen Başlayın
              </Link>
            </div>

            {/* Professional — öne çıkan */}
            <div className="bg-white rounded-3xl p-6 flex flex-col gap-4 ring-2 ring-blue-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-4 py-1 rounded-full tracking-wider whitespace-nowrap">
                EN ÇOK TERCİH EDİLEN
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="font-black text-sm tracking-widest text-blue-600 mb-1">PROFESSIONAL</p>
                <p className="text-gray-400 text-xs leading-relaxed">Büyüyen markalar için.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-3xl text-gray-900">9.990</span>
                <span className="text-sm text-gray-500">TL / Ay</span>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {["1 Web Sitesi","1.000 Ürüne Kadar","7.500 AI Denemesi / Ay","Gelişmiş Analitik","Dönüşüm Takibi","Öncelikli Destek","Yeni Özelliklere Erken Erişim"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/seller/register" className="w-full py-3 text-center text-sm font-bold bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition">
                Hemen Başlayın
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-3xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <div>
                <p className="font-black text-sm tracking-widest text-orange-500 mb-1">PREMIUM</p>
                <p className="text-gray-400 text-xs leading-relaxed">Yoğun trafiğe sahip moda markaları için.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-3xl text-gray-900">19.990</span>
                <span className="text-sm text-gray-500">TL / Ay</span>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {["Sınırsız Ürün","25.000 AI Denemesi / Ay","API Entegrasyonu","Gelişmiş Analitik","Özel Hesap Yöneticisi","Öncelikli Teknik Destek"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/seller/register" className="w-full py-3 text-center text-sm font-bold bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition">
                Hemen Başlayın
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-gray-900 rounded-3xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="font-black text-sm tracking-widest text-purple-300 mb-1">ENTERPRISE</p>
                <p className="text-gray-400 text-xs leading-relaxed">Kurumsal markalar için özel çözümler.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-black text-2xl text-purple-400">Teklif Al</span>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {["Çoklu Web Sitesi","Sınırsız Ürün","Özel AI Limitleri","Özel Sunucu Seçenekleri","SLA","Beyaz Etiket (White Label)","Özel Geliştirmeler"].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-300">
                    <svg className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/seller/register" className="w-full py-3 text-center text-sm font-bold border border-purple-500 text-purple-300 hover:bg-purple-500/10 rounded-2xl transition">
                İletişime Geçin
              </Link>
            </div>
          </div>

          {/* Alt Bölümler */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Ek Kullanım */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M4 7c0-2 1-3 3-3h10c2 0 3 1 3 3M4 7h16" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-sm mb-0.5">EK KULLANIM</p>
                <p className="text-purple-300 text-xs">AI deneme limitiniz dolarsa ihtiyaç kadar ek kullanım satın alabilirsiniz.</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-purple-300 text-xs">+ 1.000</p>
                <p className="text-[10px] text-purple-400">AI Denemesi</p>
                <p className="font-black text-white text-lg">990 TL</p>
              </div>
            </div>

            {/* Kurucu Marka Programı */}
            <div className="bg-gradient-to-br from-purple-900/80 to-[#4A1FA8]/60 border border-purple-500/30 rounded-3xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">⭐</span>
                <div>
                  <p className="font-black text-white text-sm">KURUCU MARKA PROGRAMI</p>
                  <p className="text-purple-300 text-xs">İlk 20 marka için özel avantajlar!</p>
                </div>
                <div className="ml-auto text-right flex-shrink-0">
                  <p className="font-black text-purple-300 text-xl">2.990 TL</p>
                  <p className="text-purple-400 text-[10px]">/ Ay</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "🔒", text: "Ömür Boyu Bu Fiyat Garantisi" },
                  { icon: "🚀", text: "Tüm Güncellemeler" },
                  { icon: "💬", text: "Öncelikli Destek" },
                  { icon: "🤝", text: "Referans Marka Olma Avantajı" },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs text-purple-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-purple-500 text-xs mt-6">
            Tüm fiyatlar KDV hariçtir. Paket içerikleri değişiklik gösterebilir. Detaylı bilgi için bizimle iletişime geçin.
          </p>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#4A1FA8] to-purple-600 rounded-3xl p-12 text-center shadow-2xl shadow-purple-200">
          <h2 className="font-display font-black text-2xl md:text-4xl text-white mb-3">
            E-ticaret sitenize e-cabin&apos;i ekleyin
          </h2>
          <p className="text-purple-200 mb-8">Kredi kartı gerekmez. 5 dakikada kurulum.</p>
          <Link href="/seller/register"
            className="inline-block px-10 py-4 font-bold text-base bg-white text-[#4A1FA8] hover:bg-purple-50 rounded-2xl transition shadow-lg">
            Ücretsiz Başla →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-col leading-none">
          <span className="font-display font-black text-base tracking-[0.15em] text-[#4A1FA8]">E CABIN</span>
          <span className="text-[8px] tracking-[0.3em] text-purple-400">— SANAL DENEME KABİNİ —</span>
        </div>
        <span className="text-xs text-gray-400">© 2025</span>
        <Link href="/seller/login" className="text-xs font-semibold text-purple-600 hover:text-purple-900 transition">
          Marka Girişi →
        </Link>
      </footer>
    </div>
  );
}
