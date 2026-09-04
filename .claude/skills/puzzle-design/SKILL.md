---
name: puzzle-design
description: Create fair, layered ARG puzzles with deterministic solutions, clue graphs, validation, hints, and recovery paths.
---

# ARG Puzzle Design Skill

A puzzle is a game mechanic with a narrative wrapper.

## Required puzzle anatomy

Every puzzle needs:

- objective;
- player-visible surface;
- hidden solution;
- clue inventory;
- extraction/transformation rule;
- validation condition;
- hint ladder;
- failure/recovery path;
- reward;
- dependencies;
- test cases.

## Fairness

A puzzle is fair when the player can derive the solution from information available in the game.

Do not depend on:
- obscure facts with no contextual support;
- inaccessible websites;
- brute-force guessing;
- hidden metadata that players cannot reasonably discover;
- a single typo-free transcription when transcription errors are likely.

## Layering

Prefer three layers:

1. surface observation;
2. transformation;
3. narrative confirmation.

The final answer should cause a meaningful state change.

## Hint ladder

Use progressive hints:

H1: point toward the relevant object.
H2: identify the transformation.
H3: demonstrate one small example.
H4: give the extraction procedure.
H5: reveal the answer only as a recovery mechanism.

## Puzzle test protocol

Before release:

- solve from a clean state;
- solve with one intentional transcription error;
- test every hint;
- test an incorrect answer;
- test duplicate submissions;
- test dependency locks;
- verify reward is idempotent;
- verify no author-only field leaks into player output.

## Determinism

Cipher generation, answer checking, and reward transitions must be deterministic. The LLM can design the puzzle but should not be the sole authority for whether the player solved it.
