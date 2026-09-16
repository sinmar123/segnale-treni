# Segnale Treni Community

Sito **gratis** e un po’ ludico per condividere tracce GPS + segnale cellulare **in treno in Italia**.  
Non è un clone di OpenSignal: la nicchia è la ferrovia italiana, con confronto operatori sullo stesso viaggio quando c’è dual SIM. **Mono SIM è di prima classe.**

L’app Android **SegnaleTreno** (export CSV) è un progetto separato. Qui: upload/anteprima CSV, mappa pubblica, privacy minima, gamification leggera.

## Demo sulla mappa

La mappa pubblica carica di default la registrazione reale `data/segnale_treno_20260916_065422.csv` (16/09/2026, dual SIM). I file `sample-*.csv` restano solo per prova UI (dati sintetici).

## Prova in locale

Apri `index.html` con un browser moderno (doppio clic) oppure:

```bash
npx --yes serve .
```

Poi visita la porta indicata.

## Formato CSV (contratto ingest)

Separatore virgola, UTF-8. Intestazione esatta:

```
iso_time,lat,lon,accuracy_m,sub_id,carrier_raw,carrier_label,network_type,dbm,level,rsrp,rsrq,sinr
```

- **Mono SIM:** una riga per timestamp
- **Dual SIM:** due righe con stesso `iso_time` / GPS e `sub_id` diversi
- Campi opzionali vuoti ok (gallerie senza GPS, RSRP assente su 2G, …)
- `carrier_label`: `TIM` | `Iliad` | `Altro`

Niente dati di copertura inventati: se manca una metrica, resta vuota.

## Deploy gratis

1. **Cloudflare Pages** (consigliato): collega questo repo, build command vuoto, output `/` (root statica)
2. **GitHub Pages**: Settings → Pages → Deploy from branch `main` / root

Backend upload community (account, moderazione, D1/R2): in roadmap; v0 è client-side + CONTRIBUTING.

## Struttura

```
index.html      landing
mappa.html      mappa pubblica / demo
upload.html     carica CSV e anteprima
privacy.html    privacy minima
css/ style.css
js/  csv.js, map.js, gamification.js
data/ sample-mono.csv, sample-dual.csv
```

## Licenza

MIT — vedi `LICENSE`. I CSV demo in `data/` sono dati di esempio fittizi, non misure reali.
