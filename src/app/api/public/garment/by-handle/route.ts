import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function normalizeHandle(handle: string): string {
  return handle
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
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
  const garment = garments.find(g => normalizeHandle(g.shopify_handle || "") === normalizedInput);

  if (!garment) {
    return NextResponse.json({ garment: null });
  }

  return NextResponse.json({ garment });
}
