import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");
  const handle = searchParams.get("handle");

  if (!domain || !handle) {
    return NextResponse.json({ error: "domain ve handle gerekli" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: garment } = await supabase
    .from("brand_garments")
    .select("id, name, image_url, category, shopify_handle, shopify_domain, brand_id, brands(name, slug)")
    .eq("shopify_domain", domain)
    .eq("shopify_handle", handle)
    .eq("is_active", true)
    .single();

  if (!garment) {
    return NextResponse.json({ garment: null });
  }

  return NextResponse.json({ garment });
}
