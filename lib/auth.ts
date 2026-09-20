import { NextRequest } from "next/server";
import { isSupabaseConfigured, serviceSupabase, supabaseForRequest } from "@/lib/supabase";

export async function requireUser(request: NextRequest) {
  const token = request.headers.get("authorization") || undefined;
  const db = supabaseForRequest(token);
  if (!db) return null;
  const { data, error } = await db.auth.getUser();
  if (error || !data.user) return null;
  return { db, user: data.user };
}

export function isAdmin(email?: string | null) {
  const allowlist = (process.env.ADMIN_EMAILS || "").split(",").map(item => item.trim().toLowerCase()).filter(Boolean);
  return Boolean(email && allowlist.includes(email.toLowerCase()));
}

export async function requireAdmin(request: NextRequest) {
  const auth = await requireUser(request);
  return auth && isAdmin(auth.user.email) ? auth : null;
}

export async function recordEvent(event_type: string, status: string, extra: Record<string, unknown> = {}) {
  const db = serviceSupabase();
  if (!db || !isSupabaseConfigured()) return;
  await db.from("api_events").insert({ event_type, status, metadata: extra });
}
