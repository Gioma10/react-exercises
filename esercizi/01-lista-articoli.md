# 01: Lista articoli

**Tempo target:** 45 minuti
**Argomenti:** Server Components, fetch tipizzato, `loading.tsx` / `error.tsx`, `next/image`, variabili d'ambiente

## Ticket

> Come lettore, voglio vedere in home le ultime notizie, così capisco subito cosa sta succedendo.

## Requisiti

1. La home (`/`) mostra i **primi 12 articoli** di `GET /articles` (sort `latest`).
2. Ogni articolo è una card con: immagine, categoria, titolo, excerpt, autore, data di pubblicazione leggibile (es. "23 nov 2026") e minuti di lettura.
3. Il fetch avviene in un **Server Component**: niente `useEffect`, niente `"use client"` in questa pagina.
4. L'URL dell'API **non** è scritto nel codice: arriva da una variabile d'ambiente.
5. Le risposte dell'API sono **tipizzate**. Scrivi tu i tipi in `src/lib/`, senza usare `any`.
6. Mentre carica si vede uno **skeleton** (`loading.tsx`).
7. Se l'API risponde con un errore, si vede un messaggio comprensibile con un bottone **"Riprova"** (`error.tsx`).
8. Layout responsive: 1 colonna su mobile, 2 su tablet, 3 su desktop.

## Definition of done

- [ ] `pnpm check` passa
- [ ] Con l'API avviata si vedono 12 card
- [ ] Con `MIN_DELAY=3000` si vede lo skeleton
- [ ] Con `FAIL_RATE=1` si vede la pagina di errore, e "Riprova" funziona dopo aver riavviato l'API con `FAIL_RATE=0`
- [ ] Nessun `any`, nessun URL scritto a mano

## Domande a cui devi saper rispondere (te le chiedo in review)

- Perché `error.tsx` deve essere un Client Component e `loading.tsx` no?
- Che differenza c'è tra `process.env.API_URL` e `process.env.NEXT_PUBLIC_API_URL`? Quale ti serve qui, e perché?
- Next.js in questa versione mette in cache il `fetch` per default? Come lo verifichi?

## Bonus (se finisci in anticipo)

- Estrai una funzione `apiFetch<T>()` riutilizzabile, che lancia un errore tipizzato quando `res.ok` è falso.
- Aggiungi i metadata della pagina (`title`, `description`).
