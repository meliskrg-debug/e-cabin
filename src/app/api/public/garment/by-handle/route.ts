import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const TR_MAP: Record<string, string> = {
  "ı": "i", // ı
  "İ": "i", // İ
  "ğ": "g", // ğ
  "Ğ": "g", // Ğ
  "ş": "s", // ş
  "Ş": "s", // Ş
  "ö": "o", // ö
  "Ö": "o", // Ö
  "ü": "u", // ü
  "Ü": "u", // Ü
  "ç": "c", // ç
  "Ç": "c", // Ç
  "̇": "",  // combining dot above (i̇)
};

function normalizeHandle(handle: string): string {
  return handle
    .normalize("NFD")
    .split("")
    .map((ch) => {
      if (ch in TR_MAP) return TR_MAP[ch];
      const code = ch.codePointAt(0) ?? 0;
      // strip combining diacritical marks (U+0300–U+036F)
      if (code >= 0x0300 && code <= 0x036f) return "";
      return ch;
    })
    .join("")
    .toLowerCase();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");
  const handle = searchParams.get("handle");

  if (!domain || !handle) {
    return NextResponse.json({ error: "domain ve handle gerekli" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: garments } = await supabase
    .from("brand_garments")
    .select("id, name, image_url, category, shopify_handle, shopify_domain, brand_id")
    .eq("shopify_domain", domain)
    .eq("is_active", true);

  if (!garments?.length) {
    return NextResponse.json({ garment: null });
  }

  const normalizedInput = normalizeHandle(handle);
  console.log("Input handle:", handle, "→", normalizedInput);

  const garment = garments.find((g) => {
    const norm = normalizeHandle(g.shopify_handle || "");
    console.log("DB:", g.shopify_handle, "→", norm, norm === normalizedInput ? "MATCH" : "");
    return norm === normalizedInput;
  });

  return NextResponse.json({ garment: garment || null });
}
