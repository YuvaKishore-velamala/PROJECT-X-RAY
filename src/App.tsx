// @ts-nocheck
import { useState, useEffect } from "react";

const C = {
  bg: "#0a0a0f", surface: "#0f0f17", card: "#16161f", border: "#2a2a3d",
  accent: "#6c63ff", cyan: "#00d4ff", green: "#00ff88", orange: "#ff8c42",
  pink: "#ff4d8d", yellow: "#ffd60a", text: "#f0f0f6", muted: "#8b8ba8",
  red: "#ff4d4d",
};

/* ── tiny helpers ── */
const GlowOrb = ({ color, size, top, left, opacity = 0.1 }) => (
  <div style={{
    position: "absolute", top, left, width: size, height: size, borderRadius: "50%",
    background: color, filter: `blur(${parseInt(size) * 0.55}px)`, opacity, pointerEvents: "none", zIndex: 0
  }} />
);

const Badge = ({ text, color }) => (
  <span style={{
    background: color + "22", border: `1px solid ${color}55`, color,
    borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700
  }}>{text}</span>
);

const TopBar = ({ color }) => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, height: 3,
    background: `linear-gradient(90deg,${color},transparent)`
  }} />
);

/* ── animated score ring ── */
const Ring = ({ score, color, label, size = 120 }) => {
  const r = 42, circ = 2 * Math.PI * r, pct = Math.min(score, 100) / 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke={C.border} strokeWidth="7" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{
            transition: "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)",
            filter: `drop-shadow(0 0 8px ${color})`
          }} />
        <text x="50" y="46" textAnchor="middle" fill={color}
          style={{ fontSize: 20, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>{score}</text>
        <text x="50" y="60" textAnchor="middle" fill={C.muted}
          style={{ fontSize: 9, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>/100</text>
      </svg>
      <span style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: '0.06em' }}>{label}</span>
    </div>
  );
};

