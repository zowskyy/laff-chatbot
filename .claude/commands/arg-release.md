# /arg-release

Draft or validate a new ARG release for anatta.machina.

Usage: `/arg-release [id]`

If `id` is provided, validate the existing release file at `project/releases/<id>.json`.
If no `id` is provided, draft a new release based on the current narrative state.

## Drafting a new release

1. Read `project/ARG_BIBLE.md` — check voice constraints and canon rules.
2. Read `.claude/skills/arg-pacing/SKILL.md` — apply pacing model.
3. Read `.claude/skills/continuity/SKILL.md` — check dependencies and prior releases.
4. Identify the next sequence number from existing releases.
5. Draft the release JSON conforming to `schemas/release.schema.json`.
6. Run `/arg-audit` on the draft before saving.
7. Write to `project/releases/<id>.json`.
8. Do not set dispatches to live without operator approval.

## Validating an existing release

1. Load `project/releases/<id>.json`.
2. Validate against `schemas/release.schema.json`.
3. Check all dependencies exist and are sequenced correctly.
4. Check player_facing content against voice constraints in ARG_BIBLE.
5. Run pacing audit from `arg-pacing` skill.
6. Report result.

## Voice check

Every player_facing line must pass:
- Short sentences or fragments only.
- No questions directed at the player unless unanswerable.
- No warmth, no hostility, no exclamation marks.
- Clinical, archival, or very quiet register.
