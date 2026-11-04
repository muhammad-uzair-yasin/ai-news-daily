// Ai News ep05 (Nov 4 2026) — SINGLE-STORY format v1 ("Distilled" look, cream, Byte).
// Beats: hook card + payoff promise → one story with an in-card visual → 3-card ticker → the free tool → hard cut.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, eback, pop, clamp01, lerp, VW, VH } from "./kit";
import { Narration, Caps, FONT, talkFor, speaking } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";

// ---------- cues (frames from words.ts) ----------
const F = {
  openai: 17, gadget: 81, circuit: 113, week: 161, stay: 197, end: 221, free: 250, sleep: 305,
  two: 330, astra: 405, device: 443, codex: 493, astra2: 518, case: 537, board: 551, firmware: 578, interface: 603, week2: 634, factory: 669, prototypes: 710, month: 732,
  but: 772, revisions: 809, missing: 865, tolerances: 916,
  three: 962, revolut: 1017, ninety: 1069, apple: 1132, siri: 1156, postman: 1216, claude: 1287, check: 1335,
  now: 1381, sentient: 1417, open: 1455, mac: 1497, night: 1523, mail: 1551, notes: 1559, files: 1573, drafts: 1606, forms: 1637, waits: 1665, okay: 1690, freelife: 1709, link: 1743, tomorrow: 1799,
};

// ---------- palette ----------
const BG0 = "#efe9dd", BG1 = "#f8f4ea", RED = "#ff2e4d", INK = "#0f1117", GREY = "#6b7280", PAPER = "#ffffff", SOFT = "#eef0f5", GREEN = "#1fb978";
const SERIF = "PlayfairLocal, 'Playfair Display', Georgia, serif";
const SerifFont: React.FC = () => <style>{`@font-face{font-family:PlayfairLocal;font-weight:800;font-style:italic;src:url(${staticFile("playfair800i.woff2")}) format("woff2")}`}</style>;
const logo = (n: string) => staticFile(`logos/${n}.svg`);
const WIDE = new Set(["marvell", "microsoft", "amazon"]);
const BYTE = { ...CAST[5], name: "Byte", top: "hoodie" as const, topC: "#111118", hat: "headset" as const, hatC: RED, glasses: "square" as const, hair: "short" as const, hairC: "#111", prop: "none" as const, face: "none" as const };

