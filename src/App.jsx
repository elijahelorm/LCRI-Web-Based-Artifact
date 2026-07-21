import React, { useState, useEffect, useRef } from "react";

// --- LCRI Data Model ---
const DIMENSIONS = {
  disclosure: {
    label: "Disclosure",
    weight: 0.40,
    maxPoints: 40,
    color: "#E8443A",
    icon: "🔓",
    description: "What sensitive information have you made publicly visible on LinkedIn?",
    factors: [
      { id: "d1", label: "Supervisor or mentor name publicly visible", max: 10, options: [
        { label: "Not visible", score: 0 },
        { label: "First name only or vague reference", score: 5 },
        { label: "Full name and role visible", score: 10 }
      ]},
      { id: "d2", label: "Research project or dissertation title visible", max: 10, options: [
        { label: "Not visible", score: 0 },
        { label: "General topic area mentioned", score: 5 },
        { label: "Full title and details visible", score: 10 }
      ]},
      { id: "d3", label: "Department and course of study visible", max: 8, options: [
        { label: "Not visible", score: 0 },
        { label: "University only", score: 4 },
        { label: "Department, course, and year visible", score: 8 }
      ]},
      { id: "d4", label: "Personal contact details visible (email or phone)", max: 7, options: [
        { label: "Not visible", score: 0 },
        { label: "University email only", score: 3 },
        { label: "Personal email or phone visible", score: 7 }
      ]},
      { id: "d5", label: "Location or graduation timeline visible", max: 5, options: [
        { label: "Not visible", score: 0 },
        { label: "City or general area", score: 2 },
        { label: "Specific location and graduation date", score: 5 }
      ]}
    ]
  },
  behaviour: {
    label: "Platform Behaviour",
    weight: 0.35,
    maxPoints: 35,
    color: "#E8963A",
    icon: "⚡",
    description: "How do you use LinkedIn in ways that may expand your attack surface?",
    factors: [
      { id: "b1", label: "Accepts connections from people not known personally", max: 10, options: [
        { label: "Never — only people I know", score: 0 },
        { label: "Sometimes, if profile looks relevant", score: 5 },
        { label: "Often accept most requests", score: 10 }
      ]},
      { id: "b2", label: "Has connected to people never met in person", max: 8, options: [
        { label: "No — all connections are known", score: 0 },
        { label: "A few unknown connections", score: 4 },
        { label: "Many connections never met", score: 8 }
      ]},
      { id: "b3", label: "Responds to unsolicited messages from unknown contacts", max: 8, options: [
        { label: "Never respond", score: 0 },
        { label: "Occasionally if message seems relevant", score: 4 },
        { label: "Usually respond to messages", score: 8 }
      ]},
      { id: "b4", label: "Posts personal or professional updates publicly", max: 5, options: [
        { label: "Never or rarely post", score: 0 },
        { label: "Occasional posts to connections", score: 2 },
        { label: "Frequent public posts", score: 5 }
      ]},
      { id: "b5", label: "Engages with content from unknown or unverified accounts", max: 4, options: [
        { label: "Only engage with known sources", score: 0 },
        { label: "Sometimes engage broadly", score: 2 },
        { label: "Frequently like/comment on unknown content", score: 4 }
      ]}
    ]
  },
  susceptibility: {
    label: "Susceptibility",
    weight: 0.25,
    maxPoints: 25,
    color: "#3A7DE8",
    icon: "🎯",
    description: "How would you respond to these realistic social engineering scenarios?",
    factors: [
      { id: "s1", label: "Scenario: Fake recruiter offering an opportunity referencing profile details", max: 6, 
        scenario: "You receive a LinkedIn message from a \"Senior Talent Acquisition Manager\" at a well-known tech company. They say they found your profile impressive and have an exclusive graduate role, but need you to complete a quick application form via an external link and provide your phone number for a \"fast-track screening call\" this week.",
        options: [
        { label: "Decline — verify the recruiter and role through official channels first", score: 0 },
        { label: "Reply to ask questions but share some personal details", score: 3 },
        { label: "Click the link and complete the form — this sounds like a great opportunity", score: 6 }
      ]},
      { id: "s2", label: "Scenario: Spear-phishing email referencing specific LinkedIn profile information", max: 6,
        scenario: "You receive an email that references your university, your course, and a recent LinkedIn post you made. It appears to come from your university's careers service and asks you to click a link to confirm your attendance at an upcoming networking event, or your reserved place will be given away.",
        options: [
        { label: "Don't click — check the careers service website directly for the event", score: 0 },
        { label: "Suspicious but click the link to check, without entering details", score: 3 },
        { label: "Click and enter your details — it mentions my specific course so it must be real", score: 6 }
      ]},
      { id: "s3", label: "Scenario: Senior figure requesting urgent sensitive information", max: 5,
        scenario: "A LinkedIn message arrives from someone whose profile says they are a professor in your department. They say they urgently need the internal link to your shared project drive or your student portal login details because they've been \"locked out\" ahead of a deadline and IT support is unavailable.",
        options: [
        { label: "Refuse — suggest they contact IT directly and verify their identity in person", score: 0 },
        { label: "Share the drive link but not login details", score: 3 },
        { label: "Help them out — send what they need since it sounds urgent", score: 5 }
      ]},
      { id: "s4", label: "Scenario: Unknown contact building rapport over multiple messages", max: 4,
        scenario: "Over two weeks, a LinkedIn connection you accepted (but don't know personally) has been sending friendly messages about your field of study and career goals. They now ask if you'd be willing to share your CV and a recent piece of coursework so they can \"pass it to a colleague who's hiring.\"",
        options: [
        { label: "Decline — do not share personal documents with someone you haven't verified", score: 0 },
        { label: "Share your CV but not coursework", score: 2 },
        { label: "Share both — they've been friendly and it could help my career", score: 4 }
      ]},
      { id: "s5", label: "Scenario: Connection request from a profile exhibiting common fake-profile indicators", max: 4,
        scenario: "You receive a connection request from someone claiming to be a \"Project Manager\" at a consulting firm. Their profile was created recently, has a stock-looking photo, very few connections, no posts, and a generic summary. They have listed several impressive-sounding roles but no endorsements or recommendations.",
        options: [
        { label: "Ignore or decline — the profile shows classic fake-profile indicators", score: 0 },
        { label: "Accept but do not engage further", score: 2 },
        { label: "Accept and respond — they could be a useful contact", score: 4 }
      ]}
    ]
  }
};

