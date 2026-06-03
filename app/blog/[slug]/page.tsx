import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { serviceClient, type BlogPost } from "@/lib/supabase";
import Nav from "@/components/Nav";
import MarkdownBody from "@/components/MarkdownBody";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await serviceClient().from("blog_posts").select("title,meta_description,keywords,hero_image_url,hero_image_alt,published_at,seo_title").eq("slug", slug).eq("status", "published").single();
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
  const { data } = await serviceClient().from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single();
  if (!data) notFound();
  const post = data as BlogPost;

  const publishDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

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

      <main style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "40px 52px 80px" }}>

        <p style={{ fontSize: 12, color: "rgba(217,210,195,0.35)", marginBottom: 24, fontWeight: 300 }}>
          <a href="/blog" style={{ color: "rgba(107,158,122,0.6)" }}>Blog</a> / {post.title}
        </p>

        {post.keywords?.[0] && <p className="keyword-chip" style={{ marginBottom: 12 }}>{post.keywords[0]}</p>}

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 700, color: "#f0ebe2", marginBottom: 12, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {post.title}
        </h1>

        {post.meta_description && (
          <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(217,210,195,0.55)", lineHeight: 1.75, marginBottom: 8 }}>
            {post.meta_description}
          </p>
        )}

        {publishDate && (
          <p style={{ fontSize: 12, color: "rgba(217,210,195,0.3)", marginBottom: 32, fontWeight: 300 }}>{publishDate}</p>
        )}

        {post.hero_image_url && (
          <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 36, position: "relative", height: 320 }}>
            <Image src={post.hero_image_url} alt={post.hero_image_alt || post.title} fill style={{ objectFit: "cover" }} priority />
          </div>
        )}

        <div className="prose">
          <MarkdownBody content={post.body} />
        </div>

        {/* CTA */}
        <div style={{ marginTop: 52, padding: "28px 28px", background: "rgba(107,158,122,0.06)", border: "1px solid rgba(107,158,122,0.18)", borderRadius: 12, textAlign: "center" }}>
          <p className="keyword-chip" style={{ marginBottom: 10 }}>Try LitFlo</p>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: "#f0ebe2", marginBottom: 10 }}>
            Stay on top of your field automatically
          </h3>
          <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(217,210,195,0.5)", lineHeight: 1.7, marginBottom: 20 }}>
            LitFlo monitors the latest papers in your research area and delivers a personalised digest — so you never miss what matters.
          </p>
          <a href="https://litflo.ai/account.html" style={{ display: "inline-block", background: "rgba(107,158,122,0.18)", border: "1px solid rgba(107,158,122,0.35)", color: "#f0ebe2", padding: "11px 28px", borderRadius: 8, fontSize: 14, fontWeight: 400, textDecoration: "none" }}>
            Get started free →
          </a>
        </div>

        <div style={{ marginTop: 36, paddingTop: 20, borderTop: "1px solid rgba(107,158,122,0.1)" }}>
          <a href="/blog" style={{ fontSize: 13, color: "rgba(107,158,122,0.6)", fontWeight: 300 }}>← All posts</a>
        </div>
      </main>
    </div>
  );
}
