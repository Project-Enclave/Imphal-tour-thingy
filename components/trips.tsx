"use client";

import { useEffect, useState } from "react";
import { browserSupabase, supabaseConfigured } from "@/lib/browser-supabase";
type Trip = { id: string; title: string; updated_at: string; itinerary: { totalCost?: number; days?: unknown[] } };
export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false); const [loaded, setLoaded] = useState(false);
  const accessToken = async () => (await browserSupabase!.auth.getSession()).data.session?.access_token;
  const load = async () => { const token = await accessToken(); if (!token) return location.assign("/login"); const response = await fetch("/api/trips", { headers: { Authorization: `Bearer ${token}` } }); const json = await response.json(); setTrips(json.trips || []); setLoaded(true); };
  useEffect(() => { if (browserSupabase) load(); }, []);
  const saveLatest = async () => { const raw = localStorage.getItem("manipur-trip-draft"); if (!raw) return setMessage("Generate an itinerary first, then return here to save it."); try { setSaving(true); const response = await fetch("/api/trips", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${await accessToken()}` }, body: JSON.stringify({ title: `${JSON.parse(raw).preferences.days}-day Manipur adventure`, ...JSON.parse(raw) }) }); const json = await response.json(); if (!response.ok) throw new Error(json.error); localStorage.removeItem("manipur-trip-draft"); setMessage("Your itinerary was saved."); load(); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save trip."); } finally { setSaving(false); } };
  const remove = async (id: string) => { if (!confirm("Delete this saved trip?")) return; await fetch(`/api/trips/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${await accessToken()}` } }); load(); };
  if (!supabaseConfigured) return <main className="account"><a href="/">← Planner</a><h1>Trips need Supabase.</h1><p>Configure Supabase to save your itineraries.</p></main>;
  return <main className="account"><a href="/">← Planner</a><p className="eyebrow">SAVED ITINERARIES</p><h1>My trips.</h1><div className="auth-card"><button onClick={saveLatest} disabled={saving}>{saving ? "Saving…" : "Save latest generated trip"}</button><button className="outline" onClick={async () => { await browserSupabase!.auth.signOut(); location.assign("/login"); }}>Sign out</button></div>{message && <p className="form-message">{message}</p>}<h2>Saved trips</h2>{!loaded ? <p>Loading…</p> : trips.length ? <ul>{trips.map(trip => <li key={trip.id}><b>{trip.title}</b><small>Updated {new Date(trip.updated_at).toLocaleDateString()}</small><button className="back" onClick={() => remove(trip.id)}>Delete</button></li>)}</ul> : <p>No saved trips yet. Create an itinerary and save it here.</p>}</main>;
}
