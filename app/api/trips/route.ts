import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
export async function GET(request:NextRequest){const auth=await requireUser(request);if(!auth)return NextResponse.json({error:"Sign in and configure Supabase to view saved trips."},{status:401});const {data,error}=await auth.db.from("trips").select("*").eq("user_id",auth.user.id).order("updated_at",{ascending:false});return NextResponse.json(error?{error:error.message}:{trips:data});}
const schema=z.object({title:z.string().min(1).max(100),preferences:z.unknown(),itinerary:z.unknown()});
export async function POST(request:NextRequest){const auth=await requireUser(request);if(!auth)return NextResponse.json({error:"Sign in required."},{status:401});const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid trip."},{status:400});const {data,error}=await auth.db.from("trips").insert({...parsed.data,user_id:auth.user.id}).select().single();return NextResponse.json(error?{error:error.message}:{trip:data},{status:error?400:201});}
