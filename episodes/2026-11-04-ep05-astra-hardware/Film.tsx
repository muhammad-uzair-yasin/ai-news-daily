// Ai News ep05 (Nov 4 2026) — SINGLE-STORY format v2. Agenda opener → short story (fixed-height card) →
// 3-card ticker → "today's free tool" (clear layout) → hard cut. Cream "Distilled" look, Byte, one voice.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, eback, pop, clamp01, lerp, VW, VH } from "./kit";
import { Narration, Caps, FONT, talkFor, speaking } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues ----------
const F = {
  openai: 17, gadget: 81, week: 113, one: 148, story: 154, three: 163, hits: 180, end: 203, free: 228, sleep: 266,
  two: 292, astra: 366, codex: 433, designed: 462, case: 481, board: 495, firmware: 526, factory: 549, prototypes: 573, month: 603, catch: 622, revisions: 654, missing: 712, limits: 747,
  hits2: 776, revolut: 813, ninety: 865, apple: 928, siri: 952, postman: 1018, check: 1131,
  now: 1176, sentient: 1223, mac: 1272, night: 1304, reads: 1318, mail: 1334, notes: 1342, files: 1356, drafts: 1389, forms: 1440, approve: 1474, freeword: 1497, open: 1514, link: 1544, tomorrow: 1600,
};

// ---------- palette ----------
const BG0 = "#efe9dd", BG1 = "#f8f4ea", RED = "#ff2e4d", INK = "#0f1117", GREY = "#6b7280", PAPER = "#ffffff", SOFT = "#eef0f5", GREEN = "#1fb978";
const SERIF = "PlayfairLocal, 'Playfair Display', Georgia, serif";
const SerifFont: React.FC = () => <style>{`@font-face{font-family:PlayfairLocal;font-weight:800;font-style:italic;src:url(${staticFile("playfair800i.woff2")}) format("woff2")}`}</style>;
const logo = (n: string) => staticFile(`logos/${n}.svg`);
const WIDE = new Set(["marvell", "microsoft", "amazon"]);
const BYTE = { ...CAST[5], name: "Byte", top: "hoodie" as const, topC: "#111118", hat: "headset" as const, hatC: RED, glasses: "square" as const, hair: "short" as const, hairC: "#111", prop: "none" as const, face: "none" as const };
// layout bands (never overlap): chrome 70–130 · cards 300–1160 · captions 1230–1400 · Byte 1430+
const CARD_TOP = 300, CAP_Y = 1235;

