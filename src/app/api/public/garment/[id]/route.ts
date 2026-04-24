import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: garment, error } = await supabase
    .from("brand_garments")
    .select("id, name, image_url, category, external_product_url, brand_id, brands(name, slug, logo_url)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !garment) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({ garment });
}
