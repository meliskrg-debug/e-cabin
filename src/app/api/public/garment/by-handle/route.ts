import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");
  const handle = searchParams.get("handle");

  if (!domain || !handle) {
    return NextResponse.json({ error: "domain ve handle gerekli" }, { status: 400, headers: CORS_HEADERS });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: garments } = await supabase
    .from("brand_garments")
    .select("id, name, image_url, category, shopify_handle, shopify_domain, brand_id")
    .eq("shopify_domain", domain)
    .eq("is_active", true);

  if (!garments?.length) {
    return NextResponse.json({ garment: null }, { headers: CORS_HEADERS });
  }

  const normalizedInput = normalizeHandle(handle);
  console.log("Input handle:", handle, "→", normalizedInput);

  const garment = garments.find((g) => {
    const norm = normalizeHandle(g.shopify_handle || "");
    console.log("DB:", g.shopify_handle, "→", norm, norm === normalizedInput ? "MATCH" : "");
    return norm === normalizedInput;
  });

  return NextResponse.json({ garment: garment || null }, { headers: CORS_HEADERS });
}
