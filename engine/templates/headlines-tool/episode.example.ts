// episode.ts — the ONLY file the autopilot writes by hand each day (plus script.txt).
// Every `cue*` field is a word that is SPOKEN in script.txt, in order (matching ignores case, punctuation and a trailing 's).
// Logos: a file name in engine/public/logos/ (without .svg). If the company has no logo there, find it in
// engine/node_modules/@lobehub/icons-static-svg/icons/ (prefer <name>-color.svg) or leave `logo` out and set `badge` (text).
export const EP = {
  date: "NOV 4 · 2026",            // top-right chrome
  dateShort: "NOV 4",              // in the hook badge
  hook: {
    line: "This free app does your boring work",   // ≤ 40 chars, the TOOL'S BENEFIT to the viewer, never a company
    punch: "while you sleep.",                      // ≤ 18 chars, red serif bar
  },
  cues: { hookPunch: "sleep", news: "today's", bye: "tomorrow" },
  heads: [                          // exactly 4 (3 allowed on a thin day). One line each. Each has ONE punch OR ONE chip.
    { logo: "openai", h: "OpenAI's AI designed a real gadget", punch: "in under a week.", cue: "OpenAI's", punchCue: "week", src: "OpenAI · The Decoder · Nov 3–4" },
    { badge: "REVOLUT", h: "Revolut cut its AI coding bill", punch: "−90%.", cue: "Revolut", punchCue: "percent", src: "The Register · Nov 3" },
    { logo: "apple", h: "Apple opened Siri AI to", punch: "every developer.", cue: "Apple", punchCue: "developer", src: "Apple Developer · Nov 3" },
    { badge: "POSTMAN", h: "Postman quietly installed itself into Claude Code.", chip: "⚠ Check your settings", chipHue: "red", cue: "Postman", chipCue: "check", src: "GitHub issue #14370 · Nov 3" },
  ] as { logo?: string; badge?: string; h: string; punch?: string; punchCue?: string; chip?: string; chipCue?: string; chipHue?: "red" | "green" | "ink"; cue: string; src: string }[],
  tool: {
    name: "Sentient OS", logo: undefined as string | undefined, platform: "MAC", site: "sentient-os.ai",
    cueNow: "now", cueName: "Sentient",
    steps: [                        // 3–4 plain steps, the LAST one is the payoff (green)
      { icon: "☾", text: "Reads your mail & files at night", cue: "reads" },
      { icon: "✎", text: "Drafts your replies", cue: "drafts" },
      { icon: "▤", text: "Fills your forms", cue: "fills" },
      { icon: "✓", text: "You just approve", cue: "approve" },
    ],
    punch: "Free · open source", cuePunch: "free", cueLink: "link",
  },
};
