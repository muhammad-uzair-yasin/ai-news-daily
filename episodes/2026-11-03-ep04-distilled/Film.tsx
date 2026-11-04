// Ai News — "Distilled" v2 (Nov 4 2026). Card-rain → fan → grid → picks → story cards, with company logos,
// a stopwatch progress ring (brand), lightning zaps on every punch line, and Byte (single mascot) reacting.
// Cream palette. Same narration/cues as ep04 so lip-sync + captions are real.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, eback, pop, clamp01, lerp, rnd, VW, VH } from "./kit";
import { Narration, Caps, FONT, talkFor, speaking } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues (frames from words.ts) ----------
const F = {
  everything: 28, happened: 51, today: 73, anna: 99, max: 127, today2: 171, anthropic: 182, seventeen: 234, billion: 249, three: 318, months: 327, wait: 356, yes: 431,
  up: 455, half: 469, lost: 534, accounting: 596, ipo: 679,
  s2: 718, marvell: 767, lumentum: 820, one15: 844, stock: 917, biggest: 977,
  s3: 1078, china: 1104, safety: 1140, whole: 1173, jobs: 1340,
  s4: 1367, coding: 1448, mcp: 1521, seventeenM: 1632, bug: 1713,
  s5: 1787, google: 1831, free: 1865, gemini: 1953, paid: 2027,
  s6: 2064, beacon: 2118, topped: 2210, clayzo: 2258, animations: 2316, free2: 2359,
  would: 2389, bubble: 2468, real: 2493, comments: 2541, sub: 2573, tomorrow: 2631,
};

// ---------- palette (cream editorial + brand red/black) ----------
const BG0 = "#efe9dd", BG1 = "#f8f4ea", RED = "#ff2e4d", INK = "#0f1117", GREY = "#6b7280", PAPER = "#ffffff", DIM = "#e4dccb";
const SERIF = "PlayfairLocal, 'Playfair Display', Georgia, serif";
const SerifFont: React.FC = () => (
  <style>{`@font-face{font-family:PlayfairLocal;font-weight:800;font-style:italic;src:url(${staticFile("playfair800i.woff2")}) format("woff2")}`}</style>
);
const logo = (n: string) => staticFile(`logos/${n}.svg`);

// ---------- mascot ----------
const BYTE = { ...CAST[5], name: "Byte", top: "hoodie" as const, topC: "#111118", hat: "headset" as const, hatC: RED, glasses: "square" as const, hair: "short" as const, hairC: "#111", prop: "none" as const, face: "none" as const };

