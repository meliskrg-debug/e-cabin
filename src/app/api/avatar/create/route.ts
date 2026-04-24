import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateImage } from "@/lib/nanobanana";
import { AVATAR_SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 600;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const face1 = form.get("face1") as File | null;
  const body = form.get("body") as File | null;

  if (!face1 || !body) {
    return NextResponse.json({ error: "2 fotoğraf gerekli" }, { status: 400 });
  }

  const heightCm = Number(form.get("heightCm")) || undefined;
  const weightKg = Number(form.get("weightKg")) || undefined;
  const bustCm = Number(form.get("bustCm")) || undefined;
  const waistCm = Number(form.get("waistCm")) || undefined;
  const hipsCm = Number(form.get("hipsCm")) || undefined;
  const skinTone = (form.get("skinTone") as string) || undefined;
  const eyeColor = (form.get("eyeColor") as string) || undefined;
  const hairColor = (form.get("hairColor") as string) || undefined;
  const hairStyle = (form.get("hairStyle") as string) || undefined;
  const extraNotes = (form.get("extraNotes") as string) || "";

  const toRef = async (f: File) => ({
    mimeType: f.type,
    data: Buffer.from(await f.arrayBuffer()).toString("base64"),
  });

  const prompt = AVATAR_SYSTEM_PROMPT({ heightCm, weightKg, bustCm, waistCm, hipsCm, skinTone, eyeColor, hairColor, hairStyle, extraNotes });

  let image: { mimeType: string; data: string };
  try {
    image = await generateImage({
      prompt,
      referenceImages: [await toRef(face1), await toRef(body)],
    });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Avatar üretilemedi." }, { status: 500 });
  }

  const path = `${user.id}/avatar-${Date.now()}.png`;
  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, Buffer.from(image.data, "base64"), {
      contentType: image.mimeType,
      upsert: false,
    });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

  await supabase.from("avatars").update({ is_active: false }).eq("user_id", user.id);

  const { data: row, error } = await supabase
    .from("avatars")
    .insert({
      user_id: user.id,
      avatar_url: publicUrl,
      height_cm: heightCm,
      bust_cm: bustCm,
      waist_cm: waistCm,
      hips_cm: hipsCm,
      extra_notes: extraNotes,
      is_active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ avatar: row });
}