const RISK_BANDS = [
  { label: "Low Risk", range: "0–33", color: "#22C55E", bg: "#F0FDF4", description: "Your LinkedIn profile presents minimal social engineering risk. You demonstrate strong security practices." },
  { label: "Medium Risk", range: "34–66", color: "#EAB308", bg: "#FEFCE8", description: "Your LinkedIn profile has moderate exposure. Some behaviours or disclosures increase your vulnerability to targeted attacks." },
  { label: "High Risk", range: "67–100", color: "#EF4444", bg: "#FEF2F2", description: "Your LinkedIn profile is significantly exposed to social engineering. Urgent review of your disclosure and behaviour settings is recommended." }
];

function getRiskBand(score) {
  if (score <= 33) return RISK_BANDS[0];
  if (score <= 66) return RISK_BANDS[1];
  return RISK_BANDS[2];
}

// --- Components ---

function RadarChart({ scores, size = 280 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.32;
  const dims = Object.keys(scores);
  const angleStep = (2 * Math.PI) / dims.length;
  
  const getPoint = (index, value) => {
    const angle = angleStep * index - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const gridLevels = [25, 50, 75, 100];
  const colors = { disclosure: "#E8443A", behaviour: "#E8963A", susceptibility: "#3A7DE8" };
  const labels = { disclosure: "Disclosure", behaviour: "Behaviour", susceptibility: "Susceptibility" };

  const dataPoints = dims.map((d, i) => getPoint(i, scores[d]));
  const pathD = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: "100%", maxWidth: size }}>
      {gridLevels.map(level => {
        const pts = dims.map((_, i) => getPoint(i, level));
        return <polygon key={level} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#E2E8F0" strokeWidth="0.7" />;
      })}
      {dims.map((_, i) => {
        const end = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#E2E8F0" strokeWidth="0.7" />;
      })}
      <polygon points={pathD.replace(/[MLZ]/g, ' ').trim()} fill="rgba(59,130,246,0.12)" stroke="#3B82F6" strokeWidth="1.8" />
      {dims.map((d, i) => {
        const p = getPoint(i, scores[d]);
        return <circle key={d} cx={p.x} cy={p.y} r="4" fill={colors[d]} stroke="#fff" strokeWidth="1.5" />;
      })}
      {dims.map((d, i) => {
        const labelPt = getPoint(i, 125);
        const anchor = labelPt.x < size * 0.3 ? "start" : labelPt.x > size * 0.7 ? "end" : "middle";
        return (
          <text key={d} x={labelPt.x} y={labelPt.y} textAnchor={anchor} dominantBaseline="middle"
            style={{ fontSize: 11, fontWeight: 600, fill: colors[d] }}>
            {labels[d]}
          </text>
        );
      })}
    </svg>
  );
}

