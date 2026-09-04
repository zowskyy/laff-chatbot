---
name: arg-pacing
description: Design and audit ARG pacing, reveal cadence, clue density, player recovery, and release dependencies.
---

# ARG Pacing Skill

Treat pacing as a state machine rather than a calendar of posts.

## Core model

For every release, calculate:

- `information_delta`: how much new information becomes available;
- `tension_delta`: change in uncertainty/stakes;
- `actionability`: how clearly the player knows what to do;
- `recovery_budget`: time/space for players who arrive late;
- `dependency_count`: number of prior discoveries required;
- `ambiguity_budget`: intentional unresolved questions.

Avoid simultaneous spikes in all dimensions.

## Release rhythm

A healthy sequence commonly follows:

1. signal;
2. orientation;
3. investigation;
4. partial confirmation;
5. complication;
6. consequence;
7. recovery;
8. escalation.

Do not mechanically repeat the sequence. Use it as a diagnostic vocabulary.

## Fairness checks

For each release ask:

- What can a new player understand?
- What can a returning player infer?
- What action is available?
- What clue confirms the action?
- What happens if the player misses it?
- Is the intended path distinguishable from random noise?
- Is the reward proportional to the work?

## Anti-stall rule

If a mandatory puzzle has no successful solve path, the release is invalid.

Provide at least one:
- alternate clue;
- hint channel;
- redundant confirmation;
- recovery release.

Do not solve the puzzle for the player merely because the player is stuck.

## Pacing audit output

Return:

```text
PACING VERDICT
Information load:
Tension:
Actionability:
Dependency risk:
Late-player accessibility:
Stall risk:
Recommended adjustment:
```
