import type { MetadataRoute } from "next";
import { serviceClient } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = serviceClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const posts: MetadataRoute.Sitemap = (data || []).map(p => ({
    url: `https://litflo.ai/blog/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: "https://litflo.ai/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...posts,
  ];
}
