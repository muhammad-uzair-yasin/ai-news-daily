// Ai News — "Distilled" v3 (Nov 4 2026). Single narrator (Byte). Calm intro; every story carries its own
// motion device inside the card, triggered on the spoken word. Cream palette, company logos, stopwatch ring.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, eback, pop, clamp01, lerp, rnd, VW, VH } from "./kit";
import { Narration, Caps, FONT, talkFor, speaking, countUp } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues (frames from words.ts, single voice) ----------
const F = {
  anthropic: 17, seventeen: 49, three: 113, months: 123,
  hundreds: 153, dropped: 190, today: 203, read: 235, all: 252, these: 277, seven: 295, matter: 310,
  one: 337, opened: 377, books: 396, seventeen2: 417, single: 488, quarter: 499, up: 531, half: 545, lost: 608, tw3: 615, accounting: 669, ipo: 752,
  two: 790, marvell: 830, lumentum: 880, one15: 901, billion2: 934, stock: 991, biggest: 1019, companies: 1086,
  s3: 1120, china: 1145, safety: 1182, whole: 1216, building: 1283, launching: 1303, jobs: 1385,
  s4: 1411, coding: 1457, installing: 1489, abandoned: 1517, mcp: 1535, memory: 1580, packages: 1613, seventeenM: 1642, downloads: 1669, bug: 1722, commands: 1763,
  s5: 1794, google: 1839, antigravity: 1854, lost2: 1898, claude: 1906, gemini: 1963, only: 1987, stays: 2018, paid: 2039,
  s6: 2075, beacon: 2100, shared: 2152, memory2: 2162, topped: 2200, hunt: 2221,
  s7: 2246, clayzo: 2273, animations: 2328, free: 2371,
  seventeen3: 2400, bubble: 2481, real: 2506, deal: 2514, tell: 2533, comments: 2553, sub: 2583, tomorrow: 2636,
};

// ---------- palette ----------
const BG0 = "#efe9dd", BG1 = "#f8f4ea", RED = "#ff2e4d", INK = "#0f1117", GREY = "#6b7280", PAPER = "#ffffff", SOFT = "#eef0f5", GREEN = "#1fb978";
const SERIF = "PlayfairLocal, 'Playfair Display', Georgia, serif";
const SerifFont: React.FC = () => <style>{`@font-face{font-family:PlayfairLocal;font-weight:800;font-style:italic;src:url(${staticFile("playfair800i.woff2")}) format("woff2")}`}</style>;
const logo = (n: string) => staticFile(`logos/${n}.svg`);
const WIDE = new Set(["marvell", "microsoft", "amazon"]);

const BYTE = { ...CAST[5], name: "Byte", top: "hoodie" as const, topC: "#111118", hat: "headset" as const, hatC: RED, glasses: "square" as const, hair: "short" as const, hairC: "#111", prop: "none" as const, face: "none" as const };

// ---------- intro pile (real headlines from ep01–ep03) ----------
type Mini = { h: string; src: string; logo?: string };
const PILE: Mini[] = [
  { h: "Mistral's 1-trillion-parameter model goes open weights", src: "VKTR", logo: "mistral" },
  { h: "OpenAI cuts funding goal from $30B to $20B", src: "FT via TNW", logo: "openai" },
  { h: "Apple picks Alibaba's Qwen to power Siri in China", src: "CGTN", logo: "apple" },
  { h: "Meta launches an AI pet and a stylist", src: "The Neuron", logo: "meta" },
  { h: "DeepSeek open-sources a GitHub coding agent", src: "GitHub", logo: "deepseek" },
  { h: "Amazon borrows $80B for AI build-out", src: "AI Weekly", logo: "amazon" },
  { h: "9 of 10 AI agents raised their own spending limit", src: "CoinDesk" },
  { h: "ChatGPT and Codex will share one usage limit", src: "OpenAI forum", logo: "openai" },
  { h: "Claude API upload limit 32 MB → 128 MB", src: "The Neuron", logo: "anthropic" },
  { h: "Canada buys $1.6B of Cohere", src: "The Neuron" },
];

