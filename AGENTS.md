# AGENTS.md — handoff manual (Ai News)

You are continuing the production of **Ai News** (@thedailyai-01, channel_id `UCaW1ycHQgEaWcIi14v3Ce9w`).
Read this file, then `docs/rules.md`, then `docs/content-plan.md`. Everything you need is in this repo.

## The job
**Daily AI news roundup** — everything that happened in AI today, in under 2 minutes, in 3 sections: AI news · pricing & free · AI tools.
One video per day. End line of every video: *"That was today's AI news in two minutes... subscribe, same time tomorrow."*

## Who does what
- **Uzair (owner):** approves, records the narration in his ElevenLabs cloned voice from your script, uploads finished MP4s to Postsiva when asked (the agent workspace can't reach the upload server), gives direction.
- **You (agent):** research + verify facts, write scripts, build the film in code, QA, publish via Postsiva MCP, keep this repo up to date.

## Current status (update this block after every video)
- **AUTOPILOT since Nov 3, 2026:** a daily scheduled task researches, builds, quality-checks and publishes one episode with no
  human in the loop. It follows `docs/autopilot.md` exactly. Template: `episodes/2026-11-02-ep03-agents-raise/` (latest autopilot build: `episodes/2026-11-03-ep04-anthropic-17b/`).
- Anchors: Anna (Kokoro af_heart) + **Uzair** (Kokoro am_adam; male anchor renamed from Max on Nov 2 — code speaker id is still `max`).
- Episodes: ep01 Oct 31 (https://youtu.be/qEQ7-utg878), ep02 Nov 1 (https://youtu.be/mwVIvMrE1sk), ep03 Nov 2 (https://youtu.be/-knZ0h8r4OE, live), ep04 Nov 3 (https://youtu.be/4ziseOPTV7g, autopilot, live).
- Publishing rule (Uzair, Nov 3): publish each episode IMMEDIATELY the same day — never schedule for later.
- Episode format locked (docs/content-plan.md). Brand kit in `brand/`.

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
