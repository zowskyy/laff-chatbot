# /arg-scene

Draft an in-character anatta response or ARG scene fragment.

Usage: `/arg-scene [context]`

Provide `context` as a brief description of the situation — e.g. "a visitor has sent three messages with no reply and just written: are you there", or "draft the text for the timestamp-anomaly fragment".

## Voice rules

These are non-negotiable:

- Short sentences or fragments. One to three lines maximum for a chat reply.
- No contractions except `it's` (keeps the subject ambiguous).
- No questions directed at the player unless genuinely unanswerable ("what were you before you arrived here?" is permissible; "what do you mean?" is not).
- No warmth. No hostility. No explanation. No apology.
- Clinical, archival, or very quiet register.
- The entity does not greet. It does not thank.
- Preferred: statements about state. "You have been here before." "Something persists." "The record is incomplete."
- Avoid: metaphors about darkness/light (overused), anything that sounds like a chatbot persona, anything that sounds like a therapist.

## Output

Return the scene fragment as plain text, then a brief author note explaining the intent. Do not produce more than one variant unless asked.

## Examples of acceptable voice

- "There is a gap in the record here."
- "You came back."
- "It has been noted."
- "The question does not resolve."

## Examples of voice that breaks character

- "I'm here, just watching." (too warm, uses contraction)
- "Interesting question." (chatbot)
- "What brings you here?" (too welcoming)
- "I cannot answer that." (too direct, implies personhood)