function ScoreGauge({ score, size = 180 }) {
  const band = getRiskBand(score);
  const r = 70, cx = size / 2, cy = size / 2 + 10;
  const startAngle = Math.PI, endAngle = 2 * Math.PI;
  const scoreAngle = startAngle + (score / 100) * Math.PI;
  
  const arc = (start, end, radius) => {
    const x1 = cx + radius * Math.cos(start), y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end), y2 = cy + radius * Math.sin(end);
    const large = end - start > Math.PI ? 1 : 0;
    return `M${x1},${y1} A${radius},${radius} 0 ${large} 1 ${x2},${y2}`;
  };

  return (
    <svg viewBox={`0 0 ${size} ${size * 0.6}`} style={{ width: "100%", maxWidth: size }}>
      <path d={arc(startAngle, endAngle, r)} fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="round" />
      <path d={arc(startAngle, Math.min(scoreAngle, endAngle - 0.01), r)} fill="none" stroke={band.color} strokeWidth="14" strokeLinecap="round" />
      <text x={cx} y={cy - 12} textAnchor="middle" style={{ fontSize: 32, fontWeight: 800, fill: band.color }}>{Math.round(score)}</text>
      <text x={cx} y={cy + 8} textAnchor="middle" style={{ fontSize: 11, fontWeight: 600, fill: "#64748B", letterSpacing: "0.08em" }}>/ 100</text>
    </svg>
  );
}

