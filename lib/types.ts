export type Interest = "History & Heritage" | "Nature" | "Adventure" | "Local Food" | "Culture" | "Shopping" | "Photography" | "Local Experiences" | "Peace & Relaxation";
export type Pace = "relaxed" | "balanced" | "packed";

export type Destination = {
  id: string; name: string; category: string; description: string; location: string;
  estimatedCost: number; duration: number; interests: Interest[]; accessibility: string[];
  ecoScore: number; bestTime: string; distanceFromImphal: number; travelHours: number;
  styles: string[]; imageUrl?: string; imageCredit?: string;
};

export type TripPreferences = {
  days: number; budget: number; interests: Interest[]; style: string; group: string;
  travelers: number; start: string; pace: Pace; foodPreference?: string; accessibility: string[];
};

export type ItineraryItem = Destination & { why: string; slot: "Morning" | "Afternoon" | "Evening"; score: number };
export type ItineraryDay = { day: number; theme: string; items: ItineraryItem[]; cost: number; travelHours: number; distance: number };
export type Itinerary = { days: ItineraryDay[]; totalCost: number; totalTravelHours: number; totalDistance: number; ecoScore: number; whyThisTrip: string[]; ecoTips: string[] };
