import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateImage } from "@/lib/nanobanana";
import { AVATAR_POSE_PROMPT } from "@/lib/prompts";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  // Get active front avatar
  const { data: frontAvatar } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", user.id)
    .eq("pose", "front")
    .eq("is_active", true)
    .single();

  if (!frontAvatar) return NextResponse.json({ error: "Önce ön avatar oluştur" }, { status: 400 });

  // Fetch front avatar image
  const res = await fetch(frontAvatar.avatar_url);
  if (!res.ok) return NextResponse.json({ error: "Avatar görseli alınamadı" }, { status: 500 });
  const buf = Buffer.from(await res.arrayBuffer());
  const frontRef = { mimeType: "image/png", data: buf.toString("base64") };

  const poses: Array<"hands_on_hips_1" | "hands_on_hips_2"> = ["hands_on_hips_1", "hands_on_hips_2"];
  const results = [];

  for (const pose of poses) {
    try {
      const result = await generateImage({
        prompt: AVATAR_POSE_PROMPT(pose),
        referenceImages: [frontRef],
      });

      const path = `${user.id}/avatar-${pose}-${Date.now()}.png`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, Buffer.from(result.data, "base64"), { contentType: result.mimeType, upsert: false });

      if (upErr) { results.push({ pose, error: upErr.message }); continue; }

      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

      // Delete old pose if exists
      await supabase.from("avatars").delete().eq("user_id", user.id).eq("pose", pose);

      const { data: row } = await supabase.from("avatars").insert({
        user_id: user.id,
        avatar_url: publicUrl,
        pose,
        is_active: true,
        height_cm: frontAvatar.height_cm,
        bust_cm: frontAvatar.bust_cm,
        waist_cm: frontAvatar.waist_cm,
        hips_cm: frontAvatar.hips_cm,
      }).select().single();

      results.push({ pose, avatar: row });
    } catch (err) {
      console.error("Pose generation error:", pose, err);
      results.push({ pose, error: String(err) });
    }
  }

  return NextResponse.json({ results });
}
