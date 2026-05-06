# Légumes de Saison

Site interactif français des légumes de saison — calendrier, semis, encyclopédie, potager, carbone, marchés.

## Run & Operate

- `pnpm --filter @workspace/legumes-saison run dev` — frontend Vite (port via $PORT)
- `pnpm --filter @workspace/api-server run dev` — API Express (port 8080)
- `pnpm run typecheck` — typecheck complet tous packages
- `pnpm --filter @workspace/api-server run typecheck` — typecheck API seul (utilisé par Vercel)

## Stack

- **Monorepo**: pnpm workspaces, Node 24, TypeScript 5.9
- **Frontend**: React + Vite, wouter, shadcn/ui, framer-motion, lucide-react, react-leaflet, html2canvas
- **API**: Express 5, pino/pino-http (import default + cast `as unknown as` pour compat CJS/ESM Vercel)
- **Data**: JSON statique `plants-database.json` (57 plantes), adaptateur typé `src/data/db.ts`

## Where things live

- `artifacts/legumes-saison/src/` — app React
  - `pages/` — Home, SowingCalendar, PlantList, GardenPlanner, CarbonCalc, MarketMap
  - `components/` — PlantModal, Footer, VegetableCard, ui/…
  - `hooks/` — use-region, use-weather, use-mobile, use-toast
  - `data/db.ts` — source de vérité (adaptateur JSON typé)
  - `data/plants-database.json` — 57 fiches plantes
- `artifacts/legumes-saison/public/CHANGELOG.md` — changelog éditable sans code (fetché au runtime)
- `artifacts/api-server/src/app.ts` — Express + pino-http (fix CJS interop)

## Architecture decisions

- **Données statiques** : tout en JSON local, 0 appel API propriétaire.
- **pino-http CJS/ESM** : import default `from "pino-http"` + `as unknown as PinoHttpFn` pour contourner TS2349 sur Vercel (résolution de module différente). `esModuleInterop: true` ajouté dans api-server/tsconfig.json.
- **Cycles lunaires** : calcul algorithmique (référence 6 jan 2000 + période 29.53 j), aucun package externe.
- **Météo footer** : Open-Meteo (gratuit, sans clé) + Nominatim reverse geocoding, géolocalisation navigateur optionnelle.
- **Changelog** : fichier `public/CHANGELOG.md` fetché au runtime via `fetch(BASE_URL + 'CHANGELOG.md')`, parseur markdown maison.
- **localStorage** : `legumesSaison_region`, `legumesSaison_garden_v2`, `legumesSaison_custom_plants`.

## Product

- Calendrier saisonnier (consommer / planter par mois, mois courant par défaut)
- Calendrier de semis avec cycles lunaires, saints de glace, gel par région, toggle affichage
- Encyclopédie 57 plantes avec modal détail, filtre famille cliquable
- Planificateur potager drag-and-drop + plantes personnalisées libres (violet)
- Calculateur bilan carbone local vs importé
- Carte marchés bio (react-leaflet)
- Footer universel : navigation, météo temps réel, copyright
- Changelog / à venir : section dépliable sur Home, éditable via CHANGELOG.md

## User preferences

- Pas d'emojis dans l'UI (icônes lucide-react à la place)
- Région sélecteur en haut à droite, persiste localStorage

## Gotchas

- Ne pas changer `import pinoHttp from "pino-http"` en import nommé — Vercel échoue avec les deux ; le cast `as unknown as PinoHttpFn` est la seule solution stable.
- Les mois JSON dans plants-database sont en 1-12 ; db.ts les convertit en 0-11 via `toMonthIndex()`.
- Le footer est dans le `Router()` de App.tsx (après le `<Switch>`), pas dans chaque page.
- CHANGELOG.md doit rester dans `public/` pour être accessible via fetch.
