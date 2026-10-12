# Indoor-Golfliga

Eine minimale, aber vollständig lauffähige Version der Indoor-Golfliga mit React + Vite + Netlify Functions. Die App läuft lokal mit `npm run dev` und kann für Netlify mit den mitgelieferten Netlify Functions eingesetzt werden.

## Voraussetzungen

- Node.js 18+
- npm
- optional: PostgreSQL mit `DATABASE_URL`

## Lokale Entwicklung

1. `npm install`
2. `.env.example` kopieren nach `.env` und Werte anpassen
3. `npm run dev`
4. Öffne `http://localhost:5173`

## Env-Variablen

```bash
PLAYER_PASSWORD=spieler123
ADMIN_PASSWORD=admin123
SESSION_SECRET=geheimes-zufallstoken
DATABASE_URL=postgresql://user:password@host:5432/dbname
SEASON_END_DATE=2027-03-31
```

Wenn `DATABASE_URL` nicht gesetzt ist, arbeitet die App mit einem in-memory Demo-Store weiter, damit die lokale Entwicklung ohne Datenbank funktioniert.

## Migration und Seed

```bash
npm run db:migrate
npm run db:seed
```

## Netlify Deployment

1. Repository auf GitHub pushen
2. Netlify Projekt anlegen
3. Build Command: `npm run build`
4. Publish directory: `dist`
5. Environment Variables in Netlify setzen
6. Deploy starten

## Netlify Funktionen

- `/.netlify/functions/public-data`
- `/.netlify/functions/auth-player`
- `/.netlify/functions/auth-admin`
- `/.netlify/functions/submit-round`
- `/.netlify/functions/admin-data`
- `/.netlify/functions/export-csv`

## Tests

```bash
npm test
```