// ---------- primitives ----------
const Logo: React.FC<{ name?: string; text?: string; size?: number }> = ({ name, text, size = 84 }) => (
  <div style={{ minWidth: name ? (WIDE.has(name) ? size * 2.6 : size) : undefined, height: size, padding: text ? "0 22px" : 0, borderRadius: size * 0.24, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.36, color: INK, letterSpacing: 1 }}>
    {name ? <img src={logo(name)} style={{ width: WIDE.has(name) ? size * 2.2 : size * 0.62, height: size * 0.62, objectFit: "contain" }} /> : text}
  </div>
);
const Punch: React.FC<{ f: number; at: number; text: string; fs?: number }> = ({ f, at, text, fs = 84 }) => {
  const k = eout(ramp(f, at, at + 9));
  return (
    <div style={{ position: "relative", display: "inline-block", marginTop: 6 }}>
      <div style={{ position: "absolute", left: -4, top: 0, bottom: 0, right: -4, background: RED, borderRadius: 6, transform: `rotate(-1.2deg) scaleX(${k})`, transformOrigin: "left center", boxShadow: k > 0 ? "0 10px 30px rgba(255,46,77,0.35)" : "none" }} />
      <div style={{ position: "relative", color: k > 0.5 ? "#fff" : INK, fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: fs, lineHeight: 1.05, padding: "2px 26px 10px", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};
const Chip: React.FC<{ f: number; at: number; text: string; hue?: string; fs?: number }> = ({ f, at, text, hue, fs = 30 }) => {
  const k = pop(f, at, 12); if (k <= 0) return null;
  return <div style={{ display: "inline-block", transform: `scale(${k})`, transformOrigin: "left center", marginRight: 12, background: hue ?? SOFT, color: hue ? "#fff" : INK, fontFamily: FONT, fontWeight: 800, fontSize: fs, padding: "9px 20px", borderRadius: 999, whiteSpace: "nowrap" }}>{text}</div>;
};
const Stamp: React.FC<{ f: number; at: number; text: string; x: number; y: number; rot?: number; hue?: string }> = ({ f, at, text, x, y, rot = -10, hue = RED }) => {
  const k = pop(f, at, 10); if (k <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${lerp(2.2, 1, k)})`, opacity: k, border: `6px solid ${hue}`, color: hue, borderRadius: 14, padding: "6px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 4, background: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>{text}</div>;
};
const Mark: React.FC<{ s?: number; progress: number; payoff?: number; zap?: number }> = ({ s = 1, progress, payoff, zap = 0 }) => {
  const r = 22, C = 2 * Math.PI * r, a = payoff !== undefined ? -Math.PI / 2 + payoff * 2 * Math.PI : 0;
  return (
    <svg width={60 * s} height={60 * s} viewBox="0 0 60 60" style={{ overflow: "visible" }}>
      <circle cx={30} cy={32} r={r} fill="none" stroke={INK} strokeWidth={4.5} opacity={0.22} />
      <circle cx={30} cy={32} r={r} fill="none" stroke={RED} strokeWidth={4.5} strokeLinecap="round" strokeDasharray={`${C * clamp01(progress)} ${C}`} transform="rotate(-90 30 32)" />
      <rect x={25} y={4} width={10} height={6} rx={2} fill={INK} />
      <path d="M33 22 l-8 11 h7 l-3 9 l9 -12 h-7 z" fill={RED} transform={`translate(30 32) scale(${1 + zap * 0.6}) translate(-30 -32)`} />
      {payoff !== undefined && <circle cx={30 + Math.cos(a) * r} cy={32 + Math.sin(a) * r} r={5.5} fill="#fff" stroke={RED} strokeWidth={3} />}
      {zap > 0 && <circle cx={30} cy={32} r={r + zap * 26} fill="none" stroke={RED} strokeWidth={3} opacity={1 - zap} />}
    </svg>
  );
};
const zapAt = (f: number, cues: number[]) => { let z = 0; for (const c of cues) { const q = f - c; if (q >= 0 && q < 16) z = Math.max(z, 1 - q / 16); } return z; };
const PUNCHES = [F.week, F.month, F.freeword];
const Chrome: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Mark progress={f / TOTAL} payoff={F.now / TOTAL} zap={zapAt(f, PUNCHES)} /><div style={{ color: INK, fontSize: 30, letterSpacing: 6 }}>AI NEWS</div></div>
    <div style={{ color: INK, opacity: 0.55, fontSize: 26, letterSpacing: 5 }}>NOV 4 · 2026</div>
  </div>
);
const Backdrop: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG1} 0%, ${BG0} 100%)` }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`, backgroundSize: "90px 90px", backgroundPosition: `${(f * 0.12) % 90}px ${(f * 0.08) % 90}px` }} />
    <div style={{ position: "absolute", left: -200, top: -500, width: 1500, height: 1100, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,46,77,${0.16 + 0.03 * Math.sin(f * 0.05)}) 0%, rgba(255,46,77,0) 60%)` }} />
  </div>
);
const Shell: React.FC<{ f: number; at: number; out: number; tilt: number; children: React.ReactNode; fromRight?: boolean; height?: number }> = ({ f, at, out, tilt, children, fromRight, height }) => {
  if (f < at) return null;
  const tin = ramp(f, at, at + 16), tout = ramp(f, out, out + 14); if (tout >= 1) return null;
  const e = eback(tin), back = eio(tout);
  const tx = fromRight ? lerp(1200, 0, e) : 0, ty = fromRight ? 0 : lerp(1500, 0, e), rot = lerp(fromRight ? -6 : 9, tilt, eout(tin));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: CARD_TOP, transform: `translate(${tx - back * 1300}px, ${ty}px) rotate(${rot + back * 8}deg) scale(${lerp(1, 0.94, back)})`, transformOrigin: "50% 40%", opacity: 1 - back * 0.5, zIndex: tout > 0 ? 1 : 2 }}>
      <div style={{ background: PAPER, borderRadius: 40, padding: "48px 60px 40px", height, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0,0,0,0.28), 0 0 0 2px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};

