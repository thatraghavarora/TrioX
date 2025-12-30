# TrioX Admin Dashboard

Dark-ops dashboard for TrioX drug intelligence with React (Vite) on the front-end and a small Express service that talks directly to the Telegram API (API ID/API Hash / String Session).

## Getting Started

```bash
npm install
npm run dev        # React UI
npm run server     # Telegram backend (port 4000 by default)
```

Set `VITE_API_BASE_URL=http://localhost:4000` in a `.env` file (or export) during development so the UI can talk to the Express server. If you run the optional Telethon FastAPI backend (see below), set `VITE_TELETHON_API_URL=http://localhost:8000` instead. If you want Gemini AI to fabricate demo social posts, also set `VITE_GEMINI_API_KEY=your_key`. For production deployments host the compiled `dist` build and reverse-proxy `/api/*` (and/or the Telethon `/search` endpoint) to the backend.

## Telegram Setup

1. Create an app at <https://my.telegram.org/apps> and copy the API ID + API Hash.
   2. Inside `server/.env` (or repo root `.env`) configure:
      ```
      TG_API_ID=123456
      TG_API_HASH=yourhash
      TG_STRING_SESSION=replace_later
      TG_RESULTS_LIMIT=20
      TG_DISCOVERY_LIMIT=6
      TG_CHANNEL_RESULTS=4
      TG_CHANNELS=@myPublicChannel1,@anotherChannel   # optional static list
      TG_DEBUG=true                                   # optional verbose logs
      ```
3. Generate a reusable `TG_STRING_SESSION`:
   ```bash
   cd server
   node createSession.js
   ```
   Follow the prompts (phone, 2FA password, OTP). Paste the printed string into the `.env` file.
4. Run `npm run server`. You should see “Telegram client connected and ready.”

The Express API now exposes `GET /api/telegram/search?keyword=snow` which crawls Telegram’s global search (no channel list required) and powers the Social Media view.

## Building

```
npm run build
```

Static files live under `dist/` and can be served by any CDN/front-end host. Make sure to also deploy the `server` folder somewhere Node can run (or move the code into an existing backend) so `/api/telegram/search` stays reachable. Set `VITE_API_BASE_URL` accordingly.

## Optional: Telethon FastAPI backend

If you prefer using Telethon (Python) for Telegram scraping:

1. Create a virtualenv and install dependencies:
   ```bash
   cd telethon_service
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Configure the environment (see `.env.example`):
   ```
   TELEGRAM_API_ID=123456
   TELEGRAM_API_HASH=yourhash
   TELETHON_SESSION=telethon_session
   ALLOWED_CHANNELS=@channelOne,@channelTwo
   ```
3. Start the API:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
4. Point the React app at it by setting `VITE_TELETHON_API_URL=http://localhost:8000`. The UI automatically switches its fetches to the Telethon endpoint (`GET /search?keyword=...`).
