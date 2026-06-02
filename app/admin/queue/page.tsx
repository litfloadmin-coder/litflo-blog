"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { QueueItem } from "@/lib/supabase";

export default function QueuePage() {
  const [items, setItems]   = useState<QueueItem[]>([]);
  const [topic, setTopic]   = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase.from("blog_queue").select("*").is("used_at", null).order("priority", { ascending: false }).order("created_at", { ascending: true });
    setItems(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function addTopic() {
    if (!topic.trim()) return;
    await supabase.from("blog_queue").insert({ topic: topic.trim(), priority: 0 });
    setTopic(""); load();
  }

  async function remove(id: string) {
    await supabase.from("blog_queue").delete().eq("id", id); load();
  }

  async function bumpUp(item: QueueItem, i: number) {
    if (i === 0) return;
    const prev = items[i - 1];
    await Promise.all([
      supabase.from("blog_queue").update({ priority: prev.priority + 1 }).eq("id", item.id),
      supabase.from("blog_queue").update({ priority: Math.max(0, prev.priority - 1) }).eq("id", prev.id),
    ]);
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0ebe2", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Topic Queue</h1>
      <p style={{ fontSize: 13, color: "rgba(217,210,195,0.45)", margin: "0 0 28px", fontWeight: 300 }}>The agent picks the top topic each run. Drag or promote topics to reorder.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
        <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && addTopic()}
          placeholder="Add a new topic…"
          style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(107,158,122,0.2)", borderRadius: 8, padding: "10px 14px", color: "#f0ebe2", fontSize: 14 }}
        />
        <button onClick={addTopic} style={{ background: "rgba(107,158,122,0.2)", border: "1px solid rgba(107,158,122,0.3)", color: "#f0ebe2", padding: "10px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>Add</button>
      </div>

      {loading ? <p style={{ color: "rgba(217,210,195,0.4)", fontSize: 14 }}>Loading…</p> :
       items.length === 0 ? <p style={{ color: "rgba(217,210,195,0.4)", fontSize: 14 }}>Queue is empty — the agent will pick a default topic.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item, i) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(107,158,122,0.05)", border: "1px solid rgba(107,158,122,0.13)", borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(107,158,122,0.5)", minWidth: 20, textAlign: "center" }}>#{i + 1}</span>
              <span style={{ flex: 1, fontSize: 14, color: "#f0ebe2" }}>{item.topic}</span>
              <button onClick={() => bumpUp(item, i)} disabled={i === 0} style={{ fontSize: 12, padding: "4px 10px", background: "rgba(107,158,122,0.1)", border: "1px solid rgba(107,158,122,0.2)", borderRadius: 6, color: i === 0 ? "rgba(217,210,195,0.2)" : "rgba(107,158,122,0.8)", cursor: i === 0 ? "default" : "pointer" }}>↑</button>
              <button onClick={() => remove(item.id)} style={{ fontSize: 12, padding: "4px 10px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.18)", borderRadius: 6, color: "#f87171", cursor: "pointer" }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
