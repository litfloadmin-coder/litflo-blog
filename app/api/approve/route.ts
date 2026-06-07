import { NextRequest, NextResponse } from "next/server";
import * as crypto from "crypto";
import { serviceClient } from "@/lib/supabase";

function makeToken(id: string) {
  return crypto.createHmac("sha256", process.env.BLOG_APPROVAL_SECRET || "dev-secret").update(id).digest("hex");
}

export async function GET(req: NextRequest) {
  const id    = req.nextUrl.searchParams.get("id");
  const token = req.nextUrl.searchParams.get("token");

  if (!id || !token || token !== makeToken(id)) {
    return new NextResponse("Invalid or expired link.", { status: 403 });
  }

  const supabase = serviceClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending_review");

  if (error) return new NextResponse("Failed to publish post.", { status: 500 });

  const { data } = await supabase.from("blog_posts").select("slug").eq("id", id).single();
  const slug = data?.slug ?? "";

  return new NextResponse(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
    <title>Published — LitFlo Blog</title>
    <style>body{margin:0;background:#0d2b1a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'DM Sans',sans-serif;}
    .card{background:#f8faf7;border-radius:20px;padding:52px 48px;max-width:480px;text-align:center;}
    h1{margin:0 0 12px;font-size:28px;font-weight:700;color:#0d2b1a;font-family:Georgia,serif;}
    p{margin:0 0 28px;font-size:15px;color:#3a4a3c;line-height:1.7;font-weight:300;}
    a{display:inline-block;background:#1A3D2B;color:#f5f2eb;padding:13px 32px;border-radius:100px;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;}
    </style></head>
    <body><div class="card">
    <p style="margin:0 0 16px;font-size:40px;">✓</p>
    <h1>Post published</h1>
    <p>The post is now live on LitFlo Blog.</p>
    ${slug ? `<a href="https://litflo.ai/blog/${slug}">View post →</a>` : '<a href="https://litflo.ai/blog">View blog →</a>'}
    </div></body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
