import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function normalizeHandle(handle: string): string {
  return handle
    .replace(/ı/g, "i") // ı → i (dotless i)
    .replace(/İ/g, "i") // İ → i (I with dot)
    .replace(/ğ/g, "g") // ğ → g
    .replace(/ş/g, "s") // ş → s
    .replace(/ö/g, "o") // ö → o
    .replace(/ü/g, "u") // ü → u
    .replace(/ç/g, "c") // ç → c
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics (including dotted i)
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
  console.log("Looking for handle:", handle, "→ normalized:", normalizedInput);

  const garment = garments.find(g => {
    const norm = normalizeHandle(g.shopify_handle || "");
    console.log("DB handle:", g.shopify_handle, "→ normalized:", norm, "| match:", norm === normalizedInput);
    return norm === normalizedInput;
  });

  return NextResponse.json({ garment: garment || null });
}
