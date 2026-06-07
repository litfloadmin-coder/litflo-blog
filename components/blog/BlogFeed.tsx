"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

type Post = {
  id: string;
  title: string;
  slug: string;
  meta_description: string | null;
  keywords: string[];
  hero_image_url: string | null;
  hero_image_alt: string | null;
  published_at: string | null;
};

const PER_PAGE = 9;

function PlaceholderImage() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      background: "linear-gradient(135deg, #1A3D2B 0%, #1c2f3d 55%, #0d1820 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} aria-hidden="true">
        <filter id="lf-card-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lf-card-noise)" />
      </svg>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 30,
        fontWeight: 700,
        color: "rgba(107,158,122,0.35)",
        letterSpacing: "0.08em",
        position: "relative",
        zIndex: 1,
      }}>LF</span>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false);
  const category = post.keywords?.[0] ?? null;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: hovered ? "rgba(107,158,122,0.07)" : "rgba(107,158,122,0.03)",
        border: `1px solid ${hovered ? "rgba(107,158,122,0.38)" : "rgba(107,158,122,0.13)"}`,
        borderRadius: 14,
        overflow: "hidden",
        textDecoration: "none",
        transition: "border-color 0.22s ease, background 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 12px 36px rgba(107,158,122,0.13), 0 3px 10px rgba(0,0,0,0.35)"
          : "0 2px 10px rgba(0,0,0,0.18)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, flexShrink: 0, overflow: "hidden" }}>
        {post.hero_image_url ? (
          <Image
            src={post.hero_image_url}
            alt={post.hero_image_alt || post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <PlaceholderImage />
        )}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(13,26,19,0.65) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26,45,40,0.22)",
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }} />
      </div>

      {/* Content */}
      <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        {category && (
          <p style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(107,158,122,0.82)",
            marginBottom: 8,
          }}>
            {category}
          </p>
        )}
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18,
          fontWeight: 700,
          color: "#f0ebe2",
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
          marginBottom: 10,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        } as React.CSSProperties}>
          {post.title}
        </h2>
        {post.meta_description && (
          <p style={{
            fontSize: 13,
            fontWeight: 300,
            color: "rgba(217,210,195,0.48)",
            lineHeight: 1.65,
            marginBottom: 14,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          } as React.CSSProperties}>
            {post.meta_description}
          </p>
        )}
        {date && (
          <p suppressHydrationWarning style={{ fontSize: 11, color: "rgba(217,210,195,0.27)", fontWeight: 300, marginTop: "auto", paddingTop: 8 }}>
            {date}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function BlogFeed({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const cats: string[] = [];
    for (const post of posts) {
      const cat = post.keywords?.[0];
      if (cat && !seen.has(cat)) { seen.add(cat); cats.push(cat); }
    }
    return cats;
  }, [posts]);

  // Read ?category= from URL on mount (client-only, avoids SSR hydration mismatch)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [categories]);

  const filtered = useMemo(() => {
    if (activeCategory === "All Posts") return posts;
    return posts.filter(p => p.keywords?.[0] === activeCategory);
  }, [posts, activeCategory]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pagePosts = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function selectCategory(cat: string) {
    setActiveCategory(cat);
    setPage(1);
  }

  if (posts.length === 0) {
    return <p style={{ color: "rgba(217,210,195,0.4)", fontSize: 14, fontWeight: 300 }}>No posts yet — check back soon.</p>;
  }

  return (
    <div>
      {/* Category filter */}
      {categories.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {["All Posts", ...categories].map(cat => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                style={{
                  padding: "7px 18px",
                  borderRadius: 100,
                  border: `1px solid ${active ? "rgba(107,158,122,0.65)" : "rgba(107,158,122,0.2)"}`,
                  background: active ? "rgba(107,158,122,0.16)" : "transparent",
                  color: active ? "#6B9E7A" : "rgba(217,210,195,0.5)",
                  fontSize: 12,
                  fontWeight: active ? 500 : 300,
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "background 0.18s ease, border-color 0.18s ease, color 0.18s ease",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <div className="blog-card-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 24,
      }}>
        {pagePosts.map(post => <PostCard key={post.id} post={post} />)}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "rgba(217,210,195,0.35)", fontSize: 14, fontWeight: 300, paddingTop: 8 }}>
          No posts in this category yet.
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 64, flexWrap: "wrap" }}>
          <PagBtn label="← Prev" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <PagBtn key={n} label={String(n)} onClick={() => setPage(n)} active={n === page} />
          ))}
          <PagBtn label="Next →" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
        </div>
      )}
    </div>
  );
}

function PagBtn({ label, onClick, disabled, active }: {
  label: string; onClick: () => void; disabled?: boolean; active?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        minWidth: 38,
        height: 38,
        padding: "0 12px",
        borderRadius: 8,
        border: `1px solid ${active ? "rgba(107,158,122,0.55)" : hov && !disabled ? "rgba(107,158,122,0.35)" : "rgba(107,158,122,0.15)"}`,
        background: active ? "rgba(107,158,122,0.16)" : "transparent",
        color: active ? "#6B9E7A" : disabled ? "rgba(217,210,195,0.18)" : hov ? "rgba(217,210,195,0.85)" : "rgba(217,210,195,0.45)",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: active ? 500 : 300,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "border-color 0.15s ease, color 0.15s ease, background 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}
