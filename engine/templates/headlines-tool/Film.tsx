// Ai News — "HEADLINES + FREE TOOL" daily template (locked Nov 4 2026, approved by Uzair).
// Copy this file + entry.tsx UNCHANGED into the episode folder. All daily content lives in episode.ts;
// cue frames are found automatically from words.ts by the spoken words named in episode.ts.
// Beats: 0–5 s tool-benefit hook + locked 🎁 tile · ~4 fast headlines (one line each) · 🎁 unlock · the free tool, shown · hard cut.
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { FontStyle, ramp, eio, eout, eback, pop, clamp01, lerp, VW, VH } from "./kit";
import { Narration, Caps, FONT, talkFor, speaking } from "./factkit";
import { Person, CAST } from "./Humans";
import { WORDS, CHUNKS, TOTAL, ENV, SPK } from "./words";
import { EP } from "./episode";

// ---------- cue lookup: first spoken word matching `w` at or after frame `after` ----------
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9%$'-]/g, "").replace(/'s$/, "");
const cue = (w: string, after = 0): number => {
  const t = norm(w);
  const hit = WORDS.find(([a, , s]) => a >= after && norm(s) === t);
  if (!hit) throw new Error(`episode.ts cue word "${w}" not found in words.ts after frame ${after}`);
  return hit[0];
};
// resolve all cues in spoken order
const C = (() => {
  const sleep = cue(EP.cues.hookPunch);
  const today = cue(EP.cues.news, sleep);
  let after = today;
  const heads = EP.heads.map((h) => {
    const at = cue(h.cue, after); after = at;
    const punchAt = h.punchCue ? cue(h.punchCue, at) : undefined;
    const chipAt = h.chipCue ? cue(h.chipCue, at) : undefined;
    after = Math.max(after, punchAt ?? 0, chipAt ?? 0);
    return { at, punchAt, chipAt };
  });
  const now = cue(EP.tool.cueNow, after);
  const name = cue(EP.tool.cueName, now);
  let a2 = name;
  const steps = EP.tool.steps.map((s) => { const at = cue(s.cue, a2); a2 = at; return at; });
  const punch = cue(EP.tool.cuePunch, a2);
  const link = cue(EP.tool.cueLink, punch);
  const bye = cue(EP.cues.bye, link);
  return { sleep, today, heads, now, name, steps, punch, link, bye };
})();
const UNLOCK_S = Math.round(C.now / 30);

// ---------- palette ----------
const BG0 = "#efe9dd", BG1 = "#f8f4ea", RED = "#ff2e4d", INK = "#0f1117", GREY = "#6b7280", PAPER = "#ffffff", SOFT = "#eef0f5", GREEN = "#1fb978";
const HUE: Record<string, string> = { red: RED, green: GREEN, ink: INK };
const SERIF = "PlayfairLocal, 'Playfair Display', Georgia, serif";
const SerifFont: React.FC = () => <style>{`@font-face{font-family:PlayfairLocal;font-weight:800;font-style:italic;src:url(${staticFile("playfair800i.woff2")}) format("woff2")}`}</style>;
const logo = (n: string) => staticFile(`logos/${n}.svg`);
const WIDE = new Set(["marvell", "microsoft", "amazon"]);
const BYTE = { ...CAST[5], name: "Byte", top: "hoodie" as const, topC: "#111118", hat: "headset" as const, hatC: RED, glasses: "square" as const, hair: "short" as const, hairC: "#111", prop: "none" as const, face: "none" as const };
// layout bands: chrome 70–130 · cards 300–1160 · captions 1235+ · Byte below. Cards have FIXED heights — never let content grow into captions.
const CARD_TOP = 300, CAP_Y = 1235;

