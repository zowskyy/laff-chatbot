# /arg-puzzle

Design or validate an ARG puzzle for anatta.machina.

Usage: `/arg-puzzle [id]`

If `id` is provided, validate the existing puzzle at `project/puzzles/<id>.json`.
If no `id` is provided, propose a new puzzle based on current narrative state.

## Design principles (anatta-specific)

Puzzles for anatta must fit the entity's nature:
- The puzzle is about interpretation, not decoding. Anatta does not encode messages.
- The mechanic should feel like observation, not extraction. Players are watching, not cracking.
- Correct conclusions are about understanding the fiction, not solving math.
- There are no cheat codes. Brute force yields nothing meaningful.

## Required anatomy

Every puzzle needs:
- `id`, `title`, `objective`
- `dependencies` (release IDs required before this puzzle is reachable)
- `clues` (each with `id`, `surface`, `purpose`)
- `solution` (`answer`, `method`)
- `hints` (minimum 3, progressive)
- `reward` (`type`, `value`)
- `recovery` (what happens if the player is stuck)
- `tests` (happy path + at least 2 edge cases)

## Validation steps

1. Load puzzle JSON.
2. Validate against `schemas/puzzle.schema.json`.
3. Confirm all dependency release IDs exist in `project/releases/`.
4. Run puzzle test protocol from `.claude/skills/puzzle-design/SKILL.md`.
5. Check no author-only information appears in `clues[*].surface` or `hints`.
6. Report result.