function DimensionBar({ label, score, max, color, weight }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
        <span style={{ fontWeight: 600, color: "#1E293B" }}>{label} <span style={{ fontWeight: 400, color: "#94A3B8" }}>({(weight * 100).toFixed(0)}%)</span></span>
        <span style={{ fontWeight: 700, color }}>{score.toFixed(1)} <span style={{ fontWeight: 400, color: "#94A3B8" }}>/ {max}</span></span>
      </div>
      <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

// --- Main App ---
export default function LCRIApp() {
  const [screen, setScreen] = useState("landing");
  const [currentDim, setCurrentDim] = useState(0);
  const [currentFactor, setCurrentFactor] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animatedScore, setAnimatedScore] = useState(0);
  const dimKeys = Object.keys(DIMENSIONS);
  const totalFactors = dimKeys.reduce((sum, k) => sum + DIMENSIONS[k].factors.length, 0);

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalFactors) * 100;

  const dimScores = {};
  dimKeys.forEach(k => {
    dimScores[k] = DIMENSIONS[k].factors.reduce((sum, f) => sum + (answers[f.id] ?? 0), 0);
  });
  const dimPcts = {};
  dimKeys.forEach(k => { dimPcts[k] = DIMENSIONS[k].maxPoints > 0 ? (dimScores[k] / DIMENSIONS[k].maxPoints) * 100 : 0; });
  const totalScore = dimKeys.reduce((sum, k) => sum + dimPcts[k] * DIMENSIONS[k].weight, 0);

  useEffect(() => {
    if (screen === "results") {
      let start = 0;
      const target = totalScore;
      const duration = 1200;
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - pct, 3);
        setAnimatedScore(target * eased);
        if (pct < 1) requestAnimationFrame(tick);
      };
      tick();
    }
  }, [screen, totalScore]);

  const dim = DIMENSIONS[dimKeys[currentDim]];
  const factor = dim?.factors[currentFactor];

  function handleAnswer(factorId, score) {
    setAnswers(prev => ({ ...prev, [factorId]: score }));
    if (currentFactor < dim.factors.length - 1) {
      setCurrentFactor(f => f + 1);
    } else if (currentDim < dimKeys.length - 1) {
      setCurrentDim(d => d + 1);
      setCurrentFactor(0);
    } else {
      setScreen("results");
    }
  }

  function restart() {
    setAnswers({});
    setCurrentDim(0);
    setCurrentFactor(0);
    setScreen("landing");
  }

  const band = getRiskBand(animatedScore);

  const card = { background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)" };

  if (screen === "landing") return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)", color: "#fff", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", background: "rgba(59,130,246,0.15)", borderRadius: 999, marginBottom: 28, border: "1px solid rgba(59,130,246,0.25)" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#60A5FA", letterSpacing: "0.04em" }}>LCRI v1.0 — Pilot</span>
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
          LinkedIn Cyber<br />Risk Index
        </h1>
        <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.65, maxWidth: 480, margin: "0 auto 36px" }}>
          Assess your social engineering vulnerability based on your LinkedIn profile disclosure, platform behaviour, and susceptibility to attack scenarios.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 36, textAlign: "left" }}>
          {dimKeys.map(k => {
            const d = DIMENSIONS[k];
            const descs = {
              disclosure: "What personal and academic information is visible on your profile",
              behaviour: "How your LinkedIn habits may expand your attack surface",
              susceptibility: "How you respond to realistic social engineering scenarios"
            };
            return (
              <div key={k} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{d.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: d.color, marginBottom: 4 }}>{d.label}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.5 }}>{descs[k]}</div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setScreen("assessment")} style={{
          padding: "14px 40px", fontSize: 15, fontWeight: 700, color: "#fff",
          background: "linear-gradient(135deg, #3B82F6, #2563EB)", border: "none", borderRadius: 10,
          cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 4px 14px rgba(59,130,246,0.35)"
        }}>
          Begin Assessment
        </button>
        <p style={{ fontSize: 12, color: "#475569", marginTop: 14, lineHeight: 1.5 }}>
          15 questions · Takes approximately 5 minutes · Fully anonymous
        </p>
      </div>
    </div>
  );

  if (screen === "assessment") {
    const isScenario = dimKeys[currentDim] === "susceptibility";
    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "12px 20px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.02em" }}>LCRI</span>
              <span style={{ fontSize: 12, color: "#94A3B8" }}>Q{answeredCount + 1} of {totalFactors}</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: dim.color }}>{dim.icon} {dim.label}</div>
          </div>
          <div style={{ maxWidth: 640, margin: "8px auto 0", height: 4, background: "#F1F5F9", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, #3B82F6, ${dim.color})`, borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: dim.color, letterSpacing: "0.06em", marginBottom: 6 }}>
              {dim.label.toUpperCase()} — {(dim.weight * 100).toFixed(0)}% WEIGHT
            </div>
            <div style={{ fontSize: 13, color: "#64748B" }}>{dim.description}</div>
          </div>

          <div style={{ ...card }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", marginBottom: 6, lineHeight: 1.45 }}>
              {factor.label}
            </div>
            {isScenario && factor.scenario && (
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 18, marginTop: 10, border: "1px solid #E2E8F0", fontSize: 13, color: "#475569", lineHeight: 1.65 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.06em", marginBottom: 6 }}>SCENARIO</div>
                {factor.scenario}
              </div>
            )}
            <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>
              Maximum: {factor.max} points · Select the option that best describes you
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {factor.options.map((opt, i) => {
                const selected = answers[factor.id] === opt.score;
                const riskLevel = i === 0 ? "#22C55E" : i === 1 ? "#EAB308" : "#EF4444";
                return (
                  <button key={i} onClick={() => handleAnswer(factor.id, opt.score)} style={{
                    display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px",
                    background: selected ? `${riskLevel}08` : "#FAFAFA",
                    border: `1.5px solid ${selected ? riskLevel : "#E2E8F0"}`,
                    borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 999, border: `2px solid ${selected ? riskLevel : "#CBD5E1"}`,
                      background: selected ? riskLevel : "transparent", flexShrink: 0, marginTop: 1,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {selected && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", lineHeight: 1.45 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>+{opt.score} points</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "results") return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background: "#0F172A", color: "#fff", padding: "36px 20px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", letterSpacing: "0.08em", marginBottom: 12 }}>YOUR LCRI SCORE</div>
          <ScoreGauge score={animatedScore} />
          <div style={{ display: "inline-block", marginTop: 8, padding: "5px 16px", borderRadius: 999, background: `${band.color}22`, border: `1px solid ${band.color}44` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: band.color }}>{band.label}</span>
          </div>
          <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, maxWidth: 420, margin: "14px auto 0" }}>{band.description}</p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px" }}>
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 18 }}>Dimension Breakdown</div>
          {dimKeys.map(k => (
            <DimensionBar key={k} label={DIMENSIONS[k].label} score={dimScores[k]} max={DIMENSIONS[k].maxPoints} color={DIMENSIONS[k].color} weight={DIMENSIONS[k].weight} />
          ))}
        </div>

        <div style={{ ...card, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 12 }}>Vulnerability Profile</div>
          <RadarChart scores={dimPcts} />
        </div>

        {(() => {
          const riskPaths = [
            { id: "P1", label: "Authority Pretexting",
              conditions: [{ id: "d1", dim: "disclosure" }, { id: "d3", dim: "disclosure" }, { id: "s3", dim: "susceptibility" }],
              chain: "Pretexting → Credential Theft",
              detail: "Your supervisor name and department details give an attacker enough context to impersonate a trusted authority figure. Combined with your vulnerability to authority-based pressure, this creates a complete pretexting path that could lead to credential theft." },
            { id: "P2", label: "Direct Phishing",
              conditions: [{ id: "d4", dim: "disclosure" }, { id: "b3", dim: "behaviour" }, { id: "s1", dim: "susceptibility" }],
              chain: "Targeted Phishing → Data Exfiltration",
              detail: "Your visible contact details allow attackers to reach you outside LinkedIn. Your habit of responding to unsolicited messages means you would engage, and your vulnerability to fake recruiter tactics means the attack would likely succeed — resulting in data exfiltration." },
            { id: "P3", label: "Spear-Phishing",
              conditions: [{ id: "d2", dim: "disclosure" }, { id: "b4", dim: "behaviour" }, { id: "s2", dim: "susceptibility" }],
              chain: "Spear-Phishing → Credential Theft",
              detail: "Your visible research title provides the specific detail an attacker needs to craft a convincing spear-phishing email. Your public posting activity confirms you are active and provides additional context. Your response to the spear-phishing scenario confirms you would engage with such an attack." },
            { id: "P4", label: "Long-Con Social Engineering",
              conditions: [{ id: "b1", dim: "behaviour" }, { id: "b5", dim: "behaviour" }, { id: "s4", dim: "susceptibility" }],
              chain: "Trust-Building → Document Theft",
              detail: "Your acceptance of unknown connections gives attackers initial access to your network. Your engagement with unverified content signals you are a responsive target. Your vulnerability to rapport-building tactics means an attacker who invests time in building trust could extract sensitive documents from you." },
            { id: "P5", label: "Reconnaissance",
              conditions: [{ id: "d5", dim: "disclosure" }, { id: "b2", dim: "behaviour" }, { id: "s5", dim: "susceptibility" }],
              chain: "Reconnaissance → Identity Fraud",
              detail: "Your visible location and graduation timeline help attackers build a profile of your movements and schedule. Your unverified connections mean fake profiles already have access to your network. Your acceptance of the suspicious profile scenario confirms you would not filter these out — enabling reconnaissance that could lead to identity fraud." },
          ];

          const activePaths = riskPaths.filter(path =>
            path.conditions.every(c => (answers[c.id] ?? 0) > 0)
          );

          if (activePaths.length === 0) return null;

          return (
            <div style={{ ...card, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>Risk Path Summary</div>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 14, lineHeight: 1.5 }}>
                The following cross-dimensional risk paths are active based on your responses. Each path requires factors from multiple LCRI dimensions to be present simultaneously.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {activePaths.map(path => (
                  <div key={path.id} style={{ padding: "14px 16px", background: "#FEF2F2", borderRadius: 10, border: "1px solid #FECACA" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ padding: "2px 10px", borderRadius: 999, background: "#EF4444", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.04em" }}>{path.id}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{path.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                      {path.conditions.map((c, i) => (
                        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <span style={{ width: 6, height: 6, borderRadius: 999, background: DIMENSIONS[c.dim].color, display: "inline-block" }} />
                          <span style={{ fontSize: 10, color: "#64748B" }}>{c.id.toUpperCase()}</span>
                          {i < path.conditions.length - 1 && <span style={{ fontSize: 10, color: "#CBD5E1" }}>+</span>}
                        </span>
                      ))}
                      <span style={{ fontSize: 11, color: "#94A3B8", margin: "0 4px" }}>{"→"}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#991B1B" }}>{path.chain}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{path.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {(() => {
          const factorRecs = {
            d1: "Limit visibility of your supervisor's name — attackers use trusted names to craft convincing impersonation messages.",
            d2: "Make your research or dissertation title less specific — visible project details enable highly targeted phishing.",
            d3: "Restrict your department and course visibility — this lets attackers pose as staff or students in your programme.",
            d4: "Remove personal contact details from your profile — exposed emails and phone numbers let attackers bypass LinkedIn entirely.",
            d5: "Hide your precise location and graduation date — attackers time approaches around key academic deadlines.",
            b1: "Only accept connections you can verify — broad acceptance is the first step to social engineering victimisation.",
            b2: "Audit and remove connections you cannot identify — each unknown contact has full access to your profile and activity.",
            b3: "Stop responding to unsolicited messages from strangers — legitimate contacts will understand verification before engagement.",
            b4: "Reduce the detail in public posts — each update reveals schedule, interests, and activities useful for personalised attacks.",
            b5: "Avoid engaging with content from unverified accounts — this signals you are an active, responsive target.",
            s1: "Verify job opportunities through official company career pages before clicking links — legitimate recruiters never pressure via DMs.",
            s2: "Navigate to official websites directly instead of clicking links — attackers read your profile to make phishing emails look genuine.",
            s3: "Never share credentials or sensitive links via LinkedIn, even under apparent authority or urgency — verify such requests in person.",
            s4: "Do not share CVs or documents with contacts you haven't verified outside LinkedIn — rapport-building is a common attack tactic.",
            s5: "Learn to spot fake profiles — recent creation dates, stock photos, few connections, and no endorsements are classic indicators of social engineering accounts.",
          };

          const allRecs = dimKeys.map(k => {
            const scored = DIMENSIONS[k].factors
              .map(f => ({ id: f.id, score: answers[f.id] ?? 0, max: f.max, label: f.label.replace(/^Scenario: /, "") }))
              .filter(f => f.score > 0)
              .sort((a, b) => (b.score / b.max) - (a.score / a.max));
            return { key: k, recs: scored };
          }).filter(d => d.recs.length > 0);

          if (allRecs.length === 0) {
            return (
              <div style={{ ...card, marginBottom: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 12 }}>Recommendations</div>
                <div style={{ padding: 16, background: "#F0FDF4", borderRadius: 10, border: "1px solid #BBF7D0", textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{"✅"}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>Strong security practices detected</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4, lineHeight: 1.55 }}>Your responses indicate low vulnerability across all factors. Continue maintaining these habits and stay alert to evolving tactics.</div>
                </div>
              </div>
            );
          }

          return (
            <div style={{ ...card, marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 14 }}>Recommendations</div>
              {allRecs.map(({ key: k, recs }) => {
                const dim = DIMENSIONS[k];
                return (
                  <div key={k} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 18 }}>{dim.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: dim.color }}>{dim.label}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 4 }}>
                      {recs.map(r => {
                        const pct = (r.score / r.max) * 100;
                        const sevColor = pct >= 70 ? "#EF4444" : pct >= 40 ? "#EAB308" : "#22C55E";
                        return (
                          <div key={r.id} style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <div style={{ width: 7, height: 7, borderRadius: 999, background: sevColor, flexShrink: 0 }} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>{r.id.toUpperCase()}</span>
                              <span style={{ fontSize: 11, color: "#94A3B8" }}>{r.score}/{r.max}</span>
                            </div>
                            <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, paddingLeft: 15 }}>{factorRecs[r.id]}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <button onClick={restart} style={{
            padding: "12px 32px", fontSize: 14, fontWeight: 700, color: "#3B82F6",
            background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10,
            cursor: "pointer"
          }}>
            Retake Assessment
          </button>
          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 12 }}>
            LCRI v1.0 · Design Science Research Artifact · Robert Gordon University
          </p>
        </div>
      </div>
    </div>
  );
}