# AGENTS.md — handoff manual (Ai News)

You are continuing the production of **Ai News** (@thedailyai-01, channel_id `UCaW1ycHQgEaWcIi14v3Ce9w`).
Read this file, then `docs/rules.md`, then `docs/content-plan.md`. Everything you need is in this repo.

## The job
**Daily "today's AI news + one free AI tool" Short**, 30–40 s: free-tool hook → 4 one-line headlines → the free tool shown.
Format locked Nov 4 2026 (docs/content-plan.md); end line: "Tomorrow, same time."

## Who does what
- **Uzair (owner):** approves, records the narration in his ElevenLabs cloned voice from your script, uploads finished MP4s to Postsiva when asked (the agent workspace can't reach the upload server), gives direction.
- **You (agent):** research + verify facts, write scripts, build the film in code, QA, publish via Postsiva MCP, keep this repo up to date.

## Current status (update this block after every video)
- **AUTOPILOT (re-enabled Nov 4 2026, new format):** the daily scheduled task "AI News Autopilot" follows `docs/autopilot.md`
  exactly: copies `engine/templates/headlines-tool/` and writes only `script.txt` + `episode.ts`. Reference episode:
  `episodes/2026-11-04-ep05-astra-hardware/` (hand-built; its Film.tsx predates the template — use the template).
- Voice: one narrator, **Byte** (Kokoro am_adam, speaker id `byte`), shown as the mascot bottom-right. Anna/Uzair anchors retired.
- Episodes: ep01 Oct 31 (https://youtu.be/qEQ7-utg878), ep02 Nov 1 (https://youtu.be/mwVIvMrE1sk), ep03 Nov 2 (https://youtu.be/-knZ0h8r4OE),
  ep04 Nov 3 (https://youtu.be/4ziseOPTV7g) — old roundup format; **ep05 Nov 4 (https://youtube.com/shorts/PvZeEo0IOyE) — first in the new format.**
- Publishing rule (Uzair, Nov 3): publish IMMEDIATELY the same day — never schedule for later.
- Logos: engine/public/logos (+ 994 more in engine/node_modules/@lobehub/icons-static-svg/icons).

## Next actions
1. Each day: read the latest Daily AI News Digest (scheduled research task, 10:57 & 21:57 PKT) + fresh searches; group stories into the 3 sections; write the script with the fixed opening line; send to Uzair.
2. Build from `episodes/2026-10-31-ep01-mistral-1t-open/` as the template (swap story scenes, keep studio/TOC/banners/counter/outro).
3. Post with the full SOURCES list in the description.

## Definition of done for a video
1. Script follows docs/rules.md (hook = topic, verified facts, CTA last) and Uzair recorded it.
2. Film built with the engine: word-highlight captions, lip-sync, both hands, motion on every shot, cover frame.
3. QA stills checked; final MP4 sent to Uzair; approved.
4. Published (YouTube first, then cross-posts if requested) with description per docs/posting.md.
5. **Committed + pushed**: `episodes/<date>-<slug>/` (script.md, sents.json, words.ts, Film.tsx, entry.tsx, narration.mp3, BRIEF.md with link + sources, contact_sheet.jpg) + `docs/publish-log.md` + the status block above.

## Don'ts
- Don't change the channel's purpose or the rules without Uzair.
- Don't commit rendered MP4s (they live on YouTube) or any API keys/tokens.
- Don't invent facts, prices or links — verify or cut.