// ---------- primitives ----------
const Logo: React.FC<{ name?: string; text?: string; size?: number }> = ({ name, text, size = 84 }) => (
  <div style={{ minWidth: name ? (WIDE.has(name) ? size * 2.6 : size) : undefined, height: size, padding: text ? "0 22px" : 0, borderRadius: size * 0.24, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.38, color: INK, letterSpacing: 1 }}>
    {name ? <img src={logo(name)} style={{ width: WIDE.has(name) ? size * 2.2 : size * 0.62, height: size * 0.62, objectFit: "contain" }} /> : text}
  </div>
);
const Punch: React.FC<{ f: number; at: number; text: string; big?: boolean }> = ({ f, at, text, big }) => {
  const k = eout(ramp(f, at, at + 9));
  return (
    <div style={{ position: "relative", display: "inline-block", marginTop: big ? 14 : 8 }}>
      <div style={{ position: "absolute", left: -4, top: 0, bottom: 0, right: -4, background: RED, borderRadius: 6, transform: `rotate(-1.2deg) scaleX(${k})`, transformOrigin: "left center", boxShadow: k > 0 ? "0 10px 30px rgba(255,46,77,0.35)" : "none" }} />
      <div style={{ position: "relative", color: k > 0.5 ? "#fff" : INK, fontFamily: SERIF, fontStyle: "italic", fontWeight: 800, fontSize: big ? 100 : text.length > 13 ? 74 : 92, lineHeight: 1.05, padding: "4px 28px 12px", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};
const Chip: React.FC<{ f: number; at: number; text: string; hue?: string; fs?: number }> = ({ f, at, text, hue, fs = 32 }) => {
  const k = pop(f, at, 12); if (k <= 0) return null;
  return <div style={{ display: "inline-block", transform: `scale(${k})`, transformOrigin: "left center", marginRight: 12, marginTop: 10, background: hue ?? SOFT, color: hue ? "#fff" : INK, fontFamily: FONT, fontWeight: 800, fontSize: fs, padding: "9px 20px", borderRadius: 999, whiteSpace: "nowrap" }}>{text}</div>;
};
const Stamp: React.FC<{ f: number; at: number; text: string; x: number; y: number; rot?: number; hue?: string }> = ({ f, at, text, x, y, rot = -10, hue = RED }) => {
  const k = pop(f, at, 10); if (k <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${lerp(2.2, 1, k)})`, opacity: k, border: `6px solid ${hue}`, color: hue, borderRadius: 14, padding: "6px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 38, letterSpacing: 4, background: "rgba(255,255,255,0.85)" }}>{text}</div>;
};
const Step: React.FC<{ f: number; at: number; label: string; x: number; icon: string }> = ({ f, at, label, x, icon }) => {
  const k = pop(f, at, 10);
  return (
    <div style={{ position: "absolute", left: x, top: 20, width: 200, textAlign: "center", transform: `scale(${0.85 + 0.15 * k})`, opacity: k > 0 ? 1 : 0.28 }}>
      <div style={{ width: 150, height: 110, margin: "0 auto", borderRadius: 22, background: k > 0 ? INK : SOFT, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>{icon}</div>
      <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: k > 0 ? INK : GREY, letterSpacing: 2 }}>{label}</div>
    </div>
  );
};

// ---------- brand mark with progress ring + payoff marker ----------
const Mark: React.FC<{ s?: number; progress: number; payoff?: number; zap?: number }> = ({ s = 1, progress, payoff, zap = 0 }) => {
  const r = 22, C = 2 * Math.PI * r;
  const a = payoff !== undefined ? -Math.PI / 2 + payoff * 2 * Math.PI : 0;
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
const PUNCHES = [F.week, F.freelife];
const Chrome: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: eout(ramp(f, F.stay, F.stay + 10)), fontFamily: FONT, fontWeight: 800 }}>
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

// ---------- generic card shell ----------
const Shell: React.FC<{ f: number; at: number; out: number; tilt: number; children: React.ReactNode; top: number; fromRight?: boolean }> = ({ f, at, out, tilt, children, top, fromRight }) => {
  if (f < at) return null;
  const tin = ramp(f, at, at + 16), tout = ramp(f, out, out + 14); if (tout >= 1) return null;
  const e = eback(tin), back = eio(tout);
  const tx = fromRight ? lerp(1200, 0, e) : 0, ty = fromRight ? 0 : lerp(1500, 0, e);
  const rot = lerp(fromRight ? -6 : 9, tilt, eout(tin));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, transform: `translate(${tx - back * 1300}px, ${ty}px) rotate(${rot + back * 8}deg) scale(${lerp(1, 0.94, back)})`, transformOrigin: "50% 40%", opacity: 1 - back * 0.5, zIndex: tout > 0 ? 1 : 2 }}>
      <div style={{ background: PAPER, borderRadius: 40, padding: "52px 62px 44px", boxShadow: "0 40px 80px rgba(0,0,0,0.28), 0 0 0 2px rgba(0,0,0,0.04)", position: "relative" }}>{children}</div>
    </div>
  );
};

// ---------- 1. the story card (hook → body) ----------
const StoryCard: React.FC<{ f: number }> = ({ f }) => {
  const atStage = f >= F.two; // after the hook the card moves up to make room for the visual
  const top = lerp(430, 330, eio(ramp(f, F.two - 10, F.two + 8)));
  return (
    <Shell f={f} at={-20} out={F.three - 12} tilt={-1.5} top={top}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <Logo name="openai" size={92} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: GREY, letterSpacing: 4 }}>TODAY'S STORY</div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: 1.04, letterSpacing: -3, color: INK }}>OpenAI's AI designed a real gadget.</div>
      <Punch f={f} at={F.week} text="In under a week." big />
      {/* in-card visual: the four things Astra produced, then the factory, then the catch */}
      {atStage && (
        <div style={{ position: "relative", width: 956, height: 250, marginTop: 14 }}>
          <Step f={f} at={F.case} label="CASE" x={0} icon="▣" />
          <Step f={f} at={F.board} label="CIRCUIT BOARD" x={236} icon="▦" />
          <Step f={f} at={F.firmware} label="FIRMWARE" x={472} icon="{ }" />
          <Step f={f} at={F.interface} label="INTERFACE" x={708} icon="◉" />
          <Stamp f={f} at={F.week2} text="< 1 WEEK" x={360} y={40} rot={-8} />
          <div style={{ position: "absolute", left: 0, top: 190 }}>
            <Chip f={f} at={F.prototypes} text="Factory built real prototypes" hue={GREEN} fs={30} />
            <Chip f={f} at={F.month} text="in under a month" fs={30} />
          </div>
        </div>
      )}
      {f >= F.but && (
        <div style={{ marginTop: 6 }}>
          <Chip f={f} at={F.revisions} text="But: several revisions" hue={RED} fs={32} />
          <Chip f={f} at={F.tolerances} text="missed manufacturing tolerances" fs={30} />
        </div>
      )}
      <div style={{ marginTop: 20, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 1 }}>OpenAI · The Decoder · Nov 3–4</div>
    </Shell>
  );
};

// ---------- payoff promise pill (under the hook card) ----------
const Promise: React.FC<{ f: number }> = ({ f }) => {
  if (f < F.stay || f >= F.two - 6) return null;
  const k = eback(ramp(f, F.stay, F.stay + 12)), o = 1 - ramp(f, F.two - 12, F.two - 4);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1090, display: "flex", justifyContent: "center", opacity: o, zIndex: 5 }}>
      <div style={{ transform: `scale(${k})`, background: INK, color: "#fff", borderRadius: 999, padding: "20px 40px", fontFamily: FONT, fontWeight: 800, fontSize: 31, display: "flex", alignItems: "center", gap: 16, whiteSpace: "nowrap", boxShadow: "0 16px 40px rgba(0,0,0,0.25)" }}>
        <span style={{ background: RED, borderRadius: 999, padding: "6px 16px", fontSize: 26, letterSpacing: 3 }}>AT THE END</span>
        <span>{f >= F.free ? "a free app that works while you sleep" : "a free app…"}</span>
      </div>
    </div>
  );
};

// ---------- 2. ticker: three more things ----------
type Tick = { at: number; out: number; logo?: string; text?: string; h: string; chipAt?: number; chip?: string; hue?: string };
const TICKS: Tick[] = [
  { at: F.revolut - 6, out: F.apple - 8, text: "REVOLUT", h: "Revolut cut its AI coding bill 90% by self-hosting GLM.", chipAt: F.ninety, chip: "−90%", hue: GREEN },
  { at: F.apple - 8, out: F.postman - 8, logo: "apple", h: "Apple opened Siri AI to every developer (iOS 27.3 beta).", chipAt: F.siri, chip: "App Intents" },
  { at: F.postman - 8, out: F.now - 10, text: "POSTMAN", h: "Postman quietly installed itself into Claude Code and Codex.", chipAt: F.check, chip: "Check ~/.claude & ~/.codex", hue: RED },
];
const Ticker: React.FC<{ f: number }> = ({ f }) => (
  <>
    {f >= F.three - 4 && f < F.now - 6 && (
      <div style={{ position: "absolute", left: 60, right: 60, top: 330, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, letterSpacing: -2, whiteSpace: "nowrap", color: INK, opacity: eout(ramp(f, F.three - 4, F.three + 6)) * (1 - ramp(f, F.now - 14, F.now - 6)) }}>
        Three more things today.
      </div>
    )}
    {TICKS.map((t, i) => (
      <Shell key={i} f={f} at={t.at} out={t.out} tilt={i % 2 ? 1.2 : -1.2} top={470} fromRight>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <Logo name={t.logo} text={t.text} size={76} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: RED, letterSpacing: 3 }}>{String(i + 1).padStart(2, "0")}<span style={{ color: "#c3c7d1" }}> / 03</span></div>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.06, letterSpacing: -2, color: INK }}>{t.h}</div>
        {t.chip && <div><Chip f={f} at={t.chipAt!} text={t.chip} hue={t.hue} fs={34} /></div>}
      </Shell>
    ))}
  </>
);

// ---------- 3. the free tool ----------
const ToolCard: React.FC<{ f: number }> = ({ f }) => {
  const night = f >= F.night;
  return (
    <Shell f={f} at={F.now - 4} out={999999} tilt={1} top={330}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <Logo text="SENTIENT OS" size={92} />
        <div style={{ background: RED, color: "#fff", borderRadius: 999, padding: "8px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 3 }}>THE FREE ONE</div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, lineHeight: 1.04, letterSpacing: -3, color: INK }}>It works while you sleep.</div>
      <Punch f={f} at={F.freelife} text="Free for life." big />
      <div><Chip f={f} at={F.open} text="Open source" fs={30} /><Chip f={f} at={F.mac} text="Runs on your Mac" fs={30} /></div>
      {/* night timeline: reads → drafts → waits for OK */}
      <div style={{ position: "relative", width: 956, height: 230, marginTop: 18 }}>
        <div style={{ position: "absolute", left: 0, top: 10, width: 120, height: 120, borderRadius: 24, background: night ? INK : SOFT, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>☾</div>
        {[["MAIL", F.mail], ["NOTES", F.notes], ["FILES", F.files]].map(([l, at], i) => { const k = pop(f, at as number, 10); return <div key={i} style={{ position: "absolute", left: 150, top: 4 + i * 50, width: 170, height: 42, borderRadius: 10, background: k > 0 ? SOFT : "transparent", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: INK, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k})`, opacity: k }}>{l}</div>; })}
        <svg width={956} height={200} style={{ position: "absolute", inset: 0 }}>
          <path d="M 330 75 L 410 75" stroke={RED} strokeWidth={6} strokeDasharray={80} strokeDashoffset={80 * (1 - eout(ramp(f, F.drafts - 6, F.drafts + 6)))} />
        </svg>
        {[["Drafts replies", F.drafts], ["Fills forms", F.forms]].map(([l, at], i) => { const k = pop(f, at as number, 10); return <div key={i} style={{ position: "absolute", left: 420, top: 16 + i * 76, width: 250, height: 60, borderRadius: 14, background: INK, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k})`, opacity: k }}>{l}</div>; })}
        {(() => { const k = pop(f, F.waits, 12), ok = f >= F.okay; return <div style={{ position: "absolute", left: 700, top: 24, width: 250, height: 120, borderRadius: 22, border: `5px solid ${ok ? GREEN : INK}`, background: ok ? GREEN : PAPER, color: ok ? "#fff" : INK, fontFamily: FONT, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k})`, opacity: k, letterSpacing: 2, whiteSpace: "nowrap" }}>{ok ? "✓ APPROVED" : "WAITS FOR OK"}</div>; })()}
      </div>
      {f >= F.link && <div style={{ marginTop: 6, display: "inline-block", background: INK, color: "#fff", borderRadius: 999, padding: "12px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 2, transform: `scale(${pop(f, F.link, 10)})`, transformOrigin: "left center", whiteSpace: "nowrap" }}>LINK IN PINNED COMMENT ↓</div>}
      <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 1 }}>sentient-os.ai · GitHub (AGPL-3.0)</div>
    </Shell>
  );
};

