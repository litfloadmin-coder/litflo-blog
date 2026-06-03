"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownBody({ content }: { content: string }) {
  return (
    <div style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(217,210,195,0.85)" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0ebe2", marginTop: 40, marginBottom: 12, letterSpacing: "-0.02em" }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0ebe2", marginTop: 28, marginBottom: 8 }}>{children}</h3>
          ),
          p: ({ children }) => (
            <p style={{ marginBottom: 20, lineHeight: 1.8 }}>{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} style={{ color: "rgba(107,158,122,0.9)", borderBottom: "1px solid rgba(107,158,122,0.3)" }} target="_blank" rel="noopener noreferrer">{children}</a>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: 20, marginBottom: 20 }}>{children}</ul>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: 8 }}>{children}</li>
          ),
          strong: ({ children }) => (
            <strong style={{ color: "#f0ebe2", fontWeight: 600 }}>{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
