# Ai News (@thedailyai-01)

**Daily AI news roundup** — everything that happened in AI today, in under 2 minutes, in 3 sections: AI news · pricing & free · AI tools.

YouTube: https://www.youtube.com/@thedailyai-01 · channel_id `UCaW1ycHQgEaWcIi14v3Ce9w`
Part of a 4-channel network run by **Muhammad Uzair Yasin**, produced end-to-end by an AI agent (Claude): scripts → Uzair's ElevenLabs voice → videos drawn entirely in code (Remotion/SVG) → posted via Postsiva.

## What's in this repo
| Path | What |
|---|---|
| `AGENTS.md` | **Start here** — handoff manual for any AI agent continuing the work |
| `docs/content-plan.md` | What this channel publishes, why, the format, and the queue/plan |
| `docs/rules.md` | Standing rules and the reason behind each |
| `docs/pipeline.md` | How a video is made, step by step, with commands |
| `docs/posting.md` | Publishing via Postsiva (YouTube + 7 cross-post platforms) |
| `docs/network.md` | The 4-channel network and how they connect |
| `docs/lessons-learned.md` | Bugs hit and how they were fixed |
| `docs/publish-log.md` | Every published video with links |
| `episodes/<date>-<slug>/` | One folder per video: script, timings, film code, narration, brief, contact sheet |
| `engine/` | Shared Remotion engine (`kit.tsx`), `gen_words.py`, `render.sh`, 204-element motion library, legacy canvas pipeline |
| `brand/` | Channel avatar, banner and their generator |

## Rebuild any episode
```
bash engine/render.sh episodes/<episode-folder>            # full MP4
bash engine/render.sh episodes/<episode-folder> --still 300 # one frame
```

## Episodes
| Date | Title | YouTube | Pipeline |
|---|---|---|---|
| 2026-10-31 | Ep 01 — Everything That Happened in AI Today (16 stories) | https://youtu.be/qEQ7-utg878 | Remotion |

## Sister channels
- [Learn AI With Uzair](https://github.com/muhammad-uzair-yasin/learn-ai-with-uzair) — @uzair.devops
- [Agentic Ai with Uzair](https://github.com/muhammad-uzair-yasin/agentic-ai-with-uzair) — @agenticaiwithuzair
- [The Facts Orbit](https://github.com/muhammad-uzair-yasin/the-facts-orbit) — @factsorbitdaily