/* ── progress bar ── */
const Bar = ({ label, value, color }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <span style={{ color: C.text, fontSize: 13 }}>{label}</span>
      <span style={{ color, fontSize: 13, fontWeight: 700 }}>{value}/100</span>
    </div>
    <div style={{ height: 7, background: C.border, borderRadius: 6, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${value}%`, background: `linear-gradient(90deg,${color},${color}88)`,
        borderRadius: 6, transition: "width 1.3s ease", boxShadow: `0 0 8px ${color}66`
      }} />
    </div>
  </div>
);

/* ── typewriter ── */
const Typewriter = ({ text, speed = 14 }) => {
  const [d, setD] = useState(""), [done, setDone] = useState(false);
  useEffect(() => {
    setD(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) setD(text.slice(0, ++i));
      else { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13.5, lineHeight: 1.9, color: C.text }}>
    {d}{!done && <span style={{ animation: "blink 1s step-end infinite", color: C.accent }}>▋</span>}
  </span>;
};

/* ── loading dots ── */
const Dots = () => (
  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
    {[0, 1, 2, 3].map(i => (
      <div key={i} style={{
        width: 8, height: 8, borderRadius: "50%", background: C.accent,
        animation: `pulse 1.4s ${i * 0.2}s ease-in-out infinite`
      }} />
    ))}
  </div>
);

/* ══════════════════════════════════════════════
   SECTION CARDS  – numbered like the spec
══════════════════════════════════════════════ */

const ScoreCard = ({ num, icon, title, score, level, levelColor, reasons, accentColor }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
    padding: 26, position: "relative", overflow: "hidden"
  }}>
    <TopBar color={accentColor} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{
        background: accentColor + "22", border: `1px solid ${accentColor}44`,
        color: accentColor, borderRadius: 10, padding: "4px 10px", fontSize: 12, fontWeight: 700
      }}>{num}</span>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{title}</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
      <Ring score={score} color={accentColor} label="Score" size={110} />
      <div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 6 }}>Level</div>
        <Badge text={level} color={levelColor} />
      </div>
    </div>
    <div>
      <div style={{
        fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase",
        letterSpacing: '0.06em', marginBottom: 10
      }}>Reason</div>
      {reasons.map((r, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
          <span style={{ color: accentColor, flexShrink: 0, marginTop: 2 }}>•</span>
          <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{r}</span>
        </div>
      ))}
    </div>
  </div>
);

const MarketValueCard = ({ value, currency, reasons }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
    padding: 26, position: "relative", overflow: "hidden"
  }}>
    <TopBar color={C.green} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{
        background: C.green + "22", border: `1px solid ${C.green}44`,
        color: C.green, borderRadius: 10, padding: "4px 10px", fontSize: 12, fontWeight: 700
      }}>2️⃣</span>
      <span style={{ fontSize: 18 }}>💰</span>
      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Market Value Estimate</span>
    </div>
    <div style={{
      background: C.surface, borderRadius: 14, padding: "18px 22px", marginBottom: 18,
      border: `1px solid ${C.green}33`
    }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: '0.06em' }}>Estimated Value</div>
      <div style={{
        fontSize: 28, fontWeight: 800, color: C.green,
        filter: `drop-shadow(0 0 12px ${C.green}66)`
      }}>{currency}{value}</div>
    </div>
    <div style={{
      fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase",
      letterSpacing: '0.06em', marginBottom: 10
    }}>Reason</div>
    {reasons.map((r, i) => (
      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "center" }}>
        <span style={{ color: C.green, fontSize: 16 }}>✓</span>
        <span style={{ fontSize: 13, color: C.muted }}>{r}</span>
      </div>
    ))}
  </div>
);

const RealScoreCard = ({ overall, breakdown }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
    padding: 26, position: "relative", overflow: "hidden"
  }}>
    <TopBar color={C.accent} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
      <span style={{
        background: C.accent + "22", border: `1px solid ${C.accent}44`,
        color: C.accent, borderRadius: 10, padding: "4px 10px", fontSize: 12, fontWeight: 700
      }}>4️⃣</span>
      <span style={{ fontSize: 18 }}>⭐</span>
      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Real Project Score</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
      <Ring score={overall} color={C.accent} label="Overall" size={120} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: '0.06em', fontWeight: 700 }}>Score Breakdown</div>
        {breakdown.map((b, i) => (
          <Bar key={i} label={b.label} value={b.score}
            color={[C.cyan, C.green, C.orange, C.pink, C.yellow][i % 5]} />
        ))}
      </div>
    </div>
  </div>
);

const SuggestionsCard = ({ suggestions }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
    padding: 26, position: "relative", overflow: "hidden"
  }}>
    <TopBar color={C.yellow} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 18 }}>💡</span>
      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Suggestions to Improve Score</span>
    </div>
    {suggestions.map((s, i) => (
      <div key={i} style={{
        background: C.surface, borderRadius: 12, padding: "16px 18px",
        marginBottom: 12, border: `1px solid ${C.border}`, position: "relative"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: s.points?.length ? 8 : 0 }}>
          <span style={{
            background: C.yellow + "22", border: `1px solid ${C.yellow}44`,
            color: C.yellow, borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 700
          }}>
            {i + 1}️⃣
          </span>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{s.title}</span>
        </div>
        {s.points?.map((p, j) => (
          <div key={j} style={{ display: "flex", gap: 8, marginBottom: 4, paddingLeft: 8 }}>
            <span style={{ color: C.yellow, flexShrink: 0 }}>→</span>
            <span style={{ fontSize: 13, color: C.muted }}>{p}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
);

const FinalTable = ({ rows }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
    padding: 26, position: "relative", overflow: "hidden"
  }}>
    <TopBar color={C.cyan} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 18 }}>📈</span>
      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Final Evaluation</span>
    </div>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${C.border}` }}>
          {["Metric", "Result"].map(h => (
            <th key={h} style={{
              padding: "10px 14px", textAlign: "left", fontSize: 12,
              color: C.muted, textTransform: "uppercase", letterSpacing: '0.06em'
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} style={{
            borderBottom: `1px solid ${C.border}22`,
            background: i % 2 === 0 ? C.surface + "88" : "transparent"
          }}>
            <td style={{ padding: "13px 14px", fontSize: 14, color: C.muted, fontWeight: 600 }}>{r.metric}</td>
            <td style={{ padding: "13px 14px" }}>
              <Badge text={r.result} color={r.color} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const JobCard = ({ jobs }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
    padding: 26, position: "relative", overflow: "hidden"
  }}>
    <TopBar color={C.pink} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 18 }}>💼</span>
      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Job Role Matching</span>
    </div>
    {jobs.map((j, i) => (
      <div key={i} style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: C.surface, borderRadius: 10, padding: "12px 16px", marginBottom: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, background: j.color || C.pink, borderRadius: "50%",
            boxShadow: `0 0 6px ${j.color || C.pink}`
          }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{j.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 70, height: 6, background: C.border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${j.match}%`, background: j.color || C.pink,
              transition: "width 1.2s ease"
            }} />
          </div>
          <span style={{ fontSize: 12, color: j.color || C.pink, fontWeight: 700 }}>{j.match}%</span>
        </div>
      </div>
    ))}
  </div>
);

const ResumeCard = ({ suggestions }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
    padding: 26, position: "relative", overflow: "hidden"
  }}>
    <TopBar color={C.orange} />
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: 18 }}>📄</span>
      <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>Resume Booster Suggestions</span>
    </div>
    {suggestions.map((s, i) => (
      <div key={i} style={{
        background: C.surface, borderRadius: 10, padding: "14px 16px",
        marginBottom: 10, borderLeft: `3px solid ${C.orange}`
      }}>
        <p style={{
          fontSize: 13, color: C.muted, lineHeight: 1.7,
          fontFamily: "'DM Mono', monospace", margin: 0
        }}>{s}</p>
      </div>
    ))}
    <div style={{
      marginTop: 10, padding: "10px 14px", background: C.orange + "11",
      border: `1px solid ${C.orange}33`, borderRadius: 10
    }}>
      <p style={{ fontSize: 12, color: C.orange, margin: 0 }}>
        💡 Copy these directly into your resume's project section for maximum impact.
      </p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [projectLink, setProjectLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [results, setResults] = useState(null);
  const [repoData, setRepoData] = useState(null);
  const [error, setError] = useState("");

  const stages = [
    "🔍 Fetching project from link...",
    "📖 Reading README & file structure...",
    "🧠 Detecting tech stack & features...",
    "📊 Computing market metrics...",
    "🚀 Generating improvement roadmap...",
    "✨ Finalizing AI evaluation..."
  ];

  /* ── fetch GitHub repo page ── */
  const fetchRepoData = async (url) => {
    try {
      const proxy = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
      const res = await fetch(proxy);
      const data = await res.json();
      const html = data.contents || "";

      const descMatch = html.match(/property="og:description"[^>]*content="([^"]+)"/);
      const desc = descMatch ? descMatch[1] : "";

      const langMatches = [...html.matchAll(/itemprop="programmingLanguage"[^>]*>([^<]+)</g)];
      const langs = langMatches.map(m => m[1].trim()).filter(Boolean);

      const readmeMatch = html.match(/id="readme"[\s\S]{0,200}?<article[^>]*>([\s\S]{0,3000}?)<\/article>/);
      const readme = readmeMatch ? readmeMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 1500) : "";

      const starsMatch = html.match(/(\d[\d,]*)\s*(?:users starred|star)/i);
      const forksMatch = html.match(/(\d[\d,]*)\s*fork/i);
      const stars = starsMatch ? starsMatch[1] : "unknown";
      const forks = forksMatch ? forksMatch[1] : "unknown";

      const fileMatches = [...html.matchAll(/aria-label="([^"]+\.\w+)"/g)];
      const files = [...new Set(fileMatches.map(m => m[1].trim()))].slice(0, 20);

      const topicMatches = [...html.matchAll(/data-ga-click="Topic[^"]*"[^>]*>([^<]+)</g)];
      const topics = topicMatches.map(m => m[1].trim()).filter(Boolean).slice(0, 8);

      return { desc, langs, readme, stars, forks, files, topics };
    } catch (e) {
      return null;
    }
  };

  const parseJSON = (text) => {
    try {
      const c = text.replace(/```json|```/g, "").trim();
      return JSON.parse(c.slice(c.indexOf("{"), c.lastIndexOf("}") + 1));
    } catch { return null; }
  };

  const analyze = async () => {
    if (!projectLink.trim()) {
      setError("Please enter a project link to analyze."); return;
    }
    setError(""); setLoading(true); setResults(null);

    setStage(stages[0]);
    await new Promise(r => setTimeout(r, 600));
    const repo = await fetchRepoData(projectLink);
    setRepoData(repo);

    for (let i = 1; i < stages.length; i++) {
      setStage(stages[i]);
      await new Promise(r => setTimeout(r, 700));
    }

    const repoContext = repo ? `
REAL DATA FETCHED FROM THE PROJECT LINK:
- Description: ${repo.desc || "Not found"}
- Detected Languages: ${repo.langs.length ? repo.langs.join(", ") : "Not detected"}
- GitHub Stars: ${repo.stars}
- GitHub Forks: ${repo.forks}
- Topics/Tags: ${repo.topics.length ? repo.topics.join(", ") : "None"}
- Files Found: ${repo.files.length ? repo.files.join(", ") : "Not detected"}
- README Content: ${repo.readme || "Not found"}
` : `Note: Could not auto-fetch repo details. Analyze based on the URL structure and any inferred context from the link: ${projectLink}`;

    const prompt = `You are an expert software project evaluator with deep knowledge of the tech industry, job market, and startup ecosystem. Analyze this project based on REAL data fetched from the project link.

Project URL: ${projectLink}

${repoContext}

Based on ALL the above real project data, return ONLY valid JSON — no markdown, no explanation, just the JSON object.

Return exactly this JSON structure with ACCURATE values based on the actual project data:
{
  "projectName": "<extract real project name from URL or README>",
  "detectedTech": ["<tech1>","<tech2>","<tech3>"],
  "linkStatus": "active",
  "demandScore": <0-100 integer based on real tech stack>,
  "demandLevel": "<High|Medium|Low>",
  "demandReasons": ["<specific reason based on detected tech>","<reason2>","<reason3>"],
  "marketValue": "<₹XX,000 – ₹XX,000 realistic range>",
  "marketValueReasons": ["<based on actual features>","<reason2>","<reason3>","<reason4>"],
  "trendScore": <0-100>,
  "trendLevel": "<Excellent|Good|Moderate|Low>",
  "trendReasons": ["<based on detected technologies>","<reason2>"],
  "overallScore": <0-100>,
  "scoreBreakdown": [
    {"label":"Technology relevance","score":<0-100>},
    {"label":"Feature complexity","score":<0-100>},
    {"label":"Practical usefulness","score":<0-100>},
    {"label":"Innovation","score":<0-100>},
    {"label":"UI/UX potential","score":<0-100>}
  ],
  "startupScore": <0-100>,
  "startupLevel": "<High|Medium-High|Medium|Low>",
  "startupReasons": ["<based on real project scope>","<reason2>"],
  "aiSummary": "<3-4 sentences specifically about THIS project based on real README/description data. Mention actual features found.>",
  "suggestions": [
    {"title":"<specific improvement for this project>","points":["<specific point>","<specific point>"]},
    {"title":"<improvement>","points":["<point>"]},
    {"title":"<improvement>","points":["<point>","<point>"]},
    {"title":"<improvement>","points":["<point>"]},
    {"title":"<improvement>","points":["<point>"]}
  ],
  "jobRoles": [
    {"title":"<role matching detected tech>","match":<50-99>,"color":"#6c63ff"},
    {"title":"<role>","match":<50-99>,"color":"#00d4ff"},
    {"title":"<role>","match":<50-99>,"color":"#00ff88"},
    {"title":"<role>","match":<50-99>,"color":"#ff8c42"}
  ],
  "resumeSuggestions": [
    "<professional bullet specifically about this project with real tech names>",
    "<bullet 2>",
    "<bullet 3>"
  ],
  "finalTable": [
    {"metric":"Demand","result":"<level>","color":"#00d4ff"},
    {"metric":"Market Value","result":"<₹range>","color":"#00ff88"},
    {"metric":"Trend","result":"<level>","color":"#ff8c42"},
    {"metric":"Real Score","result":"<score>/100","color":"#6c63ff"},
    {"metric":"Startup Potential","result":"<level>","color":"#ff4d8d"}
  ]
}`;

    try {
      // Google Gemini API (Free Tier)
      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        })
      });
      const data = await res.json();
      if (!res.ok) { setError("API error: " + (data?.error?.message || res.statusText)); setLoading(false); return; }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const parsed = parseJSON(text);
      if (parsed) { setResults(parsed); setPage("results"); }
      else { setError("Could not parse analysis. Please try again."); console.error(text); }
    } catch (e) {
      setError("Network error: " + (e.message || "Please check your connection."));
    }
    setLoading(false);
  };

  /* ── shared input style ── */
  const inp = {
    width: "100%", background: C.surface, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "13px 16px", color: C.text, fontSize: 14,
    fontFamily: "'Plus Jakarta Sans', sans-serif", outline: "none", transition: "all 0.2s"
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg}}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:${C.accent};border-radius:3px}
        @keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        h1,h2,h3,h4{font-family:'Plus Jakarta Sans',sans-serif;letter-spacing:-0.02em;line-height:1.15}
        p,span,div,label,td,th,button{font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
        input,textarea{font-family:'Plus Jakarta Sans',sans-serif!important;-webkit-font-smoothing:antialiased}
        input:focus,textarea:focus{border-color:${C.accent}!important;box-shadow:0 0 0 3px ${C.accent}33!important}
        .hovbtn:hover{transform:translateY(-2px);box-shadow:0 8px 28px ${C.accent}44!important}
        .navbtn:hover{background:${C.accent}18!important;color:${C.accent}!important}
        .card-in{animation:fadeUp 0.5s ease both}
      `}</style>

      <div style={{
        minHeight: "100vh", background: C.bg, color: C.text,
        fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", overflowX: "hidden"
      }}>

        {/* bg orbs */}
        <GlowOrb color={C.accent} size="600px" top="-150px" left="-150px" />
        <GlowOrb color={C.cyan} size="400px" top="70%" left="85%" />
        <GlowOrb color={C.pink} size="300px" top="35%" left="55%" opacity={0.05} />

        {/* NAV */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100, background: C.bg + "ee",
          backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`,
          padding: "0 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 62
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
            onClick={() => setPage("home")}>
            <div style={{
              width: 34, height: 34, background: `linear-gradient(135deg,${C.accent},${C.cyan})`,
              borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17
            }}>⚡</div>
            <span style={{
              fontWeight: 800, fontSize: 19,
              background: `linear-gradient(135deg,${C.accent},${C.cyan})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>PROJECT X-RAY</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ k: "home", l: "🏠 Home" }, { k: "analyze", l: "🔬 Analyze" }].map(({ k, l }) => (
              <button key={k} className="navbtn" onClick={() => setPage(k)} style={{
                background: page === k ? C.accent + "22" : "transparent",
                border: `1px solid ${page === k ? C.accent + "55" : "transparent"}`,
                color: page === k ? C.accent : C.muted,
                padding: "7px 18px", borderRadius: 9, cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s"
              }}>{l}</button>
            ))}
            {results && (
              <button className="navbtn" onClick={() => setPage("results")} style={{
                background: page === "results" ? C.green + "22" : "transparent",
                border: `1px solid ${page === "results" ? C.green + "55" : "transparent"}`,
                color: page === "results" ? C.green : C.muted,
                padding: "7px 18px", borderRadius: 9, cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s"
              }}>📊 Results</button>
            )}
          </div>
        </nav>

        {/* ═══════════ HOME ═══════════ */}
        {page === "home" && (
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "72px 32px" }}>
            <div style={{ textAlign: "center", marginBottom: 72, animation: "fadeUp 0.7s ease" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: C.accent + "22", border: `1px solid ${C.accent}44`,
                borderRadius: 20, padding: "5px 16px", marginBottom: 22
              }}>
                <span style={{
                  width: 6, height: 6, background: C.green, borderRadius: "50%",
                  display: "inline-block", boxShadow: `0 0 8px ${C.green}`
                }} />
                <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>AI-Powered Project Intelligence</span>
              </div>
              <h1 style={{ fontSize: "clamp(38px,5.5vw,66px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 22 }}>
                Know Your Project's<br />
                <span style={{
                  background: `linear-gradient(135deg,${C.accent},${C.cyan})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                }}>Real-World Value</span>
              </h1>
              <p style={{ fontSize: 17, color: C.muted, maxWidth: 540, margin: "0 auto 38px", lineHeight: 1.7 }}>
                Submit any software project and get a full AI evaluation — demand score,
                market value, startup potential, job matching, and a personalized improvement roadmap.
              </p>
              <button className="hovbtn" onClick={() => setPage("analyze")} style={{
                background: `linear-gradient(135deg,${C.accent},${C.cyan})`, border: "none",
                color: "#fff", padding: "15px 38px", borderRadius: 12, fontSize: 16,
                fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "all 0.3s", boxShadow: `0 4px 20px ${C.accent}44`
              }}>🚀 Analyze My Project →</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
              {[
                { icon: "📈", title: "Demand Score", desc: "Understand how relevant your project is in today's tech market.", color: C.accent, delay: "0s" },
                { icon: "💰", title: "Market Value", desc: "Get a financial valuation based on complexity & market demand.", color: C.green, delay: ".1s" },
                { icon: "🗺️", title: "Improvement Roadmap", desc: "Step-by-step structured guide to reach professional standards.", color: C.cyan, delay: ".2s" },
                { icon: "💼", title: "Job Matching", desc: "Discover career paths aligned with your technology stack.", color: C.orange, delay: ".3s" },
                { icon: "📄", title: "Resume Booster", desc: "Professionally crafted resume statements for your project.", color: C.pink, delay: ".4s" },
                { icon: "🚀", title: "Startup Potential", desc: "Find out if your project has what it takes to become a product.", color: C.yellow, delay: ".5s" },
              ].map((f, i) => (
                <div key={i} style={{
                  background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
                  padding: 24, position: "relative", overflow: "hidden", transition: "all 0.2s",
                  animation: `fadeUp 0.6s ${f.delay} ease both`
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + "55"; e.currentTarget.style.transform = "translateY(-3px)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)" }}>
                  <TopBar color={f.color} />
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: C.text }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ ANALYZE ═══════════ */}
        {page === "analyze" && (
          <div style={{ maxWidth: 600, margin: "0 auto", padding: "56px 32px", animation: "fadeUp 0.5s ease" }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Analyze Your Project</h2>
            <p style={{ color: C.muted, marginBottom: 10, fontSize: 15 }}>
              Just paste your project link — we automatically read everything from it.
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
              {["🔗 Paste link", "→", "📖 Auto-reads repo", "→", "🧠 AI analyzes", "→", "📊 Full report"].map((t, i) => (
                <span key={i} style={{
                  fontSize: 11.5, color: t === "→" ? C.border : C.muted,
                  background: t === "→" ? "transparent" : C.surface,
                  border: t === "→" ? "none" : `1px solid ${C.border}`,
                  borderRadius: 20, padding: t === "→" ? "0" : "4px 12px"
                }}>{t}</span>
              ))}
            </div>
            <div style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 20,
              padding: 34, position: "relative", overflow: "hidden"
            }}>
              <TopBar color={`linear-gradient(90deg,${C.accent},${C.cyan})`} />

              <label style={{
                display: "block", fontSize: 12, fontWeight: 700, color: C.muted,
                marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em"
              }}>Project Link</label>
              <input value={projectLink} onChange={e => setProjectLink(e.target.value)}
                placeholder="https://github.com/username/repository"
                style={{ ...inp, marginBottom: 16 }} />

              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {["✅ GitHub", "✅ GitLab", "✅ Live Website", "✅ Any public URL"].map((p, i) => (
                  <span key={i} style={{
                    fontSize: 11, color: C.muted, background: C.surface,
                    border: `1px solid ${C.border}`, borderRadius: 12, padding: "3px 10px"
                  }}>{p}</span>
                ))}
              </div>

              <div style={{
                background: C.accent + "11", border: `1px solid ${C.accent}33`,
                borderRadius: 12, padding: "12px 16px", marginBottom: 24
              }}>
                <p style={{ fontSize: 12.5, color: C.accent, margin: 0, lineHeight: 1.7 }}>
                  🤖 <strong>Auto-Detection:</strong> We automatically fetch your project's README, tech stack,
                  description, stars, forks, and file structure — no manual input needed.
                </p>
              </div>

              {error && (
                <div style={{
                  background: C.red + "18", border: `1px solid ${C.red}44`,
                  borderRadius: 10, padding: "11px 16px", marginBottom: 18, color: C.red, fontSize: 14
                }}>
                  ⚠️ {error}
                </div>
              )}

              {loading ? (
                <div style={{ textAlign: "center", padding: "18px 0" }}>
                  <Dots />
                  <p style={{ color: C.accent, fontSize: 14, marginTop: 14, fontWeight: 600 }}>{stage}</p>
                  <p style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Reading your project automatically...</p>
                  <div style={{ marginTop: 18, height: 4, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: "65%", borderRadius: 4,
                      background: `linear-gradient(90deg,${C.accent},${C.cyan})`,
                      animation: "shimmer 1.8s linear infinite", backgroundSize: "200% 100%"
                    }} />
                  </div>
                </div>
              ) : (
                <button className="hovbtn" onClick={analyze} style={{
                  width: "100%", background: `linear-gradient(135deg,${C.accent},${C.cyan})`,
                  border: "none", color: "#fff", padding: "15px", borderRadius: 12,
                  fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: "all 0.3s", boxShadow: `0 4px 20px ${C.accent}44`
                }}>🔍 Analyze from Link</button>
              )}
            </div>
          </div>
        )}

        {/* ═══════════ RESULTS ═══════════ */}
        {page === "results" && results && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px", animation: "fadeUp 0.4s ease" }}>

            {/* header row */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              flexWrap: "wrap", gap: 14, marginBottom: 32
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7, flexWrap: "wrap" }}>
                  <h2 style={{ fontSize: 26, fontWeight: 800 }}>{results.projectName || "Project Evaluation Report"}</h2>
                  <Badge text={results.linkStatus === "active" ? "✅ Live & Active" : "⚠️ Link Unknown"}
                    color={results.linkStatus === "active" ? C.green : C.orange} />
                </div>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: results.detectedTech?.length ? 8 : 0 }}>🔗 {projectLink}</p>
                {results.detectedTech?.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: C.muted }}>Auto-detected:</span>
                    {results.detectedTech.map((t, i) => (
                      <span key={i} style={{
                        fontSize: 11, color: C.cyan, background: C.cyan + "18",
                        border: `1px solid ${C.cyan}33`, borderRadius: 10, padding: "2px 8px"
                      }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <button className="hovbtn" onClick={() => setPage("analyze")} style={{
                background: "transparent", border: `1px solid ${C.accent}55`, color: C.accent,
                padding: "9px 18px", borderRadius: 10, cursor: "pointer", fontSize: 13,
                fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.2s"
              }}>+ New Analysis</button>
            </div>

            {/* ── top score strip ── */}
            <div style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 18,
              padding: "28px 32px", marginBottom: 22, position: "relative", overflow: "hidden"
            }}>
              <TopBar color={`linear-gradient(90deg,${C.accent},${C.cyan},${C.pink})`} />
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20 }}>
                <Ring score={results.overallScore} color={C.accent} label="Overall" />
                <Ring score={results.demandScore} color={C.cyan} label="Demand" />
                <Ring score={results.trendScore} color={C.orange} label="Trend" />
                <Ring score={results.startupScore} color={C.pink} label="Startup" />
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 8
                }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: C.green }}>{results.marketValue}</div>
                  <span style={{ color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: '0.06em' }}>Market Value</span>
                </div>
              </div>
            </div>

            {/* ── numbered cards grid ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

              {/* 1 Demand */}
              <ScoreCard num="1️⃣" icon="📈" title="Demand Score"
                score={results.demandScore} level={results.demandLevel}
                levelColor={results.demandLevel === "High" ? C.green : results.demandLevel === "Medium" ? C.orange : C.red}
                reasons={results.demandReasons || []} accentColor={C.cyan} />

              {/* 2 Market Value */}
              <MarketValueCard value={results.marketValue} currency=""
                reasons={results.marketValueReasons || []} />

              {/* 3 Trend */}
              <ScoreCard num="3️⃣" icon="📊" title="Trend Score"
                score={results.trendScore} level={results.trendLevel}
                levelColor={["Excellent", "Good"].includes(results.trendLevel) ? C.green : C.orange}
                reasons={results.trendReasons || []} accentColor={C.orange} />

              {/* 4 Real Score */}
              <RealScoreCard overall={results.overallScore}
                breakdown={results.scoreBreakdown || []} />

            </div>

            {/* 5 Startup */}
            <div style={{ marginTop: 20 }}>
              <ScoreCard num="5️⃣" icon="🚀" title="Startup Potential Score"
                score={results.startupScore} level={results.startupLevel}
                levelColor={results.startupLevel?.includes("High") ? C.green : C.orange}
                reasons={results.startupReasons || []} accentColor={C.pink} />
            </div>

            {/* AI Summary */}
            <div style={{
              marginTop: 20, background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 18, padding: 26, position: "relative", overflow: "hidden"
            }}>
              <TopBar color={C.accent} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{ fontSize: 18 }}>🧠</span>
                <span style={{ fontWeight: 800, fontSize: 16 }}>AI Feedback Summary</span>
              </div>
              <Typewriter text={results.aiSummary || "Analysis complete."} />
            </div>

            {/* Suggestions */}
            <div style={{ marginTop: 20 }}>
              <SuggestionsCard suggestions={results.suggestions || []} />
            </div>

            {/* Final Table */}
            <div style={{ marginTop: 20 }}>
              <FinalTable rows={results.finalTable || []} />
            </div>

            {/* Job + Resume */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
              <JobCard jobs={results.jobRoles || []} />
              <ResumeCard suggestions={results.resumeSuggestions || []} />
            </div>

            {/* CTA */}
            <div style={{
              marginTop: 28, textAlign: "center", padding: 30,
              background: C.card, borderRadius: 18, border: `1px solid ${C.border}`
            }}>
              <h3 style={{ fontSize: 19, fontWeight: 800, marginBottom: 8 }}>Want a better score?</h3>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 18 }}>
                Follow the suggestions above, improve your project, then re-submit for an updated evaluation.
              </p>
              <button className="hovbtn" onClick={() => setPage("analyze")} style={{
                background: `linear-gradient(135deg,${C.accent},${C.cyan})`, border: "none",
                color: "#fff", padding: "13px 30px", borderRadius: 12, fontSize: 14,
                fontWeight: 700, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.3s"
              }}>🔄 Analyze Another Project</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
