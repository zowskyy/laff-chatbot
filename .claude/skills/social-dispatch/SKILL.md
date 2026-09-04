---
name: social-dispatch
description: Draft, validate, audit, and safely dispatch ARG communications to project-owned social channels.
---

# Social Dispatch Skill

Default mode: DRY_RUN.

## Dispatch stages

1. Draft.
2. Validate.
3. Preview exact payload.
4. Check audience and account ownership.
5. Operator approval.
6. Dispatch.
7. Record immutable audit event.

## Public-action gate

A live dispatch requires all:

- `ARG_MODE=LIVE`;
- channel explicitly enabled;
- account is project-controlled;
- payload passes schema;
- no personal data;
- no deceptive emergency claim;
- operator approval recorded;
- idempotency key present.

If any condition fails, return a dry-run result.

## Safety

Do not target or harass real private individuals. Do not impersonate real people or organizations. Do not manufacture real-world emergencies. Keep fictional claims clearly within the ARG's intended fictional frame where confusion could cause harm.

## Dispatch result

Return:
- mode;
- channel;
- payload hash;
- idempotency key;
- approval status;
- dispatch status;
- audit record ID.
