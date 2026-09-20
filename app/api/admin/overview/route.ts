import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { serviceSupabase } from "@/lib/supabase";
import { destinations } from "@/data/destinations";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request); if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const db = serviceSupabase();
  if (!db) return NextResponse.json({ configured: false, metrics: { destinations: destinations.length, users: 0, trips: 0, generations: 0 }, events: [] });
  const [destinationCount, userCount, tripCount, eventCount, recent] = await Promise.all([
    db.from("destinations").select("id", { count: "exact", head: true }), db.auth.admin.listUsers({ perPage: 1 }),
    db.from("trips").select("id", { count: "exact", head: true }), db.from("api_events").select("id", { count: "exact", head: true }),
    db.from("api_events").select("event_type,status,provider,created_at,metadata").order("created_at", { ascending: false }).limit(12),
  ]);
  return NextResponse.json({ configured: true, metrics: { destinations: destinationCount.count || 0, users: userCount.data?.users.length || 0, trips: tripCount.count || 0, generations: eventCount.count || 0 }, events: recent.data || [] });
}