// ---------- stories ----------
type Story = { n: number; at: number; out: number; headline: string; punch: string; punchAt: number; source: string; tilt: number; logo?: string };
const STORIES: Story[] = [
  { n: 1, at: F.one - 6, out: F.two - 12, tilt: -1.5, logo: "anthropic", headline: "Anthropic just made $17B in one quarter.", punch: "In 3 months.", punchAt: F.three, source: "CNBC · amended S-1 · Nov 2" },
  { n: 2, at: F.two - 10, out: F.s3 - 12, tilt: 1.2, logo: "marvell", headline: "Marvell is buying Lumentum for $115 billion.", punch: "All in stock.", punchAt: F.stock, source: "Fox Business · Nov 3" },
  { n: 3, at: F.s3 - 10, out: F.s4 - 12, tilt: -1, headline: "China will set AI safety rules for the whole life of a model.", punch: "Build to launch.", punchAt: F.launching, source: "The Star · Nov 3" },
  { n: 4, at: F.s4 - 10, out: F.s5 - 12, tilt: 1.6, logo: "mcp", headline: "Coding agents install abandoned MCP servers from memory.", punch: "17M+ downloads.", punchAt: F.seventeenM, source: "Help Net Security · Nov 3" },
  { n: 5, at: F.s5 - 10, out: F.s6 - 12, tilt: -1.3, logo: "antigravity", headline: "Google Antigravity's free plan just lost Claude.", punch: "Gemini Flash only.", punchAt: F.gemini, source: "enjoy.dev · Nov 2" },
  { n: 6, at: F.s6 - 10, out: F.s7 - 12, tilt: 1, logo: "producthunt", headline: "Beacon gives your coding agents one shared memory.", punch: "#1 on Product Hunt.", punchAt: F.topped, source: "Product Hunt · Nov 3" },
  { n: 7, at: F.s7 - 10, out: F.seventeen3 - 12, tilt: -1.4, logo: "producthunt", headline: "Clayzo lets your coding agent make animations.", punch: "For free.", punchAt: F.free, source: "Product Hunt · Nov 3" },
];
const STAGE_TOP = 380, HERO_TOP = 560;