// ---------- headlines for the rain/grid (all real, from our published episodes ep01–ep04) ----------
type Mini = { h: string; src: string; logo?: string };
const RAIN: Mini[] = [
  { h: "Mistral's 1-trillion-parameter model goes open weights", src: "VKTR", logo: "mistral" },
  { h: "Fake Claude Code extension backdoor — update now", src: "AI Weekly", logo: "claude" },
  { h: "Codex usage limits doubled", src: "The Neuron", logo: "openai" },
  { h: "Claude API upload limit 32 MB → 128 MB", src: "The Neuron", logo: "anthropic" },
  { h: "Canada buys $1.6B of Cohere", src: "The Neuron" },
  { h: "Amazon borrows $80B for AI build-out", src: "AI Weekly", logo: "amazon" },
  { h: "ElevenLabs ships SFX v3", src: "The Neuron" },
  { h: "OpenAI agent arrives on iMessage", src: "The Neuron", logo: "openai" },
  { h: "Meta launches an AI pet and a stylist", src: "The Neuron", logo: "meta" },
  { h: "OpenAI cuts funding goal from $30B to $20B", src: "FT via TNW", logo: "openai" },
  { h: "Apple picks Alibaba's Qwen to power Siri in China", src: "CGTN", logo: "apple" },
  { h: "GPT-Rosalind-6: OpenAI's biology model", src: "AI Weekly", logo: "openai" },
  { h: "Kimi K2 shuts down in December", src: "qcode" },
  { h: "VOLTA malware uses AI to rank victims", src: "Cisco Talos" },
  { h: "Presentations AI turns any webpage into slides", src: "Yahoo Finance" },
  { h: "9 of 10 AI agents raised their own spending limit", src: "CoinDesk" },
  { h: "ChatGPT and Codex will share one usage limit", src: "OpenAI forum", logo: "openai" },
  { h: "DeepSeek open-sources a GitHub coding agent", src: "GitHub", logo: "deepseek" },
  { h: "Prefab UI bug: CVSS 10 — update to 0.21.0", src: "AI Weekly" },
  { h: "Aramco takes 49% of HUMAIN for ~$2.6B", src: "AI Weekly" },
  { h: "Mischief: a 5-second AI video for under 3 cents", src: "TNW" },
  { h: "Anthropic: $17B revenue in one quarter", src: "CNBC", logo: "anthropic" },
  { h: "Marvell buys Lumentum for $115B in stock", src: "Fox Business", logo: "marvell" },
  { h: "China plans AI safety rules for the whole lifecycle", src: "The Star" },
  { h: "Coding agents install abandoned MCP servers", src: "Help Net Security", logo: "mcp" },
  { h: "Antigravity free plan loses Claude", src: "enjoy.dev", logo: "antigravity" },
  { h: "Beacon: shared memory for coding agents", src: "Product Hunt", logo: "producthunt" },
  { h: "Clayzo: coding agents make animations", src: "Product Hunt", logo: "producthunt" },
  { h: "Anthropic net loss $23.3B — mostly accounting", src: "CNBC", logo: "anthropic" },
  { h: "China to watch AI's impact on jobs", src: "The Star" },
];
// which grid cells hold today's 7 picks (story n → cell index), spread around the grid like a real pick
const PICK_CELL = [21, 4, 17, 27, 9, 14, 24];

// ---------- stage timing (intro) ----------
const T = {
  rain0: F.everything + 2,          // first card rises
  rain1: F.anna - 6,                // last card lands
  fan0: F.anna + 4, fan1: F.anna + 16,
  grid0: F.max - 8, grid1: F.max + 4,
  scan0: F.max + 6, scan1: F.max + 34,
  dim: F.today2 - 10,               // grid dims, picks start
  pick0: F.today2 - 8,              // first badge pops; one every 5 frames
  gridOut: F.anthropic - 2,         // grid fades, story 1 flies out of its cell
};
// grid geometry: 5 cols × 6 rows, mini card = 900×560 card scaled
const GRID = { x0: 60, y0: 420, cw: 192, ch: 126, cols: 5, scale: 0.19 };
const cellXY = (i: number) => ({ x: GRID.x0 + (i % GRID.cols) * GRID.cw + GRID.cw / 2, y: GRID.y0 + Math.floor(i / GRID.cols) * GRID.ch + GRID.ch / 2 });

