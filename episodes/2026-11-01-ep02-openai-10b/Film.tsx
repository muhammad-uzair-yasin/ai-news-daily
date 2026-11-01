// Ai News ep02 (Nov 1 2026): two-anchor news desk format (Anna + Max).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, pop, clamp01, lerp, mix, rnd, VW, VH } from "./kit";
import { Narration, Sfx, Cue, Caps, Cover, Chip, BigNum, Stamp, Cursor, FONT, YEL, INKC, Director, Shot, transitionCues, talkFor, speaking, countUp } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues (frames from words.ts) ----------
const F = {
  max: 120, big: 152, openai: 195, ten: 253, billion: 259, wait: 304, ten2: 331, yes: 369, twenty: 415, thirty: 446, stocks: 468,
  s2: 507, apple: 537, qwen: 573, siri: 596, china: 609, testing: 629, nov: 649,
  s3: 690, gpt: 751, biology: 812, only: 848, labs: 868,
  s4: 910, kimi: 954, shutting: 972, december: 1034, switch: 1055, k31: 1073,
  s5: 1102, hackers: 1127, ai5: 1160, rank: 1169, money: 1226,
  scary: 1255, s6: 1285, free: 1296, pres: 1322, turns: 1354, webpage: 1372, slides: 1397,
  which: 1430, shocked: 1445, comments: 1491, sub: 1522, tomorrow: 1576,
};
const NAVY = "#0a1230", NAVY2 = "#122051", RED = "#e8283a", CYAN = "#33d6ff", GREEN = "#2fd67b", PURP = "#8b5cff", ORANGE = "#ff8a2a";
const ANNA = { ...CAST[16], name: "Anna", prop: "none" as const };
const MAX = { ...CAST[17], name: "Max", prop: "none" as const };
const annaTalk = (f: number) => talkFor(f, "anna", SPK, ENV);
const maxTalk = (f: number) => talkFor(f, "max", SPK, ENV);