// ---------- 1. AGENDA opener: headline + what you'll get ----------
const Agenda: React.FC<{ f: number }> = ({ f }) => {
  const rows: { at: number; n: string; label: string; sub: string; logo?: string; icon?: string }[] = [
    { at: F.one, n: "1", label: "Today's story", sub: "OpenAI · GPT-6 Astra", logo: "openai" },
    { at: F.three, n: "2", label: "Three quick hits", sub: "Revolut · Apple · Postman", icon: "⚡" },
    { at: F.end, n: "3", label: "A free tool at the end", sub: f >= F.free ? "works while you sleep" : "unlocks at 0:39", icon: "🎁" },
  ];
  return (
    <Shell f={f} at={-20} out={F.two - 10} tilt={-1.2} height={860}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <Logo name="openai" size={88} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 4 }}>TODAY IN AI</div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 82, lineHeight: 1.02, letterSpacing: -3, color: INK }}>OpenAI's AI designed a real gadget.</div>
      <Punch f={f} at={F.week} text="In under a week." fs={88} />
      <div style={{ marginTop: 26, borderTop: `3px solid ${SOFT}`, paddingTop: 18 }}>
        {rows.map((r, i) => { const k = pop(f, r.at, 12); const locked = i === 2 && f < F.free; return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 92, opacity: k, transform: `translateX(${lerp(-40, 0, k)}px)` }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: i === 2 ? RED : INK, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{r.n}</div>
            {r.logo ? <Logo name={r.logo} size={56} /> : <div style={{ width: 56, height: 56, borderRadius: 16, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flex: "none" }}>{r.icon}</div>}
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: INK, letterSpacing: -1 }}>{r.label}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: locked ? RED : GREY, marginTop: 2 }}>{locked ? "🔒 " : ""}{r.sub}</div>
            </div>
          </div>); })}
      </div>
    </Shell>
  );
};

// ---------- 2. the story (fixed height; visual area reserved from the start) ----------
const Step: React.FC<{ f: number; at: number; label: string; x: number; icon: string }> = ({ f, at, label, x, icon }) => {
  const k = pop(f, at, 10);
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: 200, textAlign: "center", transform: `scale(${0.85 + 0.15 * k})`, opacity: k > 0 ? 1 : 0.25 }}>
      <div style={{ width: 140, height: 100, margin: "0 auto", borderRadius: 22, background: k > 0 ? INK : SOFT, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>{icon}</div>
      <div style={{ marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: k > 0 ? INK : GREY, letterSpacing: 2 }}>{label}</div>
    </div>
  );
};
const StoryCard: React.FC<{ f: number }> = ({ f }) => (
  <Shell f={f} at={F.two - 8} out={F.hits2 - 10} tilt={1} height={740}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <Logo name="openai" size={76} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: RED, letterSpacing: 4 }}>1 · TODAY'S STORY</div>
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.04, letterSpacing: -2, color: INK, height: 140 }}>GPT-6 Astra designed a device for talking to Codex.</div>
    <div style={{ position: "relative", width: 956, height: 170, marginTop: 10 }}>
      <Step f={f} at={F.case} label="CASE" x={0} icon="▣" />
      <Step f={f} at={F.board} label="CIRCUIT BOARD" x={236} icon="▦" />
      <Step f={f} at={F.firmware} label="FIRMWARE" x={472} icon="{ }" />
      <Step f={f} at={F.factory} label="PROTOTYPES" x={708} icon="🏭" />
      <Stamp f={f} at={F.month} text="< 1 MONTH" x={560} y={30} rot={-8} />
    </div>
    <div style={{ height: 150, marginTop: 14 }}>
      {f >= F.catch && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: GREY, letterSpacing: 4, marginBottom: 8 }}>THE CATCH</div>}
      <div><Chip f={f} at={F.revisions} text="Several revisions needed" hue={RED} fs={32} /></div>
      <div style={{ marginTop: 8 }}><Chip f={f} at={F.missing} text="Kept missing manufacturing limits" fs={30} /></div>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 34, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: GREY, letterSpacing: 1 }}>OpenAI · The Decoder · Nov 3–4</div>
  </Shell>
);

