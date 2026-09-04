export type PlayerState = {
  playerId: string;
  version: number;
  flags: Record<string, boolean>;
  solvedPuzzles: string[];
  inventory: string[];
  threads: string[];
  events: Array<{ eventId: string; type: string; timestamp: string; payload?: Record<string, unknown> }>;
};

export function applyEvent(state: PlayerState, event: PlayerState["events"][number]): PlayerState {
  if (state.events.some(e => e.eventId === event.eventId)) return state;

  const next = structuredClone(state);
  next.events.push(event);
  next.version += 1;

  if (event.type === "puzzle_solved") {
    const id = String(event.payload?.puzzle_id ?? "");
    if (id && !next.solvedPuzzles.includes(id)) next.solvedPuzzles.push(id);
  }
  if (event.type === "flag_set") {
    const key = String(event.payload?.key ?? "");
    if (key) next.flags[key] = Boolean(event.payload?.value);
  }
  return next;
}
