import type { Itinerary, TripPreferences } from "@/lib/types";
import { recordEvent } from "@/lib/auth";

type AIResult = { intro: string; tips: string[] };
const keys = (value?:string) => value?.split(",").map(k=>k.trim()).filter(Boolean) ?? [];
let rotationCursor = 0;
export async function enhanceItinerary(itinerary: Itinerary, preferences: TripPreferences): Promise<AIResult | null> {
  const providers = [
    ...keys(process.env.GEMINI_API_KEYS).map(key=>({kind:"gemini" as const,key})),
    ...keys(process.env.OPENROUTER_API_KEYS).map(key=>({kind:"openrouter" as const,key})),
  ];
  if (!providers.length) return null;
  const start = rotationCursor++ % providers.length;
  const prompt = `Write a brief welcoming introduction and 3 practical tips for a Manipur trip. Use only these selected place names: ${itinerary.days.flatMap(d=>d.items.map(x=>x.name)).join(", ")}. Preferences: ${JSON.stringify(preferences)}. Return JSON only: {"intro":"...","tips":["...","...","..."]}.`;
  for (let attempt=0; attempt < Math.min(3,providers.length); attempt++) {
    const provider=providers[(start+attempt)%providers.length];
    const started = Date.now();
    try {
      const response = provider.kind === "gemini"
        ? await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || "gemini-2.0-flash"}:generateContent?key=${provider.key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:"application/json",maxOutputTokens:300}}),signal:AbortSignal.timeout(8000)})
        : await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${provider.key}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free",messages:[{role:"user",content:prompt}],response_format:{type:"json_object"},max_tokens:300}),signal:AbortSignal.timeout(8000)});
      if (!response.ok) { await recordEvent("ai_enhancement", `http_${response.status}`, { provider: provider.kind, latency_ms: Date.now() - started }); if (response.status === 429 || response.status >= 500) continue; return null; }
      const raw = await response.json(); const content = provider.kind === "gemini" ? raw.candidates?.[0]?.content?.parts?.[0]?.text : raw.choices?.[0]?.message?.content;
      const result=JSON.parse(content) as AIResult;
      if (typeof result.intro === "string" && Array.isArray(result.tips)) { await recordEvent("ai_enhancement", "success", { provider: provider.kind, latency_ms: Date.now() - started }); return result; }
    } catch { await recordEvent("ai_enhancement", "unavailable", { provider: provider.kind, latency_ms: Date.now() - started }); continue; }
  }
  return null;
}
