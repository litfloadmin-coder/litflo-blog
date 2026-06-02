import { serviceClient } from "@/lib/supabase";

export default async function AdminDashboard() {
  const supabase = serviceClient();
  const [{ count: published }, { count: pending }, { count: queue }, { count: rejected }] = await Promise.all([
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
    supabase.from("blog_queue").select("*", { count: "exact", head: true }).is("used_at", null),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "rejected"),
  ]);

  const { data: recent } = await supabase
    .from("blog_posts")
    .select("id,title,status,created_at,published_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Published", value: published ?? 0, color: "#4ade80" },
    { label: "Pending review", value: pending ?? 0, color: "#fbbf24", link: "/admin/drafts" },
    { label: "In queue", value: queue ?? 0, color: "#60a5fa", link: "/admin/queue" },
    { label: "Rejected", value: rejected ?? 0, color: "#f87171" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0ebe2", margin: "0 0 32px", letterSpacing: "-0.02em" }}>Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <a key={s.label} href={s.link || "#"} style={{ textDecoration: "none" }}>
            <div style={{ background: "rgba(107,158,122,0.06)", border: "1px solid rgba(107,158,122,0.15)", borderRadius: 10, padding: "20px 20px" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 300, color: "rgba(217,210,195,0.5)", marginTop: 6 }}>{s.label}</div>
            </div>
          </a>
        ))}
      </div>

      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f0ebe2", margin: "0 0 14px", letterSpacing: "0.05em", textTransform: "uppercase", opacity: 0.6 }}>Recent posts</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(recent || []).map(p => (
          <a key={p.id} href={`/admin/drafts/${p.id}`} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", background: "rgba(107,158,122,0.04)",
            border: "1px solid rgba(107,158,122,0.12)", borderRadius: 8, textDecoration: "none",
          }}>
            <span style={{ fontSize: 14, color: "#f0ebe2", fontWeight: 400 }}>{p.title}</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: p.status === "published" ? "rgba(74,222,128,0.15)" : p.status === "pending_review" ? "rgba(251,191,36,0.15)" : "rgba(248,113,113,0.15)", color: p.status === "published" ? "#4ade80" : p.status === "pending_review" ? "#fbbf24" : "#f87171" }}>
              {p.status === "pending_review" ? "pending" : p.status}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
