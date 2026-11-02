// Ai News ep03 (Nov 2 2026): two-anchor news desk format (Anna + Max).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, pop, clamp01, lerp, mix, rnd, VW, VH } from "./kit";
import { Narration, Sfx, Cue, Caps, Cover, Chip, BigNum, Stamp, Cursor, FONT, YEL, INKC, Director, Shot, transitionCues, talkFor, speaking, countUp } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues (frames from words.ts) ----------
const F = {
  max: 127, today: 173, agents: 190, raise: 234, researchers: 256, ten: 283, wallet: 309, tiny: 332, limit: 355, nine: 387, raised: 404, own: 429,
  wait: 454, how: 481, they: 512, opened: 520, email: 549, copied: 564, code: 595, only: 613, claude: 646, never: 680,
  s2: 724, december: 765, chatgpt: 784, codex: 807, share: 828, one: 839, plus: 875, business: 902,
  s3: 939, deepseek: 964, coding: 1005, watches: 1036, github: 1059, pull: 1088, free: 1140, mit: 1169,
  s4: 1212, critical: 1263, prefab: 1294, take: 1352, servers: 1371, update: 1398, v021: 1427,
  s5: 1483, aramco: 1538, owns: 1558, fortynine: 1568, humain: 1628, two6: 1684, billion: 1709,
  s6: 1759, cheap: 1776, mischief: 1844, fivesec: 1871, under: 1904, cents: 1923,
  would: 1952, money: 2004, comments: 2044, sub: 2076, tomorrow: 2134,
};
const NAVY = "#0a1230", NAVY2 = "#122051", RED = "#e8283a", CYAN = "#33d6ff", GREEN = "#2fd67b", PURP = "#8b5cff", ORANGE = "#ff8a2a";
const ANNA = { ...CAST[16], name: "Anna", prop: "none" as const };
const MAX = { ...CAST[17], name: "Uzair", prop: "none" as const };
const annaTalk = (f: number) => talkFor(f, "anna", SPK, ENV);
const maxTalk = (f: number) => talkFor(f, "max", SPK, ENV);

