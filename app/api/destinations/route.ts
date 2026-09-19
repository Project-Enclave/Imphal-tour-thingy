import { NextResponse } from "next/server";
import { destinations } from "@/data/destinations";
export function GET() { return NextResponse.json({ destinations, count: destinations.length }); }
