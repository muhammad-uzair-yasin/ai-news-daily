# Ai News autopilot — one episode a day, no human in the loop

Set up by Uzair on Nov 2, 2026: "it should not only tell me news, it should automatically create videos on it and post it to the
AI News channel, no human needed, but make sure the video is good, covers everything and is quality checked."

A scheduled task starts a fresh agent session every day and that agent follows THIS file from top to bottom.
Template episode: `episodes/2026-11-02-ep03-agents-raise/` (copy it, change the content, keep the format).

## 0. Setup (fresh session, ~5 min)
1. Repo: `/home/claude/ai-news-daily` (github.com/muhammad-uzair-yasin/ai-news-daily). If it is missing, attach it with the
   `add_repo` tool (owner `muhammad-uzair-yasin`, repo `ai-news-daily`, access `push`) and clone it there.
2. `bash engine/tts/setup.sh` — installs the Kokoro voices (downloads ~350 MB from GitHub the first time).
3. `cd engine && npm ci` (render.sh also does this when node_modules is missing).
4. Free disk check: `df -h /`. Renders need ~3 GB. Remotion leaves 240 MB bundles in TMPDIR, so ALWAYS render with
   `TMPDIR=/tmp/lrn` and delete `/tmp/lrn` afterwards.
5. Idempotency: if `docs/publish-log.md` already has an entry for today's date (PKT), stop and report "already published".

## 1. Research (the old "Daily AI News Digest", ~20 min)
- Get the current date/time. Cover what launched or changed in the last ~24 hours; do not repeat stories already in
  `docs/publish-log.md`.
- Run many separate WebSearch calls (mode "extended" for fresh news), one per area: model launches (OpenAI, Anthropic, Google,
  Meta, xAI, Mistral, DeepSeek, Qwen, open source) · AI tools/products · free tools & free tiers · deals · pricing/plan changes ·
  developer & agentic AI (MCP, SDKs, coding agents) · creator tools · business/funding/regulation · research/security.
- WebFetch the ORIGINAL source for every story you will use. Cross-check numbers with a second source for the lead story.
- Never invent facts, prices or links. A story you can't verify is cut.

## 2. Pick the stories
- 6 to 8 stories, at least one from each section: AI NEWS · PRICING & FREE · AI TOOLS (docs/content-plan.md).
- Story 1 (the lead) = the most surprising, visual, easy-to-explain one. It becomes the hook, the title and the cover word.
- Total spoken length 60–110 s (hard cap ~2 min).

## 3. Script (`episodes/<YYYY-MM-DD>-epNN-<slug>/script.txt`)
Two anchors, Kokoro voices: `[af_heart:anna]` = Anna, `[am_adam:max]` = **Uzair** (the male anchor is called Uzair on screen and
in speech; the speaker id stays `max` for the code).
```
[af_heart:anna] Here's everything that happened in AI today. I'm Anna.
[am_adam:max] And I'm Uzair. And today, <lead hook in one sentence>. <the key fact>.
[af_heart:anna] <short reaction / question, e.g. "Wait... how?">
[am_adam:max] <one-line explanation>.
[af_heart:anna] Story two. <1–2 lines>
[am_adam:max] Three. <1–2 lines>
... alternate anchors, "Four, for developers." style intros ...
[am_adam:max] <one question for the comments>
[af_heart:anna] Subscribe, and we'll see you same time tomorrow.
```
Rules: short sentences, `...` for pauses, numbers written as words, no claims beyond the sources.

## 4. Voice + timing
```
python3 engine/tts/narrate.py episodes/<ep>/script.txt episodes/<ep> --speed 1.1     # narration.mp3 + sents.json
python3 engine/tools/words_spk.py episodes/<ep>                                       # words.ts (WORDS, CHUNKS, TOTAL, ENV, SPK)
```
Print the word list with frames (`grep -o` the WORDS array) — the cue frames in Film.tsx come from it.

