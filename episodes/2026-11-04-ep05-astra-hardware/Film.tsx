// Ai News ep05 (Nov 4 2026) — "HEADLINES + FREE TOOL" format v1.
// 0–5 s tool-benefit hook with locked tool tile · 5–21 s four fast headlines · 21–34 s the free tool, shown · hard cut.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, eback, pop, clamp01, lerp, VW, VH } from "./kit";
import { Narration, Caps, FONT, talkFor, speaking } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues ----------
const F = {
  this: 17, boring: 49, sleep: 77, first: 95, today: 124, news: 148,
  h1: 178, gadget: 233, week: 267,
  h2: 295, ninety: 348,
  h3: 392, siri: 415, developer: 446,
  h4: 489, claude: 551, check: 582,
  now: 627, free: 640, sentient: 664, night: 710, reads: 723, mail: 738, files: 750, drafts: 774, fills: 826, approve: 878, freeword: 902, open: 919, mac: 946, link: 963, tomorrow: 1019,
};
const UNLOCK_S = Math.round(F.now / 30); // shown on the locked tile

// ---------- palette ----------
const BG0 = "#efe9dd", BG1 = "#f8f4ea", RED = "#ff2e4d", INK = "#0f1117", GREY = "#6b7280", PAPER = "#ffffff", SOFT = "#eef0f5", GREEN = "#1fb978";
const SERIF = "PlayfairLocal, 'Playfair Display', Georgia, serif";
const SerifFont: React.FC = () => <style>{`@font-face{font-family:PlayfairLocal;font-weight:800;font-style:italic;src:url(${staticFile("playfair800i.woff2")}) format("woff2")}`}</style>;
const logo = (n: string) => staticFile(`logos/${n}.svg`);
const WIDE = new Set(["marvell", "microsoft", "amazon"]);
const BYTE = { ...CAST[5], name: "Byte", top: "hoodie" as const, topC: "#111118", hat: "headset" as const, hatC: RED, glasses: "square" as const, hair: "short" as const, hairC: "#111", prop: "none" as const, face: "none" as const };
// layout bands: chrome 70–130 · cards 300–1160 · captions 1235+ · Byte below
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
const Chip: React.FC<{ f: number; at: number; text: string; hue?: string; fs?: number }> = ({ f, at, text, hue, fs = 32 }) => {
  const k = pop(f, at, 12); if (k <= 0) return null;
  return <div style={{ display: "inline-block", transform: `scale(${k})`, transformOrigin: "left center", marginRight: 12, background: hue ?? SOFT, color: hue ? "#fff" : INK, fontFamily: FONT, fontWeight: 800, fontSize: fs, padding: "10px 22px", borderRadius: 999, whiteSpace: "nowrap" }}>{text}</div>;
};
const Mark: React.FC<{ progress: number; payoff?: number; zap?: number }> = ({ progress, payoff, zap = 0 }) => {
  const r = 22, C = 2 * Math.PI * r, a = payoff !== undefined ? -Math.PI / 2 + payoff * 2 * Math.PI : 0;
  return (
    <svg width={60} height={60} viewBox="0 0 60 60" style={{ overflow: "visible" }}>
      <circle cx={30} cy={32} r={r} fill="none" stroke={INK} strokeWidth={4.5} opacity={0.22} />
      <circle cx={30} cy={32} r={r} fill="none" stroke={RED} strokeWidth={4.5} strokeLinecap="round" strokeDasharray={`${C * clamp01(progress)} ${C}`} transform="rotate(-90 30 32)" />
      <rect x={25} y={4} width={10} height={6} rx={2} fill={INK} />
      <path d="M33 22 l-8 11 h7 l-3 9 l9 -12 h-7 z" fill={RED} transform={`translate(30 32) scale(${1 + zap * 0.6}) translate(-30 -32)`} />
      {payoff !== undefined && <text x={30 + Math.cos(a) * r} y={32 + Math.sin(a) * r + 6} textAnchor="middle" fontSize={16}>🎁</text>}
      {zap > 0 && <circle cx={30} cy={32} r={r + zap * 26} fill="none" stroke={RED} strokeWidth={3} opacity={1 - zap} />}
    </svg>
  );
};
const zapAt = (f: number, cues: number[]) => { let z = 0; for (const c of cues) { const q = f - c; if (q >= 0 && q < 16) z = Math.max(z, 1 - q / 16); } return z; };
const ZAPS = [F.week, F.ninety, F.developer, F.check, F.now, F.freeword];
const Chrome: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Mark progress={f / TOTAL} payoff={F.now / TOTAL} zap={zapAt(f, ZAPS)} /><div style={{ color: INK, fontSize: 30, letterSpacing: 6 }}>AI NEWS</div></div>
    <div style={{ color: INK, opacity: 0.55, fontSize: 26, letterSpacing: 5 }}>NOV 4 · 2026</div>
  </div>
);
const Backdrop: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG1} 0%, ${BG0} 100%)` }}>
    <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: `linear-gradient(${INK} 1px, transparent 1px), linear-gradient(90deg, ${INK} 1px, transparent 1px)`, backgroundSize: "90px 90px", backgroundPosition: `${(f * 0.12) % 90}px ${(f * 0.08) % 90}px` }} />
    <div style={{ position: "absolute", left: -200, top: -500, width: 1500, height: 1100, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,46,77,${0.16 + 0.03 * Math.sin(f * 0.05)}) 0%, rgba(255,46,77,0) 60%)` }} />
  </div>
);
const Shell: React.FC<{ f: number; at: number; out: number; tilt: number; children: React.ReactNode; fromRight?: boolean; height: number; top?: number }> = ({ f, at, out, tilt, children, fromRight, height, top = CARD_TOP }) => {
  if (f < at) return null;
  const tin = ramp(f, at, at + (fromRight ? 10 : 16)), tout = ramp(f, out, out + 10); if (tout >= 1) return null;
  const e = eback(tin), back = eio(tout);
  const tx = fromRight ? lerp(1200, 0, e) : 0, ty = fromRight ? 0 : lerp(1500, 0, e), rot = lerp(fromRight ? -6 : 9, tilt, eout(tin));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, transform: `translate(${tx - back * 1300}px, ${ty}px) rotate(${rot + back * 8}deg) scale(${lerp(1, 0.94, back)})`, transformOrigin: "50% 40%", opacity: 1 - back * 0.5, zIndex: tout > 0 ? 1 : 2 }}>
      <div style={{ background: PAPER, borderRadius: 40, padding: "48px 60px 40px", height, boxSizing: "border-box", boxShadow: "0 40px 80px rgba(0,0,0,0.28), 0 0 0 2px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>{children}</div>
    </div>
  );
};

