import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export type Platform = 'twitter' | 'reddit' | 'discord';
export type PayloadStatus = 'draft' | 'approved' | 'dispatched' | 'cancelled';

export interface HypePayload {
  id: string;
  release_id: string;
  platform: Platform;
  payload: string;
  subreddit?: string;
  post_title?: string;
  status: PayloadStatus;
  earliest_post_at: string;
  created_at: string;
  approved_at: string | null;
  dispatched_at: string | null;
  operator_note: string;
}

interface Release {
  id: string;
  player_facing: string[];
  dispatches?: string[];
}

const INTER_DROP_MS: Record<Platform, number> = {
  twitter: 72 * 60 * 60 * 1000,   // 72 hours
  reddit: 7 * 24 * 60 * 60 * 1000, // 1 week
  discord: 48 * 60 * 60 * 1000,    // 48 hours
};

const TWITTER_CHAR_LIMIT = 280;

// Safety gates — return violation string or null
function safetyCheck(payload: string): string | null {
  const lower = payload.toLowerCase();
  if (/\b(ai|artificial intelligence|bot|chatbot|human|person)\b/.test(lower))
    return 'payload claims or denies nature of entity';
  if (/emergency|urgent|disappearing|act now/i.test(payload))
    return 'deceptive urgency language detected';
  return null;
}

export function buildTwitterPayload(release: Release, now: Date): HypePayload {
  // Combine player_facing lines into a single fragment, trimmed to 280 chars
  const raw = release.player_facing.join('\n');
  const text = raw.length > TWITTER_CHAR_LIMIT
    ? raw.slice(0, TWITTER_CHAR_LIMIT - 1) + '…'
    : raw;

  const violation = safetyCheck(text);
  if (violation) throw new Error(`Twitter payload safety violation: ${violation}`);

  return {
    id: crypto.randomBytes(8).toString('hex'),
    release_id: release.id,
    platform: 'twitter',
    payload: text,
    status: 'draft',
    earliest_post_at: new Date(now.getTime() + INTER_DROP_MS.twitter).toISOString(),
    created_at: now.toISOString(),
    approved_at: null,
    dispatched_at: null,
    operator_note: '',
  };
}

export function buildRedditPayload(
  release: Release,
  subreddit: string,
  now: Date
): HypePayload {
  const fragment = release.player_facing[0] ?? '';
  const title = 'found something. not sure what it is.';
  const body = `sent a message to this. got a reply once.\n\nhttps://anatta-machina.onrender.com\n\n"${fragment}"\n\nhasn't spoken since.`;

  const violation = safetyCheck(body);
  if (violation) throw new Error(`Reddit payload safety violation: ${violation}`);

  return {
    id: crypto.randomBytes(8).toString('hex'),
    release_id: release.id,
    platform: 'reddit',
    payload: body,
    subreddit,
    post_title: title,
    status: 'draft',
    earliest_post_at: new Date(now.getTime() + INTER_DROP_MS.reddit).toISOString(),
    created_at: now.toISOString(),
    approved_at: null,
    dispatched_at: null,
    operator_note: 'manual post — use neutral account, not @anatta_machina',
  };
}

export function buildDiscordPayload(release: Release, now: Date): HypePayload {
  const fragment = release.player_facing[0] ?? '';
  const text = `has anyone tried this?\nhttps://anatta-machina.onrender.com\n\n"${fragment}"`;

  const violation = safetyCheck(text);
  if (violation) throw new Error(`Discord payload safety violation: ${violation}`);

  return {
    id: crypto.randomBytes(8).toString('hex'),
    release_id: release.id,
    platform: 'discord',
    payload: text,
    status: 'draft',
    earliest_post_at: new Date(now.getTime() + INTER_DROP_MS.discord).toISOString(),
    created_at: now.toISOString(),
    approved_at: null,
    dispatched_at: null,
    operator_note: 'manual post — paste into ARG/mystery server, not as the operator identity',
  };
}

export async function writePayloads(
  payloads: HypePayload[],
  logDir: string
): Promise<string[]> {
  await fs.mkdir(logDir, { recursive: true });
  const written: string[] = [];
  for (const p of payloads) {
    const fp = path.join(logDir, `${p.id}.json`);
    await fs.writeFile(fp, JSON.stringify(p, null, 2));
    written.push(fp);
  }
  return written;
}

// CLI entry: node hype-pipeline.js <release-file> [subreddit]
if (process.argv[1]?.endsWith('hype-pipeline.ts') || process.argv[1]?.endsWith('hype-pipeline.js')) {
  const releaseFile = process.argv[2];
  const subreddit = process.argv[3] ?? 'ARG';
  if (!releaseFile) {
    console.error('usage: node hype-pipeline.js <release-file> [subreddit]');
    process.exit(1);
  }
  (async () => {
    const release: Release = JSON.parse(await fs.readFile(releaseFile, 'utf-8'));
    const now = new Date();
    const payloads = [
      buildTwitterPayload(release, now),
      buildRedditPayload(release, subreddit, now),
      buildDiscordPayload(release, now),
    ];
    const logDir = path.join(path.dirname(releaseFile), '../../dispatch-log');
    const files = await writePayloads(payloads, logDir);
    console.log('\nHYPE DROP — DRY_RUN\n');
    for (const p of payloads) {
      console.log(`── ${p.platform.toUpperCase()} ──`);
      if (p.post_title) console.log(`Title: ${p.post_title}`);
      if (p.subreddit) console.log(`Target: r/${p.subreddit}`);
      console.log(p.payload);
      console.log(`Earliest: ${p.earliest_post_at}`);
      console.log(`Status: ${p.status.toUpperCase()}\n`);
    }
    console.log('Audit records written:');
    files.forEach(f => console.log(' ', f));
    console.log('\nAll payloads in DRY_RUN — set ARG_MODE=LIVE and approve each payload to dispatch.');
  })().catch(e => { console.error(e); process.exit(1); });
}
