// Ai News — "Distilled" style (Nov 4 2026). Card-stack editorial look: white headline cards on a dark grid,
// one red italic punch-line per story, Anna + Uzair as stickers reacting below. Same narration/cues as ep04.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, eback, pop, clamp01, lerp, VW, VH } from "./kit";
import { Narration, Caps, FONT, talkFor, speaking } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues (frames from words.ts) ----------
const F = {
  everything: 28, anna: 99, max: 127, today: 171, anthropic: 182, seventeen: 234, billion: 249, three: 318, months: 327, wait: 356, yes: 431,
  up: 455, half: 469, lost: 534, tw3: 542, accounting: 596, ipo: 679,
  s2: 718, marvell: 767, lumentum: 820, one15: 844, stock: 917, biggest: 977,
  s3: 1078, china: 1104, safety: 1140, whole: 1173, jobs: 1340,
  s4: 1367, coding: 1448, mcp: 1521, seventeenM: 1632, bug: 1713,
  s5: 1787, google: 1831, free: 1865, gemini: 1953, paid: 2027,
  s6: 2064, beacon: 2118, topped: 2210, clayzo: 2258, animations: 2316, free2: 2359,
  would: 2389, bubble: 2468, real: 2493, comments: 2541, sub: 2573, tomorrow: 2631,
};

// ---------- palette (brand: near-black + red + cyan) ----------
const BG0 = "#0b3fd6", BG1 = "#2a7bff", RED = "#ffd60a", CYAN = "#2ee6ff", INK = "#0f1117", GREY = "#6b7280", PAPER = "#ffffff";
const SERIF = "PlayfairLocal, 'Playfair Display', Georgia, serif";

const SerifFont: React.FC = () => (
  <style>{`@font-face{font-family:PlayfairLocal;font-weight:800;font-style:italic;src:url(${staticFile("playfair800i.woff2")}) format("woff2")}`}</style>
);

// ---------- cast ----------
const ANNA = { ...CAST[16], name: "Anna", prop: "none" as const };
const UZAIR = { ...CAST[17], name: "Uzair", prop: "none" as const };

// ---------- story cards ----------
type Story = {
  at: number; out: number; n: number; headline: string; punch: string; punchAt: number; source: string; tilt: number;
  notes?: { at: number; text: string; hue?: string }[];
};
const STORIES: Story[] = [
  { at: -16, out: F.s2 - 10, n: 1, tilt: -1.5, headline: "Anthropic just made $17B in one quarter.", punch: "In 3 months.", punchAt: F.three, source: "CNBC · amended S-1 · Nov 2",
    notes: [{ at: F.half, text: "+47% vs Q2" }, { at: F.lost, text: "Still lost $23.3B", hue: RED }] },
  { at: F.s2 - 10, out: F.s3 - 10, n: 2, tilt: 1.2, headline: "Marvell is buying Lumentum for $115 billion.", punch: "All in stock.", punchAt: F.stock, source: "Fox Business · Nov 3",
    notes: [{ at: F.biggest, text: "Biggest tech merger ever", hue: RED }] },
  { at: F.s3 - 10, out: F.s4 - 10, n: 3, tilt: -1, headline: "China will set AI safety rules for the whole life of a model.", punch: "Build to launch.", punchAt: F.whole, source: "The Star · Nov 3",
    notes: [{ at: F.jobs, text: "…and watch AI's impact on jobs" }] },
  { at: F.s4 - 10, out: F.s5 - 10, n: 4, tilt: 1.6, headline: "Coding agents install abandoned MCP servers from memory.", punch: "17M+ downloads.", punchAt: F.seventeenM, source: "Help Net Security · Nov 3",
    notes: [{ at: F.bug, text: "One runs attacker commands", hue: RED }] },
  { at: F.s5 - 10, out: F.s6 - 10, n: 5, tilt: -1.3, headline: "Google Antigravity's free plan just lost Claude.", punch: "Gemini Flash only.", punchAt: F.gemini, source: "enjoy.dev · Nov 2",
    notes: [{ at: F.paid, text: "Claude stays on paid plans" }] },
  { at: F.s6 - 10, out: F.clayzo - 6, n: 6, tilt: 1, headline: "Beacon gives your coding agents one shared memory.", punch: "#1 on Product Hunt.", punchAt: F.topped, source: "Product Hunt · Nov 3" },
  { at: F.clayzo - 6, out: F.would - 8, n: 7, tilt: -1.4, headline: "Clayzo lets your coding agent make animations.", punch: "For free.", punchAt: F.free2, source: "Product Hunt · Nov 3" },
];