// ---------- story cards ----------
type Story = { n: number; headline: string; punch: string; punchAt: number; source: string; tilt: number; logo?: string; at: number; out: number; notes?: { at: number; text: string; hue?: string }[] };
const STORIES: Story[] = [
  { n: 1, at: F.anthropic - 2, out: F.s2 - 10, tilt: -1.5, logo: "anthropic", headline: "Anthropic just made $17B in one quarter.", punch: "In 3 months.", punchAt: F.three, source: "CNBC · amended S-1 · Nov 2",
    notes: [{ at: F.half, text: "+47% vs Q2" }, { at: F.lost, text: "Still lost $23.3B", hue: RED }] },
  { n: 2, at: F.s2 - 10, out: F.s3 - 10, tilt: 1.2, logo: "marvell", headline: "Marvell is buying Lumentum for $115 billion.", punch: "All in stock.", punchAt: F.stock, source: "Fox Business · Nov 3",
    notes: [{ at: F.biggest, text: "Biggest tech merger ever", hue: RED }] },
  { n: 3, at: F.s3 - 10, out: F.s4 - 10, tilt: -1, headline: "China will set AI safety rules for the whole life of a model.", punch: "Build to launch.", punchAt: F.whole, source: "The Star · Nov 3",
    notes: [{ at: F.jobs, text: "…and watch AI's impact on jobs" }] },
  { n: 4, at: F.s4 - 10, out: F.s5 - 10, tilt: 1.6, logo: "mcp", headline: "Coding agents install abandoned MCP servers from memory.", punch: "17M+ downloads.", punchAt: F.seventeenM, source: "Help Net Security · Nov 3",
    notes: [{ at: F.bug, text: "One runs attacker commands", hue: RED }] },
  { n: 5, at: F.s5 - 10, out: F.s6 - 10, tilt: -1.3, logo: "antigravity", headline: "Google Antigravity's free plan just lost Claude.", punch: "Gemini Flash only.", punchAt: F.gemini, source: "enjoy.dev · Nov 2",
    notes: [{ at: F.paid, text: "Claude stays on paid plans" }] },
  { n: 6, at: F.s6 - 10, out: F.clayzo - 6, tilt: 1, logo: "producthunt", headline: "Beacon gives your coding agents one shared memory.", punch: "#1 on Product Hunt.", punchAt: F.topped, source: "Product Hunt · Nov 3" },
  { n: 7, at: F.clayzo - 6, out: F.would - 8, tilt: -1.4, logo: "producthunt", headline: "Clayzo lets your coding agent make animations.", punch: "For free.", punchAt: F.free2, source: "Product Hunt · Nov 3" },
];
const STAGE_TOP = 400;      // story card top
const HERO_TOP = 640;       // hook card top (frame 0)

