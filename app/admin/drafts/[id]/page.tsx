import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { serviceClient } from "@/lib/supabase";
import type { BlogPost } from "@/lib/supabase";

export default async function DraftPreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = serviceClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (!data) notFound();
  const post = data as BlogPost;
  const base = process.env.BLOG_BASE_URL || "https://litflo.ai/blog";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <a href="/admin/drafts" style={{ fontSize: 13, color: "rgba(107,158,122,0.7)" }}>← Drafts</a>
        <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: post.status === "published" ? "rgba(74,222,128,0.15)" : post.status === "pending_review" ? "rgba(251,191,36,0.15)" : "rgba(248,113,113,0.15)", color: post.status === "published" ? "#4ade80" : post.status === "pending_review" ? "#fbbf24" : "#f87171", fontWeight: 600 }}>
          {post.status}
        </span>
        {post.status === "pending_review" && post.approval_token && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
            <a href={`${base}/api/approve?id=${post.id}&token=${post.approval_token}`} style={{ fontSize: 13, padding: "8px 18px", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 6, color: "#4ade80", textDecoration: "none", fontWeight: 600 }}>✓ Approve &amp; Publish</a>
            <a href={`${base}/api/reject?id=${post.id}&token=${post.approval_token}`} style={{ fontSize: 13, padding: "8px 18px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 6, color: "#f87171", textDecoration: "none" }}>✗ Reject</a>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 700 }}>
        {post.keywords?.[0] && <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,158,122,0.7)", margin: "0 0 10px" }}>{post.keywords[0]}</p>}
        <h1 style={{ fontSize: 30, fontWeight: 800, color: "#f0ebe2", margin: "0 0 10px", letterSpacing: "-0.03em", lineHeight: 1.2 }}>{post.title}</h1>
        {post.meta_description && <p style={{ fontSize: 14, color: "rgba(217,210,195,0.55)", margin: "0 0 8px", lineHeight: 1.7 }}>{post.meta_description}</p>}
        {post.keywords?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0 20px" }}>
            {post.keywords.map(k => <span key={k} style={{ fontSize: 11, padding: "2px 8px", background: "rgba(107,158,122,0.1)", borderRadius: 100, color: "rgba(107,158,122,0.8)" }}>{k}</span>)}
          </div>
        )}
        {post.hero_image_url && (
          <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 28, position: "relative", height: 260 }}>
            <Image src={post.hero_image_url} alt={post.hero_image_alt || post.title} fill style={{ objectFit: "cover" }} />
          </div>
        )}
        <div style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(217,210,195,0.8)" }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => <h2 style={{ fontSize: 19, fontWeight: 700, color: "#f0ebe2", marginTop: 32, marginBottom: 8 }}>{children}</h2>,
              p:  ({ children }) => <p style={{ marginBottom: 16 }}>{children}</p>,
              a:  ({ href, children }) => <a href={href} style={{ color: "rgba(107,158,122,0.9)" }}>{children}</a>,
            }}
          >{post.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
