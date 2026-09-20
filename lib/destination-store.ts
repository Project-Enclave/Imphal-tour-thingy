import { destinations as localDestinations } from "@/data/destinations";
import { serviceSupabase } from "@/lib/supabase";
import type { Destination } from "@/lib/types";
export async function activeDestinations(): Promise<Destination[]> {
  const db = serviceSupabase(); if (!db) return localDestinations;
  const { data, error } = await db.from("destinations").select("id,name,category,data,image_url,image_credit").eq("visible",true);
  if (error || !data?.length) return localDestinations;
  return data.map(row => ({ ...(row.data as Omit<Destination,"id"|"name"|"category"|"imageUrl"|"imageCredit">), id: row.id, name: row.name, category: row.category, imageUrl: row.image_url || undefined, imageCredit: row.image_credit || undefined }));
}
