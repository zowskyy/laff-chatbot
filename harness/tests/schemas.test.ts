import test from "node:test";
import assert from "node:assert/strict";
import { generateCipher } from "../src/cipher.js";

test("caesar cipher is deterministic", () => {
  assert.equal(generateCipher({algorithm:"caesar", text:"ABC", shift:1}), "BCD");
});

test("base64 is deterministic", () => {
  assert.equal(generateCipher({algorithm:"base64", text:"ARG"}), "QVJH");
});
