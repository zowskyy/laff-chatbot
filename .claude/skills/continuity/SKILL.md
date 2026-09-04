---
name: continuity
description: Maintain ARG canon, player state, decisions, release history, and contradiction detection across Claude sessions.
---

# Continuity Skill

External files are the continuity layer. Conversation memory is not authoritative.

## Read order

1. ARG_BIBLE.md
2. PLAYER_MODEL.md
3. current player state
4. relevant puzzle files
5. latest release
6. decision/history notes if present

## Change discipline

Never overwrite canon because a new idea is more interesting.

When a proposed change conflicts with canon, classify it:

- additive;
- clarification;
- retcon;
- contradiction;
- unresolved.

Retcons require explicit operator approval.

## State discipline

A state transition must include:

- event ID;
- timestamp;
- player ID;
- previous state or expected version;
- transition type;
- payload;
- resulting version.

Duplicate event IDs must be idempotent.

## Context compression

When context is large, summarize history into:
- current reality;
- unresolved threads;
- active puzzle dependencies;
- recent player actions;
- canon constraints.

Do not summarize away identifiers or causal relationships.