// ---------- background ----------
const Backdrop: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG1} 0%, ${BG0} 100%)` }}>
    {/* faint grid (brand) */}
    <div style={{ position: "absolute", inset: 0, opacity: 0.11,
      backgroundImage: `linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)`,
      backgroundSize: "90px 90px", backgroundPosition: `${(f * 0.15) % 90}px ${(f * 0.1) % 90}px` }} />
    {/* red glow top, cyan glow bottom */}
    <div style={{ position: "absolute", left: -300, top: -500, width: 1700, height: 1200, borderRadius: "50%", background: `radial-gradient(circle, rgba(120,190,255,0.4) 0%, rgba(0,0,0,0) 60%)` }} />
    <div style={{ position: "absolute", left: 100, top: 1500, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0) 60%)" }} />
  </div>
);

// ---------- chrome: tiny brand mark + date ----------
const Mark: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <svg width={60 * s} height={60 * s} viewBox="0 0 60 60">
    <circle cx={30} cy={32} r={22} fill="none" stroke="#fff" strokeWidth={4.5} />
    <path d="M30 32 L30 16" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
    <rect x={25} y={4} width={10} height={6} rx={2} fill="#fff" />
    <path d="M33 22 l-8 11 h7 l-3 9 l9 -12 h-7 z" fill="#fff" />
  </svg>
);
const Chrome: React.FC<{ f: number }> = ({ f }) => {
  const o = eout(ramp(f, F.everything, F.everything + 10));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o, fontFamily: FONT, fontWeight: 800 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Mark />
        <div style={{ color: "#fff", fontSize: 30, letterSpacing: 6 }}>AI NEWS</div>
      </div>
      <div style={{ color: "#fff", opacity: 0.6, fontSize: 26, letterSpacing: 5 }}>NOV 3 · 2026</div>
    </div>
  );
};

// ---------- the white card ----------
const Punch: React.FC<{ f: number; at: number; text: string; big?: boolean }> = ({ f, at, text, big }) => {
  const k = eout(ramp(f, at, at + 9));
  if (k <= 0) return null;
  return (
    <div style={{ display: "inline-block", marginTop: big ? 14 : 10, transform: `rotate(-1.2deg) scaleX(${k})`, transformOrigin: "left center", background: RED,
      color: "#111118", fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: big ? 104 : 96, lineHeight: 1.05, padding: "4px 28px 12px", borderRadius: 6,
      boxShadow: "0 10px 30px rgba(255,46,77,0.35)" }}>
      <span style={{ opacity: eout(ramp(f, at + 4, at + 10)) }}>{text}</span>
    </div>
  );
};
const Note: React.FC<{ f: number; at: number; text: string; hue?: string }> = ({ f, at, text, hue }) => {
  const k = pop(f, at, 12);
  if (k <= 0) return null;
  return (
    <div style={{ display: "inline-block", transform: `scale(${k})`, transformOrigin: "left center", marginRight: 12, marginTop: 16,
      background: hue ?? "#eef0f5", color: hue ? "#fff" : INK, fontFamily: FONT, fontWeight: 800, fontSize: 32, padding: "9px 20px", borderRadius: 999 }}>{text}</div>
  );
};
const Card: React.FC<{ f: number; s: Story; total: number; hero?: boolean }> = ({ f, s, total, hero }) => {
  if (f < s.at) return null;
  const tin = ramp(f, s.at, s.at + 16);
  const y = lerp(1500, 0, eback(tin));
  const rot = lerp(9, s.tilt, eout(tin));
  // when the next card arrives, this one drops back
  const tout = ramp(f, s.out, s.out + 16);
  const back = eio(tout);
  if (tout >= 1) return null;
  const sc = lerp(1, 0.9, back), dy = lerp(0, 70, back), fade = 1 - back * 0.7;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 0, transform: `translateY(${y + dy}px) rotate(${rot}deg) scale(${sc})`, transformOrigin: "50% 40%", opacity: fade, zIndex: tout > 0 ? 1 : 2 }}>
      <div style={{ background: PAPER, borderRadius: 40, padding: "58px 62px 48px", boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.06)", position: "relative" }}>
        {!hero && (
          <div style={{ position: "absolute", right: 48, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: RED, letterSpacing: 3 }}>
            {String(s.n).padStart(2, "0")}<span style={{ color: "#c3c7d1" }}> / {String(total).padStart(2, "0")}</span>
          </div>
        )}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: hero ? 92 : 82, lineHeight: 1.04, letterSpacing: -3, color: INK, paddingRight: hero ? 0 : 60 }}>{s.headline}</div>
        <Punch f={f} at={s.punchAt} text={s.punch} big={hero} />
        {s.notes && <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{s.notes.map((n, i) => <Note key={i} f={f} at={n.at} text={n.text} hue={n.hue} />)}</div>}
        <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: GREY, letterSpacing: 1 }}>{s.source}</div>
      </div>
    </div>
  );
};

// ---------- big white type (intro + question) ----------
const BigType: React.FC<{ f: number; at: number; until: number; lines: string[]; punch?: string; punchAt?: number; y?: number }> = ({ f, at, until, lines, punch, punchAt = at + 12, y = 300 }) => {
  if (f < at || f > until + 12) return null;
  const o = eout(ramp(f, at, at + 10)) * (1 - ramp(f, until, until + 12));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 800, color: "#fff", fontSize: 108, lineHeight: 1.0, letterSpacing: -4 }}>
      {lines.map((l, i) => <div key={i} style={{ transform: `translateY(${lerp(40, 0, eout(ramp(f, at + i * 3, at + i * 3 + 10)))}px)` }}>{l}</div>)}
      {punch && (
        <div style={{ marginTop: 18, display: "inline-block", transform: `rotate(-1.5deg) scaleX(${eout(ramp(f, punchAt, punchAt + 9))})`, transformOrigin: "left center", background: RED, color: "#fff",
          fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: 112, padding: "2px 34px 12px", borderRadius: 8, lineHeight: 1.05, boxShadow: "0 12px 36px rgba(255,46,77,0.4)" }}>{punch}</div>
      )}
    </div>
  );
};

// ---------- anchors as stickers ----------
const Anchors: React.FC<{ f: number; wave?: boolean }> = ({ f, wave }) => {
  const aT = talkFor(f, "anna", SPK, ENV), uT = talkFor(f, "max", SPK, ENV);
  const aOn = speaking(f, "anna", SPK), uOn = speaking(f, "max", SPK);
  const annaMood = f >= F.wait - 2 && f < F.yes ? "surprised" : f >= F.bug - 4 && f < F.s5 ? "neutral" : "happy";
  const uzMood = f >= F.seventeen && f < F.wait ? "surprised" : f >= F.lost && f < F.ipo ? "neutral" : "happy";
  const lean = (on: boolean, side: number) => (on ? side * 4 : 0);
  const sticker = (x: number, who: "anna" | "uz") => {
    const on = who === "anna" ? aOn : uOn;
    return (
      <g transform={`translate(${x} 2290) scale(1.85)`}>
        
        <g transform={`scale(${on ? 1.0 : 0.96}) rotate(${lean(on, who === "anna" ? -1 : 1)})`}>
          {who === "anna"
            ? <Person d={ANNA} f={f} seed={16} talk={aT} wave={wave ? 1 : 0} mood={annaMood as any} />
            : <Person d={UZAIR} f={f} seed={17} talk={uT} wave={wave ? 1 : 0} mood={uzMood as any} />}
        </g>
        {/* name tag */}
        <g transform="translate(0 -520)" opacity={on ? 1 : 0.0}>
          <rect x={-78} y={-24} width={156} height={44} rx={22} fill={RED} />
          <text y={8} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill="#fff" letterSpacing={4}>{who === "anna" ? "ANNA" : "UZAIR"}</text>
        </g>
      </g>
    );
  };
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {sticker(150, "anna")}
      {sticker(930, "uz")}
    </svg>
  );
};

// ---------- outro ----------
const Outro: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at) return null;
  const o = eout(ramp(f, at, at + 10));
  const bp = pop(f, at + 10, 14);
  const click = at + 40;
  const pulse = f >= click ? 1 + 0.04 * Math.sin((f - click) * 0.3) : 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG1} 0%, ${BG0} 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: FONT, fontWeight: 800, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "center", transform: `scale(${pop(f, at + 2, 14)})` }}><Mark s={3.2} /></div>
        <div style={{ fontSize: 128, letterSpacing: -4, marginTop: 24, lineHeight: 1 }}>AI News</div>
        <div style={{ marginTop: 24, display: "inline-block", transform: `rotate(-1.5deg) scaleX(${eout(ramp(f, at + 8, at + 17))})`, transformOrigin: "left center", background: RED, color: "#fff",
          fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: 84, padding: "2px 34px 12px", borderRadius: 8, lineHeight: 1.05 }}>Every day. One minute.</div>
        <div style={{ marginTop: 60, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `scale(${bp * pulse})`, background: f >= click ? "#2a2f3d" : "#fff", color: f >= click ? "#fff" : INK, borderRadius: 999, padding: "26px 90px", fontSize: 58, letterSpacing: 2 }}>
            {f >= click ? "Subscribed ✓" : "Subscribe"}
          </div>
        </div>
        <div style={{ marginTop: 40, fontSize: 34, color: "rgba(255,255,255,0.6)", letterSpacing: 4 }}>@THEDAILYAI-01</div>
      </div>
    </div>
  );
};

// ---------- film ----------
export const NewsFilm: React.FC = () => {
  const f = useCurrentFrame();
  const total = STORIES.length;
  // card stage: hero card sits mid-frame alone for the hook, then slides up to make room for the intro type
  const heroShift = lerp(640, 560, eio(ramp(f, F.everything - 6, F.everything + 10)));
  const stageTop = f < F.s2 - 10 ? heroShift : 400;
  const breathe = 1 + 0.012 * Math.sin(f * 0.04);
  const outroAt = F.sub - 6;
  const inOutro = f >= outroAt;
  return (
    <AbsoluteFill style={{ background: BG0 }}>
      <FontStyle /><SerifFont />
      <Backdrop f={f} />
      {!inOutro && (
        <>
          <Chrome f={f} />
          {/* intro type sits above the hero card during "Here's everything that happened in AI today" */}
          <BigType f={f} at={F.everything - 4} until={F.anthropic - 8} y={150} lines={["Today in AI."]} punch="Distilled." punchAt={F.everything + 8} />
          <div style={{ position: "absolute", left: 0, right: 0, top: stageTop, transform: `scale(${breathe})`, transformOrigin: "50% 30%" }}>
            {STORIES.map((s, i) => <Card key={i} f={f} s={s} total={total} hero={i === 0 && f < F.anthropic} />)}
          </div>
          {/* comments question */}
          <BigType f={f} at={F.would - 4} until={outroAt} y={520} lines={["AI bubble…"]} punch="or the real deal?" punchAt={F.real - 2} />
          {f >= F.comments - 2 && f < outroAt && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "rgba(255,255,255,0.75)", letterSpacing: 4, opacity: eout(ramp(f, F.comments - 2, F.comments + 8)) }}>
              TELL US IN THE COMMENTS ↓
            </div>
          )}
        </>
      )}
      <Outro f={f} at={outroAt} />
      <Anchors f={f} wave={f >= F.tomorrow - 10} />
      <Caps f={f} words={WORDS} chunks={CHUNKS} accent={RED} theme="dark" y={1250} hide={inOutro && f > outroAt + 20} />
      <Narration slug="news_blue" total={TOTAL} />
      <Sequence from={outroAt + 40}><Audio src={staticFile("sfx/click.ogg")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};
