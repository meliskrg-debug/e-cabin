import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateImage } from "@/lib/nanobanana";
import { AVATAR_BACK_PROMPT } from "@/lib/prompts";

export const maxDuration = 600;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { avatarId } = await req.json();
  if (!avatarId) return NextResponse.json({ error: "avatarId gerekli" }, { status: 400 });

  const { data: avatar } = await supabase
    .from("avatars")
    .select("*")
    .eq("id", avatarId)
    .eq("user_id", user.id)
    .single();

  if (!avatar) return NextResponse.json({ error: "Avatar bulunamadı" }, { status: 404 });

  const res = await fetch(avatar.avatar_url);
  const buf = Buffer.from(await res.arrayBuffer());
  const frontRef = { mimeType: "image/png", data: buf.toString("base64") };

  let result: { mimeType: string; data: string };
  try {
    result = await generateImage({
      prompt: AVATAR_BACK_PROMPT(),
      referenceImages: [frontRef],
    });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Arka görünüm üretilemedi." }, { status: 500 });
  }

  const path = `${user.id}/avatar-back-${Date.now()}.png`;
  await supabase.storage
    .from("avatars")
    .upload(path, Buffer.from(result.data, "base64"), { contentType: result.mimeType });

  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

  await supabase.from("avatars").update({ avatar_back_url: publicUrl }).eq("id", avatarId);

  return NextResponse.json({ backUrl: publicUrl });
}
