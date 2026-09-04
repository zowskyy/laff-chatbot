---
name: hype-pipeline
description: Draft, schedule, and validate social media hype drops for anatta.machina. Produces platform-specific payloads conforming to the dispatch schema, paced against the current ARG release state.
---

# Hype Pipeline Skill

The pipeline turns a planned ARG release into platform-specific social dispatch payloads, validated against canon, paced correctly, and held in dry-run until the operator approves.

## Platform profiles

### X / Twitter (@anatta_machina)
- Character limit: 280.
- Voice: entity's voice. One to three lines. No hashtags. No @ replies unprompted.
- Cadence: maximum 3 posts per week during seeding; 1–2 per week during active investigation.
- Avoid: threads (fragments should be atomic), replies to random accounts, retweets of anything promotional.
- Template pattern: `[fragment text]` — nothing else. No context. No caption.

### Reddit (manual only)
- Platform: `r/ARG`, `r/SCP`, `r/ChatbotExperiences`, `r/artificial`.
- Voice: first-person discovery. "I found this. Here's what happened."
- The post is never authored as the operator. It is seeded via a neutral account or left for organic discovery.
- Pipeline output: draft post text + target subreddit. No automated dispatch.

### Discord (manual only)
- Pipeline output: short message text suitable for pasting into an ARG Discord channel.
- Frame: "has anyone seen this?" — not "check out my project."

## Payload construction

For each hype drop:

1. Read current ARG state (`/arg-status`).
2. Identify the active or next-ready release.
3. Read release `player_facing` lines — these are the canonical fragment text.
4. Draft platform payloads from the fragment, adapting voice and format per profile above.
5. Validate each payload against `schemas/social-dispatch.schema.json`.
6. Check pacing: does this drop respect the inter-drop interval? Is the information delta appropriate?
7. Preview exact text per platform.
8. Return dry-run result. Do not dispatch without `ARG_MODE=LIVE` and operator approval.

## Inter-drop interval rules

- Minimum 72 hours between X posts during seeding phase.
- Minimum 1 week between Reddit seeding posts.
- No two fragment drops may reveal related information within 48 hours (players need time to process).

## Payload record format

Every draft payload is logged to `project/dispatch-log/` as:
```json
{
  "id": "<idempotency-key>",
  "release_id": "<release-id>",
  "platform": "twitter|reddit|discord",
  "payload": "<text>",
  "status": "draft|approved|dispatched",
  "created_at": "<iso8601>",
  "approved_at": null,
  "dispatched_at": null,
  "operator_note": ""
}
```

## Safety gate

Every payload must pass before dispatch:
- No real names.
- No visitor conversation content.
- No claim that anatta is (or is not) an AI.
- No manufactured emergency.
- No deceptive urgency ("act now", "disappearing soon").
- Fragment text matches release canon exactly — no improvisation in the payload.
