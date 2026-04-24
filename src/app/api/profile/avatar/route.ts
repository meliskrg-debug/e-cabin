import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await req.json();

  await supabase.from("avatars").update({ is_active: false }).eq("user_id", user.id);
  await supabase.from("avatars").update({ is_active: true }).eq("id", id).eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
