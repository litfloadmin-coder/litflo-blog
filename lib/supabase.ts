import { createClient } from "@supabase/supabase-js";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  body: string;
  meta_description: string | null;
  seo_title: string | null;
  keywords: string[];
  hero_image_url: string | null;
  hero_image_alt: string | null;
  status: "pending_review" | "published" | "rejected";
  created_at: string;
  published_at: string | null;
  approval_token?: string;
};

export type QueueItem = {
  id: string;
  topic: string;
  priority: number;
  created_at: string;
  used_at: string | null;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_KEY;

export const supabase = createClient(url, anonKey);

// Service client for admin routes — only available server-side
export function serviceClient() {
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_KEY not set");
  return createClient(url, serviceKey);
}
