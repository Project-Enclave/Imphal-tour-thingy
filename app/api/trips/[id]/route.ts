import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

const schema = z.object({ title: z.string().min(1).max(100).optional(), preferences: z.unknown().optional(), itinerary: z.unknown().optional() });
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request); if (!auth) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const parsed = schema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const { id } = await params; const { data, error } = await auth.db.from("trips").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", id).eq("user_id", auth.user.id).select().single();
  return NextResponse.json(error ? { error: error.message } : { trip: data }, { status: error ? 400 : 200 });
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request); if (!auth) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { id } = await params; const { error } = await auth.db.from("trips").delete().eq("id", id).eq("user_id", auth.user.id);
  return error ? NextResponse.json({ error: error.message }, { status: 400 }) : new NextResponse(null, { status: 204 });
}
