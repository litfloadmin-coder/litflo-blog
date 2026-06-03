import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { serviceClient } from "@/lib/supabase";
import Nav from "@/components/Nav";
import MarkdownBody from "@/components/MarkdownBody";
import type { BlogPost } from "@/lib/supabase";

export const revalidate = 60;

export async function generateStaticParams() {
  const supabase = serviceClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");
  return (data || []).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = serviceClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single();
  if (!data) return {};
  const post = data as BlogPost;
  const canonical = `https://litflo.ai/blog/${slug}`;
  return {
    title: post.seo_title || post.title,
    description: post.meta_description || undefined,
    keywords: post.keywords?.join(", "),
    alternates: { canonical },
    openGraph: {
      title: post.seo_title || post.title,
      description: post.meta_description || undefined,
      url: canonical,
      type: "article",
      publishedTime: post.published_at || undefined,
      images: post.hero_image_url ? [{ url: post.hero_image_url, alt: post.hero_image_alt || post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo_title || post.title,
      description: post.meta_description || undefined,
      images: post.hero_image_url ? [post.hero_image_url] : [],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = serviceClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").single();
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
    keywords: post.keywords?.join(", "),
  };

  return (
    <>
      <Nav active="blog" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: "rgba(217,210,195,0.4)", marginBottom: 24 }}>
          <a href="/blog" style={{ color: "rgba(107,158,122,0.7)" }}>Blog</a>
          {" / "}
          <span>{post.title}</span>
        </p>

        {/* Keywords */}
        {post.keywords?.[0] && (
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,158,122,0.7)", margin: "0 0 12px" }}>
            {post.keywords[0]}
          </p>
        )}

        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: "#f0ebe2", margin: "0 0 16px", lineHeight: 1.15 }}>
          {post.title}
        </h1>

        {post.meta_description && (
          <p style={{ fontSize: 16, fontWeight: 300, color: "rgba(217,210,195,0.6)", lineHeight: 1.75, margin: "0 0 16px" }}>
            {post.meta_description}
          </p>
        )}

        {publishDate && (
          <p style={{ fontSize: 13, color: "rgba(217,210,195,0.35)", marginBottom: 32 }}>{publishDate}</p>
        )}

        {post.hero_image_url && (
          <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 40, position: "relative", height: 340 }}>
            <Image src={post.hero_image_url} alt={post.hero_image_alt || post.title} fill style={{ objectFit: "cover" }} priority />
          </div>
        )}

        {/* Post body */}
        <MarkdownBody content={post.body} />

        {/* CTA */}
        <div style={{
          marginTop: 56,
          padding: "32px 28px",
          background: "rgba(107,158,122,0.07)",
          border: "1px solid rgba(107,158,122,0.2)",
          borderRadius: 12,
          textAlign: "center",
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,158,122,0.7)", margin: "0 0 12px" }}>
            Try LitFlo
          </p>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f0ebe2", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Stay on top of your field automatically
          </h3>
          <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(217,210,195,0.55)", lineHeight: 1.75, margin: "0 0 20px" }}>
            LitFlo monitors the latest papers in your research area and delivers a personalised digest to your inbox — so you never miss an important paper.
          </p>
          <a href="https://litflo.ai/account.html" style={{
            display: "inline-block",
            background: "rgba(107,158,122,0.2)",
            border: "1px solid rgba(107,158,122,0.4)",
            color: "#f0ebe2",
            padding: "12px 28px",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            letterSpacing: "0.01em",
          }}>
            Get started free →
          </a>
        </div>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(107,158,122,0.1)" }}>
          <a href="/blog" style={{ fontSize: 13, color: "rgba(107,158,122,0.7)" }}>← All posts</a>
        </div>
      </main>
    </>
  );
}