// ---------- primitives ----------
const Logo: React.FC<{ name?: string; text?: string; size?: number }> = ({ name, text, size = 84 }) => (
  <div style={{ minWidth: name ? (WIDE.has(name) ? size * 2.6 : size) : undefined, height: size, padding: name ? 0 : "0 22px", borderRadius: size * 0.24, background: SOFT, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.36, color: INK, letterSpacing: 1 }}>
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
const Mark: React.FC<{ progress: number; payoff: number; zap?: number }> = ({ progress, payoff, zap = 0 }) => {
  const r = 22, Cc = 2 * Math.PI * r, a = -Math.PI / 2 + payoff * 2 * Math.PI;
  return (
    <svg width={60} height={60} viewBox="0 0 60 60" style={{ overflow: "visible" }}>
      <circle cx={30} cy={32} r={r} fill="none" stroke={INK} strokeWidth={4.5} opacity={0.22} />
      <circle cx={30} cy={32} r={r} fill="none" stroke={RED} strokeWidth={4.5} strokeLinecap="round" strokeDasharray={`${Cc * clamp01(progress)} ${Cc}`} transform="rotate(-90 30 32)" />
      <rect x={25} y={4} width={10} height={6} rx={2} fill={INK} />
      <path d="M33 22 l-8 11 h7 l-3 9 l9 -12 h-7 z" fill={RED} transform={`translate(30 32) scale(${1 + zap * 0.6}) translate(-30 -32)`} />
      <text x={30 + Math.cos(a) * r} y={32 + Math.sin(a) * r + 6} textAnchor="middle" fontSize={16}>🎁</text>
      {zap > 0 && <circle cx={30} cy={32} r={r + zap * 26} fill="none" stroke={RED} strokeWidth={3} opacity={1 - zap} />}
    </svg>
  );
};
const zapAt = (f: number, cues: number[]) => { let z = 0; for (const c of cues) { const q = f - c; if (q >= 0 && q < 16) z = Math.max(z, 1 - q / 16); } return z; };
const ZAPS = [...C.heads.map((h) => h.punchAt ?? h.chipAt ?? h.at), C.now, C.punch];
const Chrome: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 70, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}><Mark progress={f / TOTAL} payoff={C.now / TOTAL} zap={zapAt(f, ZAPS)} /><div style={{ color: INK, fontSize: 30, letterSpacing: 6 }}>AI NEWS</div></div>
    <div style={{ color: INK, opacity: 0.55, fontSize: 26, letterSpacing: 5 }}>{EP.date}</div>
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