// ---------- background ----------
const Backdrop: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG1} 0%, ${BG0} 100%)` }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`, backgroundSize: "90px 90px", backgroundPosition: `${(f * 0.12) % 90}px ${(f * 0.08) % 90}px` }} />
    <div style={{ position: "absolute", left: -200, top: -500, width: 1500, height: 1100, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,46,77,${0.16 + 0.03 * Math.sin(f * 0.05)}) 0%, rgba(255,46,77,0) 60%)` }} />
  </div>
);

// ---------- brand: stopwatch mark with progress ring + zap ----------
const Mark: React.FC<{ s?: number; progress?: number; zap?: number; color?: string }> = ({ s = 1, progress = 0, zap = 0, color = INK }) => {
  const r = 22, C = 2 * Math.PI * r;
  return (
    <svg width={60 * s} height={60 * s} viewBox="0 0 60 60" style={{ overflow: "visible" }}>
      <circle cx={30} cy={32} r={r} fill="none" stroke={color} strokeWidth={4.5} opacity={0.25} />
      <circle cx={30} cy={32} r={r} fill="none" stroke={RED} strokeWidth={4.5} strokeLinecap="round" strokeDasharray={`${C * clamp01(progress)} ${C}`} transform="rotate(-90 30 32)" />
      <rect x={25} y={4} width={10} height={6} rx={2} fill={color} />
      <path d="M33 22 l-8 11 h7 l-3 9 l9 -12 h-7 z" fill={RED} transform={`translate(30 32) scale(${1 + zap * 0.6}) translate(-30 -32)`} />
      {zap > 0 && <circle cx={30} cy={32} r={r + zap * 26} fill="none" stroke={RED} strokeWidth={3} opacity={1 - zap} />}
    </svg>
  );
};
const zapAt = (f: number, cues: number[]) => { let z = 0; for (const c of cues) { const q = f - c; if (q >= 0 && q < 16) z = Math.max(z, 1 - q / 16); } return z; };
const Chrome: React.FC<{ f: number }> = ({ f }) => {
  const o = eout(ramp(f, F.everything, F.everything + 10));
  const zap = zapAt(f, STORIES.map((s) => s.punchAt));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: o, fontFamily: FONT, fontWeight: 800 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Mark progress={f / TOTAL} zap={zap} />
        <div style={{ color: INK, fontSize: 30, letterSpacing: 6 }}>AI NEWS</div>
      </div>
      <div style={{ color: INK, opacity: 0.55, fontSize: 26, letterSpacing: 5 }}>NOV 3 · 2026</div>
    </div>
  );
};
// a lightning bolt that shoots from the mark to the punch bar
const Bolt: React.FC<{ f: number; at: number; to: [number, number] }> = ({ f, at, to }) => {
  const q = f - at; if (q < -2 || q > 14) return null;
  const t = clamp01((q + 2) / 8), fade = 1 - clamp01((q - 8) / 6);
  const [x1, y1] = [96, 102], [x2, y2] = to;
  const mx = lerp(x1, x2, 0.5) + 60, my = lerp(y1, y2, 0.5) - 40;
  const d = `M${x1} ${y1} L${lerp(x1, mx, t)} ${lerp(y1, my, t)} ${t > 0.5 ? `L${lerp(mx, x2, (t - 0.5) * 2)} ${lerp(my, y2, (t - 0.5) * 2)}` : ""}`;
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <path d={d} stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fade} />
      <path d={d} stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fade * 0.8} />
    </svg>
  );
};

// ---------- the white card ----------
const Punch: React.FC<{ f: number; at: number; text: string; big?: boolean }> = ({ f, at, text, big }) => {
  const k = eout(ramp(f, at, at + 9));
  return (
    <div style={{ position: "relative", display: "inline-block", marginTop: big ? 14 : 10 }}>
      <div style={{ position: "absolute", left: -4, top: 0, bottom: 0, right: -4, background: RED, borderRadius: 6, transform: `rotate(-1.2deg) scaleX(${k})`, transformOrigin: "left center", boxShadow: k > 0 ? "0 10px 30px rgba(255,46,77,0.35)" : "none" }} />
      <div style={{ position: "relative", color: k > 0.5 ? "#fff" : INK, fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: big ? 104 : 96, lineHeight: 1.05, padding: "4px 28px 12px", transition: "none" }}>{text}</div>
    </div>
  );
};
const Note: React.FC<{ f: number; at: number; text: string; hue?: string }> = ({ f, at, text, hue }) => {
  const k = pop(f, at, 12); if (k <= 0) return null;
  return <div style={{ display: "inline-block", transform: `scale(${k})`, transformOrigin: "left center", marginRight: 12, marginTop: 16, background: hue ?? "#eef0f5", color: hue ? "#fff" : INK, fontFamily: FONT, fontWeight: 800, fontSize: 32, padding: "9px 20px", borderRadius: 999 }}>{text}</div>;
};
const WIDE = new Set(["marvell", "microsoft", "amazon"]);
const Logo: React.FC<{ name?: string; size?: number; o?: number }> = ({ name, size = 84, o = 1 }) => name ? (
  <div style={{ width: WIDE.has(name) ? size * 2.6 : size, height: size, borderRadius: size * 0.24, background: "#f3f4f7", display: "flex", alignItems: "center", justifyContent: "center", opacity: o, flex: "none" }}>
    <img src={logo(name)} style={{ width: WIDE.has(name) ? size * 2.2 : size * 0.62, height: size * 0.62, objectFit: "contain" }} />
  </div>
) : null;
const Card: React.FC<{ f: number; s: Story; total: number; hero?: boolean; fromCell?: number }> = ({ f, s, total, hero, fromCell }) => {
  if (f < s.at) return null;
  const tin = ramp(f, s.at, s.at + 16);
  const tout = ramp(f, s.out, s.out + 16);
  if (tout >= 1) return null;
  // entrance: fly from grid cell (story 1) or rise from below (others)
  let tx = 0, ty = 0, sc = 1, rot = s.tilt;
  if (fromCell !== undefined) {
    const c = cellXY(fromCell); const e = eio(tin);
    tx = lerp(c.x - VW / 2, 0, e); ty = lerp(c.y - (STAGE_TOP + 280), 0, e); sc = lerp(GRID.scale, 1, e); rot = lerp(0, s.tilt, e);
  } else if (!hero) {
    ty = lerp(1500, 0, eback(tin)); rot = lerp(9, s.tilt, eout(tin));
  }
  const back = eio(tout);
  const sc2 = lerp(1, 0.9, back), dy = lerp(0, 70, back), fade = 1 - back * 0.7;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 0, transform: `translate(${tx}px, ${ty + dy}px) rotate(${rot}deg) scale(${sc * sc2})`, transformOrigin: "50% 40%", opacity: fade, zIndex: tout > 0 ? 1 : 2 }}>
      <div style={{ background: PAPER, borderRadius: 40, padding: "58px 62px 48px", boxShadow: "0 40px 80px rgba(0,0,0,0.28), 0 0 0 2px rgba(0,0,0,0.04)", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <Logo name={s.logo} />
          {!hero && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: RED, letterSpacing: 3 }}>{String(s.n).padStart(2, "0")}<span style={{ color: "#c3c7d1" }}> / {String(total).padStart(2, "0")}</span></div>}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: hero ? 92 : 82, lineHeight: 1.04, letterSpacing: -3, color: INK }}>{s.headline}</div>
        <Punch f={f} at={s.punchAt} text={s.punch} big={hero} />
        {s.notes && <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{s.notes.map((n, i) => <Note key={i} f={f} at={n.at} text={n.text} hue={n.hue} />)}</div>}
        <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: GREY, letterSpacing: 1 }}>{s.source}</div>
      </div>
    </div>
  );
};

// ---------- mini card (rain / fan / grid) ----------
const MiniCard: React.FC<{ m: Mini; w?: number; pick?: number; lit?: number; dim?: number }> = ({ m, w = 900, pick, lit = 0, dim = 0 }) => (
  <div style={{ width: w, background: lit > 0 ? `rgb(255, ${Math.round(lerp(255, 46, lit))}, ${Math.round(lerp(255, 77, lit))})` : PAPER, opacity: 1 - dim * 0.72, borderRadius: 36, padding: "54px 58px 44px", boxShadow: "0 24px 60px rgba(0,0,0,0.22)", position: "relative", boxSizing: "border-box", height: 560 }}>
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <Logo name={m.logo} size={110} o={lit > 0.5 ? 0.9 : 1} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: -2.5, color: lit > 0.5 ? "#fff" : INK, flex: 1 }}>{m.h}</div>
    </div>
    <div style={{ position: "absolute", left: 58, bottom: 40, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: lit > 0.5 ? "rgba(255,255,255,0.8)" : GREY }}>{m.src}</div>
    {pick !== undefined && <div style={{ position: "absolute", right: 48, bottom: 32, fontFamily: FONT, fontWeight: 800, fontSize: 92, color: lit > 0.5 ? "#fff" : RED, letterSpacing: -2 }}>{String(pick).padStart(2, "0")}</div>}
  </div>
);

/** Every mini card's transform at frame f: rain → stack → fan → grid, then dim / pick / fade. */
const Deck: React.FC<{ f: number }> = ({ f }) => {
  const N = RAIN.length;
  const items = RAIN.map((m, i) => {
    const u = i / (N - 1);
    const r0 = T.rain0 + (T.rain1 - T.rain0) * (1 - Math.pow(1 - u, 1.8)); // accelerating arrivals
    if (f < r0) return null;
    const seed = (k: number) => rnd(`c${i}-${k}`);
    // stage A: rain → stack
    const land = eback(ramp(f, r0, r0 + 11));
    const stackX = VW / 2 + (seed(1) - 0.5) * 36, stackY = 760 + 280 - i * 1.5;
    let x = lerp(VW / 2 + (seed(2) - 0.5) * 500, stackX, land), y = lerp(VH + 400, stackY, land), rot = lerp((seed(3) - 0.5) * 22, (seed(4) - 0.5) * 8, land), sc = 1;
    // stage B: fan
    const fan = eio(ramp(f, T.fan0, T.fan1));
    if (fan > 0) {
      const row = i % 2, col = Math.floor(i / 2);
      const fx = -150 + col * 98 + row * 50, fy = 680 + row * 210 + (seed(5) - 0.5) * 40, fr = (seed(6) - 0.5) * 24, fs = 0.6;
      x = lerp(x, fx + 450 * fs, fan); y = lerp(y, fy + 280 * fs, fan); rot = lerp(rot, fr, fan); sc = lerp(sc, fs, fan);
    }
    // stage C: grid
    const grid = eio(ramp(f, T.grid0, T.grid1));
    if (grid > 0) { const c = cellXY(i); x = lerp(x, c.x, grid); y = lerp(y, c.y, grid); rot = lerp(rot, 0, grid); sc = lerp(sc, GRID.scale, grid); }
    // picks
    const pk = PICK_CELL.indexOf(i);
    const dim = pk >= 0 ? 0 : eio(ramp(f, T.dim, T.dim + 8));
    let lit = 0, pscale = 1;
    if (pk >= 0) { const at = T.pick0 + pk * 5; lit = eout(ramp(f, at, at + 6)); pscale = 1 + 0.55 * pop(f, at, 10) * (lit > 0 ? 1 : 0); }
    // exit: grid fades (story 1 flies out of cell separately)
    const out = eio(ramp(f, T.gridOut, T.gridOut + 10));
    if (out >= 1) return null;
    // scan band brightness
    const scanY = lerp(GRID.y0 - 100, GRID.y0 + 6 * GRID.ch + 100, ramp(f, T.scan0, T.scan1));
    const scan = f >= T.scan0 && f <= T.scan1 ? Math.max(0, 1 - Math.abs(y - scanY) / 90) : 0;
    return (
      <div key={i} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${x - 450 * sc}px, ${y - 280 * sc}px) rotate(${rot}deg) scale(${sc * pscale})`, transformOrigin: "450px 280px", width: 900, zIndex: pk >= 0 && lit > 0 ? 50 : i, opacity: 1 - out, filter: scan > 0 ? `brightness(${1 + scan * 0.35})` : "none" }}>
        <MiniCard m={m} pick={pk >= 0 && lit > 0 ? pk + 1 : undefined} lit={lit} dim={dim} />
      </div>
    );
  });
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>{items}</div>;
};

