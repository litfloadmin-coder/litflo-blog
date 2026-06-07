"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(26px, 4vw, 34px)",
      fontWeight: 700,
      color: "#f0ebe2",
      margin: "40px 0 12px",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(20px, 3vw, 26px)",
      fontWeight: 700,
      color: "#f0ebe2",
      margin: "40px 0 12px",
      lineHeight: 1.25,
      letterSpacing: "-0.015em",
    }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 20,
      fontWeight: 600,
      color: "#f0ebe2",
      margin: "28px 0 10px",
      lineHeight: 1.3,
    }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 15,
      fontWeight: 600,
      color: "rgba(217,210,195,0.75)",
      margin: "22px 0 8px",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    }}>{children}</h4>
  ),
  p: ({ children }) => (
    <p style={{ marginBottom: 20, lineHeight: 1.8, fontWeight: 300, fontSize: 16, color: "rgba(240,235,226,0.88)" }}>
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{ color: "#6B9E7A", borderBottom: "1px solid rgba(107,158,122,0.35)", textDecoration: "none", transition: "border-color 0.15s ease, color 0.15s ease" }}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: 22, marginBottom: 20, listStyleType: "disc" }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: 22, marginBottom: 20 }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: 8, lineHeight: 1.75, fontWeight: 300, fontSize: 16, color: "rgba(240,235,226,0.85)" }}>
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong style={{ color: "#f0ebe2", fontWeight: 500 }}>{children}</strong>
  ),
  em: ({ children }) => (
    <em style={{ color: "rgba(107,158,122,0.9)", fontStyle: "italic" }}>{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{
      margin: "28px 0",
      padding: "16px 20px",
      borderLeft: "3px solid rgba(107,158,122,0.55)",
      background: "rgba(107,158,122,0.04)",
      borderRadius: "0 8px 8px 0",
      fontStyle: "italic",
      color: "rgba(217,210,195,0.65)",
      lineHeight: 1.75,
    }}>
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr style={{ margin: "40px 0", border: "none", borderTop: "1px solid rgba(107,158,122,0.12)" }} />
  ),
  code: ({ className, children, ...props }) => {
    const isBlock = !!className;
    if (isBlock) {
      return (
        <code style={{
          display: "block",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 13,
          lineHeight: 1.65,
          color: "rgba(217,210,195,0.82)",
        }} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 13,
        background: "rgba(107,158,122,0.1)",
        border: "1px solid rgba(107,158,122,0.15)",
        borderRadius: 4,
        padding: "2px 6px",
        color: "rgba(217,210,195,0.85)",
      }} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre style={{
      margin: "24px 0",
      padding: "20px 22px",
      background: "rgba(13,26,19,0.6)",
      border: "1px solid rgba(107,158,122,0.12)",
      borderRadius: 10,
      overflowX: "auto",
      lineHeight: 1.65,
    }}>
      {children}
    </pre>
  ),
  img: ({ src, alt, title }) => (
    <figure style={{ margin: "32px 0" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        title={title}
        loading="lazy"
        style={{
          width: "100%",
          borderRadius: 10,
          display: "block",
          objectFit: "cover",
          maxHeight: 480,
        }}
      />
      {title && (
        <figcaption style={{
          marginTop: 10,
          fontSize: 12,
          color: "rgba(217,210,195,0.38)",
          fontWeight: 300,
          fontStyle: "italic",
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          {title}
        </figcaption>
      )}
    </figure>
  ),
  table: ({ children }) => (
    <div style={{ overflowX: "auto", margin: "24px 0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th style={{
      padding: "10px 14px",
      textAlign: "left",
      borderBottom: "1px solid rgba(107,158,122,0.25)",
      fontFamily: "'DM Sans', sans-serif",
      fontWeight: 500,
      fontSize: 12,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "rgba(217,210,195,0.5)",
    }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{
      padding: "10px 14px",
      borderBottom: "1px solid rgba(107,158,122,0.08)",
      color: "rgba(217,210,195,0.75)",
      lineHeight: 1.6,
      fontWeight: 300,
    }}>{children}</td>
  ),
};

export default function MarkdownBody({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
