import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { serviceSupabase } from "@/lib/supabase";
import { destinations } from "@/data/destinations";
export async function POST(request: NextRequest) { const admin = await requireAdmin(request); if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 }); const db = serviceSupabase(); if (!db) return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is required." }, { status: 503 }); const rows = destinations.map(({ id, name, category, imageUrl, imageCredit, ...data }) => ({ id, name, category, data, image_url: imageUrl || null, image_credit: imageCredit || null, visible: true })); const { error } = await db.from("destinations").upsert(rows); return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ seeded: rows.length }); }
