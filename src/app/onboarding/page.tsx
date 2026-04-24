"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/image-uploader";

const STEPS = ["Yüz Fotoğrafı", "Boy Fotoğrafı", "Görünüm", "Ölçüler"];

const TR_SIZES: Record<string, { bust: string; waist: string; hips: string }> = {
  "XS":  { bust: "80", waist: "60", hips: "86" },
  "S":   { bust: "84", waist: "64", hips: "90" },
  "M":   { bust: "88", waist: "68", hips: "94" },
  "L":   { bust: "92", waist: "72", hips: "98" },
  "XL":  { bust: "96", waist: "76", hips: "102" },
  "XXL": { bust: "100", waist: "80", hips: "106" },
  "3XL": { bust: "108", waist: "88", hips: "114" },
};

const SKIN_TONES = [
  { key: "very_light", label: "Çok Açık", hex: "#FDDBB4" },
  { key: "light",      label: "Açık",     hex: "#E8B899" },
  { key: "medium",     label: "Orta",     hex: "#C68642" },
  { key: "tan",        label: "Buğday",   hex: "#8D5524" },
  { key: "dark",       label: "Koyu",     hex: "#4A2A12" },
];

const EYE_COLORS = [
  { key: "brown",  label: "Kahverengi", hex: "#6B3A2A" },
  { key: "black",  label: "Siyah",      hex: "#1A1008" },
  { key: "blue",   label: "Mavi",       hex: "#3A6EA5" },
  { key: "green",  label: "Yeşil",      hex: "#3A7D44" },
  { key: "hazel",  label: "Ela",        hex: "#8B6914" },
  { key: "gray",   label: "Gri",        hex: "#7A8FA6" },
];

const HAIR_COLORS = [
  { key: "black",       label: "Siyah",       hex: "#1A1008" },
  { key: "dark_brown",  label: "Koyu Kahve",  hex: "#3B2314" },
  { key: "brown",       label: "Kahverengi",  hex: "#6B4226" },
  { key: "light_brown", label: "Açık Kahve",  hex: "#A0522D" },
  { key: "blonde",      label: "Sarı",        hex: "#D4A017" },
  { key: "red",         label: "Kızıl",       hex: "#8B2500" },
  { key: "gray",        label: "Gri",         hex: "#888888" },
  { key: "white",       label: "Beyaz",       hex: "#E8E8E8" },
];

