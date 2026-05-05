# Brief — Intégration base de données plantes & aromatiques

Voici comment intégrer le fichier `plants-database.json` dans le site existant.

---

## Étape 1 — Ajouter le fichier de données

Copier le fichier `plants-database.json` à la racine du projet (ou dans un dossier `/data/`).

---

## Étape 2 — Structure des données

Chaque plante contient les champs suivants (à utiliser dans toutes les pages) :

```
id, nom, nom_latin, categorie, emoji, varietes[]
calendrier { semis_interieur[], semis_exterieur[], repiquage[], plantation[], recolte[] }
culture { exposition, arrosage, sol, espacement, germination_jours, temps_recolte_semaines }
associations { benefiques[], nefastes[] }
ravageurs[]
conseils[]
conservation
empreinte_carbone { local, importe, unite }
```

---

## Étape 3 — Fonctionnalités à connecter à ces données

### A. Calendrier de semis interactif
- Charger `plants-database.json`
- Construire un tableau HTML : lignes = plantes, colonnes = 12 mois
- Pour chaque mois, afficher une pastille colorée selon le type d'activité :
  - 🟢 `semis_interieur` | 🟡 `semis_exterieur` | 🔵 `repiquage` / `plantation` | 🔴 `recolte`
- Filtrer par catégorie (dropdown : Légumes / Aromatiques / Fruits)
- Appliquer un décalage selon la zone choisie (Nord +2 semaines, Sud -3 semaines, Montagne +4 semaines)

### B. Fiches plantes
- Au clic sur une plante du calendrier → ouvrir une modal ou un drawer latéral
- Afficher tous les champs : variétés, calendrier, culture, associations, ravageurs, conseils, conservation
- Associations bénéfiques en vert ✅ et néfastes en rouge ❌
- Lier les associations aux autres fiches (clic sur "basilic" → ouvre la fiche basilic)

### C. Planificateur potager (grille drag-and-drop)
- Palette de gauche : liste toutes les plantes avec leur emoji
- Quand deux plantes sont posées côte à côte, vérifier si l'une est dans la liste `nefastes` de l'autre → bordure rouge + tooltip
- Suggestions : quand une case est vide à côté d'une plante → afficher ses `associations.benefiques`

### D. Calculateur carbone
- Utiliser les champs `empreinte_carbone.local` et `empreinte_carbone.importe` de chaque plante
- Formule : `(importe - local) × quantité_kg × 52` = économie annuelle en kg CO₂

### E. Saisonnalité par région
- La zone est stockée en `localStorage` sous la clé `"zone_jardinage"` (valeurs : "Nord", "Centre", "Sud", "Montagne")
- Page d'accueil : filtrer les plantes dont le mois en cours apparaît dans `calendrier.recolte` ou `calendrier.semis_exterieur`

---

## Étape 4 — Catégories disponibles dans le JSON

| Catégorie | Exemples |
|-----------|----------|
| Légumes fruits | Tomate, Courgette, Poivron, Aubergine, Concombre |
| Légumes racines | Carotte, Radis, Betterave, Pomme de terre |
| Légumes feuilles | Laitue, Épinard, Chou |
| Légumes bulbes | Oignon, Ail, Poireau |
| Légumes tiges | Asperge, Artichaut, Maïs |
| Légumineuses | Haricot vert, Petit pois |
| Cucurbitacées | Courgette, Concombre, Potiron |
| Herbes aromatiques | Basilic, Persil, Thym, Romarin, Menthe, Coriandre, Aneth, Estragon, Sauge, Ciboulette, Cerfeuil, Bourrache, Capucine, Tagètes, Lavande, Mélisse |
| Fruits rouges | Fraisier |

---

## Étape 5 — Chargement des données en JavaScript

```javascript
// Option A — fetch (si hébergé sur un serveur)
const response = await fetch('/data/plants-database.json');
const db = await response.json();
const plants = db.plants;

// Option B — import statique (Vite / bundler)
import db from './data/plants-database.json';
const plants = db.plants;

// Filtrer par catégorie
const aromatiques = plants.filter(p => p.categorie === "Herbes aromatiques");

// Trouver une plante par id
const tomate = plants.find(p => p.id === "tomate");

// Plantes de saison ce mois-ci
const moisActuel = new Date().getMonth() + 1; // 1-12
const deSaison = plants.filter(p => 
  p.calendrier.recolte?.includes(moisActuel)
);

// Plantes à semer ce mois (extérieur)
const aSemer = plants.filter(p =>
  p.calendrier.semis_exterieur?.includes(moisActuel) ||
  p.calendrier.semis_interieur?.includes(moisActuel)
);
```

---

## Résumé — 32 plantes dans le JSON

**16 légumes :** Tomate, Courgette, Carotte, Laitue, Haricot vert, Poireau, Oignon, Ail, Poivron, Aubergine, Concombre, Potiron, Pomme de terre, Épinard, Radis, Betterave, Chou, Pois, Maïs, Asperge, Artichaut

**16 aromatiques & fleurs compagnes :** Basilic, Persil, Ciboulette, Thym, Romarin, Menthe, Coriandre, Aneth, Estragon, Sauge, Lavande, Mélisse, Cerfeuil, Bourrache, Capucine, Tagètes

**1 fruit :** Fraisier
