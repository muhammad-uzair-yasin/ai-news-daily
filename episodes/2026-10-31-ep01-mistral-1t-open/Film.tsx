import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Shots, ShotDef, Figure, Captions, Vignette, FontStyle, ramp, eio, eout, eback, pop, clamp01, lerp, mix, rnd, blinkAt, VW, VH } from "./kit";
import { WORDS, CHUNKS, VOICE_END, TOTAL, ENV } from "./words";

// ---- cue frames (from narration) ----
const F = {
  hook: 17, twoMin: 98, go: 130, first: 152, aiNews: 181,
  mistral: 221, hf: 307, ctx: 355,
  fake: 418, fiveK: 526, update: 625,
  api: 675, canada: 804, country: 913,
  amazon: 1003, dc: 1079,
  token: 1132, block: 1219,
  reddit: 1306, aiMode: 1394,
  sat: 1429, tesla: 1516,
  now2: 1655, pricing: 1677,
  mPrice: 1727, codex: 1902, plans: 2011, window5: 2158,
  finally3: 2231, tools: 2254,
  sfx: 2294, imsg: 2420, meta: 2530, asia: 2628,
  outro: 2653,
};
const BG0 = "#070d1f", BG1 = "#0c1530", RED = "#ff2e4d", CYAN = "#39c2ff", GOLD = "#ffb52e", GREEN = "#2ee37a", PAPER = "#eef2ff", MUT = "#8ea0c9";
const FONT = "InterLocal, Inter, sans-serif";
const GROUND = 1500;