// ---------- 3. three quick hits ----------
type Tick = { at: number; out: number; logo?: string; text?: string; h: string; chipAt: number; chip: string; hue?: string };
const TICKS: Tick[] = [
  { at: F.revolut - 6, out: F.apple - 8, text: "REVOLUT", h: "Revolut cut its AI coding bill 90% by self-hosting.", chipAt: F.ninety, chip: "−90%", hue: GREEN },
  { at: F.apple - 8, out: F.postman - 8, logo: "apple", h: "Apple opened Siri AI to every developer.", chipAt: F.siri, chip: "iOS 27.3 beta · App Intents" },
  { at: F.postman - 8, out: F.now - 10, text: "POSTMAN", h: "Postman quietly installed itself into Claude Code and Codex.", chipAt: F.check, chip: "Check ~/.claude & ~/.codex", hue: RED },
];
const Ticker: React.FC<{ f: number }> = ({ f }) => (
  <>
    {TICKS.map((t, i) => (
      <Shell key={i} f={f} at={t.at} out={t.out} tilt={i % 2 ? 1.2 : -1.2} fromRight height={560}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Logo name={t.logo} text={t.text} size={76} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: RED, letterSpacing: 4 }}>2 · QUICK HIT {i + 1}/3</div>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.06, letterSpacing: -2, color: INK, height: 260 }}>{t.h}</div>
        <div><Chip f={f} at={t.chipAt} text={t.chip} hue={t.hue} fs={34} /></div>
      </Shell>
    ))}
  </>
);

// ---------- 4. today's free tool (clear layout) ----------
const ToolCard: React.FC<{ f: number }> = ({ f }) => {
  const bullets: [number, string][] = [[F.reads, "Reads your mail, notes & files overnight"], [F.drafts, "Drafts your replies & fills forms"], [F.approve, "You just approve"]];
  return (
    <Shell f={f} at={F.now - 4} out={999999} tilt={-1} height={860}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ background: RED, color: "#fff", borderRadius: 999, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4 }}>3 · TODAY'S FREE TOOL</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 2 }}>{f >= F.mac ? "MAC APP" : ""}</div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, lineHeight: 1, letterSpacing: -4, color: INK, opacity: eout(ramp(f, F.sentient, F.sentient + 8)) }}>Sentient OS</div>
      <div style={{ marginTop: 22, height: 300 }}>
        {bullets.map(([at, t], i) => { const k = pop(f, at, 12); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, height: 92, opacity: k, transform: `translateX(${lerp(-30, 0, k)}px)` }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: GREEN, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, flex: "none" }}>✓</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: INK, letterSpacing: -1 }}>{t}</div>
          </div>); })}
      </div>
      <Punch f={f} at={F.freeword} text="Free. Open source." fs={76} />
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 34, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: INK, letterSpacing: 1 }}>sentient-os.ai</div>
        {f >= F.link && <div style={{ background: INK, color: "#fff", borderRadius: 999, padding: "12px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 2, transform: `scale(${pop(f, F.link, 10)})`, whiteSpace: "nowrap" }}>LINK IN PINNED COMMENT ↓</div>}
      </div>
    </Shell>
  );
};

// ---------- Byte ----------
const Byte: React.FC<{ f: number }> = ({ f }) => {
  const t = talkFor(f, "byte", SPK, ENV), on = speaking(f, "byte", SPK);
  const surprised = zapAt(f, PUNCHES) > 0.3 || (f >= F.catch && f < F.catch + 30) || (f >= F.postman && f < F.postman + 30);
  const mood = surprised ? "surprised" : f >= F.revisions && f < F.hits2 ? "neutral" : "happy";
  const nod = -pop(f, F.two, 8) * 20 - pop(f, F.hits2, 8) * 20 - pop(f, F.now, 8) * 24;
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(880 ${2330 + nod}) scale(2.1) rotate(${on ? 3 : 0})`}><Person d={BYTE} f={f} seed={7} talk={t} wave={f >= F.tomorrow ? 1 : 0} mood={mood as any} /></g>
    </svg>
  );
};

// ---------- film ----------
export const NewsFilm: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG0 }}>
      <FontStyle /><SerifFont />
      <Backdrop f={f} />
      <Chrome f={f} />
      <Agenda f={f} />
      <StoryCard f={f} />
      {f >= F.hits2 - 4 && f < F.revolut - 2 && <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 72, letterSpacing: -2, color: INK, opacity: eout(ramp(f, F.hits2 - 4, F.hits2 + 6)) }}>Three quick hits.</div>}
      <Ticker f={f} />
      <ToolCard f={f} />
            <Byte f={f} />
      <Caps f={f} words={WORDS} chunks={CHUNKS} accent={RED} theme="light" y={CAP_Y} />
      <Narration slug="news05" total={TOTAL} />
    </AbsoluteFill>
  );
};
