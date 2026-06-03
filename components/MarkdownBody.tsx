"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownBody({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => <h2>{children}</h2>,
        h3: ({ children }) => <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: "#f0ebe2", margin: "24px 0 8px" }}>{children}</h3>,
        p:  ({ children }) => <p>{children}</p>,
        a:  ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
        ul: ({ children }) => <ul>{children}</ul>,
        li: ({ children }) => <li>{children}</li>,
        strong: ({ children }) => <strong>{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
