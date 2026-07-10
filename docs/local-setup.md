# Local Setup

1. Install Node.js 22 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Create a Supabase project or local Supabase stack.
5. Apply migrations from `database/migrations`.
6. Apply seeds from `database/seeds`.
7. Run `npm run dev`.

This desktop environment currently does not expose Node.js on PATH, so automated verification depends on a local machine or CI runtime with Node installed.