// stories (lower third)
const STORIES: { at: number; n: number; tag: string; tagC: string; title: string }[] = [
  { at: F.openai, n: 1, tag: "MONEY", tagC: RED, title: "OPENAI CUTS FUNDING GOAL BY $10B" },
  { at: F.s2, n: 2, tag: "BIG TECH", tagC: CYAN, title: "APPLE PICKS QWEN FOR SIRI IN CHINA" },
  { at: F.s3, n: 3, tag: "MODELS", tagC: PURP, title: "GPT-ROSALIND-6: AI FOR BIOLOGY" },
  { at: F.s4, n: 4, tag: "DEV", tagC: GREEN, title: "KIMI K2 SHUTS DOWN IN DECEMBER" },
  { at: F.s5, n: 5, tag: "SECURITY", tagC: ORANGE, title: "MALWARE USES AI TO RANK VICTIMS" },
  { at: F.s6, n: 6, tag: "FREE TOOL", tagC: YEL, title: "PRESENTATIONS AI: WEBPAGE → SLIDES" },
];
const TICKER = "OPENAI CUTS FUNDING GOAL TO $20B  •  APPLE PICKS ALIBABA'S QWEN FOR SIRI IN CHINA  •  GPT-ROSALIND-6 FOR APPROVED LABS  •  KIMI K2 RETIRES IN DECEMBER, MOVE TO K3.1  •  VOLTA MALWARE USES AI TO RANK VICTIMS  •  FREE: PRESENTATIONS AI CHROME EXTENSION  •  ";

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
  const annaMood = f >= F.wait - 2 && f < F.yes ? "surprised" : f >= F.scary - 2 && f < F.s6 ? "surprised" : "happy";
  const maxMood = f >= F.openai && f < F.wait ? "surprised" : f >= F.hackers && f < F.scary ? "neutral" : "happy";
  return (
    <g>
      <g transform={`translate(${AX.anna} 1440) scale(1.26)`}><Person d={ANNA} f={f} seed={16} talk={annaTalk(f)} wave={wave ? 1 : 0} mood={annaMood as any} /></g>
      <g transform={`translate(${AX.max} 1440) scale(1.26)`}><Person d={MAX} f={f} seed={17} talk={maxTalk(f)} wave={wave ? 1 : 0} mood={maxMood as any} /></g>
      {/* name plates */}
      {([["ANNA", AX.anna], ["MAX", AX.max]] as const).map(([n, x]) => (
        <g key={n} transform={`translate(${x} 1296)`}>
          <rect x={-70} y={-22} width={140} height={40} rx={8} fill="#0b1233" stroke={speaking(f, n.toLowerCase(), SPK) ? YEL : "#3a5bd1"} strokeWidth={4} />
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
    <T x={470} y={500} s={44} c={YEL}>NOV 1, 2026</T>
    <T x={470} y={560} s={30} c="#9fb4ff">EVERYTHING THAT HAPPENED TODAY</T>
  </g>
);
const G1Funding: React.FC<{ f: number }> = ({ f }) => {
  const shrink = eio(ramp(f, F.twenty - 6, F.thirty + 10));
  const hB = lerp(360, 240, shrink);
  const chart = ramp(f, F.stocks - 20, F.stocks + 20);
  return (
    <g>
      <T x={470} y={70} s={46} c="#fff">OPENAI FUNDING GOAL</T>
      <g transform="translate(250 560)">
        <rect x={-90} y={-360} width={180} height={360} rx={12} fill="#3a4a80" />
        <T x={0} y={-380} s={52} c="#c9d6ff">$30B</T>
        <T x={0} y={50} s={30} c="#9fb4ff">BEFORE</T>
        {f >= F.twenty && <line x1={-110} y1={-380} x2={110} y2={-330} stroke={RED} strokeWidth={10} strokeLinecap="round" opacity={ramp(f, F.twenty, F.twenty + 8)} />}
      </g>
      <g transform="translate(520 560)">
        <rect x={-90} y={-hB} width={180} height={hB} rx={12} fill={GREEN} />
        <T x={0} y={-hB - 20} s={52} c={GREEN}>{f >= F.twenty ? "$20B" : "$30B"}</T>
        <T x={0} y={50} s={30} c="#9fb4ff">NOW</T>
      </g>
      {f >= F.thirty && <g transform={`translate(520 ${200}) scale(${pop(f, F.thirty, 10)})`}><rect x={-110} y={-44} width={220} height={70} rx={14} fill={RED} /><T x={0} y={8} s={44}>-$10B</T></g>}
      {/* stock chart */}
      <g transform="translate(700 190)" opacity={chart}>
        <rect x={0} y={0} width={200} height={170} rx={12} fill="#0a1230" stroke="#3a5bd1" strokeWidth={3} />
        <polyline points={[0, 1, 2, 3, 4, 5, 6].map((i) => `${20 + i * 27},${40 + i * 14 + (i % 2) * 18 * 0 + Math.sin(i * 1.7) * 10}`).slice(0, Math.max(1, Math.round(chart * 7))).join(" ")} fill="none" stroke={RED} strokeWidth={6} strokeLinejoin="round" />
        <T x={100} y={160} s={24} c={RED}>AI STOCKS ▼</T>
      </g>
      <g transform="translate(800 470)" opacity={ramp(f, F.yes, F.yes + 10)}>
        <rect x={-110} y={-36} width={220} height={60} rx={12} fill="#1a2a66" />
        <T x={0} y={4} s={26} c="#c9d6ff">VALUE $1.25T</T>
      </g>
    </g>
  );
};
const G2Apple: React.FC<{ f: number }> = ({ f }) => {
  const join = eout(ramp(f, F.qwen - 10, F.qwen + 14));
  return (
    <g>
      <T x={470} y={70} s={44}>SIRI IN CHINA</T>
      <g transform={`translate(${lerp(140, 270, join)} 250)`}>
        <rect x={-110} y={-110} width={220} height={220} rx={48} fill="#e9edf5" />
        <T x={0} y={18} s={52} c="#111">APPLE</T>
      </g>
      <T x={470} y={270} s={80} c={YEL} o={join}>×</T>
      <g transform={`translate(${lerp(800, 670, join)} 250)`}>
        <rect x={-110} y={-110} width={220} height={220} rx={48} fill={PURP} />
        <T x={0} y={18} s={60}>QWEN</T>
        <T x={0} y={70} s={22} c="#e8ddff">BY ALIBABA</T>
      </g>
      {/* phone with assistant orb */}
      <g transform="translate(470 470)" opacity={ramp(f, F.siri - 6, F.siri + 6)}>
        <rect x={-70} y={-120} width={140} height={240} rx={24} fill="#111" stroke="#c9d6ff" strokeWidth={5} transform="scale(0.6)" />
        <circle r={26 + 4 * Math.sin(f * 0.25)} fill="url(#orb)" />
        <defs><radialGradient id="orb"><stop offset="0" stopColor="#fff" /><stop offset="0.5" stopColor={CYAN} /><stop offset="1" stopColor={PURP} /></radialGradient></defs>
      </g>
      {f >= F.china && <Chip x={220} y={470} w={200} label="CHINA" hue={RED} p={pop(f, F.china, 10)} fs={34} />}
      {f >= F.nov - 4 && (
        <g transform={`translate(740 480) scale(${pop(f, F.nov - 4, 10)})`}>
          <rect x={-90} y={-80} width={180} height={170} rx={18} fill="#fff" />
          <rect x={-90} y={-80} width={180} height={50} rx={18} fill={RED} />
          <T x={0} y={-43} s={30}>NOV</T>
          <T x={0} y={60} s={84} c="#111">4</T>
          <T x={0} y={130} s={24} c="#9fb4ff">TESTING</T>
        </g>
      )}
    </g>
  );
};
const G3Rosalind: React.FC<{ f: number }> = ({ f }) => {
  const lock = f >= F.only - 4;
  return (
    <g>
      <T x={470} y={70} s={46}>GPT-ROSALIND-6</T>
      <T x={470} y={115} s={26} c="#9fb4ff">OPENAI · AI FOR BIOLOGY</T>
      {[...Array(14)].map((_, i) => {
        const y = 160 + i * 28; const ph = f * 0.12 + i * 0.6;
        const x1 = 470 + Math.sin(ph) * 120, x2 = 470 - Math.sin(ph) * 120;
        return <g key={i} opacity={ramp(f, F.gpt - 10 + i, F.gpt + i)}><line x1={x1} y1={y} x2={x2} y2={y} stroke="#9fb4ff" strokeWidth={4} opacity={0.6} /><circle cx={x1} cy={y} r={10} fill={i % 2 ? CYAN : PURP} /><circle cx={x2} cy={y} r={10} fill={i % 2 ? GREEN : ORANGE} /></g>;
      })}
      {lock && (
        <g transform={`translate(470 400) scale(${pop(f, F.only - 4, 12)})`}>
          <rect x={-250} y={-90} width={500} height={220} rx={28} fill="rgba(10,18,48,0.92)" stroke={YEL} strokeWidth={6} />
          <path d="M-30 -20 v-30 a30 30 0 0 1 60 0 v30" stroke={YEL} strokeWidth={10} fill="none" transform="translate(0 0)" />
          <rect x={-46} y={-22} width={92} height={70} rx={12} fill={YEL} />
          <T x={0} y={100} s={40} c={YEL}>APPROVED LABS ONLY</T>
        </g>
      )}
    </g>
  );
};
const G4Kimi: React.FC<{ f: number }> = ({ f }) => {
  const lines = ["$ model = \"kimi-k2.6\"", "> status: DEPRECATED", "> retire: DECEMBER 2026"];
  return (
    <g>
      <rect x={60} y={50} width={820} height={330} rx={20} fill="#05070f" stroke="#2a3a6a" strokeWidth={4} />
      {[0, 1, 2].map((i) => <circle key={i} cx={100 + i * 34} cy={84} r={11} fill={[RED, YEL, GREEN][i]} />)}
      <T x={470} y={92} s={22} c="#6a7aaa">developer terminal</T>
      {lines.map((l, i) => {
        const at = [F.kimi - 6, F.shutting, F.december - 6][i];
        const n = Math.round(ramp(f, at, at + 14) * l.length);
        return <text key={i} x={100} y={170 + i * 70} fontFamily="monospace" fontWeight={700} fontSize={38} fill={i === 0 ? GREEN : i === 1 ? RED : YEL}>{l.slice(0, n)}{f % 30 < 15 && n < l.length && n > 0 ? "▌" : ""}</text>;
      })}
      {f >= F.switch - 6 && (
        <g transform={`translate(470 510) scale(${pop(f, F.switch - 6, 12)})`}>
          <rect x={-380} y={-70} width={240} height={110} rx={18} fill="#3a2030" />
          <T x={-260} y={5} s={40} c="#ff9aa6">K2 ✗</T>
          <T x={0} y={10} s={70} c={YEL}>→</T>
          <rect x={140} y={-70} width={260} height={110} rx={18} fill="#14402a" stroke={GREEN} strokeWidth={4} />
          <T x={270} y={5} s={40} c={GREEN}>K3.1 ✓</T>
        </g>
      )}
    </g>
  );
};
const G5Hack: React.FC<{ f: number }> = ({ f }) => {
  const cards = [["BANK", "$$$$", 1], ["CRYPTO", "$$$", 2], ["EMAIL", "$$", 3], ["GAMES", "$", 4]] as const;
  const sort = eio(ramp(f, F.rank - 4, F.money + 4));
  return (
    <g>
      <rect width={940} height={640} fill="#1a0610" />
      <T x={470} y={70} s={40} c={RED}>⚠ AI-POWERED MALWARE</T>
      {/* hooded hacker */}
      <g transform="translate(170 440)" opacity={ramp(f, F.hackers - 6, F.hackers + 6)}>
        <path d="M-90 140 Q-100 -20 0 -80 Q100 -20 90 140 Z" fill="#0a0a12" stroke="#33222c" strokeWidth={4} />
        <ellipse cx={0} cy={-6} rx={44} ry={52} fill="#000" />
        <circle cx={-14} cy={-10} r={5} fill={RED} /><circle cx={14} cy={-10} r={5} fill={RED} />
        <rect x={-80} y={70} width={160} height={70} rx={6} fill="#2a2a3a" />
      </g>
      {/* AI chip */}
      <g transform="translate(470 330)" opacity={ramp(f, F.ai5 - 6, F.ai5 + 6)}>
        <rect x={-60} y={-60} width={120} height={120} rx={14} fill="#2b1840" stroke={PURP} strokeWidth={5} />
        {[...Array(5)].map((_, i) => <g key={i}><line x1={-50 + i * 25} y1={-60} x2={-50 + i * 25} y2={-78} stroke={PURP} strokeWidth={5} /><line x1={-50 + i * 25} y1={60} x2={-50 + i * 25} y2={78} stroke={PURP} strokeWidth={5} /></g>)}
        <T x={0} y={14} s={42} c="#e8ddff">AI</T>
      </g>
      {/* data cards fly in, then sort into a ranking */}
      {cards.map(([n, v, r], i) => {
        const p0 = { x: 330 + i * 30, y: 520 + (i % 2) * 20 }, p1 = { x: 760, y: 160 + (r - 1) * 110 };
        const t = sort;
        const x = lerp(p0.x, p1.x, t), y = lerp(p0.y, p1.y, t);
        return (
          <g key={n} transform={`translate(${x} ${y})`} opacity={ramp(f, F.hackers + i * 6, F.hackers + i * 6 + 8)}>
            <rect x={-110} y={-40} width={220} height={80} rx={14} fill="#2a1420" stroke={r === 1 ? YEL : "#6a3a4a"} strokeWidth={4} />
            {t > 0.9 && <T x={-80} y={12} s={30} c={YEL}>#{r}</T>}
            <T x={t > 0.9 ? 10 : 0} y={12} s={30} c="#fff">{n}</T>
            <T x={80} y={12} s={22} c={GREEN} o={t}>{v}</T>
          </g>
        );
      })}
    </g>
  );
};
const G6Free: React.FC<{ f: number }> = ({ f }) => {
  const m = eio(ramp(f, F.turns - 6, F.slides));
  return (
    <g>
      <T x={470} y={70} s={44}>PRESENTATIONS AI</T>
      <T x={470} y={112} s={26} c="#9fb4ff">FREE CHROME EXTENSION</T>
      {/* browser page */}
      <g transform={`translate(${lerp(470, 220, m)} 360) scale(${lerp(1, 0.6, m)})`}>
        <rect x={-260} y={-190} width={520} height={380} rx={18} fill="#fff" />
        <rect x={-260} y={-190} width={520} height={46} rx={18} fill="#d8deeb" />
        {[0, 1, 2].map((i) => <circle key={i} cx={-230 + i * 26} cy={-167} r={8} fill={[RED, YEL, GREEN][i]} />)}
        <rect x={-150} y={-160} width={340} height={22} rx={11} fill="#fff" />
        {[...Array(7)].map((_, i) => <rect key={i} x={-220} y={-110 + i * 40} width={i % 3 === 0 ? 300 : 440} height={18} rx={9} fill={i % 3 === 0 ? "#2a3a6a" : "#c9d0de"} />)}
      </g>
      {/* slides fan out */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${lerp(470, 560 + i * 110, m)} ${lerp(360, 260 + i * 110, m)}) rotate(${lerp(0, -6 + i * 6, m)})`} opacity={m}>
          <rect x={-120} y={-72} width={240} height={144} rx={12} fill={[CYAN, PURP, ORANGE][i]} stroke="#fff" strokeWidth={5} />
          <rect x={-90} y={-46} width={140} height={18} rx={9} fill="#fff" />
          <rect x={-90} y={-12} width={180} height={12} rx={6} fill="#ffffffaa" />
          <rect x={-90} y={12} width={150} height={12} rx={6} fill="#ffffffaa" />
        </g>
      ))}
      {f >= F.free && <g transform="translate(150 560)"><Stamp f={f} at={F.free} x={0} y={0} text="FREE" hue={GREEN} fs={70} rot={-8} /></g>}
    </g>
  );
};
const G7Comments: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <T x={470} y={90} s={50}>WHICH STORY</T>
    <T x={470} y={150} s={50} c={YEL}>SHOCKED YOU?</T>
    {STORIES.map((s, i) => (
      <g key={i} transform={`translate(${170 + (i % 3) * 300} ${270 + Math.floor(i / 3) * 160}) scale(${pop(f, F.which + i * 5, 10)})`}>
        <rect x={-130} y={-56} width={260} height={112} rx={20} fill="#132561" stroke={s.tagC} strokeWidth={5} />
        <T x={-80} y={20} s={56} c={s.tagC}>{s.n}</T>
        <T x={30} y={14} s={26} c="#fff">{s.tag}</T>
      </g>
    ))}
    {f >= F.comments - 4 && (
      <g transform={`translate(470 590) scale(${pop(f, F.comments - 4, 10)})`}>
        <rect x={-230} y={-40} width={460} height={70} rx={35} fill="#fff" />
        <T x={0} y={10} s={32} c="#111">💬 COMMENT 1–6</T>
      </g>
    )}
  </g>
);
const graphicAt = (f: number) => {
  if (f < F.openai) return <IdleLogo f={f} />;
  if (f < F.s2) return <G1Funding f={f} />;
  if (f < F.s3) return <G2Apple f={f} />;
  if (f < F.s4) return <G3Rosalind f={f} />;
  if (f < F.s5) return <G4Kimi f={f} />;
  if (f < F.scary) return <G5Hack f={f} />;
  if (f < F.which) return <G6Free f={f} />;
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
// BREAKING full-screen
const Breaking: React.FC<{ f: number }> = ({ f }) => {
  const n = Math.max(1, countUp(f, F.openai + 10, F.billion + 4, 10));
  return (
    <g>
      <rect width={VW} height={VH} fill="#12050a" />
      {[...Array(12)].map((_, i) => <rect key={i} x={0} y={i * 170 + ((f * 6) % 170) - 170} width={VW} height={70} fill={RED} opacity={0.06} />)}
      <g transform={`translate(0 ${520}) skewY(-4)`}>
        <rect x={-20} y={-90} width={VW + 40} height={150} fill={RED} />
        <T x={540} y={20} s={96} c="#fff">BREAKING NEWS</T>
      </g>
      <T x={540} y={820} s={64} c="#fff">OPENAI CUTS ITS</T>
      <T x={540} y={900} s={64} c="#fff">FUNDING GOAL BY</T>
      <g transform={`translate(540 1110) scale(${1 + 0.06 * Math.sin(clamp01((f - F.billion) / 8) * Math.PI)})`}>
        <T x={0} y={0} s={190} c={YEL} stroke>${n}B</T>
      </g>
      <T x={540} y={1240} s={44} c="#ff9aa6" o={ramp(f, F.billion + 10, F.billion + 20)}>$30B → $20B</T>
    </g>
  );
};

// ---------- screen-fixed broadcast chrome ----------
const Chrome: React.FC<{ f: number }> = ({ f }) => {
  const st = [...STORIES].reverse().find((s) => f >= s.at - 2);
  const showLT = st && f < F.which - 4;
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
        <text x={-110} y={38} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#fff" letterSpacing={2}>NOV 1 · 2026</text>
      </g>
      {/* lower third */}
      {showLT && st && (
        <g transform={`translate(${lerp(-900, 0, ltp)} 0)`}>
          <rect x={30} y={1480} width={1020} height={100} rx={14} fill="rgba(8,14,40,0.94)" stroke={st.tagC} strokeWidth={4} />
          <rect x={30} y={1480} width={120} height={100} rx={14} fill={st.tagC} />
          <text x={90} y={1546} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={st.tagC === YEL ? INKC : "#fff"}>{st.n}/6</text>
          <text x={172} y={1517} fontFamily={FONT} fontWeight={800} fontSize={24} fill={st.tagC} letterSpacing={4}>{st.tag}</text>
          <text x={172} y={1558} fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff">{st.title}</text>
          {/* progress */}
          {STORIES.map((s, i) => <rect key={i} x={172 + i * 140} y={1588} width={130} height={8} rx={4} fill={i < st.n ? st.tagC : "#2a3a6a"} />)}
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
    { from: F.max - 4, to: F.openai - 6, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.max - 4, maxCU], [F.openai - 6, { ...maxCU, z: 1.75 }]] },
    { from: F.openai - 6, to: F.wait - 4, tr: "flash", render: () => <Breaking f={f} />, cam: [[F.openai - 6, { x: 540, y: 960, z: 1.08 }], [F.wait - 4, { x: 540, y: 980, z: 1.0 }]] },
    { from: F.wait - 4, to: F.yes - 2, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.wait - 4, { ...annaCU, z: 1.6 }], [F.yes - 2, { ...annaCU, z: 1.75 }]] },
    { from: F.yes - 2, to: F.s2 - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.yes - 2, wide], [F.twenty - 4, { ...MONC, z: 1.12 }], [F.s2 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s2 - 4, to: F.apple - 4, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s2 - 4, annaCU], [F.apple - 4, { ...annaCU, z: 1.75 }]] },
    { from: F.apple - 4, to: F.s3 - 4, tr: "push", render: () => <StudioScene f={f} />, cam: [[F.apple - 4, { ...MONC, z: 1.12 }], [F.testing, { ...MONC, z: 1.14 }], [F.s3 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s3 - 4, to: F.gpt - 10, tr: "wipe", render: () => <StudioScene f={f} />, cam: [[F.s3 - 4, maxCU], [F.gpt - 10, { ...maxCU, z: 1.75 }]] },
    { from: F.gpt - 10, to: F.s4 - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.gpt - 10, { ...MONC, z: 1.12 }], [F.only, { ...MONC, z: 1.15 }], [F.s4 - 4, wide]] },
    { from: F.s4 - 4, to: F.kimi - 8, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s4 - 4, annaCU], [F.kimi - 8, { ...annaCU, z: 1.75 }]] },
    { from: F.kimi - 8, to: F.s5 - 4, tr: "iris", render: () => <StudioScene f={f} />, cam: [[F.kimi - 8, { ...MONC, z: 1.12 }], [F.switch, { ...MONC, z: 1.14 }], [F.s5 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s5 - 4, to: F.hackers + 10, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s5 - 4, maxCU], [F.hackers + 10, { ...maxCU, z: 1.75 }]] },
    { from: F.hackers + 10, to: F.scary - 4, tr: "flash", render: () => <StudioScene f={f} />, cam: [[F.hackers + 10, { ...MONC, z: 1.12 }], [F.money, { ...MONC, z: 1.16 }], [F.scary - 4, { ...MONC, z: 1.12 }]] },
    { from: F.scary - 4, to: F.pres - 6, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.scary - 4, { ...annaCU, z: 1.7 }], [F.pres - 6, { ...annaCU, z: 1.75 }]] },
    { from: F.pres - 6, to: F.which - 4, tr: "push", render: () => <StudioScene f={f} />, cam: [[F.pres - 6, { ...MONC, z: 1.12 }], [F.slides, { ...MONC, z: 1.15 }], [F.which - 4, { ...MONC, z: 1.12 }]] },
    { from: F.which - 4, to: F.sub - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.which - 4, wide], [F.comments, { ...wide, z: 1.06, y: 900 }], [F.sub - 4, wide]] },
    { from: F.sub - 4, to: TOTAL + 1, tr: "wipe", render: () => <g><StudioScene f={f} wave /><OutroCard f={f} /></g>, cam: [[F.sub - 4, wide], [TOTAL, wide]] },
  ];
  const PUNCH: [number, number][] = [[F.billion, 0.14], [F.ten2, 0.1], [F.thirty, 0.1], [F.qwen, 0.08], [F.only, 0.1], [F.shutting, 0.1], [F.money, 0.1], [F.free, 0.1]];
  const SHAKE: [number, number][] = [[F.billion, 14], [F.shutting, 8], [F.money, 10]];
  const SFX: Cue[] = [
    [0, "boom", 0.35], [F.big - 10, "riser", 0.3], [F.billion, "boom", 0.5], [F.thirty, "impact", 0.4],
    ...STORIES.map((s) => [s.at - 2, "pop", 0.4] as Cue),
    [F.nov - 4, "pop", 0.35], [F.only - 4, "impact", 0.35], [F.kimi - 6, "tick", 0.3], [F.december - 6, "tick", 0.3], [F.switch - 6, "pop", 0.35],
    [F.hackers - 20, "riser_dark", 0.25], [F.money, "impact", 0.4], [F.free, "impact", 0.35], [F.slides, "whoosh", 0.3],
    [F.which, "pop", 0.35], [F.comments - 4, "pop", 0.35], [F.sub + 30, "click", 0.6],
  ];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FontStyle />
      <Director f={f} shots={SHOTS} punches={PUNCH} shakes={SHAKE} handheld={2} />
      <Chrome f={f} />
      <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0 }}>
        <Cover f={f} word="$10 BILLION" sub="AI NEWS TODAY" until={40} />
      </svg>
      <Caps f={f} words={WORDS} chunks={CHUNKS} accent={YEL} theme="dark" y={1640} hide={f < 30} />
      <AbsoluteFill style={{ background: "#000", opacity: ramp(f, TOTAL - 16, TOTAL - 2), pointerEvents: "none" }} />
      <Narration slug="news02" total={TOTAL} />
      <Sfx cues={[...SFX, ...transitionCues(SHOTS)]} />
    </AbsoluteFill>
  );
};
