import { NextResponse } from "next/server";
export function GET() { return NextResponse.json({ status:"ok", service:"Smart Trip Planner – Manipur", timestamp:new Date().toISOString(), aiConfigured:Boolean(process.env.GEMINI_API_KEYS || process.env.OPENROUTER_API_KEYS) }); }
