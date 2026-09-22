"use client";

import { useState, useMemo } from "react";

// ---------------------------------------------------------------------------
// Language catalogue
// ---------------------------------------------------------------------------

type Lang = {
  code: string;   // BCP-47 / Google Translate lang code
  name: string;   // English name
  native: string; // Name in that language
  flag?: string;  // Optional emoji flag
};

const LANGUAGES: Lang[] = [
  // South & Southeast Asia (prioritised – highly relevant to Manipur visitors)
  { code: "mni", name: "Meitei (Manipuri)", native: "মৈতৈলোন্", flag: "🇮🇳" },
  { code: "hi",  name: "Hindi",             native: "हिन्दी",    flag: "🇮🇳" },
  { code: "bn",  name: "Bengali",           native: "বাংলা",     flag: "🇧🇩" },
  { code: "as",  name: "Assamese",          native: "অসমীয়া",   flag: "🇮🇳" },
  { code: "ne",  name: "Nepali",            native: "नेपाली",    flag: "🇳🇵" },
  { code: "ur",  name: "Urdu",              native: "اردو",      flag: "🇵🇰" },
  { code: "pa",  name: "Punjabi",           native: "ਪੰਜਾਬੀ",   flag: "🇮🇳" },
  { code: "gu",  name: "Gujarati",          native: "ગુજરાતી",  flag: "🇮🇳" },
  { code: "mr",  name: "Marathi",           native: "मराठी",     flag: "🇮🇳" },
  { code: "ta",  name: "Tamil",             native: "தமிழ்",    flag: "🇮🇳" },
  { code: "te",  name: "Telugu",            native: "తెలుగు",   flag: "🇮🇳" },
  { code: "kn",  name: "Kannada",           native: "ಕನ್ನಡ",    flag: "🇮🇳" },
  { code: "ml",  name: "Malayalam",         native: "മലയാളം",   flag: "🇮🇳" },
  { code: "or",  name: "Odia",              native: "ଓଡ଼ିଆ",    flag: "🇮🇳" },
  { code: "my",  name: "Burmese",           native: "မြန်မာ",   flag: "🇲🇲" },
  { code: "th",  name: "Thai",              native: "ไทย",      flag: "🇹🇭" },
  { code: "km",  name: "Khmer",             native: "ខ្មែរ",     flag: "🇰🇭" },
  { code: "lo",  name: "Lao",               native: "ລາວ",      flag: "🇱🇦" },
  { code: "vi",  name: "Vietnamese",        native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id",  name: "Indonesian",        native: "Indonesia", flag: "🇮🇩" },
  { code: "ms",  name: "Malay",             native: "Melayu",   flag: "🇲🇾" },
  { code: "tl",  name: "Filipino",          native: "Filipino",  flag: "🇵🇭" },
  // East Asia
  { code: "zh-CN", name: "Chinese (Simplified)",  native: "中文（简体）", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", native: "中文（繁體）", flag: "🇹🇼" },
  { code: "ja",  name: "Japanese",          native: "日本語",    flag: "🇯🇵" },
  { code: "ko",  name: "Korean",            native: "한국어",    flag: "🇰🇷" },
  // Europe
  { code: "en",  name: "English",           native: "English",   flag: "🇬🇧" },
  { code: "fr",  name: "French",            native: "Français",  flag: "🇫🇷" },
  { code: "de",  name: "German",            native: "Deutsch",   flag: "🇩🇪" },
  { code: "es",  name: "Spanish",           native: "Español",   flag: "🇪🇸" },
  { code: "pt",  name: "Portuguese",        native: "Português", flag: "🇵🇹" },
  { code: "it",  name: "Italian",           native: "Italiano",  flag: "🇮🇹" },
  { code: "nl",  name: "Dutch",             native: "Nederlands",flag: "🇳🇱" },
  { code: "pl",  name: "Polish",            native: "Polski",    flag: "🇵🇱" },
  { code: "ru",  name: "Russian",           native: "Русский",   flag: "🇷🇺" },
  { code: "uk",  name: "Ukrainian",         native: "Українська",flag: "🇺🇦" },
  { code: "ro",  name: "Romanian",          native: "Română",    flag: "🇷🇴" },
  { code: "cs",  name: "Czech",             native: "Čeština",   flag: "🇨🇿" },
  { code: "sk",  name: "Slovak",            native: "Slovenčina",flag: "🇸🇰" },
  { code: "hr",  name: "Croatian",          native: "Hrvatski",  flag: "🇭🇷" },
  { code: "hu",  name: "Hungarian",         native: "Magyar",    flag: "🇭🇺" },
  { code: "sv",  name: "Swedish",           native: "Svenska",   flag: "🇸🇪" },
  { code: "no",  name: "Norwegian",         native: "Norsk",     flag: "🇳🇴" },
  { code: "da",  name: "Danish",            native: "Dansk",     flag: "🇩🇰" },
  { code: "fi",  name: "Finnish",           native: "Suomi",     flag: "🇫🇮" },
  { code: "el",  name: "Greek",             native: "Ελληνικά",  flag: "🇬🇷" },
  { code: "tr",  name: "Turkish",           native: "Türkçe",    flag: "🇹🇷" },
  // Middle East & Africa
  { code: "ar",  name: "Arabic",            native: "العربية",   flag: "🇸🇦" },
  { code: "fa",  name: "Persian",           native: "فارسی",     flag: "🇮🇷" },
  { code: "he",  name: "Hebrew",            native: "עברית",     flag: "🇮🇱" },
  { code: "sw",  name: "Swahili",           native: "Kiswahili", flag: "🇹🇿" },
  { code: "am",  name: "Amharic",           native: "አማርኛ",    flag: "🇪🇹" },
  { code: "ha",  name: "Hausa",             native: "Hausa",     flag: "🇳🇬" },
  // Americas
  { code: "pt-BR", name: "Portuguese (Brazil)", native: "Português (Brasil)", flag: "🇧🇷" },
  { code: "es-419", name: "Spanish (Latin America)", native: "Español (Latinoamérica)", flag: "🌎" },
];

// ---------------------------------------------------------------------------
// Phrasebook
// ---------------------------------------------------------------------------

type Phrase = { meitei: string; romanised: string; english: string };

const PHRASES: { category: string; items: Phrase[] }[] = [
  {
    category: "Greetings",
    items: [
      { meitei: "খুরুমজরি",     romanised: "Khurumjari",       english: "Hello / Welcome" },
      { meitei: "নুমিৎ চাউখৎলক্কনি", romanised: "Numit chaokhatlaknni", english: "Good morning" },
      { meitei: "অনিশা নুমিৎ",  romanised: "Anisha Numit",     english: "Good evening" },
      { meitei: "চাওথোকপা",      romanised: "Chaothokpa",       english: "Thank you" },
      { meitei: "হায়রে",          romanised: "Hayre",            english: "Goodbye" },
    ],
  },
  {
    category: "Directions & Travel",
    items: [
      { meitei: "লাইরিক্ কখা অমনি?", romanised: "Lairik kakha amani?", english: "Where is the road?" },
      { meitei: "হৌজিক্কি মমাং",  romanised: "Houjikki mamang",  english: "Straight ahead" },
      { meitei: "মতম কতা লাগবনো?", romanised: "Matam kata lagabano?", english: "How long will it take?" },
      { meitei: "বাস স্টেসন কখা?", romanised: "Bus station kakha?", english: "Where is the bus station?" },
      { meitei: "টিকেৎ লুপা কতা?", romanised: "Tiket lupa kata?", english: "How much is the ticket?" },
    ],
  },
  {
    category: "Food & Shopping",
    items: [
      { meitei: "ইমা কেইথেল কখা?", romanised: "Ima Keithel kakha?", english: "Where is Ima Keithel?" },
      { meitei: "থরক্ কতা লুপা?", romanised: "Tharak kata lupa?", english: "How much does this cost?" },
      { meitei: "চামথোং অমা পীবিরো", romanised: "Chamthong ama pibiro", english: "Give me one chamthong (stew), please" },
      { meitei: "কাঞ্জি লেপ্‌পা",   romanised: "Kanji leppa",        english: "Kanghou / Eromba (fermented fish dish)" },
      { meitei: "নিংথৌ লুপা কতা?", romanised: "Ningthou lupa kata?", english: "What is the price of singju?" },
    ],
  },
  {
    category: "Emergency & Safety",
    items: [
      { meitei: "চাফথোং পীবিরো",  romanised: "Chafthong pibiro",  english: "Please help me" },
      { meitei: "অস্পতাল কখা?",   romanised: "Hospital kakha?",    english: "Where is the hospital?" },
      { meitei: "পুলিস",            romanised: "Pulis",              english: "Police" },
      { meitei: "মায়োক্",          romanised: "Mayok",              english: "Stop / Wait" },
      { meitei: "তৌবিরো",          romanised: "Toubiro",            english: "Please do (polite request)" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LangClient() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Lang | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return LANGUAGES;
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [query]);

  // Build Google Translate URL pointing back to the home page
  const gtUrl = (lang: Lang) => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://imphal.vercel.app";
    const target = `${origin}/?lang=${lang.code}`;
    return `https://translate.google.com/translate?sl=en&tl=${lang.code}&u=${encodeURIComponent(target)}`;
  };

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <main>
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav>
        <a className="brand" href="/">
          MANIPUR <i>•</i> WANDER
        </a>
        <span>Language &amp; Translation</span>
        <span>
          <a href="/">← Back to Planner</a>
        </span>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="lang-hero">
        <p className="eyebrow">LANGUAGE &amp; TRANSLATION</p>
        <h1>
          Explore Manipur in <em>Your Language</em>
        </h1>
        <p className="lede">
          Choose any language below to view this site via Google Translate, or
          browse our handy phrasebook of Meitei — the local tongue of Manipur.
        </p>
      </div>

      {/* ── Language picker ─────────────────────────────────── */}
      <section className="lang-section">
        <div className="lang-search-wrap">
          <input
            className="lang-search"
            type="search"
            placeholder="Search languages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search languages"
          />
        </div>

        {filtered.length === 0 && (
          <p className="lang-empty">No languages match "{query}".</p>
        )}

        <div className="lang-grid">
          {filtered.map((lang) => (
            <a
              key={lang.code}
              href={gtUrl(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className={`lang-card${selected?.code === lang.code ? " lang-card--active" : ""}`}
              onClick={() => setSelected(lang)}
            >
              {lang.flag && <span className="lang-flag">{lang.flag}</span>}
              <span className="lang-name">{lang.name}</span>
              <span className="lang-native">{lang.native}</span>
              <span className="lang-code">{lang.code}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── Phrasebook ──────────────────────────────────────── */}
      <section className="lang-section lang-section--dark">
        <p className="eyebrow">MEITEI PHRASEBOOK</p>
        <h2 className="lang-section-title">Useful Phrases for Your Visit</h2>
        <p className="lang-section-sub">
          Tap any Meitei phrase to copy it. The romanised version is shown
          underneath to help with pronunciation.
        </p>

        {PHRASES.map((group) => (
          <div key={group.category} className="phrase-group">
            <h3 className="phrase-category">{group.category}</h3>
            <div className="phrase-list">
              {group.items.map((phrase) => {
                const key = phrase.meitei;
                return (
                  <div key={key} className="phrase-row">
                    <button
                      className={`phrase-meitei${copied === key ? " phrase-meitei--copied" : ""}`}
                      onClick={() => copy(phrase.meitei, key)}
                      title="Click to copy"
                    >
                      {copied === key ? "✓ Copied!" : phrase.meitei}
                    </button>
                    <div className="phrase-right">
                      <span className="phrase-roman">{phrase.romanised}</span>
                      <span className="phrase-english">{phrase.english}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* ── Footer note ─────────────────────────────────────── */}
      <div className="lang-footer-note">
        <p>
          Translation is powered by Google Translate. Quality may vary for
          lesser-resourced languages. For Meitei, the script used is Meitei
          Mayek (also written in Bengali script above).
        </p>
      </div>
    </main>
  );
}
