import { buildTwitterPayload, buildRedditPayload, buildDiscordPayload } from '../src/hype-pipeline';

const mockRelease = {
  id: '001-opening',
  player_facing: [
    'anatta.machina is reachable.',
    'Some visitors receive a reply. Most do not.',
  ],
};

const now = new Date('2026-09-04T00:00:00Z');

test('twitter payload is within 280 chars', () => {
  const p = buildTwitterPayload(mockRelease, now);
  expect(p.payload.length).toBeLessThanOrEqual(280);
  expect(p.platform).toBe('twitter');
  expect(p.status).toBe('draft');
});

test('reddit payload includes the URL and fragment', () => {
  const p = buildRedditPayload(mockRelease, 'ARG', now);
  expect(p.payload).toContain('anatta-machina.onrender.com');
  expect(p.payload).toContain(mockRelease.player_facing[0]);
  expect(p.subreddit).toBe('ARG');
});

test('discord payload is short and contains URL', () => {
  const p = buildDiscordPayload(mockRelease, now);
  expect(p.payload).toContain('anatta-machina.onrender.com');
  expect(p.platform).toBe('discord');
});

test('inter-drop interval is enforced for twitter (72h)', () => {
  const p = buildTwitterPayload(mockRelease, now);
  const earliest = new Date(p.earliest_post_at).getTime();
  const diff = earliest - now.getTime();
  expect(diff).toBeGreaterThanOrEqual(72 * 60 * 60 * 1000);
});

test('safety check rejects urgency language', () => {
  const badRelease = { ...mockRelease, player_facing: ['Act now — disappearing soon.'] };
  expect(() => buildTwitterPayload(badRelease, now)).toThrow(/urgency/);
});

test('all payloads start in draft status', () => {
  const tw = buildTwitterPayload(mockRelease, now);
  const rd = buildRedditPayload(mockRelease, 'ARG', now);
  const dc = buildDiscordPayload(mockRelease, now);
  expect(tw.status).toBe('draft');
  expect(rd.status).toBe('draft');
  expect(dc.status).toBe('draft');
});