## 5. Build the film (copy the template)
- Copy `Film.tsx` + `entry.tsx` from the template episode. In entry.tsx change the composition id (e.g. `NewsFour`).
- In Film.tsx change: the `F` cue table (exact frames of the spoken words from words.ts), `STORIES` (n/total, tag, colour,
  title ≤ 40 chars), `TICKER`, the dates (`NOV 2 · 2026` in Chrome, IdleLogo date), the `Breaking` card (lead story, kinetic
  number), one graphic component per story (`G1…Gn`, drawn in the 940×640 monitor panel: props, morphs, counters, chips,
  cards — every element appears on the word that names it), `G7Comments` question, `graphicAt`, the `SHOTS` list (anchor
  close-up on the story intro → monitor push-in on the graphic), `PUNCH`, `Cover word`, `<Narration slug="newsNN">`.
- Keep: studio, desk, anchors (male anchor `name: "Uzair"`), lower third, ticker, outro subscribe card, captions.
- SFX: only one soft subscribe click (Uzair's rule).
- Check every `F.<name>` used is defined (a quick python regex over Film.tsx) before rendering.

## 6. Quality gate — nothing gets posted unless all of this passes
1. Stills: `TMPDIR=/tmp/lrn bash engine/render.sh episodes/<ep> --still <frame>` for the Breaking card and every story graphic
   (when its last element has appeared). Look at each: no text overflowing the panel/cards, nothing overlapping, numbers right,
   lower third correct. Fix and re-check.
2. Full render: `TMPDIR=/tmp/lrn bash engine/render.sh episodes/<ep>` (~45 min for 75 s on 2 CPUs).
3. `python3 engine/qa/verify.py episodes/<ep>` must print `AUTO OK` (audio offset ≈0.54 s, corr > 0.6, frame count exact).
4. Independent review: spawn a separate subagent that has NOT seen the build. Give it the 4 sheets `episodes/<ep>/qa/passA_*.jpg`
   and `passB_*.jpg` and ask for problems with timestamps (clipped/overlapping text, empty monitor > 2 s while talking, graphic
   not matching the words, captions wrong, wrong numbers vs script) and a PASS/FIX verdict.
5. On FIX: correct Film.tsx, re-render only if needed, repeat 3–4. Max 2 fix rounds. If it still fails, DO NOT POST — commit the
   work and report what is wrong.

## 7. Publish (Postsiva, YouTube channel `UCaW1ycHQgEaWcIi14v3Ce9w`)
1. Thumbnail: `ffmpeg -ss <time of Breaking card> -i render.mp4 -frames:v 1 thumbnail.jpg`.
2. Upload: Postsiva `get_upload_link` (media_type video, platform youtube) → run its curl command for render.mp4 (→ media_id)
   and for thumbnail.jpg with `media_type=image` (→ public_url).
3. `YOUTUBE_POST_VIDEO` via `multi_execute_tool`: channel_id above, title `<Lead hook> 😳 | AI News Today (<Mon D>)` (≤ 100
   chars), description per docs/content-plan.md (emoji lines per story + channel lines + 📰 SOURCES with one link per story +
   `#ainews #ai #technews #shorts`), media_id, thumbnail_url, made_for_kids false, visibility PUBLIC,
   and NO scheduled_time — **publish immediately** (Uzair, Nov 3 2026: "it's everyday news, publish it the same day, don't
   schedule it for tomorrow"). If YouTube returns a rate-limit/quota error, retry once.
4. If YouTube refuses the custom thumbnail (403 "permissions to upload and set custom video thumbnails"), the video still goes out — mention it in the final message (the channel needs phone verification).
5. No cross-posting (Uzair hasn't asked for it on this channel's autopilot).

## 8. Save
- Episode folder: script.txt, sents.json, words.ts, Film.tsx, entry.tsx, narration.mp3, thumbnail.jpg, contact_sheet.jpg
  (= qa/passA_1.jpg), BRIEF.md (stories + every source link + QA numbers + YouTube link). Never commit render.mp4.
- Add the entry to `docs/publish-log.md` and update the status block in `AGENTS.md`. Commit and push.
- `rm -rf /tmp/lrn`.

## 9. Final message (this is what Uzair reads)
1. The YouTube link and the time it went live (PKT).
2. The digest: "Top picks" (5–7 bullets) + "Free and deals" quick list, each with its source link.
3. QA result in one line. Any story cut for lack of verification.