// ---------- 1. HOOK: tool benefit + locked tile + "today's AI news" ----------
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const out = F.h1 - 8;
  if (f >= out + 10) return null;
  const o = 1 - ramp(f, out, out + 10);
  const lockShake = Math.sin(f * 0.9) * 3 * (f < F.first ? 1 : 0);
  const newsK = pop(f, F.today, 12);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 230, opacity: o, transform: `translateY(${lerp(0, -40, ramp(f, out, out + 10))}px)` }}>
      <div style={{ display: "inline-block", background: INK, color: "#fff", borderRadius: 999, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5 }}>TODAY IN AI · NOV 4</div>
      <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: 98, lineHeight: 1.0, letterSpacing: -4, color: INK }}>This free app does your boring work</div>
      <Punch f={f} at={F.sleep - 6} text="while you sleep." fs={100} />
      <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
        {/* locked tool tile */}
        <div style={{ flex: 1.15, height: 230, borderRadius: 32, background: PAPER, boxShadow: "0 30px 60px rgba(0,0,0,0.2)", padding: "28px 30px", boxSizing: "border-box", position: "relative", transform: `rotate(-2deg) scale(${pop(f, -12, 12)})` }}>
          <div style={{ fontSize: 64, transform: `rotate(${lockShake}deg)`, display: "inline-block" }}>🎁</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: INK, marginTop: 6 }}>Today's free tool</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: RED, marginTop: 4 }}>🔒 unlocks at 0:{String(UNLOCK_S).padStart(2, "0")}</div>
        </div>
        {/* news tile */}
        <div style={{ flex: 1, height: 230, borderRadius: 32, background: INK, padding: "28px 30px", boxSizing: "border-box", transform: `rotate(2deg) scale(${newsK})`, opacity: newsK > 0 ? 1 : 0 }}>
          <div style={{ display: "flex", gap: 10 }}>{[1, 2, 3, 4].map((n) => <div key={n} style={{ width: 50, height: 50, borderRadius: 14, background: n === 1 ? RED : "#2a2f3d", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(f, F.today + n * 3, 8)})` }}>{n}</div>)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff", marginTop: 18 }}>Today's AI news</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: "#9aa3b5", marginTop: 4 }}>4 headlines · first</div>
        </div>
      </div>
    </div>
  );
};

// ---------- 2. four fast headlines ----------
type Head = { at: number; out: number; logo?: string; text?: string; h: string; punch?: string; punchAt?: number; chip?: string; chipAt?: number; hue?: string; src: string };
const HEADS: Head[] = [
  { at: F.h1 - 6, out: F.h2 - 6, logo: "openai", h: "OpenAI's AI designed a real gadget", punch: "in under a week.", punchAt: F.week - 4, src: "OpenAI · The Decoder" },
  { at: F.h2 - 6, out: F.h3 - 6, text: "REVOLUT", h: "Revolut cut its AI coding bill", punch: "−90%.", punchAt: F.ninety, src: "The Register" },
  { at: F.h3 - 6, out: F.h4 - 6, logo: "apple", h: "Apple opened Siri AI to", punch: "every developer.", punchAt: F.developer - 4, src: "Apple Developer" },
  { at: F.h4 - 6, out: F.now - 8, text: "POSTMAN", h: "Postman quietly installed itself into Claude Code.", chip: "⚠ Check your settings", chipAt: F.check, hue: RED, src: "GitHub issue #14370" },
];
const Headlines: React.FC<{ f: number }> = ({ f }) => (
  <>
    {HEADS.map((t, i) => (
      <Shell key={i} f={f} at={t.at} out={t.out} tilt={i % 2 ? 1.4 : -1.4} fromRight height={620} top={380}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <Logo name={t.logo} text={t.text} size={84} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: RED, letterSpacing: 4 }}>NEWS {i + 1}<span style={{ color: "#c3c7d1" }}>/4</span></div>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 74, lineHeight: 1.04, letterSpacing: -3, color: INK }}>{t.h}</div>
        {t.punch && <Punch f={f} at={t.punchAt!} text={t.punch} fs={80} />}
        {t.chip && <div style={{ marginTop: 18 }}><Chip f={f} at={t.chipAt!} text={t.chip} hue={t.hue} fs={36} /></div>}
        <div style={{ position: "absolute", left: 60, bottom: 34, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: GREY, letterSpacing: 1 }}>{t.src} · Nov 3–4</div>
      </Shell>
    ))}
    {/* progress pips under the cards */}
    {f >= F.h1 - 6 && f < F.now - 8 && (
      <div style={{ position: "absolute", left: 0, right: 0, top: 1050, display: "flex", justifyContent: "center", gap: 14, opacity: 1 - ramp(f, F.now - 14, F.now - 8) }}>
        {HEADS.map((t, i) => <div key={i} style={{ width: f >= t.at ? 64 : 22, height: 14, borderRadius: 7, background: f >= t.out ? INK : f >= t.at ? RED : "#d6d0c3" }} />)}
        <div style={{ width: 22, height: 14, borderRadius: 7, background: "#d6d0c3", marginLeft: 10 }} />
        <div style={{ fontSize: 22, marginTop: -6 }}>🎁</div>
      </div>
    )}
  </>
);

// ---------- 3. the free tool ----------
const Unlock: React.FC<{ f: number }> = ({ f }) => {
  const q = f - (F.now - 8); if (q < 0 || q > 22) return null;
  const burst = eout(clamp01(q / 14)), o = 1 - clamp01((q - 12) / 10);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: o, zIndex: 20 }}>
      <div style={{ fontSize: 180, transform: `scale(${lerp(0.4, 1.4, burst)}) rotate(${lerp(-20, 0, burst)}deg)` }}>🎁</div>
      {[...Array(10)].map((_, i) => { const a = (i / 10) * Math.PI * 2; return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 260 * burst - 12, top: 90 + Math.sin(a) * 260 * burst, width: 24, height: 24, borderRadius: 6, background: i % 2 ? RED : INK, transform: `rotate(${i * 40}deg)` }} />; })}
    </div>
  );
};
const ToolCard: React.FC<{ f: number }> = ({ f }) => {
  const steps: [number, string, string][] = [[F.reads, "☾", "Reads your mail & files at night"], [F.drafts, "✎", "Drafts your replies"], [F.fills, "▤", "Fills your forms"], [F.approve, "✓", "You just approve"]];
  return (
    <Shell f={f} at={F.now + 4} out={999999} tilt={-1} height={860}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ background: RED, color: "#fff", borderRadius: 999, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4 }}>🎁 TODAY'S FREE TOOL</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 2 }}>MAC</div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: -4, color: INK, opacity: eout(ramp(f, F.sentient - 4, F.sentient + 6)) }}>Sentient OS</div>
      <div style={{ marginTop: 20, height: 380 }}>
        {steps.map(([at, ic, t], i) => { const k = pop(f, at, 12); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 92, opacity: k, transform: `translateX(${lerp(-30, 0, k)}px)` }}>
            <div style={{ width: 62, height: 62, borderRadius: 18, background: i === 3 ? GREEN : INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, flex: "none" }}>{ic}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: INK, letterSpacing: -1 }}>{t}</div>
          </div>); })}
      </div>
      <Punch f={f} at={F.freeword} text="Free · open source" fs={74} />
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 34, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: INK }}>sentient-os.ai</div>
        {f >= F.link && <div style={{ background: INK, color: "#fff", borderRadius: 999, padding: "12px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 2, transform: `scale(${pop(f, F.link, 10)})`, whiteSpace: "nowrap" }}>LINK IN PINNED COMMENT ↓</div>}
      </div>
    </Shell>
  );
};

// ---------- Byte ----------
const Byte: React.FC<{ f: number }> = ({ f }) => {
  const t = talkFor(f, "byte", SPK, ENV), on = speaking(f, "byte", SPK);
  const surprised = zapAt(f, ZAPS) > 0.3 || (f >= F.h4 && f < F.check + 20);
  const nod = -pop(f, F.h1, 8) * 16 - pop(f, F.h2, 8) * 16 - pop(f, F.h3, 8) * 16 - pop(f, F.h4, 8) * 16 - pop(f, F.now, 8) * 26;
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(880 ${2330 + nod}) scale(2.1) rotate(${on ? 3 : 0})`}><Person d={BYTE} f={f} seed={7} talk={t} wave={f >= F.tomorrow ? 1 : 0} mood={(surprised ? "surprised" : "happy") as any} /></g>
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
      <Hook f={f} />
      <Headlines f={f} />
      <Unlock f={f} />
      <ToolCard f={f} />
      <Byte f={f} />
      <Caps f={f} words={WORDS} chunks={CHUNKS} accent={RED} theme="light" y={CAP_Y} />
      <Narration slug="news05" total={TOTAL} />
    </AbsoluteFill>
  );
};
