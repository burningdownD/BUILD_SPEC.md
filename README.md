# Indoor-Golfliga

Dieses Repository enthält eine vollständige Web-Anwendung (React + Netlify Functions) für eine einmalige Indoor-Golfliga.

Kurz: Frontend in React (Vite), Backend via Netlify Functions (Node.js, PostgreSQL über DATABASE_URL).

Setup (kurz):

1. .env konfigurieren (siehe .env.example)
2. npm install
3. npm run db:migrate
4. npm run db:seed
5. npm run dev

Für Netlify: setze die Environment Variables in Netlify UI (PLAYER_PASSWORD, ADMIN_PASSWORD, SESSION_SECRET, DATABASE_URL, SEASON_END_DATE)

Ausführliche Anleitung im README.md (siehe im Repo).