// ================= shared chrome =================
const Studio: React.FC<{ hue?: string; f: number }> = ({ hue = RED, f }) => (
  <g>
    <rect width={VW} height={VH} fill={BG0} />
    <rect width={VW} height={VH} fill={`url(#gradBg)`} />
    {[...Array(7)].map((_, i) => (
      <line key={i} x1={0} y1={260 + i * 200} x2={VW} y2={260 + i * 200} stroke={PAPER} opacity={0.035} strokeWidth={2} />
    ))}
    {[...Array(16)].map((_, i) => (
      <circle key={i} cx={rnd("dx" + i) * VW} cy={rnd("dy" + i) * VH} r={1.4 + rnd("dr" + i) * 2}
        fill={hue} opacity={0.12 + 0.1 * Math.abs(Math.sin(f * 0.04 + i))} />
    ))}
  </g>
);
const Defs: React.FC<{ hue: string }> = ({ hue }) => (
  <defs>
    <radialGradient id="gradBg" cx="50%" cy="34%" r="80%">
      <stop offset="0%" stopColor={BG1} /><stop offset="100%" stopColor={BG0} />
    </radialGradient>
    <linearGradient id="gradHue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={hue} /><stop offset="100%" stopColor={mix(hue, "#ffffff", 0.25)} />
    </linearGradient>
  </defs>
);
const Pool: React.FC<{ x: number; y: number; r?: number; hue?: string; o?: number }> = ({ x, y, r = 430, hue = "#9fb6ff", o = 0.16 }) => (
  <g style={{ mixBlendMode: "screen" }}>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.33} fill={hue} opacity={o} />
    <ellipse cx={x} cy={y - 330} rx={r * 0.8} ry={r * 0.95} fill={hue} opacity={o * 0.4} />
  </g>
);
const Chip: React.FC<{ x: number; y: number; w: number; label: string; hue?: string; p?: number; fs?: number; dark?: boolean }> = ({ x, y, w, label, hue = RED, p = 1, fs = 34, dark }) => (
  <g opacity={clamp01(p)} transform={`translate(${x} ${y}) scale(${0.8 + 0.2 * clamp01(p)})`}>
    <rect x={-w / 2} y={-34} width={w} height={68} rx={34} fill={dark ? "#101a38" : hue} stroke={dark ? hue : "none"} strokeWidth={3} />
    <text x={0} y={13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={fs} fill={dark ? hue : "#fff"} letterSpacing={2}>{label}</text>
  </g>
);
const Header: React.FC<{ f: number }> = ({ f }) => {
  const p = ramp(f, 4, 18);
  return (
    <g opacity={eout(p)}>
      <rect x={0} y={0} width={VW * clamp01(f / TOTAL)} height={10} fill={RED} />
      <g transform={`translate(${lerp(-220, 150, eout(p))} 86)`}>
        <rect x={-120} y={-34} width={240} height={68} rx={14} fill={RED} />
        <text x={0} y={13} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={38} fill="#fff" letterSpacing={3}>AI NEWS</text>
      </g>
      <g transform={`translate(${lerp(VW + 200, VW - 148, eout(p))} 86)`}>
        <rect x={-110} y={-30} width={220} height={60} rx={12} fill="#101a38" stroke={MUT} strokeWidth={2} />
        <text x={0} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={PAPER} letterSpacing={2}>OCT 31</text>
      </g>
    </g>
  );
};
const Counter: React.FC<{ n: string; p: number }> = ({ n, p }) => (
  <g opacity={clamp01(p)} transform={`translate(${VW - 118} 196) scale(${0.85 + 0.15 * clamp01(p)})`}>
    <rect x={-80} y={-28} width={160} height={56} rx={28} fill="#101a38" stroke={RED} strokeWidth={2.5} />
    <text x={0} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={RED} letterSpacing={1}>{n}</text>
  </g>
);
// anchor stick figure (talking)
const Anchor: React.FC<{ f: number; x?: number; y?: number; s?: number; mood?: any; armR?: number; armL?: number; elbowR?: number; look?: [number, number]; facing?: 1 | -1 }> = (p) => (
  <Figure x={p.x ?? 190} y={p.y ?? GROUND + 70} s={p.s ?? 0.78} facing={p.facing ?? 1} coat={RED} mood={p.mood ?? "happy"}
    look={p.look ?? [1, 0]} blink={blinkAt(p.f, 5)} hair="tuft" armR={p.armR ?? 55} armL={p.armL ?? 8} elbowR={p.elbowR ?? 30}
    talk={Math.max(0, ENV[Math.max(0, p.f - 15)] ?? 0)} />
);
// big kinetic number with ghost
const BigNum: React.FC<{ f: number; at: number; text: string; x: number; y: number; hue?: string; fs?: number }> = ({ f, at, text, x, y, hue = RED, fs = 190 }) => {
  const p = pop(f, at, 12);
  if (p <= 0) return null;
  return (
    <g>
      <text x={x + 8} y={y + 8} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={fs} fill={hue} opacity={0.25 * clamp01(p)}>{text}</text>
      <g transform={`translate(${x} ${y}) scale(${p})`}>
        <text x={0} y={0} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={fs} fill="url(#gradHue)" stroke="#fff" strokeWidth={2} paintOrder="stroke">{text}</text>
      </g>
    </g>
  );
};
const Banner: React.FC<{ f: number; at: number; num: string; label: string; hue: string }> = ({ f, at, num, label, hue }) => {
  const w = eio(ramp(f, at, at + 14));
  const settle = pop(f, at + 8, 14);
  return (
    <g>
      <rect x={0} y={VH / 2 - 230} width={VW * w} height={460} fill={hue} opacity={0.96} />
      <rect x={0} y={VH / 2 - 230} width={VW * w} height={8} fill="#fff" opacity={0.7} />
      <rect x={0} y={VH / 2 + 222} width={VW * w} height={8} fill="#fff" opacity={0.7} />
      {w > 0.6 && (
        <g opacity={clamp01(settle)} transform={`translate(${VW / 2} ${VH / 2}) scale(${0.9 + 0.1 * settle})`}>
          <text x={0} y={-66} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#fff" opacity={0.75} letterSpacing={10}>{num}</text>
          <text x={0} y={64} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={96} fill="#fff" letterSpacing={4}>{label}</text>
        </g>
      )}
    </g>
  );
};
// ================= intro / toc =================
const Intro: React.FC<{ f: number }> = ({ f }) => {
  const lp = pop(f, 6, 14);
  const ticker = (f * 6) % (VW + 900);
  return (
    <g>
      <Pool x={VW / 2} y={GROUND + 60} hue="#ff5d75" o={0.14} />
      {/* pulse line */}
      <path d={`M-20 540 H380 L430 470 L490 620 L540 540 H1100`} stroke={RED} strokeWidth={7} fill="none" opacity={0.5} />
      <g opacity={clamp01(lp)} transform={`translate(${VW / 2} 400) scale(${lp})`}>
        <text x={0} y={-40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={150} fill="#fff" letterSpacing={6}>AI NEWS</text>
        <rect x={-260} y={20} width={520} height={78} rx={16} fill={RED} />
        <text x={0} y={74} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#fff" letterSpacing={6}>DAILY · OCT 31</text>
      </g>
      {/* clock chip on "two minutes" */}
      {f >= F.twoMin && (
        <g opacity={pop(f, F.twoMin, 10)} transform={`translate(${VW / 2} 660)`}>
          <circle r={56} fill="#101a38" stroke={GOLD} strokeWidth={5} />
          <line x1={0} y1={0} x2={0} y2={-34} stroke={GOLD} strokeWidth={6} strokeLinecap="round"
            transform={`rotate(${(f - F.twoMin) * 6})`} />
          <line x1={0} y1={0} x2={22} y2={0} stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
          <text x={92} y={14} fontFamily={FONT} fontWeight={800} fontSize={42} fill={GOLD}>2 MIN</text>
        </g>
      )}
      {/* GO flash */}
      {f >= F.go && f < F.first && <rect width={VW} height={VH} fill="#fff" opacity={0.5 * (1 - ramp(f, F.go, F.go + 8))} />}
      {/* anchor behind desk */}
      <Anchor f={f} x={VW / 2} y={GROUND + 40} s={1.02} armR={f >= F.go ? 70 : 40} elbowR={f >= F.go ? 42 : 20} look={[0, 1]} />
      <rect x={VW / 2 - 330} y={GROUND - 160} width={660} height={44} rx={10} fill="#141f42" stroke={PAPER} strokeWidth={3} opacity={0.95} />
      <rect x={VW / 2 - 260} y={GROUND - 116} width={520} height={190} rx={8} fill="#0f1836" stroke={PAPER} strokeWidth={2} />
      {/* bottom ticker */}
      <g opacity={0.8}>
        <rect x={0} y={VH - 170} width={VW} height={64} fill="#101a38" />
        <text x={VW + 450 - ticker} y={VH - 126} fontFamily={FONT} fontWeight={700} fontSize={34} fill={MUT} letterSpacing={2}>
          16 STORIES · MODELS · PRICING · TOOLS · 16 STORIES · MODELS · PRICING · TOOLS
        </text>
      </g>
    </g>
  );
};
const Toc: React.FC<{ f: number }> = ({ f }) => {
  const rows = [
    ["01", "AI NEWS", RED], ["02", "PRICING & FREE", GOLD], ["03", "AI TOOLS", CYAN],
  ] as const;
  return (
    <g>
      <Pool x={VW / 2} y={1000} hue="#5d7dff" o={0.12} />
      <text x={VW / 2} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={PAPER} letterSpacing={4}
        opacity={eout(ramp(f, F.first, F.first + 10))}>TODAY'S RUNDOWN</text>
      {rows.map(([n, label, hue], i) => {
        const at = F.first + 4 + i * 7;
        const p = eout(ramp(f, at, at + 12));
        const hot = i === 0 && f >= F.aiNews;
        const hp = hot ? pop(f, F.aiNews, 10) : 0;
        return (
          <g key={n} opacity={p} transform={`translate(${lerp(-500, 0, p)} 0)`}>
            <rect x={90} y={560 + i * 220} width={VW - 180} height={170} rx={24}
              fill={hot ? hue : "#101a38"} stroke={hue} strokeWidth={hot ? 0 : 3}
              transform={hot ? `translate(${-6 * Math.sin(hp * Math.PI)} 0)` : undefined} />
            <text x={150} y={560 + i * 220 + 105} fontFamily={FONT} fontWeight={900} fontSize={56} fill={hot ? "#fff" : hue} opacity={0.8}>{n}</text>
            <text x={280} y={560 + i * 220 + 105} fontFamily={FONT} fontWeight={900} fontSize={60} fill={hot ? "#fff" : PAPER} letterSpacing={2}>{label}</text>
            {hot && <text x={VW - 160} y={560 + 105} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={44} fill="#fff">▶</text>}
          </g>
        );
      })}
      <Anchor f={f} x={190} y={GROUND + 70} armR={62} elbowR={36} look={[1, -1]} />
    </g>
  );
};
// ================= stories: category 1 =================
const S_Mistral: React.FC<{ f: number }> = ({ f }) => {
  const dl = ramp(f, F.hf, F.hf + 26);
  const bar = eio(ramp(f, F.ctx, F.ctx + 30));
  return (
    <g>
      <Pool x={620} y={980} hue="#ffb0bc" o={0.12} />
      <Chip x={620} y={330} w={520} label="MISTRAL LARGE 4" hue={RED} p={pop(f, F.mistral, 10)} fs={40} />
      <BigNum f={f} at={F.mistral + 8} text="1T" x={620} y={660} fs={300} />
      <text x={620} y={760} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={MUT} letterSpacing={6}
        opacity={pop(f, F.mistral + 14, 10)}>PARAMETERS</text>
      <Chip x={620} y={860} w={300} label="FREE" hue={GREEN} p={pop(f, F.mistral + 26, 10)} fs={40} />
      {/* download into box on "Hugging Face" */}
      {f >= F.hf && (
        <g opacity={eout(ramp(f, F.hf, F.hf + 10))}>
          <rect x={420} y={1150} width={400} height={190} rx={20} fill="#101a38" stroke={GOLD} strokeWidth={4} />
          <text x={620} y={1268} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={GOLD}>🤗 HUB</text>
          {[...Array(3)].map((_, i) => {
            const q = clamp01(dl * 1.6 - i * 0.25); if (q <= 0 || q >= 1) return null;
            return <rect key={i} x={590} y={960 + q * 180} width={60} height={42} rx={8} fill={PAPER} opacity={1 - q * 0.5} />;
          })}
          <path d={`M620 1105 l-30 -40 h18 v-50 h24 v50 h18 z`} fill={GOLD} transform="rotate(180 620 1082)" />
        </g>
      )}
      {/* context bar on "one-million-token" */}
      {f >= F.ctx && (
        <g>
          <rect x={160} y={1420} width={760} height={46} rx={23} fill="#101a38" stroke={CYAN} strokeWidth={3} />
          <rect x={166} y={1426} width={748 * bar} height={34} rx={17} fill={CYAN} />
          <text x={540} y={1395} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={CYAN}>
            {Math.round(bar * 1000000).toLocaleString("en-US")} TOKENS
          </text>
        </g>
      )}
      <Anchor f={f} x={170} y={GROUND + 180} s={0.62} armR={78} elbowR={28} look={[1, -1]} mood="surprised" />
    </g>
  );
};
const S_Backdoor: React.FC<{ f: number }> = ({ f }) => {
  const flip = eio(ramp(f, F.fake + 40, F.fake + 58));
  const alert = f >= F.fake + 58 ? (Math.sin(f * 0.5) + 1) / 2 : 0;
  const cnt = Math.round(eout(ramp(f, F.fiveK, F.fiveK + 30)) * 5000);
  return (
    <g>
      <rect width={VW} height={VH} fill={RED} opacity={alert * 0.07} />
      <Pool x={540} y={900} hue="#ff8396" o={0.1} />
      {/* editor window */}
      <g transform="translate(140 330)">
        <rect width={800} height={560} rx={22} fill="#101a38" stroke={PAPER} strokeWidth={3} />
        <rect width={800} height={64} rx={22} fill="#182452" />
        {[RED, GOLD, GREEN].map((c, i) => <circle key={i} cx={44 + i * 44} cy={32} r={12} fill={c} />)}
        {[...Array(7)].map((_, i) => (
          <rect key={i} x={40} y={100 + i * 62} width={240 + rnd("cl" + i) * 420} height={22} rx={11}
            fill={i === 3 ? RED : MUT} opacity={i === 3 ? 0.9 : 0.35} />
        ))}
      </g>
      {/* extension card flips to bug */}
      <g transform={`translate(760 1120)`}>
        <g transform={`scale(${Math.abs(1 - 2 * flip)} 1)`}>
          {flip < 0.5 ? (
            <g>
              <rect x={-230} y={-120} width={460} height={240} rx={24} fill="#182452" stroke={CYAN} strokeWidth={4} />
              <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={PAPER}>Claude Code</text>
              <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill={MUT}>extension · v2.1.313</text>
              <text x={0} y={86} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill={GREEN}>✔ verified?</text>
            </g>
          ) : (
            <g>
              <rect x={-230} y={-120} width={460} height={240} rx={24} fill="#2a0e18" stroke={RED} strokeWidth={5} />
              <circle cx={0} cy={-18} r={46} fill={RED} />
              <circle cx={-16} cy={-26} r={8} fill="#2a0e18" /><circle cx={16} cy={-26} r={8} fill="#2a0e18" />
              {[...Array(6)].map((_, i) => (
                <line key={i} x1={Math.cos((i / 6) * 6.28) * 46} y1={-18 + Math.sin((i / 6) * 6.28) * 46}
                  x2={Math.cos((i / 6) * 6.28) * 72} y2={-18 + Math.sin((i / 6) * 6.28) * 72} stroke={RED} strokeWidth={6} strokeLinecap="round" />
              ))}
              <text x={0} y={86} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={RED} letterSpacing={3}>BACKDOOR</text>
            </g>
          )}
        </g>
        {/* tunnel out the back after flip */}
        {flip >= 1 && [...Array(5)].map((_, i) => {
          const q = ((f * 0.03 + i * 0.2) % 1);
          return <circle key={i} cx={240 + q * 240} cy={0} r={8 * (1 - q) + 3} fill={RED} opacity={(1 - q) * 0.8} />;
        })}
      </g>
      {/* 5,000 counter + shield */}
      {f >= F.fiveK && (
        <g>
          <BigNum f={f} at={F.fiveK} text={cnt.toLocaleString("en-US")} x={400} y={1480} fs={130} hue={RED} />
          <text x={400} y={1550} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={MUT} letterSpacing={3}
            opacity={pop(f, F.fiveK + 8, 10)}>DEVS AT RISK</text>
        </g>
      )}
      {f >= F.update && (
        <g opacity={pop(f, F.update, 12)} transform={`translate(810 1460) scale(${0.9 + 0.1 * pop(f, F.update, 12)})`}>
          <path d="M0 -90 L80 -58 V20 Q80 90 0 120 Q-80 90 -80 20 V-58 Z" fill={GREEN} opacity={0.92} />
          <path d="M-34 6 L-8 36 L44 -30" stroke="#06331c" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={0} y={166} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={36} fill={GREEN}>v2.1.314</text>
        </g>
      )}
      <Anchor f={f} x={170} y={GROUND + 230} s={0.56} mood="worried" armR={70} elbowR={40} look={[1, -1]} />
    </g>
  );
};
const S_Api: React.FC<{ f: number }> = ({ f }) => {
  const g1 = eio(ramp(f, F.api + 8, F.api + 26));
  const g2 = eio(ramp(f, F.api + 56, F.api + 86));
  const num = Math.round(lerp(32, 128, g2));
  return (
    <g>
      <Pool x={VW / 2} y={1050} hue="#79d6ff" o={0.12} />
      <Chip x={VW / 2} y={360} w={560} label="CLAUDE API · REQUESTS" hue={CYAN} p={pop(f, F.api, 10)} fs={36} />
      {/* bar morph 32 -> 128 with ghost */}
      <g transform={`translate(${VW / 2} 1180)`}>
        <rect x={-104} y={-220 * g1} width={208} height={220 * g1} fill={MUT} opacity={0.3} rx={14} />
        <rect x={-104} y={-(220 + 440 * g2) * (g1 > 0 ? 1 : 0)} width={208} height={(220 + 440 * g2) * (g1 > 0 ? 1 : 0)} fill="url(#gradHue)" rx={14} />
        <text x={0} y={-(260 + 440 * g2)} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={120} fill="#fff">{num}</text>
        <text x={0} y={-(260 + 440 * g2) + 64} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={CYAN} letterSpacing={4}>MEGABYTES</text>
        <text x={0} y={70} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={MUT}>was 32 MB</text>
      </g>
      <Chip x={VW / 2} y={1400} w={240} label="4×" hue={GREEN} p={pop(f, F.api + 90, 10)} fs={44} />
      <Anchor f={f} x={170} y={GROUND + 200} s={0.6} armR={76} elbowR={26} look={[1, -1]} />
    </g>
  );
};
const S_Canada: React.FC<{ f: number }> = ({ f }) => {
  const fly = eio(ramp(f, F.canada + 20, F.canada + 48));
  const plant = pop(f, F.country + 24, 14);
  return (
    <g>
      <Pool x={VW / 2} y={1100} hue="#ff9aa8" o={0.11} />
      {/* maple leaf */}
      <g transform={`translate(240 460) scale(${pop(f, F.canada, 12) * 1.15})`}>
        <circle r={110} fill="#fff" />
        <path d="M0 -70 L9 -46 Q12 -38 20 -42 L40 -52 L34 -28 Q32 -20 40 -19 L58 -15 L44 1 Q39 7 45 12 L56 24 L34 26 Q26 27 28 35 L31 52 L11 40 Q4 36 4 44 L4 62 L-4 62 L-4 44 Q-4 36 -11 40 L-31 52 L-28 35 Q-26 27 -34 26 L-56 24 L-45 12 Q-39 7 -44 1 L-58 -15 L-40 -19 Q-32 -20 -34 -28 L-40 -52 L-20 -42 Q-12 -38 -9 -46 Z" fill={RED} />
      </g>
      <BigNum f={f} at={F.canada + 10} text="$1.6B" x={660} y={520} fs={170} hue={GOLD} />
      {/* money arrow to lab */}
      {[...Array(6)].map((_, i) => {
        const q = clamp01(fly * 1.5 - i * 0.12); if (q <= 0 || q >= 1) return null;
        const x = lerp(300, 560, q), y = lerp(560, 950, q) - Math.sin(q * Math.PI) * 120;
        return <text key={i} x={x} y={y} fontFamily={FONT} fontWeight={900} fontSize={46} fill={GOLD} opacity={1 - q * 0.4}>$</text>;
      })}
      {/* Cohere lab building */}
      <g transform="translate(540 940)">
        <rect x={-240} y={0} width={480} height={360} rx={18} fill="#101a38" stroke={PAPER} strokeWidth={4} />
        {[...Array(6)].map((_, i) => (
          <rect key={i} x={-190 + (i % 3) * 140} y={50 + Math.floor(i / 3) * 120} width={100} height={80} rx={10}
            fill={GOLD} opacity={0.22 + 0.5 * Math.abs(Math.sin(f * 0.06 + i))} />
        ))}
        <text x={0} y={-36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={PAPER} letterSpacing={3}>COHERE</text>
        {/* flag plants on "a country just bought" */}
        {f >= F.country + 20 && (
          <g transform={`translate(0 ${lerp(-180, -60, plant)})`} opacity={clamp01(plant)}>
            <line x1={0} y1={0} x2={0} y2={-150} stroke={PAPER} strokeWidth={8} strokeLinecap="round" />
            <rect x={0} y={-150} width={110} height={70} fill="#fff" />
            <rect x={0} y={-150} width={26} height={70} fill={RED} /><rect x={84} y={-150} width={26} height={70} fill={RED} />
            <path d="M55 -134 l6 12 13 -5 -4 14 14 3 -10 10 10 10 -14 3 4 14 -13 -5 -6 12 -6 -12 -13 5 4 -14 -14 -3 10 -10 -10 -10 14 -3 -4 -14 13 5 z" fill={RED} />
          </g>
        )}
      </g>
      <Anchor f={f} x={170} y={GROUND + 210} s={0.58} armR={74} elbowR={30} look={[1, -1]} mood="surprised" />
    </g>
  );
};
const S_Amazon: React.FC<{ f: number }> = ({ f }) => {
  const stack = eout(ramp(f, F.amazon + 6, F.amazon + 40));
  const racks = eout(ramp(f, F.dc, F.dc + 20));
  return (
    <g>
      <Pool x={VW / 2} y={1150} hue="#ffd27a" o={0.12} />
      <Chip x={VW / 2} y={340} w={360} label="AMAZON" hue={GOLD} p={pop(f, F.amazon, 10)} fs={42} />
      <BigNum f={f} at={F.amazon + 8} text="$80B" x={VW / 2} y={620} fs={230} hue={GOLD} />
      <text x={VW / 2} y={710} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={MUT} letterSpacing={4}
        opacity={pop(f, F.amazon + 16, 10)}>BORROWED FOR AI</text>
      {/* cash stack grows */}
      {[...Array(8)].map((_, i) => {
        const q = clamp01(stack * 8 - i); if (q <= 0) return null;
        return (
          <g key={i} opacity={q} transform={`translate(330 ${1320 - i * 56 - (1 - q) * 40})`}>
            <rect x={-130} y={-24} width={260} height={48} rx={10} fill={GREEN} stroke="#06331c" strokeWidth={3} />
            <circle r={14} fill="none" stroke="#06331c" strokeWidth={3} />
          </g>
        );
      })}
      {/* data center racks */}
      {f >= F.dc && [...Array(3)].map((_, i) => (
        <g key={i} opacity={clamp01(racks * 3 - i)} transform={`translate(${600 + i * 150} ${1120 + (1 - clamp01(racks * 3 - i)) * 60})`}>
          <rect x={-60} y={0} width={120} height={260} rx={12} fill="#101a38" stroke={CYAN} strokeWidth={3} />
          {[...Array(4)].map((_, k) => (
            <g key={k}>
              <rect x={-44} y={20 + k * 60} width={88} height={40} rx={6} fill="#182452" />
              <circle cx={28} cy={40 + k * 60} r={6} fill={(f + i * 7 + k * 13) % 30 < 15 ? GREEN : "#13341f"} />
            </g>
          ))}
        </g>
      ))}
      <Anchor f={f} x={170} y={GROUND + 220} s={0.56} armR={72} elbowR={28} look={[1, -1]} />
    </g>
  );
};
const S_Token: React.FC<{ f: number }> = ({ f }) => {
  const gate = eio(ramp(f, F.block + 8, F.block + 20));
  return (
    <g>
      <Pool x={VW / 2} y={1050} hue="#9fb6ff" o={0.12} />
      <Chip x={VW / 2} y={340} w={700} label="ONE OPT-OUT TOKEN · 4 GIANTS" hue={CYAN} p={pop(f, F.token, 10)} fs={34} />
      {/* four crawler bots march right */}
      {[...Array(4)].map((_, i) => {
        const bx = 150 + i * 200 + (f >= F.block + 20 ? -Math.sin((f - F.block) * 0.25) * 14 : (f - F.token) * 1.2 % 40);
        const hues = [GREEN, CYAN, GOLD, RED];
        return (
          <g key={i} transform={`translate(${bx} ${840 + (i % 2) * 36})`} opacity={eout(ramp(f, F.token + 6 + i * 4, F.token + 18 + i * 4))}>
            <rect x={-52} y={-52} width={104} height={86} rx={18} fill="#101a38" stroke={hues[i]} strokeWidth={4} />
            <circle cx={-18} cy={-14} r={9} fill={hues[i]} /><circle cx={18} cy={-14} r={9} fill={hues[i]} />
            <rect x={-20} y={10} width={40} height={8} rx={4} fill={hues[i]} />
            <line x1={0} y1={-52} x2={0} y2={-74} stroke={hues[i]} strokeWidth={4} /><circle cx={0} cy={-80} r={7} fill={hues[i]} />
            {/* wheels */}
            <circle cx={-28} cy={44} r={12} fill={MUT} /><circle cx={28} cy={44} r={12} fill={MUT} />
          </g>
        );
      })}
      {/* the single code line gate */}
      {f >= F.block && (
        <g>
          <rect x={90} y={lerp(-200, 1000, gate)} width={VW - 180} height={100} rx={18} fill="#101a38" stroke={RED} strokeWidth={5} />
          <text x={VW / 2} y={lerp(-200, 1000, gate) + 64} textAnchor="middle" fontFamily="monospace" fontWeight={700} fontSize={40} fill={RED}>__usage_ai-training</text>
          {gate >= 1 && <Chip x={VW / 2} y={1200} w={420} label="ONE LINE · BLOCKED" hue={RED} p={pop(f, F.block + 22, 10)} fs={34} dark />}
        </g>
      )}
      <Anchor f={f} x={170} y={GROUND + 210} s={0.58} armR={70} elbowR={34} look={[1, -1]} />
    </g>
  );
};
const S_Reddit: React.FC<{ f: number }> = ({ f }) => {
  const draw = eio(ramp(f, F.reddit + 6, F.reddit + 40));
  const pts: [number, number][] = [[160, 760], [340, 800], [520, 790], [700, 900], [880, 1080]];
  const seen = Math.max(2, Math.ceil(draw * pts.length));
  return (
    <g>
      <Pool x={VW / 2} y={1000} hue="#ff9a7a" o={0.11} />
      <Chip x={VW / 2} y={340} w={340} label="REDDIT" hue="#ff6a3d" p={pop(f, F.reddit, 10)} fs={42} />
      <g>
        <polyline points={pts.slice(0, seen).map(p => p.join(",")).join(" ")} fill="none" stroke="#ff6a3d" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        {pts.slice(0, seen).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={12} fill="#ff6a3d" />)}
        {draw >= 1 && (
          <g opacity={pop(f, F.reddit + 42, 10)}>
            <path d={`M880 1080 l-46 -18 m46 18 l-14 -48`} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          </g>
        )}
      </g>
      <BigNum f={f} at={F.reddit + 30} text="−1M" x={VW / 2} y={1340} fs={180} hue={RED} />
      <text x={VW / 2} y={1420} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={MUT} letterSpacing={3}
        opacity={pop(f, F.reddit + 36, 10)}>GOOGLE VISITS / WEEK</text>
      {f >= F.aiMode && <Chip x={VW / 2} y={560} w={420} label="BLAME: AI MODE" hue={RED} p={pop(f, F.aiMode, 10)} fs={36} dark />}
      <Anchor f={f} x={170} y={GROUND + 220} s={0.56} mood="worried" armR={66} elbowR={30} look={[1, -1]} />
    </g>
  );
};
const S_Space: React.FC<{ f: number }> = ({ f }) => {
  const orb = (f - F.sat) * 0.03;
  const tp = pop(f, F.tesla, 12);
  return (
    <g>
      {/* stars */}
      {[...Array(26)].map((_, i) => (
        <circle key={i} cx={rnd("nx" + i) * VW} cy={rnd("ny" + i) * 900} r={1.2 + rnd("nr" + i) * 2}
          fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(f * 0.05 + i))} />
      ))}
      <circle cx={VW / 2} cy={430} r={170} fill="#1b2a5c" stroke={CYAN} strokeWidth={4} />
      <path d={`M${VW / 2 - 170} 430 q 80 50 170 44 q 95 -6 170 -60`} stroke={GREEN} strokeWidth={5} fill="none" opacity={0.5} />
      {/* satellite orbiting */}
      <g transform={`translate(${VW / 2 + Math.cos(orb) * 300} ${430 + Math.sin(orb) * 120}) rotate(${orb * 57})`}
        opacity={eout(ramp(f, F.sat, F.sat + 12))}>
        <rect x={-34} y={-20} width={68} height={40} rx={8} fill={PAPER} />
        <rect x={-110} y={-12} width={64} height={24} fill={CYAN} /><rect x={46} y={-12} width={64} height={24} fill={CYAN} />
        <circle cx={0} cy={0} r={8} fill={GOLD} />
      </g>
      <Chip x={VW / 2} y={700} w={540} label="AI CHIPS · IN ORBIT" hue={CYAN} p={pop(f, F.sat + 16, 10)} fs={36} />
      {/* Tesla Optimus */}
      {f >= F.tesla && (
        <g opacity={clamp01(tp)} transform={`translate(${VW / 2} 1170) scale(${0.9 + 0.1 * tp})`}>
          <rect x={-90} y={-60} width={180} height={220} rx={40} fill="#101a38" stroke={PAPER} strokeWidth={4} />
          <circle cy={-120} r={56} fill="#101a38" stroke={PAPER} strokeWidth={4} />
          <rect x={-34} y={-136} width={68} height={22} rx={11} fill={CYAN} opacity={0.9} />
          <line x1={-90} y1={0} x2={-150} y2={80} stroke={PAPER} strokeWidth={10} strokeLinecap="round" />
          <line x1={90} y1={0} x2={150} y2={80} stroke={PAPER} strokeWidth={10} strokeLinecap="round" />
          <line x1={-40} y1={160} x2={-40} y2={270} stroke={PAPER} strokeWidth={12} strokeLinecap="round" />
          <line x1={40} y1={160} x2={40} y2={270} stroke={PAPER} strokeWidth={12} strokeLinecap="round" />
          {/* price tag swings */}
          <g transform={`translate(200 -40) rotate(${Math.sin(f * 0.12) * 8})`}>
            <rect x={-10} y={0} width={230} height={90} rx={16} fill={GOLD} />
            <circle cx={0} cy={14} r={8} fill="#101a38" />
            <text x={105} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill="#101a38">$20K+</text>
          </g>
          <Chip x={0} y={340} w={460} label="RESERVATIONS · DEC" hue={GOLD} p={pop(f, F.tesla + 14, 10)} fs={34} dark />
        </g>
      )}
      <Anchor f={f} x={170} y={GROUND + 230} s={0.54} armR={80} elbowR={20} look={[1, -1]} mood="surprised" />
    </g>
  );
};
// ================= stories: category 2 =================
const S_MPrice: React.FC<{ f: number }> = ({ f }) => {
  const morph = eio(ramp(f, F.mPrice + 26, F.mPrice + 48));
  const cents = (lerp(1.36, 0.7, morph)).toFixed(2);
  const stamp = pop(f, F.mPrice + 110, 12);
  return (
    <g>
      <Pool x={VW / 2} y={1050} hue="#ffe2a0" o={0.13} />
      <Chip x={VW / 2} y={340} w={480} label="MISTRAL API PRICE" hue={GOLD} p={pop(f, F.mPrice, 10)} fs={38} />
      {/* price tag morphs down */}
      <g transform={`translate(${VW / 2} 720) rotate(${Math.sin(f * 0.08) * 3})`}>
        <path d="M-260 -140 h380 l140 140 -140 140 h-380 z" fill="url(#gradHue)" opacity={0.95} />
        <circle cx={220} cy={0} r={16} fill={BG0} />
        <text x={-70} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={104} fill="#101a38">${cents}</text>
      </g>
      <text x={VW / 2} y={940} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={MUT} letterSpacing={3}>PER MILLION TOKENS</text>
      <text x={VW / 2} y={1020} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill={MUT} opacity={morph}
        textDecoration="line-through">was $1.36</text>
      {/* FREE stamp on the model box */}
      <g transform="translate(540 1270)">
        <rect x={-200} y={-90} width={400} height={180} rx={22} fill="#101a38" stroke={PAPER} strokeWidth={4} />
        <text x={0} y={-10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={PAPER}>THE MODEL</text>
        <text x={0} y={46} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={32} fill={MUT}>open weights</text>
        {f >= F.mPrice + 110 && (
          <g opacity={clamp01(stamp)} transform={`rotate(-14) scale(${1.6 - 0.6 * stamp})`}>
            <rect x={-160} y={-64} width={320} height={128} rx={20} fill="none" stroke={GREEN} strokeWidth={10} />
            <text x={0} y={26} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={88} fill={GREEN} letterSpacing={8}>FREE</text>
          </g>
        )}
      </g>
      <Anchor f={f} x={170} y={GROUND + 210} s={0.58} armR={74} elbowR={28} look={[1, -1]} mood="happy" />
    </g>
  );
};
const S_Codex: React.FC<{ f: number }> = ({ f }) => {
  const dbl = eio(ramp(f, F.codex + 24, F.codex + 46));
  return (
    <g>
      <Pool x={VW / 2} y={1050} hue="#b8f0cf" o={0.12} />
      <Chip x={VW / 2} y={340} w={560} label="OPENAI · CODEX LIMITS" hue={GREEN} p={pop(f, F.codex, 10)} fs={36} />
      {/* bar doubles, ghost of old height */}
      <g transform={`translate(${VW / 2} 1240)`}>
        <rect x={-260} y={-300} width={220} height={300} rx={16} fill={MUT} opacity={0.35} />
        <text x={-150} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={MUT}>BEFORE</text>
        <rect x={40} y={-300 - 300 * dbl} width={220} height={300 + 300 * dbl} rx={16} fill="url(#gradHue)" />
        <text x={150} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={PAPER}>NOW</text>
        <BigNum f={f} at={F.codex + 40} text="2×" x={150} y={-660} fs={170} hue={GREEN} />
      </g>
      <Chip x={VW / 2} y={1400} w={380} label="SAME PRICE" hue={GREEN} p={pop(f, F.codex + 70, 10)} fs={38} dark />
      <Anchor f={f} x={170} y={GROUND + 210} s={0.58} armR={72} elbowR={26} look={[1, -1]} mood="happy" />
    </g>
  );
};
const S_Plans: React.FC<{ f: number }> = ({ f }) => {
  const flip1 = eio(ramp(f, F.plans + 30, F.plans + 48));
  const flip2 = eio(ramp(f, F.plans + 70, F.plans + 88));
  const cross = pop(f, F.window5 + 20, 12);
  const card = (x: number, flip: number, oldN: string, newN: string, price: string, hue: string) => (
    <g transform={`translate(${x} 800)`}>
      <g transform={`scale(${Math.abs(1 - 2 * flip)} 1)`}>
        <rect x={-210} y={-260} width={420} height={520} rx={28} fill="#101a38" stroke={hue} strokeWidth={5} />
        <text x={0} y={-150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill={flip < 0.5 ? MUT : hue} letterSpacing={3}>
          {flip < 0.5 ? oldN : newN}</text>
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={PAPER}>{price}</text>
        <text x={0} y={80} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill={MUT}>/month</text>
        {flip >= 0.5 && <text x={0} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={GREEN}>NEW NAME</text>}
      </g>
    </g>
  );
  return (
    <g>
      <Pool x={VW / 2} y={1000} hue="#d8b7ff" o={0.12} />
      <Chip x={VW / 2} y={340} w={500} label="ANTHROPIC PLANS" hue="#b069ff" p={pop(f, F.plans, 10)} fs={38} />
      {card(300, flip1, "MAX 5×", "MAX", "$100", "#b069ff")}
      {card(780, flip2, "MAX 20×", "ULTRA", "$200", GOLD)}
      {/* hourglass crossed out */}
      {f >= F.window5 && (
        <g transform="translate(540 1420)" opacity={eout(ramp(f, F.window5, F.window5 + 10))}>
          <path d="M-60 -80 h120 l-44 80 44 80 h-120 l44 -80 z" fill="none" stroke={PAPER} strokeWidth={7} />
          <path d="M-30 -62 h60 l-30 54 z" fill={GOLD} opacity={0.8} />
          <text x={110} y={14} fontFamily={FONT} fontWeight={800} fontSize={40} fill={MUT}>5-hour window</text>
          <line x1={-90} y1={90} x2={520} y2={-90} stroke={RED} strokeWidth={14 * cross} strokeLinecap="round" />
        </g>
      )}
      <Anchor f={f} x={170} y={GROUND + 230} s={0.54} armR={70} elbowR={30} look={[1, -1]} />
    </g>
  );
};
// ================= stories: category 3 =================
const S_Sfx: React.FC<{ f: number }> = ({ f }) => {
  const burst = ramp(f, F.sfx + 26, F.sfx + 50);
  return (
    <g>
      <Pool x={VW / 2} y={1000} hue="#9fe8ff" o={0.13} />
      <Chip x={VW / 2} y={340} w={560} label="ELEVENLABS · SFX v3" hue={CYAN} p={pop(f, F.sfx, 10)} fs={38} />
      {/* text field */}
      <g transform="translate(540 620)" opacity={eout(ramp(f, F.sfx + 6, F.sfx + 16))}>
        <rect x={-380} y={-54} width={760} height={108} rx={22} fill="#101a38" stroke={PAPER} strokeWidth={3} />
        <text x={-340} y={16} fontFamily={FONT} fontWeight={700} fontSize={38} fill={PAPER}>
          {"“rain + thunder + glass”".slice(0, Math.floor(ramp(f, F.sfx + 8, F.sfx + 30) * 23))}
        </text>
        <rect x={-340 + ramp(f, F.sfx + 8, F.sfx + 30) * 440} y={-22} width={5} height={44} fill={CYAN} opacity={(f % 20) < 10 ? 1 : 0} />
      </g>
      {/* waveform bursts out */}
      <g transform="translate(540 1080)">
        {[...Array(36)].map((_, i) => {
          const h = (30 + Math.abs(Math.sin(i * 1.7 + f * 0.18)) * 240 * (0.4 + 0.6 * Math.abs(Math.sin(i * 0.4)))) * burst;
          const hues = [CYAN, GREEN, GOLD];
          return <rect key={i} x={-378 + i * 21} y={-h / 2} width={13} rx={6} height={h} fill={hues[i % 3]} opacity={0.85} />;
        })}
      </g>
      <text x={VW / 2} y={1340} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={MUT} letterSpacing={3}
        opacity={pop(f, F.sfx + 60, 10)}>LAYERED SOUND · FROM TEXT</text>
      <Anchor f={f} x={170} y={GROUND + 210} s={0.58} armR={74} elbowR={28} look={[1, -1]} mood="happy" />
    </g>
  );
};
const S_Imsg: React.FC<{ f: number }> = ({ f }) => {
  const b1 = pop(f, F.imsg + 20, 10), b2 = pop(f, F.imsg + 48, 10), b3 = pop(f, F.imsg + 76, 10);
  return (
    <g>
      <Pool x={VW / 2} y={1000} hue="#aef0c3" o={0.12} />
      <Chip x={VW / 2} y={300} w={620} label="OPENAI AGENT → iMESSAGE" hue={GREEN} p={pop(f, F.imsg, 10)} fs={34} />
      {/* phone */}
      <g transform="translate(540 1010)">
        <rect x={-260} y={-560} width={520} height={1020} rx={56} fill="#101a38" stroke={PAPER} strokeWidth={5} />
        <rect x={-80} y={-540} width={160} height={30} rx={15} fill="#060b1a" />
        <g opacity={b1}><rect x={-220} y={-440} width={340} height={96} rx={30} fill="#26304f" />
          <text x={-200} y={-382} fontFamily={FONT} fontWeight={700} fontSize={34} fill={PAPER}>Agent here 👋</text></g>
        <g opacity={b2}><rect x={-220} y={-320} width={400} height={96} rx={30} fill="#26304f" />
          <text x={-200} y={-262} fontFamily={FONT} fontWeight={700} fontSize={34} fill={PAPER}>Your build passed ✓</text></g>
        <g opacity={b3}><rect x={-120} y={-200} width={340} height={96} rx={30} fill={GREEN} />
          <text x={-96} y={-142} fontFamily={FONT} fontWeight={700} fontSize={34} fill="#06331c">nice. ship it</text></g>
        {/* typing dots */}
        {f >= F.imsg + 90 && (
          <g transform="translate(-160 -80)">
            <rect x={-60} y={-34} width={150} height={68} rx={30} fill="#26304f" />
            {[0, 1, 2].map(i => (
              <circle key={i} cx={-24 + i * 30} cy={0} r={9} fill={MUT} opacity={0.4 + 0.6 * Math.abs(Math.sin(f * 0.25 - i))} />
            ))}
          </g>
        )}
        <text x={0} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={MUT}>US · PRO USERS</text>
      </g>
      <Anchor f={f} x={170} y={GROUND + 230} s={0.54} armR={70} elbowR={30} look={[1, -1]} />
    </g>
  );
};
const S_Meta: React.FC<{ f: number }> = ({ f }) => {
  const petP = pop(f, F.meta + 14, 12);
  const styP = pop(f, F.meta + 58, 12);
  const hop = Math.abs(Math.sin((f - F.meta) * 0.22)) * 26;
  return (
    <g>
      <Pool x={VW / 2} y={1050} hue="#ffc1e0" o={0.12} />
      <Chip x={VW / 2} y={340} w={320} label="META" hue="#ff6ab8" p={pop(f, F.meta, 10)} fs={42} />
      {/* pixel pet */}
      <g opacity={clamp01(petP)} transform={`translate(320 ${880 - hop}) scale(${0.9 + 0.1 * petP})`}>
        {[[-2,-3],[-1,-3],[0,-3],[1,-3],[-3,-2],[2,-2],[-3,-1],[2,-1],[-3,0],[2,0],[-2,1],[-1,1],[0,1],[1,1],[-2,2],[1,2]].map(([gx, gy], i) => (
          <rect key={i} x={gx * 44} y={gy * 44} width={44} height={44} fill="#ff6ab8" rx={6} />
        ))}
        <rect x={-66} y={-110} width={26} height={26} fill="#fff" rx={4} /><rect x={22} y={-110} width={26} height={26} fill="#fff" rx={4} />
        <text x={-22} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={MUT}>AI PET</text>
      </g>
      {/* stylist: hanger + shirt */}
      <g opacity={clamp01(styP)} transform={`translate(760 850) rotate(${Math.sin(f * 0.1) * 5})`}>
        <path d="M0 -120 q0 -34 32 -34 q32 0 32 30 q0 24 -28 36 L160 -10 H-160 Z" fill="none" stroke={CYAN} strokeWidth={9} strokeLinejoin="round" />
        <path d="M-120 20 L-60 -20 H60 L120 20 L80 70 L60 50 V220 H-60 V50 L-80 70 Z" fill={CYAN} opacity={0.9} transform="translate(0 30)" />
        <circle cx={0} cy={110} r={20} fill="#fff" opacity={0.9} />
        <text x={0} y={320} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={MUT}>AI STYLIST</text>
      </g>
      {f >= F.asia && <Chip x={VW / 2} y={1380} w={400} label="LIVE IN ASIA" hue="#ff6ab8" p={pop(f, F.asia, 10)} fs={38} dark />}
      <Anchor f={f} x={170} y={GROUND + 220} s={0.56} armR={72} elbowR={30} look={[1, -1]} mood="happy" />
    </g>
  );
};
// ================= outro =================
const Outro: React.FC<{ f: number }> = ({ f }) => {
  const bp = pop(f, F.outro + 40, 14);
  const click = f >= F.outro + 86;
  const pulse = 1 + 0.06 * Math.sin((f - F.outro) * 0.25);
  const cx = lerp(900, 640, eio(ramp(f, F.outro + 56, F.outro + 84)));
  const cy = lerp(1420, 960, eio(ramp(f, F.outro + 56, F.outro + 84)));
  return (
    <g>
      <Pool x={VW / 2} y={GROUND + 60} hue="#ff5d75" o={0.14} />
      <text x={VW / 2} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={76} fill="#fff" letterSpacing={2}
        opacity={eout(ramp(f, F.outro + 6, F.outro + 18))}>THAT'S TODAY'S AI NEWS</text>
      <text x={VW / 2} y={545} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={92} fill={RED} letterSpacing={3}
        opacity={eout(ramp(f, F.outro + 12, F.outro + 24))}>IN 2 MINUTES</text>
      {/* subscribe button + cursor click */}
      {f >= F.outro + 40 && (
        <g transform={`translate(${VW / 2} 940) scale(${bp * (click ? pulse : 1)})`}>
          <rect x={-290} y={-80} width={580} height={160} rx={80} fill={RED} />
          <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#fff" letterSpacing={3}>SUBSCRIBE</text>
          {click && [...Array(3)].map((_, i) => {
            const q = clamp01((f - F.outro - 86 - i * 6) / 26); if (q <= 0 || q >= 1) return null;
            return <rect key={i} x={-290 - q * 60} y={-80 - q * 60} width={580 + q * 120} height={160 + q * 120} rx={110} fill="none" stroke={RED} strokeWidth={(1 - q) * 8} opacity={1 - q} />;
          })}
        </g>
      )}
      {/* cursor */}
      {f >= F.outro + 56 && (
        <g transform={`translate(${cx} ${cy}) scale(${click ? 0.92 : 1})`}>
          <path d="M0 0 L0 64 L18 50 L30 78 L44 71 L32 44 L54 42 Z" fill="#fff" stroke="#101a38" strokeWidth={4} />
        </g>
      )}
      <Chip x={VW / 2} y={1330} w={560} label="SAME TIME TOMORROW" hue={GOLD} p={pop(f, F.outro + 100, 12)} fs={36} dark />
      {/* anchor waves behind desk */}
      <Anchor f={f} x={VW / 2} y={GROUND + 40} s={1.0} armR={118 + Math.sin(f * 0.3) * 14} elbowR={46} look={[0, 1]} mood="happy" />
      <rect x={VW / 2 - 330} y={GROUND - 160} width={660} height={44} rx={10} fill="#141f42" stroke={PAPER} strokeWidth={3} opacity={0.95} />
      <rect x={VW / 2 - 260} y={GROUND - 116} width={520} height={190} rx={8} fill="#0f1836" stroke={PAPER} strokeWidth={2} />
    </g>
  );
};
// ================= film =================
const SHOTS: ShotDef[] = [
  { from: 0, to: F.first, z0: 1.0, z1: 1.06, fx: 540, fy: 820, render: (f) => <Intro f={f} /> },
  { from: F.first, to: F.mistral, z0: 1.0, z1: 1.04, fx: 540, fy: 760, render: (f) => <Toc f={f} /> },
  { from: F.mistral, to: F.fake, z0: 1.0, z1: 1.08, fx: 620, fy: 700, render: (f) => <S_Mistral f={f} /> },
  { from: F.fake, to: F.api, z0: 1.02, z1: 1.1, fx: 620, fy: 900, render: (f) => <S_Backdoor f={f} /> },
  { from: F.api, to: F.canada, z0: 1.0, z1: 1.07, fx: 540, fy: 900, render: (f) => <S_Api f={f} /> },
  { from: F.canada, to: F.amazon, z0: 1.0, z1: 1.06, fx: 540, fy: 820, render: (f) => <S_Canada f={f} /> },
  { from: F.amazon, to: F.token, z0: 1.0, z1: 1.07, fx: 540, fy: 800, render: (f) => <S_Amazon f={f} /> },
  { from: F.token, to: F.reddit, z0: 1.0, z1: 1.06, fx: 540, fy: 880, render: (f) => <S_Token f={f} /> },
  { from: F.reddit, to: F.sat, z0: 1.0, z1: 1.07, fx: 540, fy: 900, render: (f) => <S_Reddit f={f} /> },
  { from: F.sat, to: F.now2, z0: 1.0, z1: 1.06, fx: 540, fy: 800, render: (f) => <S_Space f={f} /> },
  { from: F.now2, to: F.mPrice, render: (f) => <g><Studio f={f} hue={GOLD} /><Banner f={f} at={F.now2} num="02" label="PRICING & FREE" hue={GOLD} /></g> },
  { from: F.mPrice, to: F.codex, z0: 1.0, z1: 1.07, fx: 540, fy: 850, render: (f) => <S_MPrice f={f} /> },
  { from: F.codex, to: F.plans, z0: 1.0, z1: 1.06, fx: 540, fy: 1000, render: (f) => <S_Codex f={f} /> },
  { from: F.plans, to: F.finally3, z0: 1.0, z1: 1.06, fx: 540, fy: 850, render: (f) => <S_Plans f={f} /> },
  { from: F.finally3, to: F.sfx, render: (f) => <g><Studio f={f} hue={CYAN} /><Banner f={f} at={F.finally3} num="03" label="AI TOOLS" hue={CYAN} /></g> },
  { from: F.sfx, to: F.imsg, z0: 1.0, z1: 1.07, fx: 540, fy: 850, render: (f) => <S_Sfx f={f} /> },
  { from: F.imsg, to: F.meta, z0: 1.0, z1: 1.06, fx: 540, fy: 950, render: (f) => <S_Imsg f={f} /> },
  { from: F.meta, to: F.outro, z0: 1.0, z1: 1.06, fx: 540, fy: 880, render: (f) => <S_Meta f={f} /> },
  { from: F.outro, to: TOTAL + 1, z0: 1.04, z1: 1.0, fx: 540, fy: 1000, render: (f) => <Outro f={f} /> },
];
const KICKS: [number, number][] = [
  [F.go, 18], [F.mistral, 16], [F.fake, 18], [F.fake + 58, 12], [F.api, 12], [F.canada, 14], [F.amazon, 12],
  [F.token, 12], [F.block + 18, 16], [F.reddit, 12], [F.sat, 12], [F.tesla, 12], [F.now2, 16], [F.mPrice, 12],
  [F.codex, 12], [F.plans, 12], [F.window5 + 20, 10], [F.finally3, 16], [F.sfx, 12], [F.imsg, 12], [F.meta, 12], [F.outro, 14],
];
const STORY_N: [number, string][] = [
  [F.mistral, "1 / 16"], [F.fake, "2 / 16"], [F.api, "3 / 16"], [F.canada, "4 / 16"], [F.amazon, "5 / 16"],
  [F.token, "6 / 16"], [F.reddit, "7 / 16"], [F.sat, "8 / 16"], [F.tesla, "9 / 16"], [F.mPrice, "10 / 16"],
  [F.codex, "11 / 16"], [F.plans, "12 / 16"], [F.window5, "13 / 16"], [F.sfx, "14 / 16"], [F.imsg, "15 / 16"], [F.meta, "16 / 16"],
];
export const NewsFilm: React.FC = () => {
  const f = useCurrentFrame();
  const hue = f < F.now2 ? RED : f < F.finally3 ? GOLD : CYAN;
  const cur = [...STORY_N].reverse().find(([at]) => f >= at);
  const inBanner = (f >= F.now2 && f < F.mPrice) || (f >= F.finally3 && f < F.sfx);
  const fadeIn = eout(ramp(f, 0, 10));
  const fadeOut = 1 - ramp(f, TOTAL - 16, TOTAL - 2);
  return (
    <AbsoluteFill style={{ background: BG0 }}>
      <FontStyle />
      <Audio src={staticFile("projects/news1/narration.wav")} volume={1} />
      <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`}>
        <Defs hue={hue} />
        <Shots f={f} kicks={KICKS} shots={SHOTS.map(s => ({
          ...s,
          render: (_ff: number, p: number) => (
            <g>
              {!inBanner && <Studio f={f} hue={hue} />}
              {s.render(f, p)}
            </g>
          ),
        }))} />
        <Header f={f} />
        {cur && !inBanner && f < F.outro && <Counter n={cur[1]} p={pop(f, cur[0] + 4, 10)} />}
        <Vignette />
        <rect width={VW} height={VH} fill={BG0} opacity={1 - fadeIn} />
        <rect width={VW} height={VH} fill="#000" opacity={1 - fadeOut} />
      </svg>
      <Captions f={f} words={WORDS} chunks={CHUNKS} y={1680} accent={hue} hide={inBanner} />
    </AbsoluteFill>
  );
};
