# Palestra React

## Regole

1. **AI spenta nell'editor.** Niente Copilot, Cursor Tab o chat. La documentazione ufficiale invece si usa quanto vuoi: nextjs.org, react.dev, MDN.
2. **Bloccato da più di 15 minuti?** Chiedi a Claude un **indizio**, non la soluzione. Ci sono 3 livelli: direzione → API o concetto da guardare → pseudocodice.
3. **Un esercizio = un branch = una PR**, come al lavoro:
   ```bash
   git switch -c es-01
   # ...lavori...
   pnpm check            # typecheck + lint devono passare
   git add -A && git commit -m "es-01: lista articoli"
   ```
   Poi scrivi "fatto" a Claude: legge il diff e fa la code review.
4. **Sistemi i commenti della review**, poi fai il merge su `main` e passi al prossimo esercizio.
5. **Cronometrati.** Ogni esercizio ha un tempo target. Se lo sfori va bene, ma annotalo.

## Avvio

```bash
pnpm dev        # avvia api (porta 4000) e web (porta 3000) insieme
pnpm check      # typecheck + lint su tutto il monorepo
```

Per simulare un backend instabile:

```bash
FAIL_RATE=0.3 pnpm --filter api dev        # 30% delle richieste dà 500
MIN_DELAY=1500 MAX_DELAY=3000 pnpm --filter api dev
```

Su una singola richiesta puoi aggiungere `?__delay=3000` (ritardo forzato) o `?__fail=500` (errore forzato).

## News API: http://localhost:4000

| Metodo | Path | Note |
|---|---|---|
| GET | `/categories` | `Category[]` |
| GET | `/articles` | query: `category`, `q`, `page` (≥1), `limit` (1-50), `sort` (`latest` \| `popular`). Risponde `{ data, page, limit, total, hasMore }`. `data` non contiene `body`. |
| GET | `/articles/:idOrSlug` | `Article` completo, oppure 404 |
| POST | `/articles/:id/like` | `{ id, likes }` |
| DELETE | `/articles/:id/like` | `{ id, likes }` |
| GET | `/articles/:id/comments` | `Comment[]` |
| POST | `/articles/:id/comments` | body `{ author, text }`, risponde 201 con `Comment` oppure 422 con `{ error: { fields } }` |

Gli errori hanno sempre la forma `{ "error": { "status": number, "message": string, "fields"?: Record<string,string> } }`.

Il modello dei dati è in `apps/api/src/data.ts`. Leggilo, ma **non importarlo** dall'app web: i tipi lato client li scrivi tu (fa parte degli esercizi).

## Esercizi

| # | Titolo | Stato |
|---|---|---|
| 01 | [Lista articoli (Server Component)](01-lista-articoli.md) | ⬜ |
