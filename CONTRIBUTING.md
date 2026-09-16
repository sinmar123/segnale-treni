# Contribuire — Segnale Treni Community

## Cosa puoi fare oggi (v0)

1. Registra un viaggio con l’app **SegnaleTreno** (o CSV compatibile).
2. Apri [upload.html](upload.html), carica il CSV e verifica la mappa in locale.
3. Per condividere con la community (finché non c’è upload server):
   - apri una **Issue** su GitHub allegando il CSV, **oppure**
   - apri una **Pull Request** che aggiunge il file sotto `contributions/` (cartella da creare nella PR) con nome `segnale_treno_YYYYMMDD_HHmmss.csv`

Indica tratta (es. Genova–La Spezia), data, operatori (mono o dual).  
**Non** allegare dati personali (nome, telefono, foto, ecc.): il CSV dell’app non li contiene.

## Roadmap upload

- Endpoint Worker + storage (es. Cloudflare R2/D1)
- Moderazione leggera e privacy (eventuale jitter coordinate)
- Badge automatici per tratta / km

## Codice

Issue e PR benvenute. Mantieni il sito statico, dipendenze minime, italiano con accenti, tono ludico.
