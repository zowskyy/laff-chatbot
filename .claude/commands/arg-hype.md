# /arg-hype

Draft a hype drop for anatta.machina across social platforms.

Usage: `/arg-hype [release-id]`

If `release-id` is provided, draft payloads for that specific release.
If omitted, use the next-ready release from the current ARG state.

## Procedure

1. Load `.claude/skills/hype-pipeline/SKILL.md`.
2. Run `/arg-status` to identify the active release and phase.
3. Load the release file from `project/releases/<id>.json`.
4. Validate the release is ready (dispatches not yet sent, pacing cleared).
5. Draft payloads for each platform:
   - **X/Twitter**: atomic fragment, 280 chars max, entity voice, no hashtags.
   - **Reddit**: first-person discovery post, target subreddit included, operator-posted manually.
   - **Discord**: short paste-ready message for ARG/mystery servers.
6. Validate each payload against `schemas/social-dispatch.schema.json`.
7. Run inter-drop interval check from hype-pipeline skill.
8. Write draft records to `project/dispatch-log/<idempotency-key>.json`.
9. Return preview of all payloads. Status: DRY_RUN.

## Dispatch to live

Live dispatch requires:
- `ARG_MODE=LIVE` set in environment.
- Operator explicitly approves the exact payload shown in the preview.
- All safety gates pass.

X/Twitter dispatch uses the harness `dispatch.ts` with the Twitter/X API credentials from `.env`.
Reddit and Discord payloads are always manual — the pipeline outputs the text, the operator posts.

## Output format

```
HYPE DROP — [release-id] — DRY_RUN

── X / @anatta_machina ──────────────────────────
[exact tweet text]
Characters: N/280
Earliest post date: [now + inter-drop interval]

── Reddit ───────────────────────────────────────
Target: r/[subreddit]
Title: [post title]
Body:
[post body]
(manual post — operator account, not @anatta_machina)

── Discord ──────────────────────────────────────
[paste-ready message]
(manual — paste into ARG/mystery server, not the operator's identity)

── Audit records ────────────────────────────────
Written: project/dispatch-log/[key].json × 3
Status: DRY_RUN — awaiting operator approval
```
