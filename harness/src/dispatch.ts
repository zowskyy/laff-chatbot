export type Dispatch = {
  dispatchId: string;
  channel: string;
  accountId: string;
  body: string;
  mode: "DRY_RUN" | "LIVE";
  idempotencyKey: string;
  approval?: { approvedBy: string; approvedAt: string };
};

export function dispatchSocial(input: Dispatch): {
  status: "DRY_RUN" | "SENT" | "BLOCKED";
  reason?: string;
  auditId: string;
} {
  const auditId = `audit_${input.dispatchId}`;
  if (input.mode !== "LIVE") return { status: "DRY_RUN", auditId };
  if (!input.approval) return { status: "BLOCKED", reason: "operator approval required", auditId };
  if (!process.env.ARG_LIVE_DISPATCH) return { status: "BLOCKED", reason: "ARG_LIVE_DISPATCH is not enabled", auditId };
  return { status: "SENT", auditId };
}
