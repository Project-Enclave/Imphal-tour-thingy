# Smart Trip Planner – Manipur

An intelligent, responsive tourism planner for **Re-Imagining Manipur – Hackathon 2026**. Visitors select their trip preferences and receive a practical, personalized Manipur itinerary built from curated local destinations and experiences.

It works as a polished public demo with no external configuration. Supabase accounts, saved trips, Google sign-in, and optional AI-written guidance can be enabled when deploying.

## What it does

- Presents an image-led landing page for planning a Manipur trip.
- Collects trip duration, budget, interests, travel style, group size, pace, starting point, food interests, and accessibility needs.
- Scores 20+ Manipur destinations using an explainable, rule-based recommendation engine.
- Creates non-random morning, afternoon, and evening plans with estimated cost, distance, travel time, and a reason for every suggestion.
- Calculates an itinerary Eco Score and provides lower-impact travel suggestions.
- Includes an optional account page for email/password or Google sign-in and saved trip storage when Supabase is connected.
- Includes an operations dashboard at `/admin` and backend API endpoints for health checks, destination data, and itinerary generation.
- Optionally uses Gemini and/or OpenRouter to write a warmer itinerary introduction and practical tips; the factual itinerary always comes from the local recommendation engine.

## Technology

- **Frontend and backend:** Next.js App Router, React, TypeScript
- **Styling:** Custom responsive CSS
- **Validation:** Zod
- **Optional persistence/authentication:** Supabase Postgres and Supabase Auth
- **Optional AI:** Gemini API and OpenRouter
- **Deployment:** Vercel

## Quick start

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/Project-Enclave/Imphal-tour-thingy.git
cd Imphal-tour-thingy
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The public planner and deterministic recommendations work with an empty `.env.local` file.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the local development server. |
| `npm run build` | Create and validate a production build. |
| `npm run start` | Run the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run test` | Run Vitest tests. |

## How recommendations work

Every destination contains structured information such as interests, estimated cost, visit duration, travel distance, accessibility features, travel-style fit, and eco score. The server scores each destination against the visitor’s choices:

1. Strong interest matches receive the highest score.
2. Places that fit the daily budget, travel style, group, pace, and start location are boosted.
3. Places that conflict with requested accessibility needs or budget are deprioritized.
4. The best compatible places are arranged into day and time slots, favoring practical durations and nearby places.

This means the planner remains useful even if an AI provider is unavailable, and it never invents a destination or activity outside the curated data.

## API

| Endpoint | Description |
| --- | --- |
| `GET /api/health` | Returns application health and whether AI providers are configured. |
| `GET /api/destinations` | Returns the curated Manipur destination dataset. |
| `POST /api/itinerary` | Validates trip preferences and returns a generated itinerary. |
| `GET /api/trips` | Lists the authenticated user’s saved trips when Supabase is configured. |
| `POST /api/trips` | Saves an itinerary for the authenticated user when Supabase is configured. |

Example itinerary request:

```json
{
  "days": 3,
  "budget": 5000,
  "interests": ["Culture", "Nature", "Local Food"],
  "style": "Balanced",
  "group": "Solo",
  "travelers": 1,
  "start": "Imphal",
  "pace": "balanced",
  "foodPreference": "Vegetarian-friendly",
  "accessibility": ["Less walking"]
}
```

## Environment variables

Copy `.env.example` to `.env.local`. Never commit real keys.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | For accounts/trips | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For accounts/trips | Public Supabase anonymous key. |
| `SUPABASE_SERVICE_ROLE_KEY` | For future server admin actions | Server-only Supabase key; never expose it in client code. |
| `ADMIN_EMAILS` | For admin access | Comma-separated admin email allowlist. |
| `GEMINI_API_KEYS` | Optional | Comma-separated Gemini keys used server-side. |
| `OPENROUTER_API_KEYS` | Optional | Comma-separated OpenRouter keys used server-side. |
| `GEMINI_MODEL` | Optional | Gemini model identifier. |
| `OPENROUTER_MODEL` | Optional | OpenRouter model identifier. |

## Supabase setup

1. Create a free [Supabase](https://supabase.com/) project.
2. Open its SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy the project URL and anonymous key into `.env.local` or Vercel environment variables.
4. In **Authentication → Providers**, enable Email and Google.
5. Create Google OAuth credentials, then add your local and deployed callback URLs to Google and Supabase.
6. Add your email address to `ADMIN_EMAILS` for dashboard access when admin authorization is enabled.

## Optional AI enhancement

The AI layer is deliberately optional. It only receives trip preferences and names of already-selected destinations, then returns a short welcome message and practical tips.

Set one or both key pools:

```bash
GEMINI_API_KEYS=key-one,key-two
OPENROUTER_API_KEYS=key-one,key-two
```

For each request, the backend selects a configured provider/key. On an eligible timeout, rate limit (`429`), or provider server error, it attempts another configured key/provider, up to three attempts. Invalid responses are discarded and the user receives the normal template-based guidance.

Free AI plans have quotas and terms that can change. Do not send personal, sensitive, or account data to free AI providers.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Add the environment variables you need in **Project Settings → Environment Variables**.
4. Deploy.
5. If using Supabase Google authentication, add the final Vercel URL to the authorized redirect URLs in both Supabase and Google Cloud.

## Destination data and images

The initial destination dataset lives in [`data/destinations.ts`](data/destinations.ts). Add or revise destinations there, then use the Supabase seed/admin workflow when persistence is enabled.

Use only images you own or sources with clear reuse permission. Wikimedia Commons assets must retain their author, licence, and source attribution. The interface intentionally uses a solid-color fallback for locations without a verified image, so you can safely add your own Manipur photographs later.

## Project structure

```text
app/              Pages and route handlers
components/       Interactive planner and account UI
data/             Curated Manipur destination seed data
lib/              Recommendation engine, AI router, shared types, Supabase helpers
supabase/         Database schema and row-level-security policies
```

## Current limitations and next improvements

- Add destination CRUD and metrics persistence to the protected admin dashboard after Supabase is connected.
- Add trip version history, manual drag-and-drop schedule editing, and saved-trip deletion UI.
- Replace image fallbacks with user-supplied Manipur photographs and complete attribution records.
- Add automated unit tests for scoring and API routes.

## License

See [LICENSE](LICENSE).
