import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceClient, type BlogPost } from "@/lib/supabase";
import Nav from "@/components/Nav";
import MarkdownBody from "@/components/MarkdownBody";

export const dynamic = "force-dynamic";

function calcReadTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 250));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await serviceClient()
    .from("blog_posts")
    .select("title,meta_description,keywords,hero_image_url,hero_image_alt,published_at,seo_title")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (!data) return {};
  const canonical = `https://litflo.ai/blog/${slug}`;
  return {
    title: data.seo_title || data.title,
    description: data.meta_description || undefined,
    keywords: data.keywords?.join(", "),
    alternates: { canonical },
    openGraph: {
      title: data.seo_title || data.title,
      description: data.meta_description || undefined,
      url: canonical,
      type: "article",
      publishedTime: data.published_at || undefined,
      images: data.hero_image_url ? [{ url: data.hero_image_url, alt: data.hero_image_alt || data.title }] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [{ data }, { data: recentData }] = await Promise.all([
    serviceClient().from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single(),
    serviceClient()
      .from("blog_posts")
      .select("id,title,slug,hero_image_url,hero_image_alt,keywords,published_at,meta_description")
      .eq("status", "published")
      .neq("slug", slug)
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  if (!data) notFound();
  const post = data as BlogPost;
  const recent = (recentData || []) as Pick<BlogPost, "id"|"title"|"slug"|"hero_image_url"|"hero_image_alt"|"keywords"|"published_at"|"meta_description">[];

  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;
  const readTime = calcReadTime(post.body);
  const category = post.keywords?.[0] ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description,
    datePublished: post.published_at,
    image: post.hero_image_url,
    author: { "@type": "Organization", name: "LitFlo", url: "https://litflo.ai" },
    publisher: { "@type": "Organization", name: "LitFlo", url: "https://litflo.ai" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://litflo.ai/blog/${slug}` },
  };

  return (
    <div className="page-bg">
      <div className="page-haze" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav active="blog" />

      <main className="blog-post-main" style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "40px 48px 100px" }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: "rgba(217,210,195,0.32)", marginBottom: 28, fontWeight: 300 }}>
          <a href="/blog" style={{ color: "rgba(107,158,122,0.65)", textDecoration: "none" }}>Blog</a>
          <span style={{ margin: "0 8px", opacity: 0.5 }}>/</span>
          <span style={{ color: "rgba(217,210,195,0.45)" }}>{post.title.length > 52 ? post.title.slice(0, 52) + "…" : post.title}</span>
        </p>

        {/* Category chip */}
        {category && (
          <p className="keyword-chip" style={{ marginBottom: 14 }}>{category}</p>
        )}

        {/* Title */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 700,
          color: "#f0ebe2",
          marginBottom: 16,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}>
          {post.title}
        </h1>

        {/* Meta line */}
        {(publishDate || readTime) && (
          <p style={{ fontSize: 13, color: "rgba(217,210,195,0.38)", marginBottom: 36, fontWeight: 300, display: "flex", alignItems: "center", gap: 10 }}>
            {publishDate && <span>{publishDate}</span>}
            {publishDate && <span style={{ opacity: 0.4 }}>·</span>}
            <span>{readTime} min read</span>
          </p>
        )}

        {/* Hero image */}
        {post.hero_image_url && (
          <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 44, position: "relative", height: 420 }}>
            <Image
              src={post.hero_image_url}
              alt={post.hero_image_alt || post.title}
              fill
              sizes="(max-width: 760px) 100vw, 760px"
              style={{ objectFit: "cover" }}
              priority
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(13,26,19,0.55) 0%, transparent 50%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "rgba(26,45,40,0.2)",
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }} />
          </div>
        )}

        {/* Infographic */}
        {post.infographic_svg && (
          <div
            style={{ margin: "0 0 44px", borderRadius: 10, overflow: "hidden", lineHeight: 0 }}
            dangerouslySetInnerHTML={{ __html: post.infographic_svg }}
          />
        )}

        {/* Body */}
        <div className="prose">
          <MarkdownBody content={post.body} />
        </div>

        {/* Tags row */}
        {post.keywords && post.keywords.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(107,158,122,0.1)", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "rgba(217,210,195,0.3)", fontWeight: 300, marginRight: 4 }}>Topics:</span>
            {post.keywords.map(kw => (
              <Link
                key={kw}
                href={`/blog?category=${encodeURIComponent(kw)}`}
                style={{
                  padding: "5px 13px",
                  borderRadius: 100,
                  border: "1px solid rgba(107,158,122,0.22)",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(107,158,122,0.75)",
                  textDecoration: "none",
                  transition: "border-color 0.18s ease, color 0.18s ease",
                }}
              >
                {kw}
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{
          marginTop: 52,
          padding: "32px 32px",
          background: "rgba(107,158,122,0.05)",
          border: "1px solid rgba(107,158,122,0.18)",
          borderRadius: 14,
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(107,158,122,0.06), inset 0 1px 0 rgba(107,158,122,0.08)",
        }}>
          <p className="keyword-chip" style={{ marginBottom: 12 }}>Try LitFlo</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#f0ebe2", marginBottom: 12, letterSpacing: "-0.01em" }}>
            Stay on top of your field <em style={{ color: "#6B9E7A", fontStyle: "italic" }}>automatically</em>
          </h3>
          <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(217,210,195,0.5)", lineHeight: 1.75, marginBottom: 24, maxWidth: 380, margin: "0 auto 24px" }}>
            LitFlo monitors the latest papers in your research area and delivers a personalised digest — so you never miss what matters.
          </p>
          <a
            href="https://litflo.ai/account.html"
            style={{
              display: "inline-block",
              background: "rgba(107,158,122,0.18)",
              border: "1px solid rgba(107,158,122,0.38)",
              color: "#f0ebe2",
              padding: "12px 32px",
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 400,
              textDecoration: "none",
              letterSpacing: "0.02em",
            }}
          >
            Get started free →
          </a>
        </div>

        {/* Recent posts */}
        {recent.length > 0 && (
          <div style={{ marginTop: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(217,210,195,0.35)", marginBottom: 20 }}>
              Recent posts
            </p>
            <div className="recent-posts-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {recent.map(rp => (
                <RecentPostCard key={rp.id} post={rp} />
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 48, paddingTop: 20, borderTop: "1px solid rgba(107,158,122,0.08)" }}>
          <a href="/blog" style={{ fontSize: 13, color: "rgba(107,158,122,0.6)", fontWeight: 300, textDecoration: "none" }}>← All posts</a>
        </div>
      </main>
    </div>
  );
}

function RecentPostCard({ post }: {
  post: Pick<BlogPost, "id"|"title"|"slug"|"hero_image_url"|"hero_image_alt"|"keywords"|"published_at"|"meta_description">
}) {
  const cat = post.keywords?.[0] ?? null;
  return (
    <a
      href={`/blog/${post.slug}`}
      style={{
        display: "block",
        background: "rgba(107,158,122,0.03)",
        border: "1px solid rgba(107,158,122,0.12)",
        borderRadius: 12,
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
        {post.hero_image_url ? (
          <Image
            src={post.hero_image_url}
            alt={post.hero_image_alt || post.title}
            fill
            sizes="240px"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #1A3D2B 0%, #1c2f3d 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "rgba(107,158,122,0.3)" }}>LF</span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,26,19,0.6) 0%, transparent 55%)", pointerEvents: "none" }} />
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        {cat && <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(107,158,122,0.7)", marginBottom: 6 }}>{cat}</p>}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 13,
          fontWeight: 600,
          color: "#f0ebe2",
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}>
          {post.title}
        </p>
      </div>
    </a>
  );
}
