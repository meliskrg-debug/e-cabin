import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, password, brandName, slug, websiteUrl } = await req.json();

  if (!email || !password || !brandName || !slug) {
    return NextResponse.json({ error: "Eksik alan" }, { status: 400 });
  }

  // Create user via admin (no email confirm required)
  const { data: authData, error: authErr } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authErr || !authData.user) {
    return NextResponse.json({ error: authErr?.message || "Kayıt başarısız" }, { status: 400 });
  }

  // Create brand via admin (bypasses RLS)
  const { error: brandErr } = await adminClient.from("brands").insert({
    owner_user_id: authData.user.id,
    name: brandName,
    slug,
    website_url: websiteUrl || null,
  });

  if (brandErr) {
    // Rollback: delete user
    await adminClient.auth.admin.deleteUser(authData.user.id);
    if (brandErr.message.includes("unique")) {
      return NextResponse.json({ error: "Bu marka URL'si zaten kullanılıyor." }, { status: 400 });
    }
    return NextResponse.json({ error: brandErr.message }, { status: 500 });
  }

  // Sign in to establish session
  const supabase = await createServerClient();
  await supabase.auth.signInWithPassword({ email, password });

  return NextResponse.json({ ok: true });
}
