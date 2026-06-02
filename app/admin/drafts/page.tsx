import { serviceClient } from "@/lib/supabase";
import type { BlogPost } from "@/lib/supabase";

export default async function DraftsPage() {
  const supabase = serviceClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,title,meta_description,keywords,created_at,approval_token")
    .eq("status", "pending_review")
    .order("created_at", { ascending: false });

  const posts = (data || []) as BlogPost[];
  const base  = process.env.BLOG_BASE_URL || "https://litflo.ai/blog";

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0ebe2", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
        Drafts <span style={{ fontSize: 16, opacity: 0.4, fontWeight: 300 }}>({posts.length})</span>
      </h1>

      {posts.length === 0 ? (
        <p style={{ color: "rgba(217,210,195,0.4)", fontSize: 14 }}>No drafts pending review.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {posts.map(p => (
            <div key={p.id} style={{ background: "rgba(107,158,122,0.05)", border: "1px solid rgba(107,158,122,0.15)", borderRadius: 10, padding: "20px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 8 }}>
                <div>
                  <a href={`/admin/drafts/${p.id}`} style={{ fontSize: 16, fontWeight: 600, color: "#f0ebe2", textDecoration: "none" }}>{p.title}</a>
                  {p.meta_description && <p style={{ fontSize: 13, color: "rgba(217,210,195,0.5)", margin: "4px 0 0", fontWeight: 300, lineHeight: 1.6 }}>{p.meta_description}</p>}
                </div>
                <span style={{ fontSize: 11, color: "rgba(217,210,195,0.35)", whiteSpace: "nowrap", paddingTop: 2 }}>
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>
              {p.keywords?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {p.keywords.map(k => (
                    <span key={k} style={{ fontSize: 11, padding: "2px 8px", background: "rgba(107,158,122,0.12)", borderRadius: 100, color: "rgba(107,158,122,0.8)" }}>{k}</span>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <a href={`/admin/drafts/${p.id}`} style={{ fontSize: 13, padding: "8px 16px", background: "rgba(107,158,122,0.12)", border: "1px solid rgba(107,158,122,0.25)", borderRadius: 6, color: "#f0ebe2", textDecoration: "none" }}>Preview</a>
                {p.approval_token && (
                  <>
                    <a href={`${base}/api/approve?id=${p.id}&token=${p.approval_token}`} style={{ fontSize: 13, padding: "8px 16px", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 6, color: "#4ade80", textDecoration: "none" }}>✓ Approve</a>
                    <a href={`${base}/api/reject?id=${p.id}&token=${p.approval_token}`} style={{ fontSize: 13, padding: "8px 16px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 6, color: "#f87171", textDecoration: "none" }}>✗ Reject</a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
