// Ai News ep04 (Nov 3 2026): two-anchor news desk (Anna + Uzair). Autopilot episode.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, pop, clamp01, lerp, mix, rnd, VW, VH } from "./kit";
import { Narration, Sfx, Cue, Caps, Cover, Chip, BigNum, Stamp, Cursor, FONT, YEL, INKC, Director, Shot, transitionCues, talkFor, speaking, countUp } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues (frames from words.ts) ----------
const F = {
  max: 127, anthropic: 182, seventeen: 234, billion: 249, dollars: 261, three: 318, months: 327, wait: 356, seventeen2: 383, yes: 431,
  up: 455, half: 469, before: 500, lost: 534, tw3: 542, accounting: 596, ipo: 679,
  s2: 718, chipmaker: 749, marvell: 767, buying: 786, laser: 799, lumentum: 820, one15: 844, billion2: 879, stock: 917, biggest: 977, merger: 989,
  s3: 1078, china: 1104, safety: 1140, whole: 1173, building: 1239, launching: 1259, jobs: 1340,
  s4: 1367, researchers: 1414, coding: 1448, abandoned: 1503, mcp: 1521, memory: 1570, packages: 1603, seventeenM: 1632, downloads: 1660, bug: 1713, commands: 1754,
  s5: 1787, pricing: 1804, google: 1831, free: 1865, lost2: 1889, claude: 1897, gemini: 1953, only: 1976, stays: 2007, paid: 2027,
  s6: 2064, beacon: 2118, shared: 2175, topped: 2210, hunt: 2233, clayzo: 2258, animations: 2316, free2: 2359,
  would: 2389, bubble: 2468, real: 2493, comments: 2541, sub: 2573, tomorrow: 2631,
};
const NAVY = "#0a1230", NAVY2 = "#122051", RED = "#e8283a", CYAN = "#33d6ff", GREEN = "#2fd67b", PURP = "#8b5cff", ORANGE = "#ff8a2a";
const ANNA = { ...CAST[16], name: "Anna", prop: "none" as const };
const MAX = { ...CAST[17], name: "Uzair", prop: "none" as const };
const annaTalk = (f: number) => talkFor(f, "anna", SPK, ENV);
const maxTalk = (f: number) => talkFor(f, "max", SPK, ENV);

// stories (lower third)
const STORIES: { at: number; n: number; tag: string; tagC: string; title: string }[] = [
  { at: F.seventeen, n: 1, tag: "MONEY", tagC: GREEN, title: "ANTHROPIC: $17B REVENUE IN ONE QUARTER" },
  { at: F.s2, n: 2, tag: "MEGA DEAL", tagC: CYAN, title: "MARVELL BUYS LUMENTUM · $115B" },
  { at: F.s3, n: 3, tag: "POLICY", tagC: RED, title: "CHINA: AI SAFETY RULES, START TO END" },
  { at: F.s4, n: 4, tag: "SECURITY", tagC: ORANGE, title: "AGENTS INSTALL ABANDONED MCP SERVERS" },
  { at: F.s5, n: 5, tag: "PRICING", tagC: PURP, title: "ANTIGRAVITY FREE PLAN LOSES CLAUDE" },
  { at: F.s6, n: 6, tag: "FREE TOOL", tagC: YEL, title: "BEACON: SHARED MEMORY FOR AGENTS" },
  { at: F.clayzo, n: 7, tag: "FREE TOOL", tagC: YEL, title: "CLAYZO: AGENTS MAKE ANIMATIONS" },
];
const TICKER = "ANTHROPIC S-1: ABOUT $17B Q3 REVENUE  •  MARVELL TO BUY LUMENTUM FOR $115B IN STOCK  •  CHINA PLANS FULL-LIFECYCLE AI SAFETY RULES  •  CODING AGENTS INSTALL DEPRECATED MCP SERVERS  •  ANTIGRAVITY FREE PLAN: GEMINI 3.8 FLASH ONLY  •  BEACON TOPS PRODUCT HUNT  •  CLAYZO: FREE AGENT ANIMATIONS  •  ";

