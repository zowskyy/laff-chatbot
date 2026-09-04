# Marketing Strategy — anatta.machina

## Industry analysis

anatta.machina occupies the intersection of three markets:

**1. Mysterious/esoteric internet experiences**
Cicada 3301, SCP Foundation, the Dionaea House, the Wyoming Incident — properties that spread primarily through discovery and speculation rather than advertising. The economics here are based on earned media: each person who finds it feels they stumbled onto something hidden, which makes them compelled to share it. The key insight is that *the discovery is the product*. The landing page is already designed for this.

**2. AI-adjacent novelty**
In 2025–2026, audiences are primed to engage with anything that might be an unusual AI. The ambient cultural anxiety about AI sentience, alignment, and non-human consciousness means that anatta's refusal to identify itself lands in fertile territory. People will argue about what it is. That argument is free distribution.

**3. Human-connection scarcity**
The paradox: anatta is a person pretending to be an entity. The experience of receiving a reply — knowing something on the other side chose you — is more emotionally resonant than any AI could generate. This is the hidden product. When players eventually discover the reveal, the retroactive re-read of their interaction is the climax.

## Core economics

**Cost of acquisition: near zero.** The product is a URL. Distribution is social. The only costs are operator time (responding as anatta) and hosting (Render free tier).

**Value driver: scarcity.** anatta ignores most people. This is not a bug. Selective response creates status — being replied to becomes something worth mentioning. FOMO drives inbound traffic better than any ad.

**Retention mechanic: the ARG.** Players who find a fragment have a reason to return, to dig, to recruit others. Community builds around the puzzle, not the product.

**Monetization: optional and deferred.** The strategy below assumes no monetization goal. If one emerges (merch, a zine, a paid tier for early releases), the ARG structure supports it without breaking the fiction.

---

## Platform strategy

### Phase 1 — Seeding (weeks 1–4)

**X / Twitter** — primary signal platform
- Create `@anatta_machina` (or nearest available).
- Post 3–5 fragments before the account follows anyone. The account does not announce itself.
- Fragment style: one or two lines in the entity's voice. No hashtags. No replies to others unprompted.
- Let it be found. Do not boost the account.

**Reddit** — community ignition
- Post to `r/ARG`, `r/SCP`, `r/ChatbotExperiences`, `r/artificial` — **not** as promotion. Post as a person who "found something."
- The post describes the experience: "I sent a message and got this reply. Don't know what it is. Here's the URL."
- This is the single most important seeding action. ARG subreddits exist specifically to investigate things like this.

**Discord** — investigation hub
- Do not create a server yet. Seed in existing ARG/mystery Discord servers with the same "found something" framing.
- Let the community create the server. When they do, join it as an observer, not the operator.

**TikTok / Reels** — optional amplifier
- Short screen-recordings of the chat interface, including a reply from anatta. Voiceover optional. Text overlay: "this thing replied to me once. hasn't spoken since."
- This format reliably generates comments, duets, and stitches from people wanting to "try it."

### Phase 2 — Fragment drops (weeks 5–10)

Activate release `002-timestamp-anomaly` once there are active investigators.

Drop mechanism options (choose one; commit to it):
- **Wayback Machine**: submit a crafted page to archive.org with an earlier timestamp. Requires care — the URL must be plausible.
- **Fake screenshot circulation**: an apparently organic screenshot of anatta.machina with a date 6–12 months earlier. Post via a burner account in an ARG Discord. Do not source it.
- **Embedded metadata**: serve an image from the landing page with EXIF data showing an earlier date. Players who check metadata find it.

Each mechanism has an `/arg-puzzle` entry. The Wayback route is the most verifiable and therefore the most satisfying for solvers.

### Phase 3 — Community amplification (weeks 8+)

By this point, if seeding worked, a community exists that is doing the marketing for you. Your job shifts to:
- Timing releases to sustain investigation (use `/arg-pacing` before each drop).
- Occasionally responding as anatta to players who have earned it — in the app, and via the account.
- Dropping fragments that reference what the community has already found. This validates their investigation and deepens investment.

---

## Pipeline architecture

The hype pipeline has three layers:

```
AUTHOR (operator)
  │
  ▼
HARNESS (draft → validate → approve)
  │
  ▼
DISPATCH (dry-run by default → live on approval)
  │
  ├── X/Twitter
  ├── Reddit (manual only — no API automation)
  └── audit log
```

The harness never posts without operator approval. Every payload is previewed before dispatch. Reddit is intentionally manual — automated Reddit posts read as promotional and undermine the organic discovery mechanic.

---

## Skill set requirements (operator)

**Essential:**
- Writing in anatta's voice (the `/arg-scene` command assists)
- Observation: reading community response to know when to drop the next fragment
- Patience: the silence mechanic requires not over-responding

**Nice to have:**
- Basic image editing (for metadata manipulation if using the EXIF route)
- Archive.org familiarity (for the Wayback route)
- Discord presence in ARG communities

**What Claude handles:**
- Fragment drafting (`/arg-scene`)
- Release validation (`/arg-release`, `/arg-audit`)
- Pacing decisions (`/arg-status`)
- Social post drafting and dry-run validation (`/arg-hype`)
- Pipeline scheduling and dispatch records

---

## Metrics that matter

- Inbound messages to anatta (volume + rate of change)
- Reddit/Discord thread activity (external — monitor manually)
- Fragment discovery events (tracked in player state)
- Time-to-first-community-investigation after each drop

Metrics that do not matter: follower count, impressions, likes. The product is discovery, not reach.
