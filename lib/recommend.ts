import { destinations } from "@/data/destinations";
import type { Destination, Itinerary, ItineraryDay, ItineraryItem, TripPreferences } from "@/lib/types";

const slots: ItineraryItem["slot"][] = ["Morning", "Afternoon", "Evening"];
export function scoreDestination(place: Destination, p: TripPreferences) {
  let score = place.interests.filter(i => p.interests.includes(i)).length * 24;
  if (place.estimatedCost <= p.budget / Math.max(p.days, 1)) score += 16; else score -= 22;
  if (place.styles.includes(p.style)) score += 10;
  if (p.start.toLowerCase().includes("imphal") && place.distanceFromImphal < 35) score += 8;
  if (p.accessibility.every(a => place.accessibility.includes(a))) score += p.accessibility.length * 8;
  else if (p.accessibility.length && !p.accessibility.some(a => place.accessibility.includes(a))) score -= 14;
  if (p.pace === "relaxed" && place.duration <= 3) score += 5;
  if (p.group === "Family" && place.accessibility.includes("Family-friendly")) score += 7;
  return score;
}
export function generateItinerary(p: TripPreferences): Itinerary {
  const ranked = destinations.map(place => ({ place, score: scoreDestination(place, p) })).filter(x => x.score > -10).sort((a,b) => b.score-a.score);
  const perDay = p.pace === "packed" ? 3 : p.pace === "balanced" ? 2 : 2;
  const used = ranked.slice(0, Math.min(ranked.length, p.days * perDay));
  const days: ItineraryDay[] = Array.from({length:p.days}, (_, idx) => ({day:idx+1,theme:"Manipur highlights",items:[],cost:0,travelHours:0,distance:0}));
  used.forEach(({place,score}, idx) => {
    const day = days[idx % p.days]; const matching = place.interests.find(i => p.interests.includes(i)) || place.category;
    day.items.push({...place,score,slot:slots[day.items.length % 3],why:`A strong match for ${matching}${place.distanceFromImphal < 35 ? ", with an easy journey from Imphal" : " and your chosen travel style"}.`});
    day.cost += place.estimatedCost * p.travelers; day.travelHours += place.travelHours; day.distance += place.distanceFromImphal;
    day.theme = matching;
  });
  const all = days.flatMap(d=>d.items); const totalCost = days.reduce((n,d)=>n+d.cost,0);
  return { days, totalCost, totalTravelHours:Number(days.reduce((n,d)=>n+d.travelHours,0).toFixed(1)), totalDistance:days.reduce((n,d)=>n+d.distance,0), ecoScore:Math.round(all.reduce((n,x)=>n+x.ecoScore,0)/Math.max(all.length,1)), whyThisTrip:[`Built around ${p.interests.slice(0,3).join(", ") || "Manipur’s best experiences"}.`,`Balanced for a ${p.days}-day ${p.pace} journey from ${p.start}.`,`Prioritises ${p.accessibility.length ? "your accessibility preferences" : "places with strong local value"}.`], ecoTips:["Choose shared transport for intercity journeys.","Carry a refillable bottle and avoid single-use plastic.","Buy directly from local makers and family-run businesses."] };
}
