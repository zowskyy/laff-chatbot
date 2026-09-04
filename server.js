const http = require('http');const fs = require('fs');const path = require('path');const crypto = require('crypto');const PORT = process.env.PORT || 3000;const PASSCODE = process.env.ADMIN_PASS;const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

if (!PASSCODE) { console.error('FATAL: ADMIN_PASS env var is not set. Refusing to start with no admin passcode configured.'); process.exit(1); }
if (!ALLOWED_ORIGIN) { console.warn('WARNING: ALLOWED_ORIGIN env var is not set — accepting socket connections from any origin. Set ALLOWED_ORIGIN to your deployed domain before sharing this publicly.'); }

const conversations = new Map();const adminSockets = new Set();const userSockets = new Map();
const loginAttempts = new Map(); // ip -> {count, lockUntil}
const MAX_ATTEMPTS = 5, LOCK_MS = 60000, ATTEMPT_WINDOW_MS = 60000, MAX_HISTORY = 5, MAX_ADMIN_HISTORY = 500;

const ADJECTIVES = ['pale','dim','still','cold','hollow','ashen','silent','faint','grey','quiet','bare','dark','worn','soft','lost','slow','thin','dull','void','rust'];
const NOUNS = ['moth','crane','ember','drift','smoke','wisp','stone','frost','shade','mist','wraith','husk','dusk','veil','shard','echo','gloom','ash','tide','rift'];
function genName() {
  const a = ADJECTIVES[Math.floor(Math.random()*ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random()*NOUNS.length)];
  return `${a}-${n}`;
}

function pushMsg(conv, msg) {
  conv.msgs.push(msg); if (conv.msgs.length > MAX_HISTORY) conv.msgs = conv.msgs.slice(-MAX_HISTORY);
  conv.adminMsgs.push(msg); if (conv.adminMsgs.length > MAX_ADMIN_HISTORY) conv.adminMsgs = conv.adminMsgs.slice(-MAX_ADMIN_HISTORY);
}

function genId() { return crypto.randomBytes(8).toString('hex'); }

function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) { crypto.timingSafeEqual(bufB, bufB); return false; }
  return crypto.timingSafeEqual(bufA, bufB);
}

function checkRateLimit(ip) {
  const now = Date.now();
  let entry = loginAttempts.get(ip);
  if (!entry || now > entry.windowStart + ATTEMPT_WINDOW_MS) { entry = { count: 0, windowStart: now, lockUntil: 0 }; loginAttempts.set(ip, entry); }
  if (entry.lockUntil && now < entry.lockUntil) return false;
  return true;
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, windowStart: now, lockUntil: 0 };
  entry.count++;
  if (entry.count >= MAX_ATTEMPTS) { entry.lockUntil = now + LOCK_MS; entry.count = 0; }
  loginAttempts.set(ip, entry);
}

function clearAttempts(ip) { loginAttempts.delete(ip); }

const telegramMsgMap = new Map(); // telegram alert message_id -> userId
let lastActiveUserId = null;
let webhookSecret = null;

async function telegramAlert(text, userId) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try {
    const msg = `laff alert: someone is talking to you.\nmessage: "${text.slice(0,200)}${text.length>200?'...':''}"\n\n↩ reply to this message to respond to them`;
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: msg, disable_notification: false }) });
    const data = await res.json();
    if (data.ok && data.result && data.result.message_id) telegramMsgMap.set(data.result.message_id, userId);
  } catch(e) { console.log('telegram alert failed:', e.message); }
}

async function telegramConfirm(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  try { await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, disable_notification: true }) }); } catch(e) {}
}

async function setupTelegramWebhook() {
  if (!TELEGRAM_BOT_TOKEN || !ALLOWED_ORIGIN) { if (TELEGRAM_BOT_TOKEN) console.warn('WARNING: TELEGRAM_BOT_TOKEN is set but ALLOWED_ORIGIN is not — cannot register Telegram webhook, replying from Telegram will not work.'); return; }
  webhookSecret = crypto.randomBytes(24).toString('hex');
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ url: `${ALLOWED_ORIGIN}/telegram-webhook`, secret_token: webhookSecret, allowed_updates: ['message'] }) });
    const data = await res.json();
    if (data.ok) console.log('Telegram webhook registered — replying from Telegram is now live.');
    else { console.error('Telegram webhook registration failed:', data.description); webhookSecret = null; }
  } catch(e) { console.error('Telegram webhook setup error:', e.message); webhookSecret = null; }
}

