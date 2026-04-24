import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: items } = await supabase
    .from("wardrobe")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ items: items || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("item") as File | null;
  const name = (form.get("name") as string) || "";
  const category = (form.get("category") as string) || "diger";

  if (!file) return NextResponse.json({ error: "Dosya eksik" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const path = `${user.id}/wardrobe-${Date.now()}.jpg`;
  const { error: upErr } = await supabase.storage
    .from("user-uploads")
    .upload(path, buf, { contentType: file.type });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("user-uploads").getPublicUrl(path);

  const { data: row } = await supabase
    .from("wardrobe")
    .insert({ user_id: user.id, item_url: publicUrl, name: name || null, category })
    .select()
    .single();

  return NextResponse.json({ item: row });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await supabase.from("wardrobe").delete().eq("id", id).eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
