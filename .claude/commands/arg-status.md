# /arg-status

Report current ARG state for anatta.machina.

1. Read `project/ARG_BIBLE.md` and `project/PLAYER_MODEL.md`.
2. List all releases in `project/releases/` with their sequence, status, and dispatch state.
3. List all puzzles in `project/puzzles/` with their dependency locks and solve status.
4. Identify the most recent active release.
5. Report any releases with unresolved dispatches or blocked dependencies.
6. Report pacing health: check no two consecutive releases both spike information_delta > 3 and tension_delta > 2 simultaneously.
7. Flag any canon risks: cross-reference release player_facing content against ARG_BIBLE canon rules.

Output format:

```
ARG STATUS — anatta.machina
Active release: <id> — <title>
Releases: <count> total, <count> dispatched, <count> draft
Puzzles: <count> total, <count> solvable, <count> blocked
Pacing health: OK / WARNING (<detail>)
Canon risks: none / <list>
Next recommended action: <one sentence>
```
