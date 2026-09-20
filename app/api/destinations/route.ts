import { NextResponse } from "next/server";
import { activeDestinations } from "@/lib/destination-store";
export async function GET() { const destinations = await activeDestinations(); return NextResponse.json({ destinations, count: destinations.length }); }
