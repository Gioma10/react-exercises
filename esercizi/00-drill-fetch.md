# 00: Drill fetch

**Tempo target:** 30 minuti in totale
**Obiettivo:** scrivere una chiamata fetch senza pensarci.

## Setup

Crea il file `esercizi/drill/fetch.ts` e lancialo con:

```bash
node esercizi/drill/fetch.ts
```

Node 24 esegue TypeScript direttamente e ha già `fetch`. L'API deve essere avviata (`pnpm --filter api dev`).

## Regole

- Scrivi tutto **a memoria**: niente copia-incolla dalla spiegazione e niente AI.
- Ogni drill è una funzione `async` separata. Chiamale una alla volta in fondo al file.
- Dopo ogni drill **cancella il codice e riscrivilo da zero**, finché non ti viene senza esitazioni.

## Drill

1. **Categorie.** Fai fetch di `/categories` e stampa solo i nomi, uno per riga.
2. **Un articolo.** Fai fetch di `/articles/1` e stampa `titolo (autore)`.
3. **Status.** Fai fetch di `/articles/9999`. Stampa lo status e il messaggio d'errore che arriva nel JSON.
4. **res.ok.** Scrivi una funzione `getArticle(id: string)` che lancia un `Error` se la risposta non è ok. Chiamala con un id valido e con uno non valido, dentro un `try/catch`, e stampa cosa succede.
5. **Query string.** Fai fetch dei 5 articoli più popolari di `tech` (guarda i parametri nel README). Stampa `likes - titolo`.
6. **Tipi.** Definisci il tipo `Category` e il tipo della risposta paginata di `/articles`. Fai in modo che il risultato di `res.json()` sia tipizzato, così che l'autocompletamento funzioni.
7. **POST.** Aggiungi un commento all'articolo 1 con `method: "POST"`, l'header `Content-Type: application/json` e un body creato con `JSON.stringify`. Stampa il commento creato.
8. **POST invalido.** Rifai il 7 con `text: ""`. Stampa lo status e l'oggetto `fields` con gli errori di validazione.
9. **Errore di rete.** Ferma l'API e lancia il drill 1. Cosa succede? Che differenza c'è con il drill 3?
10. **Parallelo.** Fai fetch degli articoli 1, 2 e 3 **in parallelo** (non uno dopo l'altro) e stampa i 3 titoli. Suggerimento: `Promise.all`.

## Quando hai finito

Scrivi a Claude "drill fatto", poi torna all'esercizio 01: la chiamata nella home ti sembrerà banale.
