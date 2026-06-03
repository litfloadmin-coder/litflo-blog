export default function Nav({ active }: { active?: "blog" | "about" }) {
  return (
    <nav style={{
      position: "relative",
      zIndex: 10,
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "30px 52px",
    }}>
      <div />
      <a href="https://litflo.ai" style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(217,210,195,0.8)",
        textAlign: "center",
        gridColumn: 2,
        textDecoration: "none",
      }}>LitFlo</a>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 5,
        fontSize: 13,
        fontWeight: 300,
        letterSpacing: "0.04em",
        color: "rgba(217,210,195,0.65)",
      }}>
        {[
          { href: "https://litflo.ai",             label: "Home" },
          { href: "https://litflo.ai/about.html",  label: "About" },
          { href: "https://litflo.ai/blog",        label: "Blog",    key: "blog" },
          { href: "https://litflo.ai/account.html", label: "Account" },
        ].map((item, i, arr) => (
          <>
            <a
              key={item.label}
              href={item.href}
              style={{
                color: active === item.key ? "rgba(217,210,195,1)" : "inherit",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {item.label}
            </a>
            {i < arr.length - 1 && (
              <span key={`sep-${i}`} style={{ opacity: 0.3, padding: "0 3px" }}>|</span>
            )}
          </>
        ))}
      </div>
    </nav>
  );
}
