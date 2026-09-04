import test from "node:test";
import assert from "node:assert/strict";
import { applyEvent, type PlayerState } from "../src/state-store.js";

test("event application is idempotent", () => {
  const state: PlayerState = {
    playerId:"p1", version:0, flags:{}, solvedPuzzles:[], inventory:[], threads:[], events:[]
  };
  const event = {eventId:"e1", type:"puzzle_solved", timestamp:"2026-09-03T00:00:00Z", payload:{puzzle_id:"p1"}};
  const once = applyEvent(state, event);
  const twice = applyEvent(once, event);
  assert.equal(twice.version, 1);
  assert.deepEqual(twice.solvedPuzzles, ["p1"]);
});