// ---------- Byte ----------
const Byte: React.FC<{ f: number }> = ({ f }) => {
  const t = talkFor(f, "byte", SPK, ENV), on = speaking(f, "byte", SPK);
  const surprised = zapAt(f, PUNCHES) > 0.3 || (f >= F.but && f < F.but + 30) || (f >= F.postman && f < F.postman + 30);
  const mood = surprised ? "surprised" : f >= F.revisions && f < F.three ? "neutral" : "happy";
  const nod = -pop(f, F.three, 8) * 20 - pop(f, F.now, 8) * 24;
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
      <StoryCard f={f} />
      <Promise f={f} />
      <Ticker f={f} />
      <ToolCard f={f} />
      {/* CTA lower third on the last line, held to the cut */}
      {f >= F.tomorrow - 2 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: INK, letterSpacing: 3, opacity: eout(ramp(f, F.tomorrow - 2, F.tomorrow + 8)) }}>
          <span style={{ background: PAPER, borderRadius: 999, padding: "14px 34px", boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}>Follow · a new one every day</span>
        </div>
      )}
      <Byte f={f} />
      <Caps f={f} words={WORDS} chunks={CHUNKS} accent={RED} theme="light" y={1250} />
      <Narration slug="news05" total={TOTAL} />
    </AbsoluteFill>
  );
};