// ---------- studio set ----------
const MON = { x: 90, y: 180, w: 900, h: 640 };
const Studio: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <linearGradient id="stBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060b22" /><stop offset="0.6" stopColor={NAVY2} /><stop offset="1" stopColor="#050816" /></linearGradient>
      <radialGradient id="stGlow" cx="50%" cy="38%" r="60%"><stop offset="0" stopColor="#2a6bff" stopOpacity={0.45} /><stop offset="1" stopColor="#2a6bff" stopOpacity={0} /></radialGradient>
      <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1d2a5e" /><stop offset="1" stopColor="#0b1233" /></linearGradient>
      <linearGradient id="deskTop" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9d6ff" /><stop offset="0.5" stopColor="#ffffff" /><stop offset="1" stopColor="#c9d6ff" /></linearGradient>
    </defs>
    <rect width={VW} height={VH} fill="url(#stBg)" />
    <rect width={VW} height={VH} fill="url(#stGlow)" />
    {/* LED wall tiles */}
    {[...Array(9)].map((_, i) => [...Array(14)].map((__, j) => (
      <rect key={i + "-" + j} x={i * 122 - 10} y={j * 92 + 20} width={112} height={82} rx={6} fill="#1a3a9a"
        opacity={0.08 + 0.1 * (0.5 + 0.5 * Math.sin(f * 0.05 + i * 0.7 + j * 0.45))} />
    )))}
    {/* light beams */}
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${140 + i * 260} 0 L${60 + i * 260} 1400 L${260 + i * 260} 1400 Z`} fill="#5aa8ff" opacity={0.035 + 0.02 * Math.sin(f * 0.04 + i)} />
    ))}
    {/* side LED strips */}
    {[30, 1050].map((x, i) => <rect key={i} x={x - 6} y={120} width={12} height={1250} rx={6} fill={CYAN} opacity={0.5 + 0.3 * Math.sin(f * 0.1 + i)} />)}
    {/* floor */}
    <rect x={0} y={1400} width={VW} height={520} fill="#050816" />
    <ellipse cx={540} cy={1420} rx={620} ry={60} fill="#2a6bff" opacity={0.18} />
  </g>
);
const Desk: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <path d="M-40 1255 L1120 1255 L1080 1700 L0 1700 Z" fill="url(#desk)" stroke="#3a5bd1" strokeWidth={4} />
    <rect x={-40} y={1241} width={1160} height={22} rx={8} fill="url(#deskTop)" />
    <rect x={20} y={1330} width={1040} height={8} rx={4} fill={CYAN} opacity={0.7 + 0.3 * Math.sin(f * 0.15)} />
    {/* mugs / laptops on desk */}
    <g transform="translate(110 1241)"><rect x={-26} y={-40} width={40} height={40} rx={6} fill="#ffffff" /><path d="M14 -32 q16 0 16 14 q0 12 -16 12" stroke="#ffffff" strokeWidth={6} fill="none" /></g>
    <g transform="translate(975 1241)"><path d="M-70 0 L-50 -60 L50 -60 L70 0 Z" fill="#9aa4c0" stroke="#3a4260" strokeWidth={4} /><rect x={-80} y={-4} width={160} height={10} rx={4} fill="#6a7390" /></g>
  </g>
);
// anchors (behind desk). x positions in world.
const AX = { anna: 290, max: 790 };
const Anchors: React.FC<{ f: number; wave?: boolean }> = ({ f, wave }) => {
  const annaMood = f >= F.wait - 2 && f < F.yes ? "surprised" : f >= F.bug - 4 && f < F.s5 ? "neutral" : "happy";
  const maxMood = f >= F.seventeen && f < F.wait ? "surprised" : f >= F.lost2 - 4 && f < F.gemini ? "neutral" : "happy";
  return (
    <g>
      <g transform={`translate(${AX.anna} 1440) scale(1.26)`}><Person d={ANNA} f={f} seed={16} talk={annaTalk(f)} wave={wave ? 1 : 0} mood={annaMood as any} /></g>
      <g transform={`translate(${AX.max} 1440) scale(1.26)`}><Person d={MAX} f={f} seed={17} talk={maxTalk(f)} wave={wave ? 1 : 0} mood={maxMood as any} /></g>
      {/* name plates */}
      {([["ANNA", AX.anna, "anna"], ["UZAIR", AX.max, "max"]] as const).map(([n, x, id]) => (
        <g key={n} transform={`translate(${x} 1296)`}>
          <rect x={-85} y={-22} width={170} height={40} rx={8} fill="#0b1233" stroke={speaking(f, id, SPK) ? YEL : "#3a5bd1"} strokeWidth={4} />
          <text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill="#fff" letterSpacing={4}>{n}</text>
        </g>
      ))}
    </g>
  );
};

// ---------- story graphics (drawn in a 940x640 panel) ----------
const Panel: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; frame?: boolean; f: number }> = ({ x, y, w, h, children, frame = true, f }) => (
  <g>
    {frame && <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={26} fill="#0b1233" stroke={CYAN} strokeWidth={5} opacity={0.95} />}
    <svg x={x} y={y} width={w} height={h} viewBox="0 0 940 640" preserveAspectRatio="xMidYMid meet">
      <rect width={940} height={640} rx={14} fill="#0d1a45" />
      {children}
      {/* scanlines */}
      {[...Array(32)].map((_, i) => <rect key={i} x={0} y={i * 20 + ((f * 0.6) % 20)} width={940} height={2} fill="#ffffff" opacity={0.025} />)}
    </svg>
  </g>
);
const T: React.FC<{ x: number; y: number; s: number; c?: string; children: React.ReactNode; a?: "middle" | "start" | "end"; o?: number; stroke?: boolean }> = ({ x, y, s, c = "#fff", children, a = "middle", o = 1, stroke }) => (
  <text x={x} y={y} textAnchor={a} fontFamily={FONT} fontWeight={800} fontSize={s} fill={c} opacity={o} stroke={stroke ? INKC : undefined} strokeWidth={stroke ? s * 0.12 : undefined} paintOrder="stroke">{children}</text>
);
const IdleLogo: React.FC<{ f: number }> = ({ f }) => (
  <g opacity={ramp(f, 36, 50) || (f > 100 ? 1 : 0)}>
    <circle cx={470} cy={280} r={120 + 6 * Math.sin(f * 0.08)} fill="none" stroke={CYAN} strokeWidth={6} opacity={0.6} />
    <circle cx={470} cy={280} r={160 + 8 * Math.sin(f * 0.08 + 1)} fill="none" stroke={CYAN} strokeWidth={3} opacity={0.3} />
    <T x={470} y={300} s={86} c="#fff">AI NEWS</T>
    <T x={470} y={500} s={44} c={YEL}>NOV 3, 2026</T>
    <T x={470} y={560} s={30} c="#9fb4ff">EVERYTHING THAT HAPPENED TODAY</T>
  </g>
);
// G1: Anthropic quarter bars (after "Wait... seventeen billion?")
const G1Anthropic: React.FC<{ f: number }> = ({ f }) => {
  const g2 = eout(ramp(f, F.yes - 4, F.yes + 14));
  const g3 = eout(ramp(f, F.up - 4, F.half + 14));
  const base = 470, H = 270 / 17;
  return (
    <g>
      <T x={470} y={66} s={40}>ANTHROPIC · REVENUE PER QUARTER</T>
      {f < F.yes && (
        <g opacity={1 - ramp(f, F.yes - 8, F.yes)}>
          <rect x={20} y={100} width={900} height={520} rx={14} fill="#0d1a45" />
          <T x={470} y={360} s={220} c={GREEN} stroke>$17B</T>
          <T x={470} y={450} s={44} c="#fff">REVENUE · JUL–SEP 2026</T>
        </g>
      )}
      <line x1={90} y1={base} x2={560} y2={base} stroke="#3a5bd1" strokeWidth={4} />
      {/* Q2 */}
      <rect x={130} y={base - 11.56 * H * g2} width={150} height={11.56 * H * g2} rx={10} fill="#5a7aff" />
      <T x={205} y={base - 11.56 * H * g2 - 16} s={34} c="#c9d6ff" o={g2}>$11.6B</T>
      <T x={205} y={base + 44} s={30} c="#9fb4ff" o={g2}>Q2</T>
      {/* Q3 */}
      <rect x={370} y={base - 16.96 * H * g3} width={150} height={16.96 * H * g3} rx={10} fill={GREEN} />
      <T x={445} y={base - 16.96 * H * g3 - 16} s={40} c={GREEN} o={g3}>$17B</T>
      <T x={445} y={base + 44} s={30} c="#9fb4ff" o={g2}>Q3</T>
      {f >= F.half - 2 && <g transform={`translate(445 126) scale(${pop(f, F.half - 2, 10)})`}><rect x={-80} y={-30} width={160} height={52} rx={26} fill={YEL} /><T x={0} y={8} s={30} c={INKC}>+47%</T></g>}
      {/* loss card */}
      {f >= F.lost - 4 && (
        <g transform={`translate(745 240) scale(${pop(f, F.lost - 4, 12)})`}>
          <rect x={-150} y={-110} width={300} height={220} rx={22} fill="#2a0e14" stroke={RED} strokeWidth={5} />
          <T x={0} y={-60} s={26} c="#ffb3bd">NET LOSS Q3</T>
          <T x={0} y={10} s={60} c={RED}>-$23.3B</T>
          <T x={0} y={62} s={22} c="#ffd6dc" o={ramp(f, F.accounting - 4, F.accounting + 8)}>MOSTLY NON-CASH</T>
          <T x={0} y={90} s={22} c="#ffd6dc" o={ramp(f, F.accounting - 4, F.accounting + 8)}>ACCOUNTING CHARGES</T>
        </g>
      )}
      {f >= F.ipo - 4 && <Stamp f={f} at={F.ipo - 4} x={745} y={500} text="IPO FILING" hue={YEL} fs={44} rot={-6} />}
      <T x={470} y={600} s={22} c="#9fb4ff" o={ramp(f, F.ipo, F.ipo + 10)}>SOURCE: AMENDED S-1, NOV 2, 2026</T>
    </g>
  );
};
// a chip icon
const ChipIcon: React.FC<{ x: number; y: number; c: string; label: string; o?: number }> = ({ x, y, c, label, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    {[...Array(5)].map((_, i) => <g key={i}><rect x={-80 + i * 36} y={-112} width={16} height={22} fill={c} /><rect x={-80 + i * 36} y={90} width={16} height={22} fill={c} /><rect x={-112} y={-80 + i * 36} width={22} height={16} fill={c} /><rect x={90} y={-80 + i * 36} width={22} height={16} fill={c} /></g>)}
    <rect x={-92} y={-92} width={184} height={184} rx={18} fill="#0a1230" stroke={c} strokeWidth={6} />
    <T x={0} y={14} s={32} c={c}>{label}</T>
  </g>
);
const G2Marvell: React.FC<{ f: number }> = ({ f }) => {
  const m = eio(ramp(f, F.one15 - 10, F.one15 + 16));
  const n = countUp(f, F.one15 - 6, F.one15 + 10, 115);
  return (
    <g>
      <T x={470} y={66} s={40}>THE AI DATA-CENTER DEAL</T>
      <ChipIcon x={lerp(230, 360, m)} y={250} c={CYAN} label="MARVELL" o={ramp(f, F.marvell - 8, F.marvell + 4)} />
      <g opacity={ramp(f, F.laser - 6, F.laser + 6)} transform={`translate(${lerp(710, 580, m)} 250)`}>
        <rect x={-92} y={-92} width={184} height={184} rx={18} fill="#0a1230" stroke={PURP} strokeWidth={6} />
        <circle cx={-50} cy={-20} r={16} fill={RED} />
        <line x1={-34} y1={-20} x2={70} y2={-20} stroke={RED} strokeWidth={6} opacity={0.5 + 0.5 * Math.sin(f * 0.4)} />
        <T x={0} y={50} s={26} c={PURP}>LUMENTUM</T>
      </g>
      <T x={470} y={262} s={64} c={YEL} o={ramp(f, F.buying - 4, F.buying + 6)}>+</T>
      {f >= F.one15 - 4 && (
        <g transform={`translate(470 470) scale(${pop(f, F.one15 - 4, 12)})`}>
          <rect x={-230} y={-66} width={460} height={124} rx={22} fill={YEL} />
          <T x={0} y={26} s={80} c={INKC}>${n}B</T>
        </g>
      )}
      {f >= F.stock - 4 && <Chip x={470} y={575} w={300} label="ALL STOCK" hue={CYAN} p={pop(f, F.stock - 4, 10)} fs={30} dark />}
      {f >= F.biggest - 4 && (
        <g transform={`translate(470 128) scale(${pop(f, F.biggest - 4, 10)})`}>
          <rect x={-380} y={-30} width={760} height={56} rx={14} fill={RED} />
          <T x={0} y={10} s={28}>BIGGEST MERGER OF 2 PUBLIC TECH COMPANIES</T>
        </g>
      )}
    </g>
  );
};
const G3China: React.FC<{ f: number }> = ({ f }) => {
  const steps = [["BUILD", F.building], ["TEST", F.building + 10], ["LAUNCH", F.launching]] as const;
  return (
    <g>
      <T x={470} y={66} s={40}>CHINA · AI SAFETY RULES</T>
      <T x={470} y={108} s={24} c="#9fb4ff" o={ramp(f, F.china, F.china + 8)}>NATIONAL DEVELOPMENT AND REFORM COMMISSION</T>
      {/* shield */}
      <g transform={`translate(470 245) scale(${pop(f, F.safety - 4, 12)})`}>
        <path d="M0 -95 L85 -60 L85 10 Q85 75 0 105 Q-85 75 -85 10 L-85 -60 Z" fill="#2a0e14" stroke={RED} strokeWidth={6} />
        <path d="M-35 5 L-8 32 L40 -22" stroke={YEL} strokeWidth={12} fill="none" strokeLinecap="round" />
      </g>
      <T x={470} y={385} s={30} c="#fff" o={ramp(f, F.whole - 4, F.whole + 8)}>THE WHOLE AI LIFECYCLE</T>
      {steps.map(([t, at], i) => (
        <g key={t} transform={`translate(${200 + i * 270} 455) scale(${pop(f, at - 4, 10)})`}>
          <rect x={-105} y={-34} width={210} height={64} rx={14} fill="#132561" stroke={CYAN} strokeWidth={4} />
          <T x={0} y={11} s={30} c={CYAN}>{t}</T>
          {i < 2 && <T x={135} y={12} s={36} c={YEL}>→</T>}
        </g>
      ))}
      {f >= F.jobs - 6 && (
        <g transform={`translate(470 565) scale(${pop(f, F.jobs - 6, 10)})`}>
          <rect x={-290} y={-36} width={580} height={68} rx={34} fill={YEL} />
          <T x={0} y={11} s={30} c={INKC}>👀 WATCHING AI'S IMPACT ON JOBS</T>
        </g>
      )}
    </g>
  );
};
const G4MCP: React.FC<{ f: number }> = ({ f }) => {
  const cmd = "$ npx @modelcontextprotocol/server-…";
  const n = Math.round(ramp(f, F.coding - 4, F.mcp + 10) * cmd.length);
  const dl = countUp(f, F.seventeenM - 6, F.seventeenM + 8, 173) / 10;
  return (
    <g>
      <rect width={940} height={640} fill="#1a0a06" />
      <rect x={60} y={40} width={820} height={210} rx={20} fill="#05070f" stroke="#5a2a1a" strokeWidth={4} />
      {[0, 1, 2].map((i) => <circle key={i} cx={100 + i * 34} cy={74} r={11} fill={[RED, YEL, GREEN][i]} />)}
      <T x={470} y={82} s={22} c="#aa7a6a">AI coding agent · terminal</T>
      <text x={90} y={150} fontFamily="monospace" fontWeight={700} fontSize={32} fill="#ffd6c9">{cmd.slice(0, n)}</text>
      <text x={90} y={210} fontFamily="monospace" fontWeight={700} fontSize={26} fill={ORANGE} opacity={ramp(f, F.memory - 4, F.memory + 6)}>picked from training memory…</text>
      {f >= F.abandoned - 2 && <Stamp f={f} at={F.abandoned - 2} x={735} y={208} text="ARCHIVED" hue={RED} fs={34} rot={-6} />}
      {f >= F.seventeenM - 4 && (
        <g transform={`translate(260 400) scale(${pop(f, F.seventeenM - 4, 12)})`}>
          <rect x={-200} y={-80} width={400} height={160} rx={22} fill="#2a1410" stroke={ORANGE} strokeWidth={5} />
          <T x={0} y={8} s={68} c={ORANGE}>{dl.toFixed(1)}M+</T>
          <T x={0} y={56} s={26} c="#ffd6c9">NPM DOWNLOADS</T>
        </g>
      )}
      {f >= F.bug - 4 && (
        <g transform={`translate(680 400) scale(${pop(f, F.bug - 4, 12)})`}>
          <rect x={-190} y={-80} width={380} height={160} rx={22} fill="#2a0e14" stroke={RED} strokeWidth={5} />
          <T x={0} y={-22} s={30} c="#ffb3bd">PUPPETEER SERVER</T>
          <T x={0} y={30} s={40} c={RED}>RUNS ATTACKER</T>
          <T x={0} y={64} s={26} c="#ffb3bd">COMMANDS</T>
        </g>
      )}
      <T x={470} y={560} s={30} c="#fff" o={ramp(f, F.commands, F.commands + 8)}>FIX: USE EACH SERVICE'S OFFICIAL SERVER</T>
      <T x={470} y={600} s={20} c="#aa7a6a" o={ramp(f, F.researchers, F.researchers + 8)}>"MCPHANTOM" · GLOW SECURITY · VIA HELP NET SECURITY</T>
    </g>
  );
};
const G5Antigravity: React.FC<{ f: number }> = ({ f }) => {
  const cut = ramp(f, F.lost2, F.lost2 + 10);
  return (
    <g>
      <T x={470} y={66} s={40}>GOOGLE ANTIGRAVITY</T>
      <T x={470} y={106} s={24} c="#9fb4ff">AI CODING APP · FROM NOV 2</T>
      {/* free plan card */}
      <g transform="translate(250 360)" opacity={ramp(f, F.free - 6, F.free + 4)}>
        <rect x={-190} y={-200} width={380} height={400} rx={24} fill="#0a1230" stroke="#9fb4ff" strokeWidth={5} />
        <T x={0} y={-150} s={38} c="#fff">FREE PLAN</T>
        <rect x={-150} y={-100} width={300} height={70} rx={14} fill="#3a1a10" opacity={1 - cut * 0.5} />
        <T x={0} y={-53} s={30} c={ORANGE} o={1 - cut * 0.5}>CLAUDE 4.6</T>
        <line x1={-160} y1={-65} x2={lerp(-160, 160, cut)} y2={-65} stroke={RED} strokeWidth={8} />
        {f >= F.gemini - 4 && (
          <g transform={`translate(0 40) scale(${pop(f, F.gemini - 4, 10)})`}>
            <rect x={-150} y={-36} width={300} height={72} rx={14} fill="#10304a" stroke={CYAN} strokeWidth={4} />
            <T x={0} y={11} s={30} c={CYAN}>GEMINI 3.8 FLASH</T>
          </g>
        )}
        <T x={0} y={140} s={34} c={YEL} o={ramp(f, F.only - 4, F.only + 6)}>ONLY</T>
      </g>
      {/* paid plan card */}
      <g transform="translate(690 360)" opacity={ramp(f, F.only + 8, F.only + 18)}>
        <rect x={-190} y={-200} width={380} height={400} rx={24} fill="#0a1230" stroke={GREEN} strokeWidth={5} />
        <T x={0} y={-150} s={34} c={GREEN}>PAID PLANS</T>
        <T x={0} y={-112} s={22} c="#c9f5dd">PRO · ULTRA</T>
        {f >= F.paid - 6 && (
          <g transform={`translate(0 0) scale(${pop(f, F.paid - 6, 10)})`}>
            <rect x={-150} y={-46} width={300} height={92} rx={14} fill="#14402a" stroke={GREEN} strokeWidth={4} />
            <T x={0} y={-6} s={30} c={GREEN}>CLAUDE 5.5</T>
            <T x={0} y={30} s={26} c="#c9f5dd">STAYS ✓</T>
          </g>
        )}
      </g>
    </g>
  );
};
const G6Tools: React.FC<{ f: number }> = ({ f }) => {
  const second = f >= F.clayzo - 6;
  const sw = eio(ramp(f, F.clayzo - 8, F.clayzo + 8));
  return (
    <g>
      {/* Beacon */}
      <g opacity={1 - sw} transform={`translate(${-300 * sw} 0)`}>
        <T x={470} y={66} s={44}>BEACON</T>
        <T x={470} y={106} s={24} c="#9fb4ff">OPEN-SOURCE MEMORY FOR CODING AGENTS</T>
        <g transform="translate(470 300)">
          {(["CLAUDE CODE", "CURSOR", "CODEX"] as const).map((t, i) => {
            const a = -Math.PI / 2 + (i - 1) * 1.15 + Math.PI;
            const x = Math.cos(a) * 270, y = Math.sin(a) * 150 - 40;
            const p = ramp(f, F.beacon + 10 + i * 8, F.beacon + 22 + i * 8);
            return (
              <g key={t} opacity={p}>
                <line x1={0} y1={0} x2={x} y2={y} stroke={YEL} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-f * 2} opacity={ramp(f, F.shared - 4, F.shared + 6)} />
                <g transform={`translate(${x} ${y})`}><rect x={-120} y={-30} width={240} height={60} rx={14} fill="#132561" stroke={CYAN} strokeWidth={4} /><T x={0} y={10} s={26} c={CYAN}>{t}</T></g>
              </g>
            );
          })}
          <circle r={70 + 4 * Math.sin(f * 0.1)} fill="#2a2a0a" stroke={YEL} strokeWidth={6} opacity={ramp(f, F.beacon - 6, F.beacon + 6)} />
          <T x={0} y={10} s={26} c={YEL} o={ramp(f, F.beacon - 6, F.beacon + 6)}>MEMORY</T>
        </g>
        {f >= F.topped - 4 && (
          <g transform={`translate(470 545) scale(${pop(f, F.topped - 4, 12)})`}>
            <rect x={-260} y={-50} width={520} height={100} rx={20} fill="#da552f" />
            <T x={0} y={16} s={44}>#1 ON PRODUCT HUNT</T>
          </g>
        )}
      </g>
      {/* Clayzo */}
      {second && (
        <g opacity={sw} transform={`translate(${300 * (1 - sw)} 0)`}>
          <T x={470} y={66} s={44}>CLAYZO</T>
          <T x={470} y={106} s={24} c="#9fb4ff">MOTION GRAPHICS · CLAUDE CODE · CODEX · CURSOR</T>
          <g transform="translate(470 330)" opacity={ramp(f, F.animations - 10, F.animations + 4) * 0.8 + 0.2}>
            <rect x={-300} y={-150} width={600} height={300} rx={20} fill="#05070f" stroke="#3a5bd1" strokeWidth={4} />
            <circle cx={-170 + 60 * Math.sin(f * 0.09)} cy={-20 + 40 * Math.cos(f * 0.12)} r={46} fill={PURP} />
            <rect x={-20 + 50 * Math.sin(f * 0.07 + 1)} y={-60} width={90} height={90} rx={16} fill={CYAN} transform={`rotate(${f * 3} ${25 + 50 * Math.sin(f * 0.07 + 1)} -15)`} />
            <path d={`M150 ${40 + 30 * Math.sin(f * 0.1)} l50 -90 l50 90 z`} fill={ORANGE} />
            <rect x={-280} y={118} width={560 * ((f % 90) / 90)} height={8} rx={4} fill={YEL} />
          </g>
          {f >= F.free2 - 2 && <Stamp f={f} at={F.free2 - 2} x={470} y={560} text="FREE" hue={GREEN} fs={64} rot={-6} />}
        </g>
      )}
    </g>
  );
};
const G7Comments: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <T x={470} y={110} s={44}>$17B IN 3 MONTHS…</T>
    <T x={470} y={175} s={52} c={YEL}>IS AI A BUBBLE?</T>
    {([["BUBBLE", RED, 280, F.bubble], ["REAL DEAL", GREEN, 660, F.real]] as const).map(([t, c, x, at]) => (
      <g key={t} transform={`translate(${x} 360) scale(${pop(f, at - 6, 10)})`}>
        <rect x={-165} y={-70} width={330} height={140} rx={28} fill="#132561" stroke={c} strokeWidth={6} />
        <T x={0} y={20} s={52} c={c}>{t}</T>
      </g>
    ))}
    {f >= F.comments - 4 && (
      <g transform={`translate(470 560) scale(${pop(f, F.comments - 4, 10)})`}>
        <rect x={-230} y={-40} width={460} height={70} rx={35} fill="#fff" />
        <T x={0} y={10} s={32} c="#111">💬 TELL US BELOW</T>
      </g>
    )}
  </g>
);
const graphicAt = (f: number) => {
  if (f < F.seventeen) return <IdleLogo f={f} />;
  if (f < F.s2) return <G1Anthropic f={f} />;
  if (f < F.s3) return <G2Marvell f={f} />;
  if (f < F.s4) return <G3China f={f} />;
  if (f < F.s5) return <G4MCP f={f} />;
  if (f < F.s6) return <G5Antigravity f={f} />;
  if (f < F.would) return <G6Tools f={f} />;
  if (f < F.sub) return <G7Comments f={f} />;
  return <g><circle cx={470} cy={320} r={150 + 8 * Math.sin(f * 0.08)} fill="none" stroke={CYAN} strokeWidth={5} opacity={0.4} /></g>;
};

// full studio scene (wide): set + monitor graphic + anchors + desk
const StudioScene: React.FC<{ f: number; wave?: boolean }> = ({ f, wave }) => (
  <g>
    <Studio f={f} />
    <Panel x={MON.x} y={MON.y} w={MON.w} h={MON.h} f={f}>{graphicAt(f)}</Panel>
    <Anchors f={f} wave={wave} />
    <Desk f={f} />
  </g>
);
// ---------- screen-fixed broadcast chrome ----------
const Chrome: React.FC<{ f: number }> = ({ f }) => {
  const st = [...STORIES].reverse().find((s) => f >= s.at - 2);
  const showLT = st && f < F.would - 4;
  const ltp = st ? eout(ramp(f, st.at - 2, st.at + 10)) : 0;
  const tickX = -((f * 4.2) % 5200);
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0 }}>
      {/* LIVE bug + logo + clock */}
      <g transform="translate(46 70)">
        <rect x={0} y={0} width={150} height={56} rx={10} fill={RED} />
        <circle cx={30} cy={28} r={10} fill="#fff" opacity={0.5 + 0.5 * Math.sin(f * 0.25)} />
        <text x={92} y={39} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#fff" letterSpacing={3}>LIVE</text>
        <rect x={160} y={0} width={190} height={56} rx={10} fill="rgba(10,18,48,0.85)" stroke={CYAN} strokeWidth={3} />
        <text x={255} y={38} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#fff" letterSpacing={3}>AI NEWS</text>
      </g>
      <g transform="translate(1034 70)">
        <rect x={-220} y={0} width={220} height={56} rx={10} fill="rgba(10,18,48,0.85)" stroke="#3a5bd1" strokeWidth={3} />
        <text x={-110} y={38} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#fff" letterSpacing={2}>NOV 3 · 2026</text>
      </g>
      {/* lower third */}
      {showLT && st && (
        <g transform={`translate(${lerp(-900, 0, ltp)} 0)`}>
          <rect x={30} y={1480} width={1020} height={100} rx={14} fill="rgba(8,14,40,0.94)" stroke={st.tagC} strokeWidth={4} />
          <rect x={30} y={1480} width={120} height={100} rx={14} fill={st.tagC} />
          <text x={90} y={1546} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={st.tagC === YEL ? INKC : "#fff"}>{st.n}/7</text>
          <text x={172} y={1517} fontFamily={FONT} fontWeight={800} fontSize={24} fill={st.tagC} letterSpacing={4}>{st.tag}</text>
          <text x={172} y={1558} fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff">{st.title}</text>
          {/* progress */}
          {STORIES.map((s, i) => <rect key={i} x={172 + i * 120} y={1588} width={110} height={8} rx={4} fill={i < st.n ? st.tagC : "#2a3a6a"} />)}
        </g>
      )}
      {/* ticker */}
      <g>
        <rect x={0} y={1838} width={VW} height={62} fill="#ffffff" />
        <clipPath id="tk"><rect x={210} y={1838} width={VW - 210} height={62} /></clipPath>
        <g clipPath="url(#tk)">
          {[0, 1].map((k) => <text key={k} x={210 + tickX + k * 5200} y={1880} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#111" textLength={5100} lengthAdjust="spacing">{TICKER}</text>)}
        </g>
        <rect x={0} y={1838} width={210} height={62} fill={RED} />
        <text x={105} y={1880} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#fff" letterSpacing={2}>HEADLINES</text>
      </g>
    </svg>
  );
};

// BREAKING full-screen: $17B in 3 months
const Breaking: React.FC<{ f: number }> = ({ f }) => {
  const n = countUp(f, F.seventeen - 6, F.seventeen + 8, 17);
  return (
    <g>
      <rect width={VW} height={VH} fill="#04140c" />
      {[...Array(12)].map((_, i) => <rect key={i} x={0} y={i * 170 + ((f * 6) % 170) - 170} width={VW} height={70} fill={GREEN} opacity={0.05} />)}
      <g transform={`translate(0 ${420}) skewY(-4)`}>
        <rect x={-20} y={-90} width={VW + 40} height={150} fill={RED} />
        <T x={540} y={20} s={92} c="#fff">BREAKING NEWS</T>
      </g>
      <T x={540} y={660} s={64} c="#fff">ANTHROPIC OPENS ITS BOOKS</T>
      <g transform={`translate(540 900) scale(${pop(f, F.seventeen - 2, 12)})`}>
        <T x={0} y={0} s={240} c={GREEN} stroke>${n}B</T>
      </g>
      <T x={540} y={1010} s={56} c="#c9f5dd" o={ramp(f, F.dollars + 10, F.dollars + 22)}>REVENUE</T>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${330 + i * 210} 1230) scale(${pop(f, F.three - 4 + i * 4, 10)})`}>
          <rect x={-85} y={-80} width={170} height={160} rx={18} fill="#0f2a1c" stroke={GREEN} strokeWidth={5} />
          <rect x={-85} y={-80} width={170} height={44} rx={18} fill={GREEN} />
          <T x={0} y={50} s={52} c="#fff">{["JUL", "AUG", "SEP"][i]}</T>
        </g>
      ))}
      {f >= F.months - 4 && (
        <g transform={`translate(540 1430) scale(${pop(f, F.months - 4, 12)})`}>
          <rect x={-330} y={-60} width={660} height={110} rx={24} fill={YEL} />
          <T x={0} y={18} s={60} c={INKC}>IN JUST 3 MONTHS</T>
        </g>
      )}
    </g>
  );
};

