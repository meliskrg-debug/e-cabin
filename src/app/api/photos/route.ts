import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ photos: photos || [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("photo") as File | null;
  const label = (form.get("label") as string) || "";

  if (!file) return NextResponse.json({ error: "Fotoğraf eksik" }, { status: 400 });

  const buf = Buffer.from(await file.arrayBuffer());
  const path = `${user.id}/photo-${Date.now()}.jpg`;

  const { error: upErr } = await supabase.storage
    .from("user-uploads")
    .upload(path, buf, { contentType: file.type, upsert: false });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("user-uploads").getPublicUrl(path);

  const { data: row, error } = await supabase
    .from("photos")
    .insert({ user_id: user.id, photo_url: publicUrl, label })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ photo: row });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await supabase.from("photos").delete().eq("id", id).eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