// ---------- big type (intro + question) ----------
const BigType: React.FC<{ f: number; at: number; until: number; lines: [number, string][]; punch?: string; punchAt?: number; y?: number; size?: number }> = ({ f, at, until, lines, punch, punchAt = at + 12, y = 150, size = 112 }) => {
  if (f < at || f > until + 10) return null;
  const o = 1 - ramp(f, until, until + 10);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", opacity: o, fontFamily: FONT, fontWeight: 800, color: INK, fontSize: size, lineHeight: 1.0, letterSpacing: -4 }}>
      {lines.map(([la, l], i) => f >= la && <div key={i} style={{ transform: `translateY(${lerp(30, 0, eout(ramp(f, la, la + 8)))}px)`, opacity: eout(ramp(f, la, la + 6)) }}>{l}</div>)}
      {punch && f >= punchAt && (
        <div style={{ marginTop: 16, display: "inline-block", transform: `rotate(-1.5deg) scaleX(${eout(ramp(f, punchAt, punchAt + 9))})`, transformOrigin: "left center", background: RED, color: "#fff",
          fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: size, padding: "2px 34px 12px", borderRadius: 8, lineHeight: 1.05, boxShadow: "0 12px 36px rgba(255,46,77,0.35)" }}>{punch}</div>
      )}
    </div>
  );
};

