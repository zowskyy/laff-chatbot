# Telegram Bot Alert Setup for laff

## Step 1: Create Your Bot

1. Open Telegram and search for **@BotFather**
2. Start a chat and send: `/newbot`
3. Name it: `laff alerts` (or whatever you want)
4. Username: `yourname_laff_bot` (must end in bot, unique)
5. BotFather gives you a **token** like:
   ```
   123456789:ABCdefGHIjklMNOpqrSTUvwxyz
   ```

## Step 2: Get Your Chat ID

1. Send a message to your new bot (say "hello")
2. Open this URL in your browser:
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
3. Look for `"chat":{"id":123456789` — that number is your **chat ID**

## Step 3: Set Environment Variables

On your server (Render, Railway, etc.), add these:

```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxyz
TELEGRAM_CHAT_ID=123456789
ADMIN_PASS=your-secret-passcode
```

## What Happens

Every time someone sends a message in laff, you get a Telegram notification:

```
laff alert: someone is talking to you.
message: "i feel like nobody sees me..."

↩ reply to this message to respond to them
```

**You can reply straight from Telegram — no app, no passcode.** Swipe on the alert message (or long-press → Reply) and type your response; it goes straight to that visitor. Telegram sends back a `✓ sent to <id>` confirmation so you know it landed.

If multiple people are messaging at once: always reply-to the specific alert for the person you mean. If you just type a plain message without replying to anything, it goes to whoever messaged most recently.

The web app's admin mode (tap top 4x, enter passcode) still works too — useful for browsing full conversation history or switching between several open threads at once, but for a quick one-line reply, Telegram is now the fast path.

Requires `ALLOWED_ORIGIN` to be set to your real deployed URL — the server uses it to register the Telegram webhook on startup. Check your server logs for `Telegram webhook registered` to confirm it's live.