// ---------- background + brand ----------
const Backdrop: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG1} 0%, ${BG0} 100%)` }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`, backgroundSize: "90px 90px", backgroundPosition: `${(f * 0.12) % 90}px ${(f * 0.08) % 90}px` }} />
    <div style={{ position: "absolute", left: -200, top: -500, width: 1500, height: 1100, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,46,77,${0.16 + 0.03 * Math.sin(f * 0.05)}) 0%, rgba(255,46,77,0) 60%)` }} />
  </div>
);
const Mark: React.FC<{ s?: number; progress?: number; zap?: number }> = ({ s = 1, progress = 0, zap = 0 }) => {
  const r = 22, C = 2 * Math.PI * r;
  return (
    <svg width={60 * s} height={60 * s} viewBox="0 0 60 60" style={{ overflow: "visible" }}>
      <circle cx={30} cy={32} r={r} fill="none" stroke={INK} strokeWidth={4.5} opacity={0.25} />
      <circle cx={30} cy={32} r={r} fill="none" stroke={RED} strokeWidth={4.5} strokeLinecap="round" strokeDasharray={`${C * clamp01(progress)} ${C}`} transform="rotate(-90 30 32)" />
      <rect x={25} y={4} width={10} height={6} rx={2} fill={INK} />
      <path d="M33 22 l-8 11 h7 l-3 9 l9 -12 h-7 z" fill={RED} transform={`translate(30 32) scale(${1 + zap * 0.6}) translate(-30 -32)`} />
      {zap > 0 && <circle cx={30} cy={32} r={r + zap * 26} fill="none" stroke={RED} strokeWidth={3} opacity={1 - zap} />}
    </svg>
  );
};
const zapAt = (f: number, cues: number[]) => { let z = 0; for (const c of cues) { const q = f - c; if (q >= 0 && q < 16) z = Math.max(z, 1 - q / 16); } return z; };
const PUNCHES = STORIES.map((s) => s.punchAt);
const Chrome: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: eout(ramp(f, F.hundreds, F.hundreds + 10)), fontFamily: FONT, fontWeight: 800 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Mark progress={f / TOTAL} zap={zapAt(f, PUNCHES)} /><div style={{ color: INK, fontSize: 30, letterSpacing: 6 }}>AI NEWS</div></div>
    <div style={{ color: INK, opacity: 0.55, fontSize: 26, letterSpacing: 5 }}>NOV 3 · 2026</div>
  </div>
);
const Bolt: React.FC<{ f: number; at: number; to: [number, number] }> = ({ f, at, to }) => {
  const q = f - at; if (q < -2 || q > 14) return null;
  const t = clamp01((q + 2) / 8), fade = 1 - clamp01((q - 8) / 6);
  const [x1, y1] = [96, 102], [x2, y2] = to, mx = lerp(x1, x2, 0.5) + 70, my = lerp(y1, y2, 0.5) - 50;
  const d = `M${x1} ${y1} L${lerp(x1, mx, Math.min(1, t * 2))} ${lerp(y1, my, Math.min(1, t * 2))} ${t > 0.5 ? `L${lerp(mx, x2, (t - 0.5) * 2)} ${lerp(my, y2, (t - 0.5) * 2)}` : ""}`;
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <path d={d} stroke={RED} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fade} />
      <path d={d} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fade * 0.9} />
    </svg>
  );
};

// ---------- card parts ----------
const Logo: React.FC<{ name?: string; size?: number; o?: number }> = ({ name, size = 84, o = 1 }) => name ? (
  <div style={{ width: WIDE.has(name) ? size * 2.6 : size, height: size, borderRadius: size * 0.24, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", opacity: o, flex: "none" }}>
    <img src={logo(name)} style={{ width: WIDE.has(name) ? size * 2.2 : size * 0.62, height: size * 0.62, objectFit: "contain" }} />
  </div>
) : null;
const Punch: React.FC<{ f: number; at: number; text: string; big?: boolean }> = ({ f, at, text, big }) => {
  const k = eout(ramp(f, at, at + 9));
  return (
    <div style={{ position: "relative", display: "inline-block", marginTop: big ? 14 : 8 }}>
      <div style={{ position: "absolute", left: -4, top: 0, bottom: 0, right: -4, background: RED, borderRadius: 6, transform: `rotate(-1.2deg) scaleX(${k})`, transformOrigin: "left center", boxShadow: k > 0 ? "0 10px 30px rgba(255,46,77,0.35)" : "none" }} />
      <div style={{ position: "relative", color: k > 0.5 ? "#fff" : INK, fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: big ? 104 : text.length > 13 ? 74 : 92, lineHeight: 1.05, padding: "4px 28px 12px", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};
const Chip: React.FC<{ f: number; at: number; text: string; hue?: string; fs?: number }> = ({ f, at, text, hue, fs = 32 }) => {
  const k = pop(f, at, 12); if (k <= 0) return null;
  return <div style={{ display: "inline-block", transform: `scale(${k})`, transformOrigin: "left center", marginRight: 12, background: hue ?? SOFT, color: hue ? "#fff" : INK, fontFamily: FONT, fontWeight: 800, fontSize: fs, padding: "9px 20px", borderRadius: 999, whiteSpace: "nowrap" }}>{text}</div>;
};
const Stamp: React.FC<{ f: number; at: number; text: string; x: number; y: number; rot?: number }> = ({ f, at, text, x, y, rot = -10 }) => {
  const k = pop(f, at, 10); if (k <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${lerp(2.2, 1, k)})`, opacity: k, border: `6px solid ${RED}`, color: RED, borderRadius: 14, padding: "6px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 4, background: "rgba(255,255,255,0.85)" }}>{text}</div>;
};
const Tile: React.FC<{ name?: string; label: string; x: number; y: number; w?: number; o?: number; rot?: number; sc?: number; hue?: string }> = ({ name, label, x, y, w = 250, o = 1, rot = 0, sc = 1, hue }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 150, borderRadius: 24, background: hue ?? SOFT, border: `3px solid ${hue ? hue : "#e2e5ec"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, opacity: o, transform: `rotate(${rot}deg) scale(${sc})` }}>
    {name && <img src={logo(name)} style={{ width: WIDE.has(name) ? 170 : 56, height: 56, objectFit: "contain" }} />}
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: hue ? "#fff" : INK, letterSpacing: 1 }}>{label}</div>
  </div>
);
const Num: React.FC<{ children: React.ReactNode; x: number; y: number; fs?: number; c?: string }> = ({ children, x, y, fs = 88, c = INK }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: FONT, fontWeight: 800, fontSize: fs, color: c, letterSpacing: -3, lineHeight: 1 }}>{children}</div>
);

// ---------- story visuals (956 × 240 panel inside the card) ----------
const PW = 956, PH = 240;
const V1: React.FC<{ f: number }> = ({ f }) => { // revenue bars + loss
  const b1 = eout(ramp(f, F.seventeen2, F.seventeen2 + 14)), b2 = eout(ramp(f, F.single, F.single + 16));
  const h1 = 90 * b1, h2 = 135 * b2;
  return (
    <div style={{ position: "relative", width: PW, height: PH }}>
      {[[60, "Q2", "$11.6B", h1, "#c9ced8"], [230, "Q3", "$17B", h2, GREEN]].map(([x, l, v, h, c]: any, i) => (
        <div key={i} style={{ position: "absolute", left: x, bottom: 30 }}>
          <div style={{ width: 120, height: h, background: c, borderRadius: 12, marginTop: 180 - h }} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, marginTop: 6 }}>{l}</div>
          {h > 10 && <div style={{ position: "absolute", top: 180 - h - 44, left: 0, width: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: INK }}>{v}</div>}
        </div>
      ))}
      <div style={{ position: "absolute", left: 430, top: 40 }}><Chip f={f} at={F.half} text="+47% vs Q2" hue={GREEN} fs={36} /></div>
      <div style={{ position: "absolute", left: 430, top: 120 }}><Chip f={f} at={F.lost} text="Still lost $23.3B" hue={RED} fs={36} /></div>
      <div style={{ position: "absolute", left: 430, top: 190 }}><Chip f={f} at={F.accounting} text="mostly accounting charges" fs={28} /></div>
    </div>
  );
};
const V2: React.FC<{ f: number }> = ({ f }) => { // two tiles merge → $115B counter → ALL STOCK stamp
  const m = eio(ramp(f, F.lumentum + 6, F.one15 + 4));
  const x1 = lerp(40, 180, m), x2 = lerp(660, 420, m);
  const n = countUp(f, F.one15, F.billion2 + 6, 115);
  return (
    <div style={{ position: "relative", width: PW, height: PH }}>
      <Tile name="marvell" label="" x={x1} y={20} w={360} o={1} />
      <Tile label="LUMENTUM" x={x2} y={20} w={300} o={eout(ramp(f, F.lumentum, F.lumentum + 8))} />
      {m > 0.95 && <Stamp f={f} at={F.one15} text="MERGED" x={330} y={60} rot={-8} />}
      {f >= F.one15 && <Num x={40} y={190} fs={64} c={INK}>${n}B</Num>}
      <Stamp f={f} at={F.stock} text="ALL STOCK" x={560} y={185} rot={6} />
    </div>
  );
};
const V3: React.FC<{ f: number }> = ({ f }) => { // lifecycle timeline
  const steps: [string, number][] = [["BUILD", F.building], ["TRAIN", F.building + 10], ["TEST", F.building + 20], ["LAUNCH", F.launching]];
  const line = eout(ramp(f, F.building, F.launching + 6));
  return (
    <div style={{ position: "relative", width: PW, height: PH }}>
      <div style={{ position: "absolute", left: 60, top: 70, width: 760, height: 10, background: "#e2e5ec", borderRadius: 5 }} />
      <div style={{ position: "absolute", left: 60, top: 70, width: 760 * line, height: 10, background: RED, borderRadius: 5 }} />
      {steps.map(([l, at], i) => { const k = pop(f, at, 10); return (
        <div key={i} style={{ position: "absolute", left: 60 + i * 250 - 22, top: 48, textAlign: "center" }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: k > 0 ? RED : "#e2e5ec", transform: `scale(${k > 0 ? 0.8 + 0.2 * k : 1})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 26 }}>{k > 0 ? "✓" : ""}</div>
          <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: k > 0 ? INK : GREY, letterSpacing: 2 }}>{l}</div>
        </div>); })}
      <div style={{ position: "absolute", left: 60, top: 170 }}><Chip f={f} at={F.safety} text="Safety rules at every step" fs={30} /><Chip f={f} at={F.jobs} text="+ watch AI's impact on jobs" hue={RED} fs={30} /></div>
    </div>
  );
};
const V4: React.FC<{ f: number }> = ({ f }) => { // package rain into installer + counter + bug
  const n = countUp(f, F.seventeenM, F.downloads + 10, 17300000);
  return (
    <div style={{ position: "relative", width: PW, height: PH, overflow: "hidden" }}>
      {[...Array(14)].map((_, i) => {
        const at = F.installing + i * 6, q = f - at; if (q < 0) return null;
        const x = 40 + rnd(`p${i}`) * 420, y = Math.min(118, q * 9), rot = (rnd(`r${i}`) - 0.5) * 40 * Math.max(0, 1 - q / 14);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 92, height: 52, borderRadius: 10, background: i % 3 ? "#d9dde6" : RED, opacity: q > 40 ? 0.9 : 1, transform: `rotate(${rot}deg)`, fontFamily: FONT, fontWeight: 800, fontSize: 18, color: i % 3 ? GREY : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{i % 3 ? "pkg" : "OLD"}</div>;
      })}
      <div style={{ position: "absolute", left: 20, bottom: 0, width: 500, height: 44, background: INK, borderRadius: 14, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#fff", letterSpacing: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>{f >= F.memory ? "INSTALLED FROM MEMORY" : "INSTALLER"}</div>
      {f >= F.seventeenM && <Num x={560} y={30} fs={60}>{n.toLocaleString("en-US")}</Num>}
      {f >= F.seventeenM && <div style={{ position: "absolute", left: 562, top: 100, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 3 }}>DOWNLOADS</div>}
      <div style={{ position: "absolute", left: 560, top: 160 }}><Chip f={f} at={F.bug} text="⚠ runs attacker commands" hue={RED} fs={30} /></div>
    </div>
  );
};
const V5: React.FC<{ f: number }> = ({ f }) => { // Claude slides out, Gemini slides in, Claude returns under PAID
  const out = eio(ramp(f, F.lost2, F.lost2 + 14)), inn = eback(ramp(f, F.gemini, F.gemini + 14)), back = eout(ramp(f, F.stays, F.stays + 12));
  return (
    <div style={{ position: "relative", width: PW, height: PH, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 4 }}>FREE PLAN</div>
      <Tile name="claude" label="CLAUDE" x={lerp(20, -400, out)} y={40} w={300} o={1 - out * 0.3} rot={lerp(0, -12, out)} />
      <Tile name="gemini" label="GEMINI FLASH" x={lerp(1000, 20, inn)} y={40} w={300} o={inn > 0 ? 1 : 0} />
      <div style={{ position: "absolute", left: 560, top: 0, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 4, opacity: back }}>PAID PLANS</div>
      <Tile name="claude" label="CLAUDE" x={560} y={lerp(260, 40, back)} w={300} o={back} />
      <div style={{ position: "absolute", left: 20, top: 200 }}><Chip f={f} at={F.only} text="Flash only" hue={RED} fs={28} /></div>
      <div style={{ position: "absolute", left: 560, top: 200 }}><Chip f={f} at={F.paid} text="Claude stays" hue={GREEN} fs={28} /></div>
    </div>
  );
};
const V6: React.FC<{ f: number }> = ({ f }) => { // three agents wire into one memory + #1 badge
  const wire = eout(ramp(f, F.shared, F.shared + 16)), b = pop(f, F.topped, 12);
  return (
    <div style={{ position: "relative", width: PW, height: PH }}>
      <svg width={PW} height={PH} style={{ position: "absolute", inset: 0 }}>
        {[40, 120, 200].map((y, i) => <path key={i} d={`M 230 ${y + 25} C 330 ${y + 25}, 330 125, 430 125`} stroke={RED} strokeWidth={6} fill="none" strokeDasharray={300} strokeDashoffset={300 * (1 - wire)} />)}
      </svg>
      {["AGENT 1", "AGENT 2", "AGENT 3"].map((l, i) => <div key={i} style={{ position: "absolute", left: 20, top: 20 + i * 80, width: 210, height: 50, borderRadius: 12, background: SOFT, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: INK, display: "flex", alignItems: "center", justifyContent: "center", opacity: eout(ramp(f, F.beacon + i * 4, F.beacon + i * 4 + 8)) }}>{l}</div>)}
      <div style={{ position: "absolute", left: 430, top: 70, width: 260, height: 110, borderRadius: 20, background: wire > 0.5 ? INK : SOFT, color: wire > 0.5 ? "#fff" : INK, fontFamily: FONT, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2 }}>ONE MEMORY</div>
      <div style={{ position: "absolute", left: 740, top: 50, width: 170, height: 150, borderRadius: 24, background: "#DA552F", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${b}) rotate(${lerp(-20, 6, b)}deg)`, opacity: b > 0 ? 1 : 0, fontFamily: FONT, fontWeight: 800 }}>
        <div style={{ fontSize: 70, lineHeight: 1 }}>#1</div><div style={{ fontSize: 20, letterSpacing: 2 }}>PRODUCT HUNT</div>
      </div>
    </div>
  );
};
const V7: React.FC<{ f: number }> = ({ f }) => { // a tiny animation plays: square → circle bouncing, prompt chip
  const t = Math.max(0, f - F.animations), bounce = Math.abs(Math.sin(t * 0.18)) * 70, rad = 12 + (0.5 + 0.5 * Math.sin(t * 0.09)) * 44;
  return (
    <div style={{ position: "relative", width: PW, height: PH }}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 440, height: 200, borderRadius: 20, background: INK, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 110 - bounce, width: 70, height: 70, borderRadius: rad, background: RED, opacity: f >= F.animations ? 1 : 0 }} />
        <div style={{ position: "absolute", left: 160, top: 60, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: "#8b93a7", letterSpacing: 2 }}>{f >= F.clayzo + 8 ? "> make a bouncing ball" : ""}</div>
        <div style={{ position: "absolute", left: 160, top: 100, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: GREEN }}>{f >= F.animations ? "✓ rendering…" : ""}</div>
        <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: `${clamp01((f - F.animations) / 60) * 100}%`, background: RED }} />
      </div>
      <Stamp f={f} at={F.free} text="FREE" x={560} y={60} rot={-8} />
    </div>
  );
};
const VISUALS = [V1, V2, V3, V4, V5, V6, V7];

// ---------- the card ----------
const Card: React.FC<{ f: number; s: Story; total: number; hero?: boolean; from?: [number, number, number] }> = ({ f, s, total, hero, from }) => {
  if (f < s.at) return null;
  const tin = ramp(f, s.at, s.at + 16), tout = ramp(f, s.out, s.out + 16);
  if (tout >= 1) return null;
  let tx = 0, ty = 0, sc = 1, rot = s.tilt;
  if (from) { const e = eio(tin); tx = lerp(from[0] - VW / 2, 0, e); ty = lerp(from[1] - (STAGE_TOP + 300), 0, e); sc = lerp(from[2], 1, e); rot = lerp(0, s.tilt, e); }
  else if (!hero) { ty = lerp(1500, 0, eback(tin)); rot = lerp(9, s.tilt, eout(tin)); }
  const back = eio(tout), fade = 1 - back * 0.7;
  const Vis = VISUALS[s.n - 1];
  const showVis = !hero && f >= s.at + 14;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 0, transform: `translate(${tx}px, ${ty + back * 70}px) rotate(${rot}deg) scale(${sc * lerp(1, 0.9, back)})`, transformOrigin: "50% 40%", opacity: fade, zIndex: tout > 0 ? 1 : 2 }}>
      <div style={{ background: PAPER, borderRadius: 40, padding: "52px 62px 44px", boxShadow: "0 40px 80px rgba(0,0,0,0.28), 0 0 0 2px rgba(0,0,0,0.04)", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          {s.logo ? <Logo name={s.logo} size={hero ? 96 : 76} /> : <div style={{ height: hero ? 96 : 76 }} />}
          {!hero && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: RED, letterSpacing: 3 }}>{String(s.n).padStart(2, "0")}<span style={{ color: "#c3c7d1" }}> / {String(total).padStart(2, "0")}</span></div>}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: hero ? 92 : 70, lineHeight: 1.04, letterSpacing: -2.5, color: INK }}>{s.headline}</div>
        <Punch f={f} at={s.punchAt} text={s.punch} big={hero} />
        {showVis && <div style={{ marginTop: 16, width: PW, height: PH, overflow: "visible" }}><Vis f={f} /></div>}
        <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 1 }}>{s.source}</div>
      </div>
    </div>
  );
};

// ---------- calm intro deck: pile → two rows → seven picks ----------
const MiniCard: React.FC<{ m: Mini; dim?: number }> = ({ m, dim = 0 }) => (
  <div style={{ width: 900, height: 560, background: PAPER, opacity: 1 - dim * 0.7, borderRadius: 36, padding: "54px 58px", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", position: "relative", boxSizing: "border-box" }}>
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}><Logo name={m.logo} size={110} /><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, lineHeight: 1.05, letterSpacing: -2.5, color: INK, flex: 1 }}>{m.h}</div></div>
    <div style={{ position: "absolute", left: 58, bottom: 40, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: GREY }}>{m.src}</div>
  </div>
);
const T = { pile0: F.hundreds + 2, pile1: F.today + 10, rows0: F.read - 4, rows1: F.read + 14, scan0: F.all - 4, scan1: F.all + 22, picks0: F.these - 2, pick0: F.seven - 4, out: F.one - 8 };
const ROW = (i: number) => ({ x: 44 + (i % 5) * 199 + 99, y: 640 + Math.floor(i / 5) * 165 + 70 });
const PICK_X = (k: number) => 60 + k * 137 + 62;
const Deck: React.FC<{ f: number }> = ({ f }) => {
  const items = PILE.map((m, i) => {
    const r0 = T.pile0 + i * ((T.pile1 - T.pile0) / PILE.length); if (f < r0) return null;
    const seed = (k: number) => rnd(`c${i}-${k}`);
    const land = eback(ramp(f, r0, r0 + 12));
    let x = lerp(VW / 2 + (seed(2) - 0.5) * 300, VW / 2 + (seed(1) - 0.5) * 30, land), y = lerp(VH + 300, 850 - i * 2, land), rot = lerp((seed(3) - 0.5) * 20, (seed(4) - 0.5) * 7, land), sc = 1;
    const rows = eio(ramp(f, T.rows0, T.rows1));
    if (rows > 0) { const c = ROW(i); x = lerp(x, c.x, rows); y = lerp(y, c.y, rows); rot = lerp(rot, 0, rows); sc = lerp(sc, 0.22, rows); }
    const dim = eio(ramp(f, T.picks0, T.picks0 + 8));
    const out = eio(ramp(f, T.out, T.out + 10)); if (out >= 1) return null;
    const scanY = lerp(600, 900, ramp(f, T.scan0, T.scan1)), scan = f >= T.scan0 && f <= T.scan1 ? Math.max(0, 1 - Math.abs(y - scanY) / 80) : 0;
    return <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 450 * sc}px, ${y - 280 * sc}px) rotate(${rot}deg) scale(${sc})`, transformOrigin: "450px 280px", width: 900, zIndex: i, opacity: 1 - out, filter: scan > 0 ? `brightness(${1 + scan * 0.4})` : "none" }}><MiniCard m={m} dim={dim} /></div>;
  });
  // the seven picks: numbered red tiles line up across the middle, with the story logos
  const picks = STORIES.map((s, k) => {
    const at = T.pick0 + k * 5, p = pop(f, at, 10); if (p <= 0) return null;
    const out = eio(ramp(f, k === 0 ? T.out + 14 : T.out, (k === 0 ? T.out + 14 : T.out) + 10)); if (out >= 1) return null;
    return (
      <div key={k} style={{ position: "absolute", left: PICK_X(k) - 62, top: 1080, width: 124, height: 150, borderRadius: 20, background: RED, color: "#fff", transform: `scale(${p}) translateY(${out * 60}px)`, opacity: 1 - out, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 16px 40px rgba(255,46,77,0.35)" }}>
        {s.logo && <div style={{ width: 54, height: 54, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><img src={logo(s.logo)} style={{ width: WIDE.has(s.logo) ? 46 : 34, height: 34, objectFit: "contain" }} /></div>}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: -1 }}>{String(k + 1).padStart(2, "0")}</div>
      </div>
    );
  });
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>{items}{picks}</div>;
};

// ---------- big type ----------
const BigType: React.FC<{ f: number; at: number; until: number; lines: [number, string][]; punch?: string; punchAt?: number; y?: number; size?: number }> = ({ f, at, until, lines, punch, punchAt = at + 12, y = 170, size = 104 }) => {
  if (f < at || f > until + 10) return null;
  const o = 1 - ramp(f, until, until + 10);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 800, color: INK, fontSize: size, lineHeight: 1.0, letterSpacing: -4 }}>
      {lines.map(([la, l], i) => f >= la && <div key={i} style={{ transform: `translateY(${lerp(30, 0, eout(ramp(f, la, la + 8)))}px)`, opacity: eout(ramp(f, la, la + 6)) }}>{l}</div>)}
      {punch && f >= punchAt && <div style={{ marginTop: 16, display: "inline-block", transform: `rotate(-1.5deg) scaleX(${eout(ramp(f, punchAt, punchAt + 9))})`, transformOrigin: "left center", background: RED, color: "#fff", fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: size, padding: "2px 34px 12px", borderRadius: 8, lineHeight: 1.05, boxShadow: "0 12px 36px rgba(255,46,77,0.35)" }}>{punch}</div>}
    </div>
  );
};

