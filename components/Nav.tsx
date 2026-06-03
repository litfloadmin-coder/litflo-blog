/* Nav — pixel-identical to the static LitFlo pages (about.html, account.html) */
export default function Nav({ active }: { active?: "blog" }) {
  const links = [
    { href: "https://litflo.ai",              label: "Home" },
    { href: "https://litflo.ai/about.html",   label: "About" },
    { href: "https://litflo.ai/blog",         label: "Blog",    key: "blog" as const },
    { href: "https://litflo.ai/account.html", label: "Account" },
  ];

  return (
    <nav style={{
      position: "relative",
      zIndex: 10,
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "30px 52px",
    }}>
      {/* left spacer */}
      <div />

      {/* centered brand — Playfair Display, uppercase, wide tracking */}
      <a href="https://litflo.ai" style={{
        fontFamily: "var(--font-playfair), 'Playfair Display', serif",
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(217,210,195,0.8)",
        textDecoration: "none",
        gridColumn: 2,
      }}>
        LitFlo
      </a>

      {/* right nav — DM Sans 300, 13px, letter-spacing 0.04em */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 0,
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 300,
        letterSpacing: "0.04em",
        color: "rgba(217,210,195,0.65)",
      }}>
        {links.map((link, i) => (
          <span key={link.label} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && (
              <span style={{ opacity: 0.3, padding: "0 3px" }}>|</span>
            )}
            <a
              href={link.href}
              style={{
                color: active === link.key ? "rgba(217,210,195,1)" : "inherit",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
            >
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </nav>
  );
}
