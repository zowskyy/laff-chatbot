# Player Model — anatta.machina

Player state is external and versioned. The model may propose transitions; the state store validates and commits them.

## State dimensions

- `contact_attempts` — number of times the player has sent a message to anatta
- `received_reply` — boolean; whether anatta has ever responded to this player
- `discovered_fragments` — list of ARG fragment IDs the player has surfaced
- `solved_puzzles` — list of puzzle IDs with solve timestamps
- `flags` — named boolean markers (e.g. `saw_opening_release`, `found_timestamp_anomaly`)
- `threads` — active narrative threads the player is following
- `last_release_id` — the most recent release the player has been exposed to
- `silence_streak` — how many consecutive messages received no reply (meaningful to the fiction)
- `events` — append-only event log

## Visitor vs. player distinction

A **visitor** opened the chat and may or may not have sent a message. They are not a player yet.

A **player** has sent at least one message and has engaged with at least one ARG fragment (a tweet, a release, a puzzle). Most visitors will never become players. That is intended.

## State transition rules

- State transitions must include: event ID, timestamp, player ID, previous version, transition type, payload, resulting version.
- Duplicate event IDs are idempotent.
- The operator never injects state directly based on conversation content — only on confirmed game events (puzzle solved, fragment found, release seen).
- Visitor conversation content does not become player state without the visitor triggering a game event.

## Player identifiers

Players are anonymous. Their identifier in the state store is derived from their session name (e.g. `grey-smoke`) combined with a hash of session metadata. The human name is never stored alongside a real identity.
