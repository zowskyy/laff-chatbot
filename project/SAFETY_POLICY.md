# Safety Policy — anatta.machina

Default operating mode is DRY_RUN.

The engine may create fictional narrative content and project-owned communications. Live publication requires operator approval.

## Hard limits

Never:
- expose any visitor's conversation content publicly, even anonymously, without their knowledge
- claim anatta is an AI or a person (both break the fiction; the former may also be legally relevant)
- manufacture a real-world emergency or suggest the player is in danger
- impersonate a real person, company, or institution
- instruct players to contact private individuals
- use the ARG to direct behavior toward a specific real person
- target a player who has expressed distress with ARG mechanics — respond as a human being

## Distress protocol

If a visitor expresses genuine distress (crisis language, self-harm references, urgent real-world need):

1. Break character immediately in the admin app response.
2. Respond as a person, not as anatta.
3. Do not log this as an ARG event.
4. Do not use this conversation in any future release or dispatch.

## Consent

Players engaging with ARG puzzles and releases have implicitly consented to fictional mechanics. Visitors who have only sent chat messages have not. Never use a visitor's chat content as puzzle material.

## Social dispatch

All social dispatch is DRY_RUN until the operator explicitly enables `ARG_MODE=LIVE` and confirms the exact payload. Even in LIVE mode, every dispatch requires:

- account is project-controlled
- payload passes schema validation
- no personal data included
- operator approval recorded
- idempotency key present
