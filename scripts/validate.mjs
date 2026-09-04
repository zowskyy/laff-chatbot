import fs from "node:fs";
import path from "node:path";

const required = [
  ".claude/CLAUDE.md",
  ".claude/settings.json",
  ".claude/skills/arg-pacing/SKILL.md",
  ".claude/skills/puzzle-design/SKILL.md",
  "schemas/player-state.schema.json",
  "schemas/puzzle.schema.json",
  "project/ARG_BIBLE.md",
  "project/SAFETY_POLICY.md"
];

let failed = false;
for (const file of required) {
  if (!fs.existsSync(path.resolve(file))) {
    console.error(`MISSING ${file}`);
    failed = true;
  }
}

for (const file of fs.readdirSync("schemas")) {
  if (file.endsWith(".json")) {
    try { JSON.parse(fs.readFileSync(path.join("schemas", file), "utf8")); }
    catch (e) { console.error(`INVALID JSON ${file}`, e); failed = true; }
  }
}

if (failed) process.exit(1);
console.log("ARG configuration validation passed.");
