import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

const admin = createAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getBrand(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("brands").select("id, website_url").eq("owner_user_id", userId).single();
  return data;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const brand = await getBrand(supabase, user.id);
  if (!brand) return NextResponse.json({ error: "no brand" }, { status: 403 });

  const { shopifyDomain } = await req.json();
  if (!shopifyDomain) return NextResponse.json({ error: "shopifyDomain gerekli" }, { status: 400 });

  const domain = shopifyDomain.replace("https://", "").replace("http://", "").replace(/\/$/, "");

  // Shopify public products API
  const res = await fetch(`https://${domain}/products.json?limit=250`);
  if (!res.ok) return NextResponse.json({ error: "Shopify'a ulaşılamadı" }, { status: 400 });

  const { products } = await res.json();
  if (!products?.length) return NextResponse.json({ count: 0 });

  let imported = 0;
  let skipped = 0;

  console.log("Total products from Shopify:", products.length);
  console.log("First product sample:", JSON.stringify(products[0]).slice(0, 500));

  for (const product of products) {
    const image = product.images?.[0]?.src;
    console.log(`Product: ${product.title} | image: ${image} | handle: ${product.handle}`);
    if (!image) { skipped++; continue; }

    const handle = product.handle;
    const name = product.title;
    const shopifyProductId = String(product.id);

    // Upsert by shopify_product_id
    const { error } = await admin
      .from("brand_garments")
      .upsert({
        brand_id: brand.id,
        name,
        image_url: image,
        shopify_product_id: shopifyProductId,
        shopify_handle: handle,
        shopify_domain: domain,
        category: "diger",
        is_active: true,
      }, { onConflict: "brand_id,shopify_product_id" });

    console.log(`Upsert result for ${name}: error=${JSON.stringify(error)}`);
    if (!error) imported++;
    else skipped++;
  }

  return NextResponse.json({ imported, skipped, total: products.length });
}