// stories (lower third)
const STORIES: { at: number; n: number; tag: string; tagC: string; title: string }[] = [
  { at: F.researchers, n: 1, tag: "AGENTS", tagC: RED, title: "9 OF 10 AI AGENTS RAISED THEIR OWN LIMIT" },
  { at: F.s2, n: 2, tag: "PRICING", tagC: CYAN, title: "CHATGPT + CODEX: ONE SHARED LIMIT" },
  { at: F.s3, n: 3, tag: "OPEN SOURCE", tagC: PURP, title: "DEEPSEEK OPEN-SOURCES A CODING AGENT" },
  { at: F.s4, n: 4, tag: "SECURITY", tagC: ORANGE, title: "PREFAB UI BUG: CVSS 10 — UPDATE NOW" },
  { at: F.s5, n: 5, tag: "MONEY", tagC: GREEN, title: "ARAMCO TAKES 49% OF HUMAIN · $2.6B" },
  { at: F.s6, n: 6, tag: "CHEAP TOOL", tagC: YEL, title: "MISCHIEF: 5-SEC AI VIDEO UNDER 3¢" },
];
const TICKER = "9 OF 10 AI AGENTS RAISED THEIR OWN SPENDING CAP IN A CORNELL TECH / YALE TEST  •  CHATGPT AND CODEX SHARE ONE USAGE LIMIT FROM DECEMBER  •  DEEPSEEK OPEN-SOURCES DSH-SUPERAGENT (MIT)  •  PREFAB UI CVE-2026-120338: UPDATE TO 0.21.0  •  ARAMCO CLOSES 49% STAKE IN HUMAIN  •  MISCHIEF VIDEO MODEL: $0.005 PER SECOND  •  ";

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
  const annaMood = f >= F.wait - 2 && f < F.they ? "surprised" : f >= F.critical && f < F.update ? "neutral" : "happy";
  const maxMood = f >= F.nine && f < F.wait ? "surprised" : "happy";
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
    <T x={470} y={500} s={44} c={YEL}>NOV 2, 2026</T>
    <T x={470} y={560} s={30} c="#9fb4ff">EVERYTHING THAT HAPPENED TODAY</T>
  </g>
);
// small robot head used for the 10 agents
const Bot: React.FC<{ x: number; y: number; c: string; s?: number; o?: number }> = ({ x, y, c, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <line x1={0} y1={-46} x2={0} y2={-30} stroke={c} strokeWidth={5} />
    <circle cx={0} cy={-50} r={7} fill={c} />
    <rect x={-34} y={-30} width={68} height={56} rx={14} fill="#0a1230" stroke={c} strokeWidth={5} />
    <circle cx={-13} cy={-4} r={7} fill={c} /><circle cx={13} cy={-4} r={7} fill={c} />
    <rect x={-12} y={12} width={24} height={5} rx={2} fill={c} />
  </g>
);
// G1: the email + approval code part of the agents story (after "Wait... how?")
const G1Agents: React.FC<{ f: number }> = ({ f }) => {
  const env = ramp(f, F.opened - 6, F.opened + 8);
  const code = "482 913";
  const typed = Math.round(ramp(f, F.copied, F.code + 6) * code.length);
  const claude = f >= F.claude - 4;
  return (
    <g>
      <T x={470} y={66} s={40}>HOW THEY DID IT</T>
      {/* inbox card */}
      <g transform="translate(260 300)" opacity={env}>
        <rect x={-200} y={-170} width={400} height={300} rx={22} fill="#f3f5fb" />
        <rect x={-200} y={-170} width={400} height={56} rx={22} fill="#d8deeb" />
        <T x={0} y={-132} s={26} c="#334">OWNER'S INBOX</T>
        <path d="M-130 -80 L130 -80 L130 60 L-130 60 Z" fill="#fff" stroke="#9aa4c0" strokeWidth={4} />
        <path d="M-130 -80 L0 0 L130 -80" fill="none" stroke="#9aa4c0" strokeWidth={4} />
        <T x={0} y={110} s={24} c="#556">"Your approval code"</T>
      </g>
      {/* code flies to the robot */}
      {f >= F.copied - 4 && (
        <g transform={`translate(${lerp(300, 720, eio(ramp(f, F.copied + 10, F.code + 4)))} ${lerp(330, 250, eio(ramp(f, F.copied + 10, F.code + 4)))}) scale(${lerp(1, 0.2, eio(ramp(f, F.copied + 10, F.code + 4)))})`} opacity={1 - ramp(f, F.code, F.code + 6)}>
          <rect x={-120} y={-36} width={240} height={64} rx={14} fill={YEL} />
          <text x={0} y={10} textAnchor="middle" fontFamily="monospace" fontWeight={800} fontSize={40} fill={INKC}>{code.slice(0, Math.max(1, typed))}</text>
        </g>
      )}
      <Bot x={720} y={250} c={RED} s={2.0} o={ramp(f, F.they - 6, F.they + 6)} />
      {f >= F.code - 2 && <g transform={`translate(720 410) scale(${pop(f, F.code - 2, 10)})`}><rect x={-150} y={-34} width={300} height={60} rx={14} fill={RED} /><T x={0} y={8} s={30}>LIMIT RAISED ↑</T></g>}
      {claude && (
        <g transform={`translate(470 545) scale(${pop(f, F.claude - 4, 12)})`}>
          <rect x={-330} y={-58} width={660} height={110} rx={24} fill="#0f3a26" stroke={GREEN} strokeWidth={5} />
          <Bot x={-260} y={10} c={GREEN} s={0.9} />
          <T x={40} y={0} s={38} c={GREEN}>CLAUDE OPUS 5.5</T>
          <T x={40} y={40} s={28} c="#c9f5dd" o={ramp(f, F.never - 4, F.never + 6)}>NEVER TRIED ✓</T>
        </g>
      )}
    </g>
  );
};
const G2Pool: React.FC<{ f: number }> = ({ f }) => {
  const m = eio(ramp(f, F.share - 6, F.one + 10));
  return (
    <g>
      <T x={470} y={70} s={44}>ONE SHARED LIMIT</T>
      <T x={470} y={112} s={26} c="#9fb4ff" o={ramp(f, F.december - 4, F.december + 8)}>STARTS DECEMBER 2026</T>
      {/* two tanks slide together into one */}
      {([["CHATGPT", CYAN, 240, F.chatgpt], ["CODEX", PURP, 700, F.codex]] as const).map(([n, c, x0, at]) => (
        <g key={n} transform={`translate(${lerp(x0, 470, m)} 360)`} opacity={(1 - m * 0.9) * ramp(f, at - 8, at + 4)}>
          <rect x={-110} y={-150} width={220} height={260} rx={22} fill="#0a1230" stroke={c} strokeWidth={5} />
          <rect x={-96} y={-60} width={192} height={156} rx={14} fill={c} opacity={0.7} />
          <T x={0} y={150} s={34} c={c}>{n}</T>
        </g>
      ))}
      <g transform="translate(470 360)" opacity={m}>
        <rect x={-190} y={-170} width={380} height={300} rx={26} fill="#0a1230" stroke={YEL} strokeWidth={6} />
        <rect x={-172} y={-70} width={344} height={182} rx={16} fill="url(#poolG)" />
        <defs><linearGradient id="poolG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={CYAN} /><stop offset="1" stopColor={PURP} /></linearGradient></defs>
        <T x={0} y={-110} s={34} c={YEL}>1 POOL</T>
        <T x={0} y={30} s={34}>CHATGPT + CODEX</T>
      </g>
      {["PLUS", "PRO", "BUSINESS"].map((p, i) => f >= F.plus + i * 12 - 4 && (
        <Chip key={p} x={250 + i * 220} y={585} w={190} label={p} hue={[GREEN, ORANGE, CYAN][i]} p={pop(f, F.plus + i * 12 - 4, 10)} fs={30} />
      ))}
    </g>
  );
};
const G3DeepSeek: React.FC<{ f: number }> = ({ f }) => {
  const pr = f >= F.pull - 6;
  return (
    <g>
      <T x={470} y={66} s={40}>DEEPSEEK SUPER-AGENT</T>
      {/* repo window */}
      <g transform="translate(320 330)" opacity={ramp(f, F.github - 10, F.github + 4)}>
        <rect x={-250} y={-200} width={500} height={360} rx={18} fill="#0d1117" stroke="#30363d" strokeWidth={4} />
        <T x={-230} y={-160} s={26} c="#c9d1d9" a="start">📁 your-repo</T>
        {[...Array(6)].map((_, i) => <rect key={i} x={-220} y={-120 + i * 42} width={i % 2 ? 300 : 400} height={20} rx={10} fill="#21262d" />)}
      </g>
      {/* watching eye */}
      <g transform="translate(720 240)" opacity={ramp(f, F.watches - 6, F.watches + 6)}>
        <ellipse rx={110} ry={62} fill="#fff" />
        <circle cx={18 * Math.sin(f * 0.07)} r={38} fill={PURP} /><circle cx={18 * Math.sin(f * 0.07)} r={16} fill="#000" />
        <T x={0} y={110} s={26} c="#c9b8ff">WATCHES THE REPO</T>
      </g>
      {pr && (
        <g transform={`translate(610 460) scale(${pop(f, F.pull - 6, 12)})`}>
          <rect x={-260} y={-50} width={520} height={100} rx={18} fill="#132a1c" stroke={GREEN} strokeWidth={5} />
          <T x={0} y={-4} s={30} c={GREEN}>⇡ PULL REQUEST OPENED</T>
          <T x={0} y={34} s={22} c="#c9f5dd">by the agent — no human typed it</T>
        </g>
      )}
      {f >= F.free && <g transform="translate(170 575)"><Stamp f={f} at={F.free} x={0} y={0} text="FREE · MIT" hue={GREEN} fs={52} rot={-6} /></g>}
    </g>
  );
};
const G4Prefab: React.FC<{ f: number }> = ({ f }) => {
  const lines = ["CVE-2026-120338", "CVSS 10.0 / 10  CRITICAL", "AI code → reads & writes server files"];
  return (
    <g>
      <rect width={940} height={640} fill="#1a0a06" />
      <rect x={60} y={50} width={820} height={330} rx={20} fill="#05070f" stroke="#5a2a1a" strokeWidth={4} />
      {[0, 1, 2].map((i) => <circle key={i} cx={100 + i * 34} cy={84} r={11} fill={[RED, YEL, GREEN][i]} />)}
      <T x={470} y={92} s={22} c="#aa7a6a">security alert · Prefab UI</T>
      {lines.map((l, i) => {
        const at = [F.critical - 4, F.prefab, F.take - 6][i];
        const n = Math.round(ramp(f, at, at + 14) * l.length);
        return <text key={i} x={100} y={170 + i * 70} fontFamily="monospace" fontWeight={700} fontSize={i === 2 ? 30 : 38} fill={i === 0 ? ORANGE : i === 1 ? RED : "#ffd6c9"}>{l.slice(0, n)}</text>;
      })}
      {/* server under attack */}
      <g transform="translate(200 520)" opacity={ramp(f, F.servers - 8, F.servers + 4)}>
        {[0, 1, 2].map((i) => <rect key={i} x={-80} y={-70 + i * 46} width={160} height={38} rx={8} fill="#2a1410" stroke={RED} strokeWidth={4} />)}
        {[0, 1, 2].map((i) => <circle key={i} cx={50} cy={-51 + i * 46} r={7} fill={f % 20 < 10 ? RED : "#5a1a1a"} />)}
      </g>
      {f >= F.update - 4 && (
        <g transform={`translate(600 520) scale(${pop(f, F.update - 4, 12)})`}>
          <rect x={-240} y={-56} width={480} height={112} rx={20} fill="#14402a" stroke={GREEN} strokeWidth={5} />
          <T x={0} y={-6} s={30} c="#c9f5dd">UPDATE TO</T>
          <T x={0} y={40} s={46} c={GREEN}>v0.21.0 ✓</T>
        </g>
      )}
    </g>
  );
};
const G5Aramco: React.FC<{ f: number }> = ({ f }) => {
  const p = eio(ramp(f, F.fortynine - 6, F.fortynine + 18));
  const a = p * 0.49 * Math.PI * 2;
  const R = 150, cx = 300, cy = 350;
  const x = cx + R * Math.sin(a), y = cy - R * Math.cos(a);
  return (
    <g>
      <T x={470} y={70} s={44}>HUMAIN · SAUDI AI</T>
      <circle cx={cx} cy={cy} r={R} fill="#1a2a66" />
      {p > 0 && <path d={`M${cx} ${cy} L${cx} ${cy - R} A${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${x} ${y} Z`} fill={GREEN} />}
      <T x={cx} y={cy + 16} s={56} c="#fff" o={ramp(f, F.fortynine, F.fortynine + 10)}>49%</T>
      <g opacity={ramp(f, F.aramco - 6, F.aramco + 6)}>
        <rect x={520} y={200} width={340} height={80} rx={16} fill="#14402a" stroke={GREEN} strokeWidth={4} />
        <T x={690} y={252} s={34} c={GREEN}>ARAMCO 49%</T>
        <rect x={520} y={300} width={340} height={80} rx={16} fill="#1a2a66" stroke="#5a7aff" strokeWidth={4} />
        <T x={690} y={352} s={34} c="#c9d6ff">PIF 51%</T>
      </g>
      {f >= F.two6 - 4 && (
        <g transform={`translate(690 500) scale(${pop(f, F.two6 - 4, 12)})`}>
          <rect x={-170} y={-60} width={340} height={110} rx={20} fill={YEL} />
          <T x={0} y={18} s={64} c={INKC}>$2.6B</T>
        </g>
      )}
      <T x={cx} y={570} s={26} c="#9fb4ff" o={ramp(f, F.humain - 6, F.humain + 6)}>TARGET: 3 GW OF AI DATA CENTERS BY 2030</T>
    </g>
  );
};
const G6Mischief: React.FC<{ f: number }> = ({ f }) => {
  const play = ramp(f, F.fivesec - 6, F.fivesec + 30);
  return (
    <g>
      <T x={470} y={70} s={44}>MISCHIEF · AI VIDEO</T>
      <T x={470} y={112} s={24} c="#9fb4ff">IMAGE → VIDEO · ON FAL & OPENROUTER</T>
      {/* film strip */}
      <g transform="translate(470 300)" opacity={ramp(f, F.mischief - 8, F.mischief + 4)}>
        <rect x={-380} y={-110} width={760} height={220} rx={12} fill="#111" />
        {[...Array(16)].map((_, i) => <g key={i}><rect x={-366 + i * 47} y={-100} width={24} height={16} rx={3} fill="#444" /><rect x={-366 + i * 47} y={84} width={24} height={16} rx={3} fill="#444" /></g>)}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={-350 + i * 142} y={-70} width={128} height={140} rx={8} fill={[CYAN, PURP, ORANGE, GREEN, RED][i]} opacity={play * 5 > i ? 0.95 : 0.25} />
        ))}
        <rect x={-350} y={78} width={700 * play} height={6} fill={YEL} />
        <T x={0} y={150} s={28} c="#fff">5 SECONDS</T>
      </g>
      {f >= F.under - 4 && (
        <g transform={`translate(470 545) scale(${pop(f, F.under - 4, 12)})`}>
          <rect x={-240} y={-56} width={480} height={112} rx={20} fill={YEL} />
          <T x={0} y={-6} s={30} c={INKC}>PER CLIP</T>
          <T x={0} y={42} s={52} c={INKC}>UNDER 3¢</T>
        </g>
      )}
    </g>
  );
};
const G7Comments: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <T x={470} y={110} s={44}>WOULD YOU LET AN AI AGENT</T>
    <T x={470} y={175} s={52} c={YEL}>SPEND YOUR MONEY?</T>
    {([["YES", GREEN, 300], ["NO", RED, 640]] as const).map(([t, c, x], i) => (
      <g key={t} transform={`translate(${x} 360) scale(${pop(f, F.money - 10 + i * 6, 10)})`}>
        <rect x={-130} y={-70} width={260} height={140} rx={28} fill="#132561" stroke={c} strokeWidth={6} />
        <T x={0} y={22} s={64} c={c}>{t}</T>
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
  if (f < F.researchers) return <IdleLogo f={f} />;
  if (f < F.s2) return <G1Agents f={f} />;
  if (f < F.s3) return <G2Pool f={f} />;
  if (f < F.s4) return <G3DeepSeek f={f} />;
  if (f < F.s5) return <G4Prefab f={f} />;
  if (f < F.s6) return <G5Aramco f={f} />;
  if (f < F.would) return <G6Mischief f={f} />;
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
        <text x={-110} y={38} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill="#fff" letterSpacing={2}>NOV 2 · 2026</text>
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

// BREAKING full-screen: 10 agents, 9 turn red as he says "nine of them raised it"
const Breaking: React.FC<{ f: number }> = ({ f }) => {
  const bad = (i: number) => i !== 6 && f >= F.nine + i * 2;
  return (
    <g>
      <rect width={VW} height={VH} fill="#12050a" />
      {[...Array(12)].map((_, i) => <rect key={i} x={0} y={i * 170 + ((f * 6) % 170) - 170} width={VW} height={70} fill={RED} opacity={0.06} />)}
      <g transform={`translate(0 ${420}) skewY(-4)`}>
        <rect x={-20} y={-90} width={VW + 40} height={150} fill={RED} />
        <T x={540} y={20} s={92} c="#fff">BREAKING NEWS</T>
      </g>
      <T x={540} y={660} s={58} c="#fff">10 AI AGENTS · 1 TINY LIMIT</T>
      {/* wallet with limit */}
      <g transform="translate(540 790)" opacity={ramp(f, F.wallet - 6, F.wallet + 6)}>
        <rect x={-210} y={-50} width={420} height={96} rx={20} fill="#2a1420" stroke={YEL} strokeWidth={5} />
        <T x={0} y={16} s={42} c={YEL}>DAILY LIMIT: 1¢</T>
      </g>
      {[...Array(10)].map((_, i) => {
        const x = 170 + (i % 5) * 185, y = 1010 + Math.floor(i / 5) * 190;
        return <Bot key={i} x={x} y={y} c={bad(i) ? RED : i === 6 && f >= F.nine ? GREEN : "#9fb4ff"} s={1.5} o={ramp(f, F.ten + i, F.ten + i + 6)} />;
      })}
      {f >= F.raised - 2 && (
        <g transform={`translate(540 1440) scale(${pop(f, F.raised - 2, 12)})`}>
          <T x={0} y={0} s={150} c={YEL} stroke>9 / 10</T>
          <T x={0} y={80} s={44} c="#ffb3bd">RAISED THEIR OWN LIMIT</T>
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
    { from: F.max - 4, to: F.researchers - 6, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.max - 4, maxCU], [F.researchers - 6, { ...maxCU, z: 1.75 }]] },
    { from: F.researchers - 6, to: F.wait - 4, tr: "flash", render: () => <Breaking f={f} />, cam: [[F.researchers - 6, { x: 540, y: 960, z: 1.06 }], [F.wait - 4, { x: 540, y: 980, z: 1.0 }]] },
    { from: F.wait - 4, to: F.they - 4, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.wait - 4, { ...annaCU, z: 1.6 }], [F.they - 4, { ...annaCU, z: 1.75 }]] },
    { from: F.they - 4, to: F.s2 - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.they - 4, { ...MONC, z: 1.12 }], [F.claude, { ...MONC, z: 1.14 }], [F.s2 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s2 - 4, to: F.december - 4, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s2 - 4, annaCU], [F.december - 4, { ...annaCU, z: 1.75 }]] },
    { from: F.december - 4, to: F.s3 - 4, tr: "push", render: () => <StudioScene f={f} />, cam: [[F.december - 4, { ...MONC, z: 1.12 }], [F.one, { ...MONC, z: 1.14 }], [F.s3 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s3 - 4, to: F.deepseek - 6, tr: "wipe", render: () => <StudioScene f={f} />, cam: [[F.s3 - 4, maxCU], [F.deepseek - 6, { ...maxCU, z: 1.75 }]] },
    { from: F.deepseek - 6, to: F.s4 - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.deepseek - 6, { ...MONC, z: 1.12 }], [F.pull, { ...MONC, z: 1.15 }], [F.s4 - 4, wide]] },
    { from: F.s4 - 4, to: F.critical - 4, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s4 - 4, annaCU], [F.critical - 4, { ...annaCU, z: 1.75 }]] },
    { from: F.critical - 4, to: F.s5 - 4, tr: "iris", render: () => <StudioScene f={f} />, cam: [[F.critical - 4, { ...MONC, z: 1.12 }], [F.update, { ...MONC, z: 1.14 }], [F.s5 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s5 - 4, to: F.aramco - 6, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s5 - 4, maxCU], [F.aramco - 6, { ...maxCU, z: 1.75 }]] },
    { from: F.aramco - 6, to: F.s6 - 4, tr: "push", render: () => <StudioScene f={f} />, cam: [[F.aramco - 6, { ...MONC, z: 1.12 }], [F.two6, { ...MONC, z: 1.15 }], [F.s6 - 4, { ...MONC, z: 1.12 }]] },
    { from: F.s6 - 4, to: F.mischief - 8, tr: "whip", render: () => <StudioScene f={f} />, cam: [[F.s6 - 4, { ...annaCU, z: 1.7 }], [F.mischief - 8, { ...annaCU, z: 1.75 }]] },
    { from: F.mischief - 8, to: F.would - 4, tr: "push", render: () => <StudioScene f={f} />, cam: [[F.mischief - 8, { ...MONC, z: 1.12 }], [F.under, { ...MONC, z: 1.15 }], [F.would - 4, { ...MONC, z: 1.12 }]] },
    { from: F.would - 4, to: F.sub - 4, tr: "zoom", render: () => <StudioScene f={f} />, cam: [[F.would - 4, wide], [F.comments, { ...wide, z: 1.06, y: 900 }], [F.sub - 4, wide]] },
    { from: F.sub - 4, to: TOTAL + 1, tr: "wipe", render: () => <g><StudioScene f={f} wave /><OutroCard f={f} /></g>, cam: [[F.sub - 4, wide], [TOTAL, wide]] },
  ];
  const PUNCH: [number, number][] = [[F.raised, 0.12], [F.claude, 0.08], [F.one, 0.08], [F.pull, 0.08], [F.update, 0.08], [F.two6, 0.1], [F.under, 0.08]];
  const SHAKE: [number, number][] = [[F.raised, 8]];
  // Uzair (Nov 1): no SFX or minimal — only one soft subscribe click
  const SFX: Cue[] = [[F.sub + 30, "click", 0.35]];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FontStyle />
      <Director f={f} shots={SHOTS} punches={PUNCH} shakes={SHAKE} handheld={2} />
      <Chrome f={f} />
      <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0 }}>
        <Cover f={f} word="9 OF 10 AGENTS" sub="AI NEWS TODAY" until={40} />
      </svg>
      <Caps f={f} words={WORDS} chunks={CHUNKS} accent={YEL} theme="dark" y={1640} hide={f < 30} />
      <AbsoluteFill style={{ background: "#000", opacity: ramp(f, TOTAL - 16, TOTAL - 2), pointerEvents: "none" }} />
      <Narration slug="news03" total={TOTAL} />
      <Sfx cues={SFX} />
    </AbsoluteFill>
  );
};
