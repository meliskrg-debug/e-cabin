"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

type Garment = {
  id: string;
  name: string;
  image_url: string;
  category: string;
  is_active: boolean;
};

function EmbedPageInner() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("garment");

  const [garments, setGarments] = useState<Garment[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [copiedGlobal, setCopiedGlobal] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/seller/garments").then(r => r.json()).then(d => {
      const list = d.garments || [];
      setGarments(list);
      if (preselectedId) {
        setSelectedId(preselectedId);
      } else if (list.length > 0) {
        setSelectedId(list[0].id);
      }
      const withDomain = list.find((g: any) => g.shopify_domain);
      if (withDomain) setShopifyDomain(withDomain.shopify_domain);
    });
  }, [preselectedId]);

  const baseUrl = "https://e-cabin.vercel.app";
  const selectedGarment = garments.find(g => g.id === selectedId);

  const linkEmbed = selectedId
    ? `<a href="${baseUrl}/tryon?g=${selectedId}" target="_blank" rel="noopener"\n   style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:linear-gradient(135deg,#9F7AEA,#805AD5);color:#fff;border-radius:12px;text-decoration:none;font-weight:600;font-size:14px;">\n  👗 e-cabin ile dene\n</a>`
    : "";

  const scriptEmbed = selectedId
    ? `<script data-ecabin-garment="${selectedId}"\n        src="${baseUrl}/widget.js"></script>`
    : "";

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copyGlobal(text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedGlobal(true);
    setTimeout(() => setCopiedGlobal(false), 2000);
  }

  const globalScript = shopifyDomain
    ? `<script src="${baseUrl}/widget.js" data-ecabin-shop="${shopifyDomain}"></script>`
    : null;

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col">
      <nav className="sticky top-0 z-10 bg-[#0f0a1e]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="font-display font-bold text-white text-xl tracking-tight">e-cabin</a>
          <span className="px-2 py-0.5 text-xs bg-lavender-500/20 border border-lavender-500/30 text-lavender-400 rounded-full">Marka Paneli</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/seller/dashboard" className="text-sm font-medium text-white/50 hover:text-white transition">Dashboard</Link>
          <Link href="/seller/garments" className="text-sm font-medium text-white/50 hover:text-white transition">Ürünler</Link>
        </div>
      </nav>

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-lavender-500/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 relative">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Embed Kodu</h1>
        <p className="text-white/40 text-sm mb-8">Ürün sayfana ekleyeceğin butonu kopyala.</p>

        {/* Global Shopify Entegrasyonu */}
        {shopifyDomain && (
          <div className="mb-8 bg-gradient-to-br from-lavender-500/10 to-purple-500/10 border border-lavender-500/30 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 text-sm font-bold">✓</div>
              <div>
                <h2 className="font-semibold text-white">Shopify Global Entegrasyon</h2>
                <p className="text-xs text-white/40">{shopifyDomain} — {garments.filter(g => g.is_active).length} aktif ürün</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Aşağıdaki kodu Shopify temanın <code className="text-lavender-300 bg-lavender-500/10 px-1.5 py-0.5 rounded">theme.liquid</code> dosyasına, <code className="text-lavender-300 bg-lavender-500/10 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> etiketinden önce yapıştır.
              Tüm ürün sayfalarında otomatik "e-cabin ile dene" butonu çıkar.
            </p>
            <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-lavender-300 mb-3 overflow-x-auto">
              {globalScript}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/30">Bir kez ekle, tüm ürünlerde çalışır.</p>
              <button onClick={() => copyGlobal(globalScript!)}
                className="px-4 py-2 text-xs font-semibold bg-lavender-500 hover:bg-lavender-400 text-white rounded-xl transition">
                {copiedGlobal ? "Kopyalandı ✓" : "Kodu Kopyala"}
              </button>
            </div>

            <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-4 gap-3">
              {[
                { n: "1", t: "Shopify Admin", d: "Online Store → Themes" },
                { n: "2", t: "Edit Code", d: "Aktif temanın yanındaki butona tıkla" },
                { n: "3", t: "theme.liquid", d: "Layout klasöründe bul" },
                { n: "4", t: "Yapıştır", d: "</body> etiketinden hemen önce" },
              ].map(s => (
                <div key={s.n} className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-lavender-500/20 border border-lavender-500/30 text-lavender-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{s.n}</div>
                  <div>
                    <p className="text-xs font-semibold text-white">{s.t}</p>
                    <p className="text-xs text-white/30">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Ürün seçimi */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
            <h2 className="font-semibold text-white">1. Ürün Seç</h2>
            {garments.length === 0 ? (
              <div className="text-center py-8 text-white/30">
                <p className="text-sm">Henüz ürün yok.</p>
                <Link href="/seller/garments" className="text-lavender-400 text-xs mt-2 block hover:text-lavender-300">
                  Ürün ekle →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto">
                {garments.map(g => (
                  <button key={g.id} onClick={() => setSelectedId(g.id)}
                    className={`rounded-xl overflow-hidden border-2 transition text-left ${selectedId === g.id ? "border-lavender-500" : "border-white/10 hover:border-lavender-500/40"}`}>
                    <div className="relative aspect-[3/4] bg-white/5">
                      <Image src={g.image_url} alt={g.name} fill className="object-contain p-1" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold text-white truncate">{g.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kod */}
          <div className="flex flex-col gap-4">
            {/* Preview */}
            {selectedGarment && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <div className="relative w-10 h-14 flex-shrink-0">
                  <Image src={selectedGarment.image_url} alt={selectedGarment.name} fill className="object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{selectedGarment.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">Seçili ürün</p>
                </div>
                <a href={`${baseUrl}/tryon?g=${selectedId}`} target="_blank" rel="noopener"
                  className="px-3 py-1.5 text-xs font-semibold bg-lavender-500/20 text-lavender-300 rounded-lg hover:bg-lavender-500/30 transition">
                  Önizle →
                </a>
              </div>
            )}

            {/* HTML Link */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">HTML Bağlantı (Önerilen)</h3>
                <button onClick={() => copy(linkEmbed)} disabled={!selectedId}
                  className="text-xs px-3 py-1 bg-lavender-500/20 text-lavender-300 rounded-lg hover:bg-lavender-500/30 transition disabled:opacity-40">
                  {copied ? "Kopyalandı ✓" : "Kopyala"}
                </button>
              </div>
              <pre className="text-xs text-white/50 bg-black/30 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-all font-mono">
                {selectedId ? linkEmbed : "← Önce bir ürün seç"}
              </pre>
              <p className="text-xs text-white/30">Ürün sayfanıza yapıştırın. CSS stil ile özelleştirebilirsiniz.</p>
            </div>

            {/* Script */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Script Tag</h3>
                <button onClick={() => copy(scriptEmbed)} disabled={!selectedId}
                  className="text-xs px-3 py-1 bg-lavender-500/20 text-lavender-300 rounded-lg hover:bg-lavender-500/30 transition disabled:opacity-40">
                  {copied ? "Kopyalandı ✓" : "Kopyala"}
                </button>
              </div>
              <pre className="text-xs text-white/50 bg-black/30 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-all font-mono">
                {selectedId ? scriptEmbed : "← Önce bir ürün seç"}
              </pre>
              <p className="text-xs text-white/30">Otomatik stillenmiş buton render eder.</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">Nasıl entegre edilir?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Ürün seç", desc: "Soldaki listeden embed kodu alacağın ürünü seç." },
              { step: "2", title: "Kodu kopyala", desc: "HTML bağlantısını veya script tag'ini kopyala." },
              { step: "3", title: "Siteye yapıştır", desc: "Ürün sayfanın uygun yerine yapıştır. Müşteri tıkladığında e-cabin açılır." },
            ].map(item => (
              <div key={item.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-lavender-500/20 border border-lavender-500/30 text-lavender-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SellerEmbedPage() {
  return (
    <Suspense>
      <EmbedPageInner />
    </Suspense>
  );
}