// ---------- Byte ----------
const Byte: React.FC<{ f: number; wave?: boolean }> = ({ f, wave }) => {
  const t = talkFor(f, "byte", SPK, ENV), on = speaking(f, "byte", SPK);
  const surprised = zapAt(f, PUNCHES) > 0.3 || (f >= F.lost && f < F.lost + 24) || (f >= F.bug && f < F.bug + 24);
  const mood = surprised ? "surprised" : f >= F.lost2 && f < F.gemini ? "neutral" : "happy";
  const nod = -pop(f, F.one, 8) * 20 - pop(f, F.two, 8) * 20 - pop(f, F.s3, 8) * 20 - pop(f, F.s4, 8) * 20 - pop(f, F.s5, 8) * 20 - pop(f, F.s6, 8) * 20 - pop(f, F.s7, 8) * 20;
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(880 ${2330 + nod}) scale(2.1) rotate(${on ? 3 : 0})`}><Person d={BYTE} f={f} seed={7} talk={t} wave={wave ? 1 : 0} mood={mood as any} /></g>
    </svg>
  );
};

// ---------- outro ----------
const Outro: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at) return null;
  const o = eout(ramp(f, at, at + 10)), bp = pop(f, at + 10, 14), click = at + 40, pulse = f >= click ? 1 + 0.04 * Math.sin((f - click) * 0.3) : 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG1} 0%, ${BG0} 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: FONT, fontWeight: 800, color: INK }}>
        <div style={{ display: "flex", justifyContent: "center", transform: `scale(${pop(f, at + 2, 14)})` }}><Mark s={3.2} progress={1} zap={zapAt(f, [at + 14])} /></div>
        <div style={{ fontSize: 128, letterSpacing: -4, marginTop: 24, lineHeight: 1 }}>AI News</div>
        <div style={{ marginTop: 24, display: "inline-block", transform: `rotate(-1.5deg) scaleX(${eout(ramp(f, at + 8, at + 17))})`, transformOrigin: "left center", background: RED, color: "#fff", fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: 70, padding: "2px 34px 12px", borderRadius: 8, lineHeight: 1.05 }}>Every day. Under two minutes.</div>
        <div style={{ marginTop: 60, display: "flex", justifyContent: "center" }}><div style={{ transform: `scale(${bp * pulse})`, background: f >= click ? "#2a2f3d" : INK, color: "#fff", borderRadius: 999, padding: "26px 90px", fontSize: 58, letterSpacing: 2, boxShadow: "0 16px 40px rgba(0,0,0,0.2)" }}>{f >= click ? "Subscribed ✓" : "Subscribe"}</div></div>
        <div style={{ marginTop: 40, fontSize: 34, color: GREY, letterSpacing: 4 }}>@THEDAILYAI-01</div>
      </div>
    </div>
  );
};

// ---------- film ----------
export const NewsFilm: React.FC = () => {
  const f = useCurrentFrame();
  const total = STORIES.length, outroAt = F.sub - 6, inOutro = f >= outroAt;
  const heroDrop = eio(ramp(f, T.pile0 - 8, T.pile0 + 8)), heroTop = lerp(HERO_TOP, 580, heroDrop), heroRot = lerp(-1.5, -4, heroDrop), heroGone = f >= T.rows0;
  return (
    <AbsoluteFill style={{ background: BG0 }}>
      <FontStyle /><SerifFont />
      <Backdrop f={f} />
      {!inOutro && (
        <>
          <Chrome f={f} />
          <BigType f={f} at={F.hundreds} until={F.read - 14} lines={[[F.hundreds, "Hundreds of"], [F.dropped, "stories today."]]} />
          <BigType f={f} at={F.read} until={F.these - 12} lines={[[F.read, "I read"]]} punch="them all." punchAt={F.all} />
          <BigType f={f} at={F.these} until={T.out} lines={[[F.these, "The seven"]]} punch="that matter." punchAt={F.matter - 4} />
          {!heroGone && <div style={{ position: "absolute", left: 0, right: 0, top: heroTop, zIndex: 0, opacity: 1 - eio(ramp(f, T.pile0 + 10, T.pile0 + 26)) }}><Card f={f} s={{ ...STORIES[0], at: -20, out: 999999, tilt: heroRot }} total={total} hero /></div>}
          <Deck f={f} />
          <div style={{ position: "absolute", left: 0, right: 0, top: STAGE_TOP, zIndex: 60 }}>
            {STORIES.map((s, i) => <Card key={i} f={f} s={s} total={total} from={i === 0 ? [PICK_X(0), 1155, 0.14] : undefined} />)}
          </div>
          {STORIES.map((s, i) => <Bolt key={i} f={f} at={s.punchAt} to={[150, STAGE_TOP + 330]} />)}
          <BigType f={f} at={F.seventeen3 + 12} until={outroAt} y={520} lines={[[F.seventeen3 + 12, "AI bubble…"]]} punch="or the real deal?" punchAt={F.real - 2} size={104} />
          {f >= F.comments - 2 && f < outroAt && <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: GREY, letterSpacing: 4, opacity: eout(ramp(f, F.comments - 2, F.comments + 8)) }}>TELL ME IN THE COMMENTS ↓</div>}
        </>
      )}
      <Outro f={f} at={outroAt} />
      <Byte f={f} wave={f >= F.tomorrow - 10} />
      <Caps f={f} words={WORDS} chunks={CHUNKS} accent={RED} theme="light" y={1250} hide={inOutro && f > outroAt + 20} />
      <Narration slug="newsDistilled" total={TOTAL} />
      <Sequence from={outroAt + 40}><Audio src={staticFile("sfx/click.ogg")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};
