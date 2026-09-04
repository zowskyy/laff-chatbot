# laff

Anonymous chatbot app. You are the bot. Users talk to you anonymously. You respond anonymously.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire PWA frontend (black theme, red accents, admin mode) |
| `server.js` | Node.js + Socket.io real-time backend |
| `package.json` | Dependencies |
| `icon-192.png` | App icon (192x192) |
| `icon-512.png` | App icon (512x512) |
| `icon-maskable.png` | Adaptive icon for Android |
| `TELEGRAM_SETUP.md` | How to set up Telegram bot alerts |
| `twa/twa-manifest.json` | Bubblewrap config for Play Store |

## Quick Start

### 1. Deploy Frontend

Upload `index.html` + icons to any static host:
- **Vercel**: `npm i -g vercel && vercel --prod`
- **Netlify**: Drag folder into netlify.com
- **GitHub Pages**: Push to repo, enable Pages

### 2. Deploy Backend

Upload `server.js` + `package.json` to any Node.js host:
- **Render**: New Web Service, Node environment
- **Railway**: New project, deploy from repo
- **Glitch**: Remix a Node project, paste code

Set environment variables:
```
PORT=3000
ADMIN_PASS=laff1827
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

### 3. Build Android App

```bash
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://your-site.com/manifest.json
bubblewrap build
```

Upload `app-release-signed.aab` to Google Play Console.

## Admin Mode

1. Open the app
2. Tap the **top edge of the screen 4 times rapidly**
3. Enter passcode: `laff1827` (change in env vars)
4. See all anonymous conversations, tap one, respond

## How It Works

```
[Anonymous User] → types in laff app
                → message hits your server
                → Telegram bot texts your phone instantly
                → you open app, unlock admin mode, respond
                → user sees your reply in real-time
```

No logins. No names. No data stored permanently.
