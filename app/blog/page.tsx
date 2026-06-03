import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { serviceClient, type BlogPost } from "@/lib/supabase";
import Nav from "@/components/Nav";

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
  const supabase = serviceClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,title,slug,meta_description,keywords,hero_image_url,hero_image_alt,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  const posts = (data || []) as BlogPost[];

  return (
    <div className="page-bg">
      <div className="page-haze" />
      <Nav active="blog" />

      <main style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "48px 52px 80px" }}>

        <div style={{ marginBottom: 48 }}>
          <p className="eyebrow">LitFlo Blog</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: "#f0ebe2", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Research tools &amp; <em style={{ color: "#6B9E7A", fontStyle: "italic" }}>PhD productivity</em>
          </h1>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(217,210,195,0.55)", lineHeight: 1.75, maxWidth: 520 }}>
            Practical guides from researchers — on literature review, academic AI, and staying on top of your field.
          </p>
        </div>

        {posts.length === 0 ? (
          <p style={{ color: "rgba(217,210,195,0.4)", fontSize: 14, fontWeight: 300 }}>No posts yet — check back soon.</p>
        ) : (
          <div style={{ display: "grid", gap: 20 }}>
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="post-card">
                <div style={{ display: "grid", gridTemplateColumns: post.hero_image_url ? "1fr 220px" : "1fr", gap: 20, alignItems: "center" }}>
                  <div>
                    {post.keywords?.[0] && <p className="keyword-chip" style={{ marginBottom: 8 }}>{post.keywords[0]}</p>}
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#f0ebe2", marginBottom: 8, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                      {post.title}
                    </h2>
                    {post.meta_description && (
                      <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(217,210,195,0.5)", lineHeight: 1.65 }}>{post.meta_description}</p>
                    )}
                    {post.published_at && (
                      <p style={{ fontSize: 12, color: "rgba(217,210,195,0.3)", marginTop: 10, fontWeight: 300 }}>
                        {new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  {post.hero_image_url && (
                    <div style={{ borderRadius: 8, overflow: "hidden", height: 130, position: "relative" }}>
                      <Image src={post.hero_image_url} alt={post.hero_image_alt || post.title} fill style={{ objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(107,158,122,0.1)", padding: "28px 52px", textAlign: "center" }}>
        <a href="https://litflo.ai" style={{ fontSize: 13, color: "rgba(107,158,122,0.6)", fontWeight: 300 }}>← Back to LitFlo</a>
      </footer>
    </div>
  );
}
