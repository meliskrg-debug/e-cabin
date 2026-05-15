import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const body = form.get("body") as File | null;

  if (!body) {
    return NextResponse.json({ error: "Fotoğraf gerekli" }, { status: 400 });
  }

  const buf = Buffer.from(await body.arrayBuffer());
  const ext = body.type === "image/png" ? "png" : "jpg";
  const path = `${user.id}/avatar-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, buf, { contentType: body.type, upsert: false });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  await supabase.from("avatars").update({ is_active: false }).eq("user_id", user.id);

  const { data: row, error } = await supabase
    .from("avatars")
    .insert({
      user_id: user.id,
      avatar_url: publicUrl,
      is_active: true,
      pose: "front",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ avatar: row });
}
