import type { Metadata } from "next";
import { serviceClient, type BlogPost } from "@/lib/supabase";
import Nav from "@/components/Nav";
import BlogFeed from "@/components/blog/BlogFeed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LitFlo Blog — Research Tools & PhD Productivity",
  description: "Practical guides on literature review tools, academic AI, and PhD productivity from researchers who use them every day.",
  alternates: { canonical: "https://litflo.ai/blog" },
  openGraph: {
    title: "LitFlo Blog — Research Tools & PhD Productivity",
    description: "Practical guides on literature review tools, academic AI, and PhD productivity.",
    url: "https://litflo.ai/blog",
    type: "website",
  },
};

export default async function BlogIndex() {
  const { data } = await serviceClient()
    .from("blog_posts")
    .select("id,title,slug,meta_description,keywords,hero_image_url,hero_image_alt,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const posts = (data || []) as Pick<
    BlogPost,
    "id" | "title" | "slug" | "meta_description" | "keywords" | "hero_image_url" | "hero_image_alt" | "published_at"
  >[];

  return (
    <div className="page-bg">
      <div className="page-haze" />
      <Nav active="blog" />

      <main className="blog-feed-main" style={{ position: "relative", zIndex: 1, maxWidth: 1160, margin: "0 auto", padding: "52px 40px 100px" }}>
        <div style={{ marginBottom: 52 }}>
          <p className="eyebrow">LitFlo Blog</p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700,
            color: "#f0ebe2",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}>
            Research tools &amp; <em style={{ color: "#6B9E7A", fontStyle: "italic" }}>PhD productivity</em>
          </h1>
          <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(217,210,195,0.55)", lineHeight: 1.75, maxWidth: 520 }}>
            Practical guides from researchers — on literature review, academic AI, and staying on top of your field.
          </p>
        </div>

        <BlogFeed posts={posts} />
      </main>

      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(107,158,122,0.1)", padding: "28px 52px", textAlign: "center" }}>
        <a href="https://litflo.ai" style={{ fontSize: 13, color: "rgba(107,158,122,0.6)", fontWeight: 300 }}>← Back to LitFlo</a>
      </footer>
    </div>
  );
}
