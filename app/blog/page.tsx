import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { serviceClient } from "@/lib/supabase";
import Nav from "@/components/Nav";
import type { BlogPost } from "@/lib/supabase";

export const revalidate = 60;

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
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id,title,slug,meta_description,keywords,hero_image_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  const published = (posts || []) as BlogPost[];

  return (
    <>
      <Nav active="blog" />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,158,122,0.7)", margin: "0 0 12px" }}>
            LitFlo Blog
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: "#f0ebe2", margin: "0 0 16px", lineHeight: 1.15 }}>
            Research tools &amp; PhD productivity
          </h1>
          <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(217,210,195,0.55)", lineHeight: 1.75, maxWidth: 560, margin: 0 }}>
            Practical guides from researchers — on literature review, academic AI, and staying on top of your field.
          </p>
        </div>

        {/* Post grid */}
        {published.length === 0 ? (
          <p style={{ color: "rgba(217,210,195,0.4)", fontSize: 14 }}>No posts yet — check back soon.</p>
        ) : (
          <div style={{ display: "grid", gap: 28 }}>
            {published.map((post, i) => (
              <PostCard key={post.id} post={post} featured={i === 0} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function PostCard({ post, featured }: { post: BlogPost; featured: boolean }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <article style={{
        display: "grid",
        gridTemplateColumns: featured || !post.hero_image_url ? "1fr" : "1fr 260px",
        gap: 24,
        background: "rgba(107,158,122,0.04)",
        border: "1px solid rgba(107,158,122,0.15)",
        borderRadius: 12,
        padding: 24,
        transition: "border-color 0.2s, background 0.2s",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,158,122,0.4)";
          (e.currentTarget as HTMLElement).style.background = "rgba(107,158,122,0.07)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,158,122,0.15)";
          (e.currentTarget as HTMLElement).style.background = "rgba(107,158,122,0.04)";
        }}
      >
        <div>
          {post.keywords?.[0] && (
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(107,158,122,0.7)" }}>
              {post.keywords[0]}
            </span>
          )}
          <h2 style={{ fontSize: featured ? 22 : 17, fontWeight: 700, color: "#f0ebe2", margin: "8px 0 10px", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            {post.title}
          </h2>
          {post.meta_description && (
            <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(217,210,195,0.55)", lineHeight: 1.7, margin: "0 0 12px" }}>
              {post.meta_description}
            </p>
          )}
          {date && <span style={{ fontSize: 12, color: "rgba(217,210,195,0.35)", fontWeight: 300 }}>{date}</span>}
        </div>
        {!featured && post.hero_image_url && (
          <div style={{ borderRadius: 8, overflow: "hidden", height: 140, position: "relative" }}>
            <Image src={post.hero_image_url} alt={post.hero_image_alt || post.title} fill style={{ objectFit: "cover" }} />
          </div>
        )}
        {featured && post.hero_image_url && (
          <div style={{ borderRadius: 8, overflow: "hidden", height: 220, position: "relative", marginTop: 16 }}>
            <Image src={post.hero_image_url} alt={post.hero_image_alt || post.title} fill style={{ objectFit: "cover" }} />
          </div>
        )}
      </article>
    </Link>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(107,158,122,0.1)", padding: "32px 24px", textAlign: "center" }}>
      <a href="https://litflo.ai" style={{ fontSize: 13, color: "rgba(107,158,122,0.7)", textDecoration: "none", fontWeight: 300 }}>
        ← Back to LitFlo
      </a>
    </footer>
  );
}
