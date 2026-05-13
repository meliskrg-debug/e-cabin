import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/seller/login",
  "/seller/register",
  "/tryon",
  "/api/public",
  "/api/tryon",
  "/widget.js",
];
const SELLER_PATHS = ["/seller/dashboard", "/seller/garments", "/seller/embed"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.startsWith("/seller") ? "/seller/login" : "/login";
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && SELLER_PATHS.some((p) => pathname.startsWith(p))) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
    );
    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("owner_user_id", user.id)
      .single();

    if (!brand) {
      const url = request.nextUrl.clone();
      url.pathname = "/seller/register";
      return NextResponse.redirect(url);
    }
  }

  if (
    user &&
    (pathname === "/seller/login" || pathname === "/seller/register")
  ) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
    );
    const { data: brand } = await supabase
      .from("brands")
      .select("id")
      .eq("owner_user_id", user.id)
      .single();

    if (brand) {
      const url = request.nextUrl.clone();
      url.pathname = "/seller/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|widget\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