function deliverAdminReply(targetId, text) {
  const conv = conversations.get(targetId);
  if (!conv) return false;
  const msg = { text: text.trim().slice(0, 2000), fromMe: true, time: Date.now() };
  pushMsg(conv, msg); conv.last = Date.now(); conv.unread = 0;
  const us = userSockets.get(targetId); if (us) us.emit('msg', msg);
  adminSockets.forEach(s => s.emit('msg_update', targetId, msg));
  return true;
}

function handleTelegramUpdate(update) {
  const message = update && update.message;
  if (!message || !message.text) return;
  if (String(message.chat.id) !== String(TELEGRAM_CHAT_ID)) return;
  let targetId = null;
  if (message.reply_to_message && telegramMsgMap.has(message.reply_to_message.message_id)) targetId = telegramMsgMap.get(message.reply_to_message.message_id);
  else targetId = lastActiveUserId;
  if (!targetId) { telegramConfirm('no active conversation to reply to yet.'); return; }
  const delivered = deliverAdminReply(targetId, message.text);
  telegramConfirm(delivered ? `✓ sent to ${targetId.slice(0,8)}` : 'that conversation no longer exists.');
}

const MIME = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.mp4':'video/mp4','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.webmanifest':'application/manifest+json','.ico':'image/x-icon'};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (req.method === 'POST' && urlPath === '/telegram-webhook') {
    if (!webhookSecret || req.headers['x-telegram-bot-api-secret-token'] !== webhookSecret) { res.writeHead(403); res.end(); return; }
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => { try { handleTelegramUpdate(JSON.parse(body)); } catch(e) {} res.writeHead(200); res.end('ok'); });
    return;
  }
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(__dirname, urlPath);
  if (!filePath.startsWith(__dirname + path.sep) && filePath !== path.join(__dirname, 'index.html')) { res.writeHead(403); res.end(); return; }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': stat.size });
    fs.createReadStream(filePath).pipe(res);
  });
});

const io = require('socket.io')(server, { cors: { origin: ALLOWED_ORIGIN || '*' } });

io.on('connection', socket => {
  let userId = null; let isAdmin = false;
  const ip = socket.handshake.address;

  socket.on('join', () => { userId = genId(); userSockets.set(userId, socket); socket.emit('assigned', userId);
    if (!conversations.has(userId)) conversations.set(userId, {msgs:[],adminMsgs:[],unread:0,last:Date.now(),name:genName()});
  });

  socket.on('admin_auth', pass => {
    if (!checkRateLimit(ip)) { socket.emit('admin_fail'); return; }
    if (typeof pass === 'string' && safeCompare(pass, PASSCODE)) {
      clearAttempts(ip);
      isAdmin = true; adminSockets.add(socket); socket.emit('admin_ok');
      const list = Array.from(conversations.entries()).map(([id,c]) => ({id,name:c.name,last:c.last,unread:c.unread,preview:c.adminMsgs[c.adminMsgs.length-1]?.text||''})).sort((a,b)=>b.last-a.last);
      socket.emit('convo_list', list);
    } else {
      recordFailedAttempt(ip);
      socket.emit('admin_fail');
    }
  });

  socket.on('read_convo', targetId => { if (!isAdmin) return; const conv = conversations.get(targetId); if (conv) conv.unread = 0; });

  socket.on('get_history', targetId => { if (!isAdmin) return; const conv = conversations.get(targetId); if (conv) socket.emit('admin_history', targetId, conv.adminMsgs); });

  socket.on('msg', (text, targetId) => { if (!text || !text.trim()) return; const t = text.trim().slice(0, 2000); if (isAdmin && targetId) { deliverAdminReply(targetId, t); } else if (userId) { let conv = conversations.get(userId); if (!conv) { conv = {msgs:[],adminMsgs:[],unread:0,last:Date.now(),name:genName()}; conversations.set(userId, conv); } const msg = {text:t,fromMe:false,time:Date.now()}; pushMsg(conv, msg); conv.last = Date.now(); conv.unread++; lastActiveUserId = userId; telegramAlert(t, userId); adminSockets.forEach(s => { s.emit('new_convo', {id:userId,name:conv.name,last:conv.last,unread:conv.unread,preview:t}); s.emit('msg_update', userId, msg); }); socket.emit('msg_echo', msg); } });

  socket.on('typing', targetId => { if (isAdmin && targetId) { const us = userSockets.get(targetId); if (us) us.emit('admin_typing'); } else if (userId) { adminSockets.forEach(s => s.emit('user_typing', userId)); } });

  socket.on('disconnect', () => { if (isAdmin) adminSockets.delete(socket); if (userId) userSockets.delete(userId); });
});

server.listen(PORT, () => { console.log('laff server on :'+PORT); setupTelegramWebhook(); });
