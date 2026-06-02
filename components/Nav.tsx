export default function Nav({ active }: { active?: "blog" | "about" }) {
  return (
    <nav style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center", padding: "20px 32px",
      borderBottom: "1px solid rgba(107,158,122,0.1)",
    }}>
      <div />
      <a href="https://litflo.ai" style={{
        fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em",
        color: "#f0ebe2", textDecoration: "none",
      }}>LitFlo</a>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", alignItems: "center", fontSize: 13, fontWeight: 300 }}>
        <a href="https://litflo.ai" style={{ color: "rgba(217,210,195,0.6)", textDecoration: "none" }}>Home</a>
        <span style={{ opacity: 0.3 }}>|</span>
        <a href="https://litflo.ai/about.html" style={{ color: "rgba(217,210,195,0.6)", textDecoration: "none" }}>About</a>
        <span style={{ opacity: 0.3 }}>|</span>
        <a href="/blog" style={{
          color: active === "blog" ? "#f0ebe2" : "rgba(217,210,195,0.6)",
          textDecoration: "none", fontWeight: active === "blog" ? 500 : 300,
        }}>Blog</a>
        <span style={{ opacity: 0.3 }}>|</span>
        <a href="https://litflo.ai/account.html" style={{
          color: "rgba(217,210,195,0.6)", textDecoration: "none",
        }}>Account</a>
      </div>
    </nav>
  );
}
