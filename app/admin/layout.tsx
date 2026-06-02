import { requireAdmin } from "@/lib/auth";

const NAV = [
  { href: "/admin",           label: "Dashboard" },
  { href: "/admin/queue",     label: "Queue" },
  { href: "/admin/drafts",    label: "Drafts" },
  { href: "/admin/published", label: "Published" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div style={{ minHeight: "100vh", background: "#0f1a14", color: "#d9d2c3" }}>
      <nav style={{ background: "rgba(107,158,122,0.06)", borderBottom: "1px solid rgba(107,158,122,0.15)", padding: "14px 28px", display: "flex", gap: 24, alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#f0ebe2", marginRight: 16 }}>LitFlo Blog</span>
        {NAV.map(n => (
          <a key={n.href} href={n.href} style={{ fontSize: 13, fontWeight: 300, color: "rgba(217,210,195,0.6)", textDecoration: "none" }}>{n.label}</a>
        ))}
        <a href="/blog" target="_blank" style={{ marginLeft: "auto", fontSize: 12, color: "rgba(107,158,122,0.7)", textDecoration: "none" }}>View blog ↗</a>
      </nav>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        {children}
      </div>
    </div>
  );
}
