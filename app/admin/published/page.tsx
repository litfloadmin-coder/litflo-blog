import { serviceClient } from "@/lib/supabase";
import type { BlogPost } from "@/lib/supabase";

export default async function PublishedPage() {
  const supabase = serviceClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,title,slug,keywords,published_at,meta_description")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const posts = (data || []) as BlogPost[];

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0ebe2", margin: "0 0 28px", letterSpacing: "-0.02em" }}>
        Published <span style={{ fontSize: 16, opacity: 0.4, fontWeight: 300 }}>({posts.length})</span>
      </h1>
      {posts.length === 0 ? (
        <p style={{ color: "rgba(217,210,195,0.4)", fontSize: 14 }}>No posts published yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", background: "rgba(107,158,122,0.05)", border: "1px solid rgba(107,158,122,0.13)", borderRadius: 10 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: "#f0ebe2", margin: "0 0 4px" }}>{p.title}</p>
                {p.keywords?.length > 0 && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {p.keywords.slice(0, 3).map(k => <span key={k} style={{ fontSize: 10, padding: "1px 7px", background: "rgba(107,158,122,0.1)", borderRadius: 100, color: "rgba(107,158,122,0.7)" }}>{k}</span>)}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 12, color: "rgba(217,210,195,0.35)", whiteSpace: "nowrap" }}>
                {p.published_at ? new Date(p.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
              </span>
              <a href={`https://litflo.ai/blog/${p.slug}`} target="_blank" style={{ fontSize: 12, color: "rgba(107,158,122,0.7)", textDecoration: "none", whiteSpace: "nowrap" }}>View ↗</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