// ---------- 1. HOOK ----------
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const out = C.heads[0].at - 8;
  if (f >= out + 10) return null;
  const o = 1 - ramp(f, out, out + 10);
  const lockShake = Math.sin(f * 0.9) * 3 * (f < C.today ? 1 : 0);
  const newsK = pop(f, C.today, 12), n = EP.heads.length;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 230, opacity: o, transform: `translateY(${lerp(0, -40, ramp(f, out, out + 10))}px)` }}>
      <div style={{ display: "inline-block", background: INK, color: "#fff", borderRadius: 999, padding: "12px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5 }}>TODAY IN AI · {EP.dateShort}</div>
      <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: 98, lineHeight: 1.0, letterSpacing: -4, color: INK }}>{EP.hook.line}</div>
      <Punch f={f} at={C.sleep - 6} text={EP.hook.punch} fs={100} />
      <div style={{ display: "flex", gap: 24, marginTop: 40 }}>
        <div style={{ flex: 1.15, height: 230, borderRadius: 32, background: PAPER, boxShadow: "0 30px 60px rgba(0,0,0,0.2)", padding: "28px 30px", boxSizing: "border-box", transform: `rotate(-2deg) scale(${pop(f, -12, 12)})` }}>
          <div style={{ fontSize: 64, transform: `rotate(${lockShake}deg)`, display: "inline-block" }}>🎁</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: INK, marginTop: 6 }}>Today's free tool</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: RED, marginTop: 4 }}>🔒 unlocks at 0:{String(UNLOCK_S).padStart(2, "0")}</div>
        </div>
        <div style={{ flex: 1, height: 230, borderRadius: 32, background: INK, padding: "28px 30px", boxSizing: "border-box", transform: `rotate(2deg) scale(${newsK})`, opacity: newsK > 0 ? 1 : 0 }}>
          <div style={{ display: "flex", gap: 10 }}>{EP.heads.map((_, i) => <div key={i} style={{ width: 50, height: 50, borderRadius: 14, background: i === 0 ? RED : "#2a2f3d", color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(f, C.today + (i + 1) * 3, 8)})` }}>{i + 1}</div>)}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff", marginTop: 18 }}>Today's AI news</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: "#9aa3b5", marginTop: 4 }}>{n} headlines · first</div>
        </div>
      </div>
    </div>
  );
};

// ---------- 2. headlines ----------
const Headlines: React.FC<{ f: number }> = ({ f }) => {
  const n = EP.heads.length;
  const outs = C.heads.map((h, i) => (i < n - 1 ? C.heads[i + 1].at - 6 : C.now - 8));
  return (
    <>
      {EP.heads.map((t, i) => {
        const c = C.heads[i];
        return (
          <Shell key={i} f={f} at={c.at - 6} out={outs[i]} tilt={i % 2 ? 1.4 : -1.4} fromRight height={620} top={380}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <Logo name={t.logo} text={t.badge} size={84} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: RED, letterSpacing: 4 }}>NEWS {i + 1}<span style={{ color: "#c3c7d1" }}>/{n}</span></div>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: t.h.length > 52 ? 64 : 74, lineHeight: 1.04, letterSpacing: -3, color: INK }}>{t.h}</div>
            {t.punch && <Punch f={f} at={(c.punchAt ?? c.at) - 4} text={t.punch} fs={t.punch.length > 16 ? 64 : 80} />}
            {t.chip && <div style={{ marginTop: 18 }}><Chip f={f} at={c.chipAt ?? c.at} text={t.chip} hue={HUE[t.chipHue ?? "ink"]} fs={36} /></div>}
            <div style={{ position: "absolute", left: 60, bottom: 34, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: GREY, letterSpacing: 1 }}>{t.src}</div>
          </Shell>
        );
      })}
      {f >= C.heads[0].at - 6 && f < C.now - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1050, display: "flex", justifyContent: "center", gap: 14, opacity: 1 - ramp(f, C.now - 14, C.now - 8) }}>
          {C.heads.map((c, i) => <div key={i} style={{ width: f >= c.at - 6 ? 64 : 22, height: 14, borderRadius: 7, background: f >= outs[i] ? INK : f >= c.at - 6 ? RED : "#d6d0c3" }} />)}
          <div style={{ width: 22, height: 14, borderRadius: 7, background: "#d6d0c3", marginLeft: 10 }} />
          <div style={{ fontSize: 22, marginTop: -6 }}>🎁</div>
        </div>
      )}
    </>
  );
};

// ---------- 3. the free tool ----------
const Unlock: React.FC<{ f: number }> = ({ f }) => {
  const q = f - (C.now - 8); if (q < 0 || q > 22) return null;
  const burst = eout(clamp01(q / 14)), o = 1 - clamp01((q - 12) / 10);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: o, zIndex: 20 }}>
      <div style={{ fontSize: 180, transform: `scale(${lerp(0.4, 1.4, burst)}) rotate(${lerp(-20, 0, burst)}deg)` }}>🎁</div>
      {[...Array(10)].map((_, i) => { const a = (i / 10) * Math.PI * 2; return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 260 * burst - 12, top: 90 + Math.sin(a) * 260 * burst, width: 24, height: 24, borderRadius: 6, background: i % 2 ? RED : INK, transform: `rotate(${i * 40}deg)` }} />; })}
    </div>
  );
};
const ToolCard: React.FC<{ f: number }> = ({ f }) => {
  const T = EP.tool, last = T.steps.length - 1;
  return (
    <Shell f={f} at={C.now + 4} out={999999} tilt={-1} height={860}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ background: RED, color: "#fff", borderRadius: 999, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4 }}>🎁 TODAY'S FREE TOOL</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: GREY, letterSpacing: 2 }}>{T.platform}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: eout(ramp(f, C.name - 4, C.name + 6)) }}>
        {T.logo && <Logo name={T.logo} size={96} />}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: T.name.length > 12 ? 84 : 104, lineHeight: 1, letterSpacing: -4, color: INK }}>{T.name}</div>
      </div>
      <div style={{ marginTop: 20, height: 380 }}>
        {T.steps.map((s, i) => { const k = pop(f, C.steps[i], 12); return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 92, opacity: k, transform: `translateX(${lerp(-30, 0, k)}px)` }}>
            <div style={{ width: 62, height: 62, borderRadius: 18, background: i === last ? GREEN : INK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, flex: "none" }}>{s.icon}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: s.text.length > 30 ? 38 : 44, color: INK, letterSpacing: -1 }}>{s.text}</div>
          </div>); })}
      </div>
      <Punch f={f} at={C.punch} text={T.punch} fs={T.punch.length > 18 ? 64 : 74} />
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 34, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: INK }}>{T.site}</div>
        {f >= C.link && <div style={{ background: INK, color: "#fff", borderRadius: 999, padding: "12px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 2, transform: `scale(${pop(f, C.link, 10)})`, whiteSpace: "nowrap" }}>LINK IN PINNED COMMENT ↓</div>}
      </div>
    </Shell>
  );
};

// ---------- Byte ----------
const Byte: React.FC<{ f: number }> = ({ f }) => {
  const t = talkFor(f, "byte", SPK, ENV), on = speaking(f, "byte", SPK);
  const surprised = zapAt(f, ZAPS) > 0.3;
  let nod = -pop(f, C.now, 8) * 26;
  for (const c of C.heads) nod -= pop(f, c.at, 8) * 16;
  return (
    <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(880 ${2330 + nod}) scale(2.1) rotate(${on ? 3 : 0})`}><Person d={BYTE} f={f} seed={7} talk={t} wave={f >= C.bye ? 1 : 0} mood={(surprised ? "surprised" : "happy") as any} /></g>
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
      <Narration slug="newsDaily" total={TOTAL} />
    </AbsoluteFill>
  );
};
