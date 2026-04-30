import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateImage } from "@/lib/nanobanana";
import { TRYON_SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const sourceType = form.get("sourceType") as "avatar" | "gallery";
  const garment = form.get("garment") as File | null;
  const garmentUrl = form.get("garmentUrl") as string | null;

  if (!garment && !garmentUrl) return NextResponse.json({ error: "Kıyafet fotoğrafı eksik" }, { status: 400 });

  let sourceRef: { mimeType: string; data: string };
  let sourceImageUrl: string;
  let avatarId: string | null = null;

  if (sourceType === "avatar") {
    const { data: active } = await supabase
      .from("avatars")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!active) return NextResponse.json({ error: "Aktif avatar bulunamadı. Önce /onboarding sayfasından avatar oluştur." }, { status: 400 });

    console.log("Fetching avatar:", active.avatar_url);
    const res = await fetch(active.avatar_url);
    if (!res.ok) {
      console.error("Avatar fetch failed:", res.status, res.statusText);
      return NextResponse.json({ error: "Avatar görseli yüklenemedi." }, { status: 500 });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    sourceRef = { mimeType: "image/png", data: buf.toString("base64") };
    sourceImageUrl = active.avatar_url;
    avatarId = active.id;
  } else {
    const galleryImageUrl = form.get("galleryImageUrl") as string | null;
    const galleryFile = form.get("galleryImage") as File | null;

    if (galleryImageUrl) {
      // Use already-saved photo URL
      const res = await fetch(galleryImageUrl);
      const buf = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get("content-type") || "image/jpeg";
      sourceRef = { mimeType: contentType, data: buf.toString("base64") };
      sourceImageUrl = galleryImageUrl;
    } else if (galleryFile) {
      const buf = Buffer.from(await galleryFile.arrayBuffer());
      sourceRef = { mimeType: galleryFile.type, data: buf.toString("base64") };
      const gpath = `${user.id}/src-${Date.now()}.jpg`;
      await supabase.storage.from("user-uploads").upload(gpath, buf, { contentType: galleryFile.type });
      const { data: { publicUrl } } = supabase.storage.from("user-uploads").getPublicUrl(gpath);
      sourceImageUrl = publicUrl;
      // Auto-save to photos library
      await supabase.from("photos").insert({ user_id: user.id, photo_url: publicUrl });
    } else {
      return NextResponse.json({ error: "Galeri fotoğrafı eksik" }, { status: 400 });
    }
  }

  let garmentRef: { mimeType: string; data: string };
  let finalGarmentUrl: string;

  if (garment) {
    const garmentBuf = Buffer.from(await garment.arrayBuffer());
    garmentRef = { mimeType: garment.type, data: garmentBuf.toString("base64") };
    const gpath = `${user.id}/garment-${Date.now()}.png`;
    await supabase.storage.from("user-uploads").upload(gpath, garmentBuf, { contentType: garment.type });
    const { data: { publicUrl } } = supabase.storage.from("user-uploads").getPublicUrl(gpath);
    finalGarmentUrl = publicUrl;
  } else {
    console.log("Fetching garment URL:", garmentUrl);
    const res = await fetch(garmentUrl!);
    if (!res.ok) {
      console.error("Garment fetch failed:", res.status, res.statusText);
      return NextResponse.json({ error: "Kıyafet görseli yüklenemedi." }, { status: 500 });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "image/jpeg";
    garmentRef = { mimeType: contentType, data: buf.toString("base64") };
    finalGarmentUrl = garmentUrl!;
  }

  let result: { mimeType: string; data: string };
  try {
    result = await generateImage({
      prompt: TRYON_SYSTEM_PROMPT(),
      referenceImages: [sourceRef, garmentRef],
    });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ error: "Görsel üretilemedi." }, { status: 500 });
  }

  const rpath = `${user.id}/tryon-${Date.now()}.png`;
  const { error: uploadErr } = await supabase.storage
    .from("tryons")
    .upload(rpath, Buffer.from(result.data, "base64"), { contentType: result.mimeType });

  if (uploadErr) {
    console.error("Storage upload error:", uploadErr);
    return NextResponse.json({ error: "Sonuç yüklenemedi: " + uploadErr.message }, { status: 500 });
  }

  const { data: { publicUrl: resultUrl } } = supabase.storage.from("tryons").getPublicUrl(rpath);

  const { data: row, error: insertErr } = await supabase
    .from("tryons")
    .insert({
      user_id: user.id,
      avatar_id: avatarId,
      source_type: sourceType,
      source_image_url: sourceImageUrl,
      garment_image_url: finalGarmentUrl,
      result_image_url: resultUrl,
    })
    .select()
    .single();

  if (insertErr) {
    console.error("DB insert error:", insertErr);
    // Still return the result URL even if DB insert fails
    return NextResponse.json({ tryon: { result_image_url: resultUrl } });
  }

  return NextResponse.json({ tryon: row });
}
