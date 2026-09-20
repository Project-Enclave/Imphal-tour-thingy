"use client";

import { useState } from "react";
import { browserSupabase, supabaseConfigured } from "@/lib/browser-supabase";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const isSignup = mode === "signup";

  const submit = async () => {
    if (!browserSupabase) return;
    setBusy(true); setMessage("");
    const result = isSignup
      ? await browserSupabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/trips` } })
      : await browserSupabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (result.error) return setMessage(result.error.message);
    if (isSignup) setMessage("Check your inbox to confirm your email, then sign in.");
    else location.assign("/trips");
  };
  const google = async () => {
    if (!browserSupabase) return;
    setBusy(true);
    const { error } = await browserSupabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/trips` } });
    if (error) { setMessage(error.message); setBusy(false); }
  };
  if (!supabaseConfigured) return <main className="account"><a href="/">← Planner</a><h1>Authentication needs configuration.</h1><p>Add the public Supabase URL and anonymous key to Vercel, then redeploy.</p></main>;
  return <main className="account"><a href="/">← Planner</a><p className="eyebrow">{isSignup ? "CREATE YOUR ACCOUNT" : "WELCOME BACK"}</p><h1>{isSignup ? "Save every journey." : "Pick up where you left off."}</h1><div className="auth-card"><label>Email<input autoComplete="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input autoComplete={isSignup ? "new-password" : "current-password"} type="password" minLength={6} placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} /></label><button onClick={submit} disabled={busy}>{busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}</button><button className="google" onClick={google} disabled={busy}>Continue with Google</button>{message && <p className="form-message">{message}</p>}</div><p>{isSignup ? "Already have an account? " : "New here? "}<a href={isSignup ? "/login" : "/signup"}>{isSignup ? "Sign in" : "Create an account"} →</a></p></main>;
}
