"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [pw, setPw]     = useState("");
  const [err, setErr]   = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const r = await fetch("/api/admin-login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (r.ok) router.push("/admin");
    else setErr("Wrong password.");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1a14" }}>
      <form onSubmit={submit} style={{ background: "rgba(107,158,122,0.06)", border: "1px solid rgba(107,158,122,0.2)", borderRadius: 12, padding: "36px 32px", width: 320 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(107,158,122,0.7)", margin: "0 0 20px" }}>LitFlo Blog Admin</p>
        <input
          type="password" value={pw} onChange={e => setPw(e.target.value)}
          placeholder="Admin password" autoFocus
          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(107,158,122,0.2)", borderRadius: 8, padding: "10px 14px", color: "#f0ebe2", fontSize: 14, marginBottom: 12, boxSizing: "border-box" }}
        />
        {err && <p style={{ fontSize: 13, color: "#f87171", margin: "0 0 10px" }}>{err}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", background: "rgba(107,158,122,0.2)", border: "1px solid rgba(107,158,122,0.3)", color: "#f0ebe2", padding: "10px 0", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>
          {loading ? "Signing in…" : "Sign in →"}
        </button>
      </form>
    </div>
  );
}
