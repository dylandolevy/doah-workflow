# ChatKit demo (ChatKit frontend + FastAPI session server)

This repo contains a minimal demo that shows how to connect OpenAI ChatKit to a website:
- `server/` - FastAPI server that creates/refreshes ChatKit sessions (returns `client_secret`)
- `public/index.html` - Minimal static frontend that loads ChatKit script and calls the server for client secrets.

## Important
- **GitHub Pages can host the frontend (static).** It cannot run the FastAPI server.
- You must run the `server` somewhere (locally, Render, Vercel functions, Fly, Heroku, etc).

## Quick local run (dev)
1. Copy `.env.example` → `.env` and fill `OPENAI_API_KEY` and `CHATKIT_WORKFLOW_ID`.
2. Run server:
   ```bash
   cd server
   python -m venv .venv
   source .venv/bin/activate   # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn server:app --reload --port 8000