// ---------- outro ----------
const OutroCard: React.FC<{ f: number }> = ({ f }) => {
  const at = F.sub;
  const bp = pop(f, at + 2, 12);
  const click = at + 30;
  const cx = lerp(900, 640, eio(ramp(f, at + 10, at + 28)));
  const cy = lerp(900, 470, eio(ramp(f, at + 10, at + 28)));
  return (
    <g>
      <g transform={`translate(540 430) scale(${bp})`}>
        <rect x={-290} y={-82} width={580} height={164} rx={82} fill={f >= click ? "#3a3a44" : "#e62117"} />
        <text y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={60} fill="#fff" letterSpacing={3}>{f >= click ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</text>
      </g>
      {f >= at + 10 && <Cursor x={cx} y={cy} f={f} clickAt={click} />}
      <g opacity={eout(ramp(f, click + 4, click + 16))}>
        <rect x={190} y={560} width={700} height={90} rx={20} fill="rgba(10,18,48,0.9)" stroke={YEL} strokeWidth={4} />
        <text x={540} y={620} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={YEL} letterSpacing={3}>SAME TIME TOMORROW</text>
      </g>
    </g>
  );
};


// ---------- the film ----------
export const NewsFilm: React.FC = () => {
  const f = useCurrentFrame();
  const MONC = { x: 540, y: 530 };
  const annaCU = { x: AX.anna, y: 1060, z: 1.6 };
  const maxCU = { x: AX.max, y: 1060, z: 1.6 };
  const wide = { x: 540, y: 960, z: 1.0 };
  const SHOTS: Shot[] = [
    { from: 0, to: F.max - 4, render: () => <StudioScene f={f} />, cam: [[0, { ...wide, z: 1.12, y: 1000 }], [F.max - 4, { ...wide, z: 1.04 }]] },
    { from: F.max - 4, to: F.seventeen - 6, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.max - 4, maxCU], [F.seventeen - 6, { ...maxCU, z: 1.75 }]] },
    { from: F.seventeen - 6, to: F.wait - 4, tr: "flash", render: () => <Breaking f={f} />, cam: [[F.seventeen - 6, { x: 540, y: 960, z: 1.06 }], [F.wait - 4, { x: 540, y: 980, z: 1.0 }]] },
    { from: F.wait - 4, to: F.yes - 6, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.wait - 4, { ...annaCU, z: 1.6 }], [F.yes - 6, { ...annaCU, z: 1.75 }]] },
    { from: F.yes - 6, to: F.s2 - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.yes - 6, { ...MONC, z: 1.12 }], [F.lost, { ...MONC, z: 1.14 }], [F.s2 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s2 - 4, to: F.marvell - 8, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s2 - 4, annaCU], [F.marvell - 8, { ...annaCU, z: 1.75 }]] },
    { from: F.marvell - 8, to: F.s3 - 4, tr: "push", render: () => <StudioScene f={f} />, cam: [[F.marvell - 8, { ...MONC, z: 1.12 }], [F.one15, { ...MONC, z: 1.14 }], [F.s3 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s3 - 4, to: F.safety - 8, tr: "wipe", render: () => <StudioScene f={f} />, cam: [[F.s3 - 4, maxCU], [F.safety - 8, { ...maxCU, z: 1.75 }]] },
    { from: F.safety - 8, to: F.s4 - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.safety - 8, { ...MONC, z: 1.12 }], [F.launching, { ...MONC, z: 1.15 }], [F.s4 - 4, wide]] },
    { from: F.s4 - 4, to: F.researchers - 6, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s4 - 4, annaCU], [F.researchers - 6, { ...annaCU, z: 1.75 }]] },
    { from: F.researchers - 6, to: F.s5 - 4, tr: "iris", render: () => <StudioScene f={f} />, cam: [[F.researchers - 6, { ...MONC, z: 1.12 }], [F.bug, { ...MONC, z: 1.14 }], [F.s5 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s5 - 4, to: F.google - 6, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s5 - 4, maxCU], [F.google - 6, { ...maxCU, z: 1.75 }]] },
    { from: F.google - 6, to: F.s6 - 4, tr: "push", render: () => <StudioScene f={f} />, cam: [[F.google - 6, { ...MONC, z: 1.12 }], [F.gemini, { ...MONC, z: 1.15 }], [F.s6 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s6 - 4, to: F.beacon - 8, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s6 - 4, { ...annaCU, z: 1.7 }], [F.beacon - 8, { ...annaCU, z: 1.75 }]] },
    { from: F.beacon - 8, to: F.would - 4, tr: "push", render: () => <StudioScene f={f} />, cam: [[F.beacon - 8, { ...MONC, z: 1.12 }], [F.topped, { ...MONC, z: 1.15 }], [F.would - 4, { ...MONC, z: 1.12 }]] },
    { from: F.would - 4, to: F.sub - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.would - 4, wide], [F.comments, { ...wide, z: 1.06, y: 900 }], [F.sub - 4, wide]] },
    { from: F.sub - 4, to: TOTAL + 1, tr: "wipe", render: () => <g><StudioScene f={f} wave /><OutroCard f={f} /></g>, cam: [[F.sub - 4, wide], [TOTAL, wide]] },
  ];
  const PUNCH: [number, number][] = [[F.seventeen, 0.12], [F.half, 0.08], [F.one15, 0.1], [F.biggest, 0.08], [F.jobs, 0.06], [F.bug, 0.08], [F.lost2, 0.08], [F.topped, 0.08], [F.free2, 0.08]];
  const SHAKE: [number, number][] = [[F.seventeen, 8]];
  // Uzair (Nov 1): no SFX or minimal — only one soft subscribe click
  const SFX: Cue[] = [[F.sub + 30, "click", 0.35]];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FontStyle />
      <Director f={f} shots={SHOTS} punches={PUNCH} shakes={SHAKE} handheld={2} />
      <Chrome f={f} />
      <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0 }}>
        <Cover f={f} word="$17B" until={40} />
      </svg>
      <Caps f={f} words={WORDS} chunks={CHUNKS} accent={YEL} theme="dark" y={1640} hide={f < 30} />
      <AbsoluteFill style={{ background: "#000", opacity: ramp(f, TOTAL - 16, TOTAL - 2), pointerEvents: "none" }} />
      <Narration slug="news04" total={TOTAL} />
      <Sfx cues={SFX} />
    </AbsoluteFill>
  );
};
