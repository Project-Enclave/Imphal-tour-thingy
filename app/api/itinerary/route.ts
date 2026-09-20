import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateItinerary } from "@/lib/recommend";
import { enhanceItinerary } from "@/lib/ai";
import { recordEvent } from "@/lib/auth";
import { activeDestinations } from "@/lib/destination-store";
const schema=z.object({days:z.number().int().min(1).max(7),budget:z.number().min(500),interests:z.array(z.string()).default([]),style:z.string(),group:z.string(),travelers:z.number().int().min(1).max(20),start:z.string(),pace:z.enum(["relaxed","balanced","packed"]),foodPreference:z.string().optional(),accessibility:z.array(z.string()).default([])});
export async function POST(request:NextRequest) { const parsed=schema.safeParse(await request.json()); if(!parsed.success) return NextResponse.json({error:"Please check your trip preferences."},{status:400}); const itinerary=generateItinerary(parsed.data as never, await activeDestinations()); const ai=await enhanceItinerary(itinerary,parsed.data as never); await recordEvent("itinerary_generation", "success", { days: parsed.data.days, interest_count: parsed.data.interests.length, ai_enhanced: Boolean(ai) }); return NextResponse.json({itinerary,ai,source:"rule-based"}); }
