/**
 * Sample local MCP-style tool adapter.
 *
 * This file intentionally contains no live social-network credentials and does
 * not post anywhere. Connect it to the MCP SDK when you choose a concrete
 * SDK version and transport for your deployment.
 */
import { generateCipher } from "./cipher.js";
import { applyEvent } from "./state-store.js";
import { dispatchSocial } from "./dispatch.js";

export const tools = {
  arg_generate_cipher: generateCipher,
  arg_apply_player_event: applyEvent,
  arg_dispatch_social: dispatchSocial,
};