// ---------- Byte ----------
const Byte: React.FC<{ f: number; wave?: boolean }> = ({ f, wave }) => {
  const t = Math.max(talkFor(f, "anna", SPK, ENV), talkFor(f, "max", SPK, ENV));
  const on = speaking(f, "anna", SPK) || speaking(f, "max", SPK);
  const surprised = (f >= F.wait - 2 && f < F.yes) || (f >= F.seventeen && f < F.wait) || zapAt(f, STORIES.map((s) => s.punchAt)) > 0.3;
  const mood = surprised ? "surprised" : f >= F.bug - 4 && f < F.s5 ? "neutral" : "happy";
  const hop = -pop(f, T.pick0, 8) * 30;
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(880 ${2330 + hop}) scale(2.1) rotate(${on ? 3 : 0})`}>
        <Person d={BYTE} f={f} seed={7} talk={t} wave={wave ? 1 : 0} mood={mood as any} />
      </g>
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
        <div style={{ marginTop: 60, display: "flex", justifyContent: "center" }}>
          <div style={{ transform: `scale(${bp * pulse})`, background: f >= click ? "#2a2f3d" : INK, color: "#fff", borderRadius: 999, padding: "26px 90px", fontSize: 58, letterSpacing: 2, boxShadow: "0 16px 40px rgba(0,0,0,0.2)" }}>{f >= click ? "Subscribed ✓" : "Subscribe"}</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 34, color: GREY, letterSpacing: 4 }}>@THEDAILYAI-01</div>
      </div>
    </div>
  );
};

// ---------- film ----------
export const NewsFilm: React.FC = () => {
  const f = useCurrentFrame();
  const total = STORIES.length;
  const outroAt = F.sub - 6, inOutro = f >= outroAt;
  // hero card: alone at frame 0, then drops into the stack when the rain starts, and is buried
  const heroDrop = eio(ramp(f, T.rain0 - 6, T.rain0 + 8));
  const heroTop = lerp(HERO_TOP, 760, heroDrop), heroRot = lerp(-1.5, -4, heroDrop);
  const heroGone = f >= T.fan0;
  const breathe = 1 + 0.01 * Math.sin(f * 0.04);
  return (
    <AbsoluteFill style={{ background: BG0 }}>
      <FontStyle /><SerifFont />
      <Backdrop f={f} />
      {!inOutro && (
        <>
          <Chrome f={f} />
          {/* intro type: builds word-group by word-group like the reference */}
          <BigType f={f} at={T.rain0} until={T.fan0 - 14} lines={[[T.rain0, "Everything"], [F.happened, "in AI today."]]} punch="Distilled." punchAt={F.today} />
          <BigType f={f} at={T.fan0} until={T.dim - 12} lines={[[T.fan0, "AI News"]]} punch="reads it all." punchAt={T.grid1 + 2} />
          <BigType f={f} at={T.dim} until={T.gridOut} lines={[[T.dim, "Picks"]]} punch="the seven." punchAt={T.dim + 6} />
          {/* hook / hero card */}
          {!heroGone && (
            <div style={{ position: "absolute", left: 0, right: 0, top: heroTop, zIndex: 0 }}>
              <Card f={f} s={{ ...STORIES[0], at: -20, out: 999999, tilt: heroRot }} total={total} hero />
            </div>
          )}
          {/* the deck: rain → fan → grid → picks */}
          <Deck f={f} />
          {/* story cards */}
          <div style={{ position: "absolute", left: 0, right: 0, top: STAGE_TOP, transform: `scale(${breathe})`, transformOrigin: "50% 30%", zIndex: 60 }}>
            {STORIES.map((s, i) => <Card key={i} f={f} s={s} total={total} fromCell={i === 0 ? PICK_CELL[0] : undefined} />)}
          </div>
          {STORIES.map((s, i) => <Bolt key={i} f={f} at={s.punchAt} to={[150, STAGE_TOP + 330]} />)}
          {/* comments question */}
          <BigType f={f} at={F.would - 4} until={outroAt} y={520} lines={[[F.would - 4, "AI bubble…"]]} punch="or the real deal?" punchAt={F.real - 2} size={104} />
          {f >= F.comments - 2 && f < outroAt && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: GREY, letterSpacing: 4, opacity: eout(ramp(f, F.comments - 2, F.comments + 8)) }}>TELL US IN THE COMMENTS ↓</div>
          )}
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
