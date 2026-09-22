"use client";

import { useState } from "react";
import type { Interest, Itinerary, ItineraryItem, TripPreferences } from "@/lib/types";
import MapSearchLinks from "@/components/map-search-links";

const interests: Interest[] = [
  "History & Heritage",
  "Nature",
  "Adventure",
  "Local Food",
  "Culture",
  "Shopping",
  "Photography",
  "Local Experiences",
  "Peace & Relaxation",
];

const defaults: TripPreferences = {
  days: 3,
  budget: 5000,
  interests: ["Culture", "Nature"],
  style: "Balanced",
  group: "Solo",
  travelers: 1,
  start: "Imphal",
  pace: "balanced",
  foodPreference: "Any",
  accessibility: [],
};

const options = {
  days: [1, 2, 3, 4, 5],
  budget: [1000, 3000, 5000, 10000],
  style: ["Budget", "Balanced", "Comfortable", "Adventure"],
  group: ["Solo", "Couple", "Family", "Friends"],
  pace: ["relaxed", "balanced", "packed"],
  accessibility: [
    "Wheelchair-friendly places",
    "Less walking",
    "Family-friendly",
    "Senior-friendly",
  ],
};

export default function Planner() {
  const [step, setStep] = useState(0);
  const [p, setP] = useState(defaults);
  const [result, setResult] = useState<Itinerary | null>(null);
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = (value: Interest) =>
    setP((x) => ({
      ...x,
      interests: x.interests.includes(value)
        ? x.interests.filter((i) => i !== value)
        : [...x.interests, value],
    }));

  const generate = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const json = await r.json();
      setResult(json.itinerary);
      setIntro(json.ai?.intro || "");
      window.localStorage.setItem(
        "manipur-trip-draft",
        JSON.stringify({ preferences: p, itinerary: json.itinerary })
      );
      setStep(8);
    } finally {
      setLoading(false);
    }
  };

  if (result)
    return (
      <Result
        itinerary={result}
        intro={intro}
        reset={() => {
          setResult(null);
          setStep(0);
        }}
      />
    );

  const labels = ["Days", "Budget", "Interests", "Style", "Group", "Start", "Access", "Review"];

  return (
    <main>
      <nav>
        <a className="brand" href="/">
          MANIPUR <i>•</i> WANDER
        </a>
        <span>Smart Trip Planner</span>
        <span>
          <a href="/trips">My trips</a> · <a href="/admin">Dashboard</a> · <a href="/lang" title="Language / Translation" aria-label="Change language">🌐</a>
        </span>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">RE-IMAGINING MANIPUR · 2026</p>
          <h1>
            Plan Your Perfect <em>Manipur</em> Journey
          </h1>
          <p className="lede">
            Tell us what you love. We'll create a personalized Manipur
            experience for you.
          </p>
          <button
            onClick={() =>
              document.getElementById("planner")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Create My Trip <b>→</b>
          </button>
        </div>
      </section>

      <section id="planner" className="planner">
        <p className="eyebrow">YOUR JOURNEY, YOUR WAY</p>
        <div className="progress">
          {labels.map((x, i) => (
            <span key={x} className={i <= step ? "active" : ""}>
              {i + 1} <small>{x}</small>
            </span>
          ))}
        </div>
        <div className="panel">
          <p className="step">STEP {step + 1} OF 8</p>

          {step === 0 && (
            <Choice
              title="How many days do you have?"
              values={options.days}
              value={p.days}
              onChange={(v) => setP({ ...p, days: Number(v) })}
              render={(v) => (v === 5 ? "5+ Days" : `${v} Day${v === 1 ? "" : "s"}`)}
            />
          )}

          {step === 1 && (
            <Choice
              title="What is your approximate trip budget?"
              values={options.budget}
              value={p.budget}
              onChange={(v) => setP({ ...p, budget: Number(v) })}
              render={(v) =>
                v === 10000 ? "₹10,000+" : `₹${Number(v).toLocaleString("en-IN")}`
              }
            />
          )}

          {step === 2 && (
            <>
              <h2>What makes you curious?</h2>
              <p>Choose as many experiences as you'd like.</p>
              <div className="chips">
                {interests.map((i) => (
                  <button
                    key={i}
                    className={p.interests.includes(i) ? "selected" : ""}
                    onClick={() => toggle(i)}
                  >
                    {p.interests.includes(i) ? "✓ " : ""}
                    {i}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <Choice
              title="What is your travel style?"
              values={options.style}
              value={p.style}
              onChange={(v) => setP({ ...p, style: String(v) })}
            />
          )}

          {step === 4 && (
            <>
              <Choice
                title="Who are you travelling with?"
                values={options.group}
                value={p.group}
                onChange={(v) => setP({ ...p, group: String(v) })}
              />
              <label className="number">
                Number of travelers{" "}
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={p.travelers}
                  onChange={(e) => setP({ ...p, travelers: Number(e.target.value) })}
                />
              </label>
            </>
          )}

          {step === 5 && (
            <>
              <h2>Where are you starting from?</h2>
              <p>This helps us sort places by travel time.</p>
              <div className="choices">
                {["Imphal", "Outside Manipur"].map((v) => (
                  <button
                    key={v}
                    className={p.start === v ? "selected" : ""}
                    onClick={() => setP({ ...p, start: v })}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <h2>Any accessibility needs?</h2>
              <p>Optional — we'll prioritise places that match.</p>
              <div className="chips">
                {options.accessibility.map((a) => (
                  <button
                    key={a}
                    className={p.accessibility.includes(a) ? "selected" : ""}
                    onClick={() =>
                      setP((x) => ({
                        ...x,
                        accessibility: x.accessibility.includes(a)
                          ? x.accessibility.filter((i) => i !== a)
                          : [...x.accessibility, a],
                      }))
                    }
                  >
                    {p.accessibility.includes(a) ? "✓ " : ""}
                    {a}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 7 && (
            <>
              <h2>Ready to plan your trip?</h2>
              <p className="muted">
                {p.days} day{p.days > 1 ? "s" : ""} · ₹{p.budget.toLocaleString("en-IN")} budget ·{" "}
                {p.interests.slice(0, 3).join(", ")}
                {p.interests.length > 3 ? ` +${p.interests.length - 3} more` : ""}
              </p>
            </>
          )}

          <footer>
            <button className="back" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              ← Back
            </button>
            {step < 7 ? (
              <button onClick={() => setStep((s) => s + 1)}>Continue →</button>
            ) : (
              <button onClick={generate} disabled={loading}>
                {loading ? "Building your trip…" : "Create My Itinerary →"}
              </button>
            )}
          </footer>
        </div>
      </section>
    </main>
  );
}

function Choice({
  title,
  values,
  value,
  onChange,
  render = (v) => String(v),
}: {
  title?: string;
  values: (string | number)[];
  value: string | number;
  onChange: (v: string | number) => void;
  render?: (v: string | number) => string;
}) {
  return (
    <>
      {title && <h2>{title}</h2>}
      <div className="choices">
        {values.map((v) => (
          <button
            key={v}
            className={v === value ? "selected" : ""}
            onClick={() => onChange(v)}
          >
            {render(v)}
          </button>
        ))}
      </div>
    </>
  );
}

function Result({
  itinerary,
  intro,
  reset,
}: {
  itinerary: Itinerary;
  intro: string;
  reset: () => void;
}) {
  return (
    <main>
      <nav>
        <a className="brand" href="/">
          MANIPUR <i>•</i> WANDER
        </a>
        <span>Your Personalized Itinerary</span>
        <span>
          <a href="#" onClick={reset}>
            Start Over
          </a>{" "}
          · <a href="/admin">Dashboard</a> · <a href="/lang" title="Language / Translation" aria-label="Change language">🌐</a>
        </span>
      </nav>

      <section className="result">
        <header>
          <p className="eyebrow">YOUR PERSONALIZED ITINERARY</p>
          <h1>
            Your <em>Manipur</em> Adventure Awaits
          </h1>
          {intro && <p className="lede">{intro}</p>}
          <div className="summary">
            {itinerary.days && (
              <>
                <b>{itinerary.days.length}</b>
                <span>Days</span>
              </>
            )}
            {itinerary.totalCost && (
              <>
                <b>₹{itinerary.totalCost.toLocaleString("en-IN")}</b>
                <span>Est. Budget</span>
              </>
            )}
          </div>
        </header>

        <div className="days">
          {itinerary.days?.map((day, idx) => (
            <div key={idx} className="day">
              <div className="day-title">
                <p>Day {idx + 1}</p>
                {/* theme replaces the old (broken) day.title */}
                <h2>{day.theme}</h2>
              </div>
              {day.items?.map((item: ItineraryItem, i: number) => (
                <div key={i} className="activity">
                  <div className="slot">{item.slot}</div>
                  <div>
                    <h3>{item.name}</h3>
                    <p className="category">{item.category}</p>
                    {item.description && <p>{item.description}</p>}
                    {item.why && <p className="why">Why: {item.why}</p>}
                    <MapSearchLinks name={item.name} location={item.location} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {itinerary.whyThisTrip && (
          <section className="why-section">
            <h2>Why These Experiences?</h2>
            {Array.isArray(itinerary.whyThisTrip) ? (
              itinerary.whyThisTrip.map((item, idx) => (
                <div key={idx}>
                  {typeof item === "object" ? (
                    <>
                      <h3>{(item as { title: string }).title}</h3>
                      <p>{(item as { description: string }).description}</p>
                    </>
                  ) : (
                    <p>{item}</p>
                  )}
                </div>
              ))
            ) : (
              <p>{itinerary.whyThisTrip}</p>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
