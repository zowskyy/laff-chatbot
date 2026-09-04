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
```

Tap the notification, open the app, tap the top 4 times, enter your passcode, respond.
