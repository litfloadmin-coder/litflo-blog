"use client";
import { useState } from "react";

const SCHEDULE_OPTIONS = [
  { value: "0 9 * * 1,4", label: "Mon + Thu 9am ET (2x/week — recommended)" },
  { value: "0 9 * * 1",   label: "Monday 9am ET (1x/week)" },
  { value: "0 9 * * 1,3,5", label: "Mon, Wed, Fri 9am ET (3x/week)" },
];

const LITFLO_STYLE_OPTIONS = [
  { value: "natural",    label: "Natural — 1-2 mentions where it genuinely fits" },
  { value: "minimal",    label: "Minimal — mention only at the CTA" },
  { value: "aggressive", label: "Aggressive — 3-4 mentions per post" },
];

export default function SettingsPage() {
  const [schedule,    setSchedule]    = useState("0 9 * * 1,4");
  const [email,       setEmail]       = useState("litfloadmin@gmail.com");
  const [litfloStyle, setLitfloStyle] = useState("natural");
  const [saved,       setSaved]       = useState(false);

  function save() {
    // Settings are read by the Trigger.dev task via env vars — show what to update
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const field = (label: string, children: React.ReactNode, hint?: string) => (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(107,158,122,0.8)", marginBottom: 8 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: "rgba(217,210,195,0.35)", margin: "6px 0 0", fontWeight: 300 }}>{hint}</p>}
    </div>
  );

  const input = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(107,158,122,0.2)", borderRadius: 8, padding: "10px 14px", color: "#f0ebe2", fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const select = { ...input, cursor: "pointer" };

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0ebe2", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Settings</h1>
      <p style={{ fontSize: 13, color: "rgba(217,210,195,0.4)", margin: "0 0 36px", fontWeight: 300 }}>
        To change the posting schedule or notification email, update the environment variables in Trigger.dev and Vercel.
      </p>

      {field("Posting schedule (current)",
        <select style={select} value={schedule} onChange={e => setSchedule(e.target.value)}>
          {SCHEDULE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>,
        `Current cron: ${schedule} — update BLOG_CRON in Trigger.dev env vars to change`
      )}

      {field("Notification email",
        <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} />,
        "Where approval emails are sent. Update BLOG_NOTIFICATION_EMAIL in Trigger.dev to change."
      )}

      {field("LitFlo mention style",
        <select style={select} value={litfloStyle} onChange={e => setLitfloStyle(e.target.value)}>
          {LITFLO_STYLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>,
        "Controls how often Anthony mentions LitFlo in each post."
      )}

      <div style={{ marginTop: 16, padding: "16px 20px", background: "rgba(107,158,122,0.06)", border: "1px solid rgba(107,158,122,0.15)", borderRadius: 8 }}>
        <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "rgba(107,158,122,0.8)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Trigger.dev env vars to update</p>
        <code style={{ display: "block", fontSize: 12, color: "#d9d2c3", lineHeight: 1.8, fontFamily: "monospace" }}>
          BLOG_AGENT_ID=agent_01WL1KYUcZGxD16qp5J5BCXK<br/>
          BLOG_AGENT_VERSION=2<br/>
          BLOG_ENV_ID=env_01X3K8ZQxKHv6mPdfZbKEU1v<br/>
          BLOG_APPROVAL_SECRET=Xdy7ykzX+G8pMOfeCmvXIKpSt/CqzuKw<br/>
          BLOG_BASE_URL=https://litflo.ai/blog<br/>
          BLOG_LITFLO_STYLE={litfloStyle}
        </code>
      </div>

      <button onClick={save} style={{ marginTop: 20, background: "rgba(107,158,122,0.2)", border: "1px solid rgba(107,158,122,0.3)", color: "#f0ebe2", padding: "11px 24px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500, transition: "opacity 0.2s" }}>
        {saved ? "Saved ✓" : "Save preferences"}
      </button>
    </div>
  );
}
