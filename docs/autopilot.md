# Ai News autopilot — "HEADLINES + FREE TOOL" (locked Nov 4 2026)

Set up by Uzair: a scheduled task starts a fresh agent session every day; that agent follows THIS file top to bottom, builds
one Short in exactly the format of **ep05 (Nov 4 2026, https://youtube.com/shorts/PvZeEo0IOyE)** and publishes it. No human in the loop.
Why this format: the old 7-story / 90 s / two-anchor roundup got 29% "stayed to watch" and 30–200 views. Research
(`docs/retention-research.md`) showed every high-view AI short is short, has a viewer-benefit hook, and a real payoff. Uzair
chose: open with the free tool's benefit, give today's news as headlines only, then show the free tool at the end.

## The format (do not change it without Uzair)
| Time | Beat | Spoken |
|---|---|---|
| 0–5 s | HOOK screen: "TODAY IN AI · <DATE>" badge, big line = the free tool's BENEFIT (never a company), red serif punch, 🎁 "Today's free tool · unlocks at 0:xx" tile (visible on frame 0 = the thumbnail), then a "Today's AI news · 4 headlines · first" tile | "This free app <benefit>... <punch>. First... today's AI news." |
| ~5–20 s | 4 HEADLINE cards, one line each, ~3.5 s each, logo + one punch OR one chip, progress dots ending in 🎁 | one short sentence per headline, ≤ 12 words, no explanations |
| ~20 s | 🎁 bursts open | "Now, the free one." |
| ~21–34 s | FREE TOOL card: name big, 3–4 plain steps that appear as spoken (last one green = the payoff), red punch ("Free · open source"), site, "LINK IN PINNED COMMENT" | "<Name>. <what it does in 3–4 short steps>. <Free/price line>. Link in the pinned comment." |
| last 2 s | hard cut, Byte waves | "Tomorrow, same time." |

Total **30–40 s**, ~90 words, one voice (Byte = Kokoro `am_adam`, speaker id `byte`). Cream "Distilled" look, logos, stopwatch
ring with a 🎁 marker at the unlock point. The template (`engine/templates/headlines-tool/`) already does all of this —
the agent only writes `script.txt` and `episode.ts`.

## 0. Setup (~5 min)
1. Repo `/home/claude/ai-news-daily` (github.com/muhammad-uzair-yasin/ai-news-daily). If missing: `add_repo` (owner
   `muhammad-uzair-yasin`, repo `ai-news-daily`, access `push`), clone there. `git pull`.
2. `bash engine/tts/setup.sh` (Kokoro voices) · `cd engine && npm ci`.
3. `df -h /` (renders need ~3 GB). Always render with `TMPDIR=/tmp/lrn`; delete `/tmp/lrn` at the end.
4. Idempotency: if `docs/publish-log.md` already has an entry for today's date (PKT), stop and report "already published".

## 1. Research (~15 min)
Run several WebSearch calls (mode "extended"): "AI news today <Month D YYYY>", "everything that happened in AI today <date>",
"free AI tool launched this week <Month YYYY>", "Product Hunt AI <date>". Good digests to WebFetch: theneuron.ai daily digest,
aiweekly.co/ai-news-today, thetoolnerd.com new-tools posts, producthunt.com daily leaderboard.

**Pick 4 headlines** (3 on a thin day) from the last ~24 h, not already in `docs/publish-log.md`:
- Prefer concrete and visual: a named product/model doing something, a price or free tier change, a big number, a security
  warning people can act on. Avoid funding rounds, executive hires and vague "AI will…" stories.
- Mix: at most 2 from the same company. Order: most surprising first.
- WebFetch the ORIGINAL source for each one. Never invent facts, numbers or links; cut any story you cannot verify.

**Pick 1 free tool** (this is the payoff — spend time on it):
- Must be usable today, really free (free forever / open source / generous free tier — say which), launched or updated recently.
- WebFetch its own site AND confirm the free part (pricing page, GitHub license). Record the exact URL.
- It must do one thing a normal person wants, describable in 3–4 plain steps ("reads your…, drafts…, you just approve").
- Prefer tools for everyday work (email, docs, notes, video, images, coding) over niche dev infrastructure.
- Never repeat a tool that is in `docs/publish-log.md`.

## 2. Script (`episodes/<YYYY-MM-DD>-epNN-<slug>/script.txt`)
One paragraph per beat, every paragraph tagged `[am_adam:byte]`. Copy the shape of ep05's script exactly:
```
[am_adam:byte] This free app <benefit>... <punch>. First... today's AI news.
[am_adam:byte] <headline 1, ≤ 12 words>.
[am_adam:byte] <headline 2>.
[am_adam:byte] <headline 3>.
[am_adam:byte] And <headline 4>. <optional 2–3 word action, e.g. "Check your settings.">
[am_adam:byte] Now, the free one. <Tool name>. <step 1>... <step 2>... and <step 3>. <payoff step>. <Free line>. Link in the pinned comment.
[am_adam:byte] Tomorrow, same time.
```
Rules: short words, numbers written as words ("ninety percent"), no claims beyond the sources, vary the wording every day
(do not reuse yesterday's hook verb or punch) — YouTube's inauthentic-content policy punishes identical-sounding uploads.

## 3. Voice + timing
```
python3 engine/tts/narrate.py episodes/<ep>/script.txt episodes/<ep> --speed 1.1
python3 engine/tools/words_spk.py episodes/<ep>
```
Check the printed duration: 30–40 s. Over 40 s → shorten the tool steps or the headlines and re-run.

## 4. Build (copy, don't code)
```
EP=episodes/<ep>
cp engine/templates/headlines-tool/Film.tsx engine/templates/headlines-tool/entry.tsx $EP/
cp engine/templates/headlines-tool/episode.example.ts $EP/episode.ts   # then edit $EP/episode.ts
```
Edit only `episode.ts`: date, hook line/punch, the 4 heads (text, logo or badge, punch or chip, cue words, source), the tool
(name, platform, site, 3–4 steps with cue words, punch). Every `cue*` must be a word that is actually spoken, in order — the
template finds the frames itself and throws an error naming the missing word if one is wrong. Do NOT edit Film.tsx.
Logos: `ls engine/public/logos`; if missing, `ls engine/node_modules/@lobehub/icons-static-svg/icons | grep -i <name>`, copy
`<name>-color.svg` (or `<name>.svg`) to `engine/public/logos/<name>.svg`, replace `fill="currentColor"` with `fill="#111118"`
and `height="1em" width="1em"` with `height="200" width="200"`; commit it. No logo → use `badge: "NAME"`.
Text limits (so nothing overflows): hook line ≤ 40 chars, hook punch ≤ 18, headline `h` ≤ 60, punch ≤ 18, chip ≤ 28,
tool step ≤ 36, tool punch ≤ 22.

## 5. Quality gate — nothing is posted unless all of this passes
1. Stills: `TMPDIR=/tmp/lrn bash engine/render.sh $EP --still <f>` for frame 0, each headline after its punch, and the tool card
   after its last step. Look at each: nothing overflowing a card, nothing over the captions (captions start at y=1235), logos visible.
2. Full render IN THE FOREGROUND (background jobs get killed): `TMPDIR=/tmp/lrn bash engine/render.sh $EP` with a 10-minute
   command timeout (~6 min for 35 s on 2 CPUs).
3. `python3 engine/qa/verify.py $EP` must print `AUTO OK`.
4. Independent review: spawn a subagent that has not seen the build; give it `$EP/qa/passA_*.jpg`, `passB_*.jpg` and
   script.txt; ask for problems with timestamps (overflow, overlap, wrong words/numbers vs script, captions covered) and PASS/FIX.
5. On FIX: correct episode.ts (or the script), re-render, repeat 3–4. Max 2 rounds. Still failing → DO NOT POST; commit and report.

## 6. Publish (Postsiva, YouTube channel `UCaW1ycHQgEaWcIi14v3Ce9w`)
1. Postsiva `get_upload_link` (media_type video, platform youtube, file_path = render.mp4) → run its curl → media_id.
2. `YOUTUBE_POST_VIDEO` via `multi_execute_tool`: channel_id above, made_for_kids false, visibility PUBLIC, **no scheduled_time**
   (publish immediately — Uzair's rule), title and description below. On a rate-limit error retry once.
   - **Title:** `<Tool benefit, ≤ 55 chars> + today's AI news | AI News <D Mon>` — e.g.
     `Free app does your boring work while you sleep + today's AI news | AI News 4 Nov`.
   - **Description:** first line 🎁 the free tool + what it does + its URL (and GitHub if open source); then "📰 Today's AI news
     (<date>):" with the 4 headlines numbered; "⏱ Today's AI news + one free tool. Every day."; "Voice and visuals made with AI.";
     the three "More from me" channel lines; "📰 SOURCES" with one link per headline + the tool link; 3 hashtags
     (`#AINews #<main company> #FreeAITools`).
3. `YOUTUBE_FIRST_COMMENT` on the new video id: "🎁 Today's free tool — <Name> (<free/open source/platform>): <URL>" + one
   question for the comments. (Pinning must be done by Uzair in the YouTube app — say so in the final message.)
4. No cross-posting on this channel.

## 7. Save
- Episode folder: script.txt, sents.json, words.ts, episode.ts, Film.tsx, entry.tsx, narration.mp3, BRIEF.md (headlines + tool
  + every source link + QA result + YouTube link). Never commit render.mp4.
- Add the entry at the TOP of `docs/publish-log.md` (date, title, link, the 4 headlines, the tool + URL) and update the status
  block in `AGENTS.md`. Commit and push. `rm -rf /tmp/lrn`.

## 8. Final message (Uzair reads this on his phone)
1. YouTube link + time it went live (PKT).
2. Today's free tool (name, one line, link) and the 4 headlines (one line each, with source links).
3. QA result in one line; any story cut for lack of verification; reminder to pin the first comment.
If nothing was posted, say so at the top with the reason.