const HAIR_STYLES = [
  { key: "straight",  label: "Düz" },
  { key: "wavy",      label: "Dalgalı" },
  { key: "curly",     label: "Kıvırcık" },
  { key: "short",     label: "Kısa" },
  { key: "long",      label: "Uzun" },
  { key: "bun",       label: "Topuz" },
  { key: "ponytail",  label: "At Kuyruğu" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Photos
  const [face1, setFace1] = useState<File | null>(null);
  const [body, setBody] = useState<File | null>(null);

  // Appearance
  const [skinTone, setSkinTone] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [hairStyle, setHairStyle] = useState("");

  // Measurements
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [bustCm, setBustCm] = useState("");
  const [waistCm, setWaistCm] = useState("");
  const [hipsCm, setHipsCm] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSizeSelect(size: string) {
    setSelectedSize(size);
    const s = TR_SIZES[size];
    setBustCm(s.bust);
    setWaistCm(s.waist);
    setHipsCm(s.hips);
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const formData = new FormData();
    if (face1) formData.append("face1", face1);
    if (body) formData.append("body", body);
    if (heightCm) formData.append("heightCm", heightCm);
    if (weightKg) formData.append("weightKg", weightKg);
    if (bustCm) formData.append("bustCm", bustCm);
    if (waistCm) formData.append("waistCm", waistCm);
    if (hipsCm) formData.append("hipsCm", hipsCm);
    if (skinTone) formData.append("skinTone", skinTone);
    if (eyeColor) formData.append("eyeColor", eyeColor);
    if (hairColor) formData.append("hairColor", hairColor);
    if (hairStyle) formData.append("hairStyle", hairStyle);
    if (extraNotes) formData.append("extraNotes", extraNotes);

    const res = await fetch("/api/avatar/create", { method: "POST", body: formData });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || "Bir hata oluştu.");
    } else {
      router.push("/dashboard");
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#0f0a1e] flex flex-col items-center justify-center px-4 py-12">
      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-lavender-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <a href="/" className="font-display font-bold text-white text-2xl tracking-tight mb-6 block">e-cabin</a>
          <h1 className="font-display font-bold text-2xl text-white">Avatarını Oluştur</h1>
          <p className="text-white/40 mt-1 text-sm">
            Adım {step + 1} / {STEPS.length} — {STEPS[step]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lavender-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-8 px-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? "bg-lavender-500 text-white" :
                i === step ? "bg-lavender-500/30 border-2 border-lavender-500 text-lavender-300" :
                "bg-white/10 text-white/30"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-[10px] hidden sm:block ${i === step ? "text-lavender-300" : "text-white/30"}`}>{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">

          {/* Step 0: Face photo */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-white/50">
                Net bir yüz fotoğrafı yükle. İyi aydınlatma ve net yüz görünürlüğü önemli.
              </p>
              <div className="max-w-[200px] mx-auto w-full">
                <ImageUploader label="Yüz Fotoğrafı" hint="Öne bakış, iyi ışık" onChange={setFace1} />
              </div>
              <button
                disabled={!face1}
                onClick={() => setStep(1)}
                className="w-full py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-40"
              >
                Devam Et →
              </button>
            </div>
          )}

          {/* Step 1: Body photo */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-white/50">
                Baş-ayak arası görünen, düz duruş, sade kıyafetle tam boy fotoğrafı yükle.
              </p>
              <div className="max-w-[200px] mx-auto w-full">
                <ImageUploader label="Boy Fotoğrafı" hint="Tam boy, öne bakış" onChange={setBody} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex-1 py-3 font-semibold bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition">
                  ← Geri
                </button>
                <button
                  disabled={!body}
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-40"
                >
                  Devam Et →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Appearance */}
          {step === 2 && (
            <div className="flex flex-col gap-6">

              {/* Skin tone */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white">Ten Rengi</label>
                <div className="flex gap-3">
                  {SKIN_TONES.map((tone) => (
                    <button
                      key={tone.key}
                      onClick={() => setSkinTone(tone.key)}
                      title={tone.label}
                      className={`flex flex-col items-center gap-1.5 flex-1 transition`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          skinTone === tone.key
                            ? "border-lavender-400 scale-110 shadow-lg shadow-lavender-500/30"
                            : "border-white/20 hover:border-white/50"
                        }`}
                        style={{ backgroundColor: tone.hex }}
                      />
                      <span className={`text-[10px] ${skinTone === tone.key ? "text-lavender-300" : "text-white/40"}`}>
                        {tone.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eye color */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white">Göz Rengi</label>
                <div className="flex flex-wrap gap-2">
                  {EYE_COLORS.map((color) => (
                    <button
                      key={color.key}
                      onClick={() => setEyeColor(color.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                        eyeColor === color.key
                          ? "border-lavender-500 bg-lavender-500/20 text-lavender-300"
                          : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: color.hex }} />
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair color */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white">Saç Rengi</label>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map((color) => (
                    <button
                      key={color.key}
                      onClick={() => setHairColor(color.key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition ${
                        hairColor === color.key
                          ? "border-lavender-500 bg-lavender-500/20 text-lavender-300"
                          : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair style */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-white">Saç Şekli</label>
                <div className="flex flex-wrap gap-2">
                  {HAIR_STYLES.map((style) => (
                    <button
                      key={style.key}
                      onClick={() => setHairStyle(style.key)}
                      className={`px-4 py-2 rounded-xl border text-xs font-semibold transition ${
                        hairStyle === style.key
                          ? "border-lavender-500 bg-lavender-500/20 text-lavender-300"
                          : "border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-3 font-semibold bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition">
                  ← Geri
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition"
                >
                  Devam Et →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Measurements */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/60">Boy (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="165"
                    className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/60">Kilo (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="60"
                    className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-white/60">Türkiye Beden</label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(TR_SIZES).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                        selectedSize === size
                          ? "bg-lavender-500/30 border-lavender-500/60 text-lavender-300"
                          : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Göğüs (cm)", value: bustCm, set: setBustCm, placeholder: "88" },
                  { label: "Bel (cm)", value: waistCm, set: setWaistCm, placeholder: "68" },
                  { label: "Kalça (cm)", value: hipsCm, set: setHipsCm, placeholder: "94" },
                ].map(({ label, value, set, placeholder }) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-white/60">{label}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => { set(e.target.value); setSelectedSize(""); }}
                      placeholder={placeholder}
                      className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">Ek Notlar (opsiyonel)</label>
                <textarea
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="Örn: atletik yapı, uzun boyun..."
                  rows={2}
                  className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:ring-2 focus:ring-lavender-500/50 focus:border-lavender-500/50 transition resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="flex-1 py-3 font-semibold bg-white/5 border border-white/10 text-white/60 rounded-xl hover:bg-white/10 hover:text-white transition disabled:opacity-40"
                >
                  ← Geri
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 font-semibold bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-xl hover:from-lavender-400 hover:to-purple-400 transition disabled:opacity-60"
                >
                  {loading ? "Avatarın hazırlanıyor..." : "Avatarımı Oluştur ✨"}
                </button>
              </div>

              {loading && (
                <p className="text-center text-xs text-white/40 animate-pulse">
                  Bu işlem 20–40 saniye sürebilir, lütfen bekle...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
