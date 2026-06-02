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

  return NextResponse.redirect(new URL("/admin/published", req.url));
}
