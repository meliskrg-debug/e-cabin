import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getBrand(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("brands").select("id").eq("owner_user_id", userId).single();
  return data;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const brand = await getBrand(supabase, user.id);
  if (!brand) return NextResponse.json({ error: "no brand" }, { status: 403 });

  const { data: garments } = await supabase
    .from("brand_garments")
    .select("*")
    .eq("brand_id", brand.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ garments: garments || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const brand = await getBrand(supabase, user.id);
  if (!brand) return NextResponse.json({ error: "no brand" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("image") as File | null;
  const name = (form.get("name") as string) || "Ürün";
  const category = (form.get("category") as string) || "diger";
  const externalProductUrl = (form.get("external_product_url") as string) || null;

  if (!file) return NextResponse.json({ error: "Görsel gerekli" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const path = `${brand.id}/${Date.now()}.jpg`;
  const { error: upErr } = await admin.storage
    .from("brand-garments")
    .upload(path, buf, { contentType: file.type, upsert: false });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = admin.storage.from("brand-garments").getPublicUrl(path);

  const { data: garment, error } = await supabase
    .from("brand_garments")
    .insert({ brand_id: brand.id, name, image_url: publicUrl, category, external_product_url: externalProductUrl })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ garment });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const brand = await getBrand(supabase, user.id);
  if (!brand) return NextResponse.json({ error: "no brand" }, { status: 403 });

  const { id } = await req.json();
  await supabase.from("brand_garments").delete().eq("id", id).eq("brand_id", brand.id);

  return NextResponse.json({ ok: true });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const brand = await getBrand(supabase, user.id);
  if (!brand) return NextResponse.json({ error: "no brand" }, { status: 403 });

  const { id, is_active } = await req.json();
  await supabase.from("brand_garments").update({ is_active }).eq("id", id).eq("brand_id", brand.id);

  return NextResponse.json({ ok: true });
}
