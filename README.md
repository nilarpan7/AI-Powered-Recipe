AI Powered Recipe - Full Stack (OpenAI + Supabase)

Overview
This project is a full-stack MVP for a healthy recipe generator with guest mode, Supabase auth/storage, and OpenAI-powered recipe generation.

Stack

- Backend: Node.js, Express, TypeScript, OpenAI SDK, Supabase (service role for server)
- Frontend: React (Vite + TS), Supabase client (auth), Fetch to backend

Setup

1. Supabase

- Create a project, get the URL and anon/service keys.
- Run the SQL in `supabase/schema.sql`, then `supabase/policies.sql`.

2. Backend

- Copy `backend/.env.example` to `backend/.env` and fill in values.
- Install deps: `cd backend && npm install`
- Start dev: `npm run dev`

3. Frontend

- Copy `frontend/.env.example` to `frontend/.env` and fill in values.
- Install deps: `cd frontend && npm install`
- Start dev: `npm run dev`

Environment Variables

- Backend (`backend/.env`):

  - PORT: server port (default 4000)
  - OPENAI_API_KEY: your OpenAI API key
  - SUPABASE_URL: your Supabase project URL
  - SUPABASE_SERVICE_ROLE_KEY: service role key (server only)
  - FRONTEND_ORIGIN: allowed CORS origin (e.g., http://localhost:5173)

- Frontend (`frontend/.env`):
  - VITE_SUPABASE_URL: your Supabase URL
  - VITE_SUPABASE_ANON_KEY: anon key
  - VITE_API_BASE_URL: backend URL (e.g., http://localhost:4000)

Notes

- The backend provides `/api/generate` which calls OpenAI to produce a structured recipe JSON and optionally saves to Supabase when `user_id` is provided.
- The frontend handles auth (email/password + optional Google) and calls the backend to generate recipes. History/favorites use Supabase.
- Events are recorded via Supabase directly from the frontend.

Security

- Do not expose the service role key in the frontend. Keep it only in the backend `.env`.
