# /arg-audit

Full integrity audit of the anatta.machina ARG state.

1. Read `project/ARG_BIBLE.md`, `project/PLAYER_MODEL.md`, `project/SAFETY_POLICY.md`.
2. Load all releases from `project/releases/` and validate each against `schemas/release.schema.json`.
3. Load all puzzles from `project/puzzles/` and validate each against `schemas/puzzle.schema.json`.
4. Check dependency graph: every release's dependencies exist; no cycles.
5. Check puzzle dependency graph: all release dependencies exist and are sequenced before the puzzle.
6. Run voice audit on all player_facing fields in releases: flag any line that violates voice constraints.
7. Run pacing audit across the full release sequence: flag any consecutive pair with simultaneous spikes.
8. Check safety policy: flag any release or puzzle that references real people, real locations without context, or visitor conversation content.
9. Check state schema: if any player state files exist in `project/state/`, validate against `schemas/player-state.schema.json`.
10. Run `scripts/validate.mjs` if Node.js is available.

Output:

```
AUDIT REPORT — anatta.machina
Releases: <count> valid / <count> invalid
Puzzles: <count> valid / <count> invalid
Dependency graph: clean / ERRORS (<list>)
Voice violations: none / <list>
Pacing violations: none / <list>
Safety flags: none / <list>
State files: <count> valid / <count> invalid
Schema runner: passed / FAILED (<output>)
Overall: CLEAN / NEEDS ATTENTION
```
