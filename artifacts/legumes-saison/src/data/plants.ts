export interface PlantDetail {
  name: string;
  latinName: string;
  companions: string[]; // beneficial neighbors
  enemies: string[]; // bad neighbors
  pests: string[]; // common pests
  sun: 'plein soleil' | 'mi-ombre' | 'ombre';
  water: 'faible' | 'modéré' | 'élevé';
  soil: string;
  sowToHarvestWeeks: number;
  tips: string; // 2-3 lines of practical advice
}

export const PLANTS: Record<string, PlantDetail> = {
  "Tomate": {
    name: "Tomate",
    latinName: "Solanum lycopersicum",
    companions: ["Basilic", "Persil", "Carotte", "Oignon"],
    enemies: ["Fenouil", "Pomme de terre", "Chou"],
    pests: ["Pucerons", "Mildiou", "Aleurodes"],
    sun: "plein soleil",
    water: "élevé",
    soil: "Riche, bien drainé",
    sowToHarvestWeeks: 16,
    tips: "Tuteurer dès 30 cm. Ébourgeonnez les gourmands. Arroser à la base pour éviter le mildiou."
  },
  "Courgette": {
    name: "Courgette",
    latinName: "Cucurbita pepo",
    companions: ["Maïs", "Haricot vert", "Capucine", "Basilic"],
    enemies: ["Pomme de terre", "Concombre"],
    pests: ["Oïdium", "Pucerons", "Limaces"],
    sun: "plein soleil",
    water: "élevé",
    soil: "Riche en humus, frais",
    sowToHarvestWeeks: 8,
    tips: "Laisser suffisamment d'espace (1m). Récolter jeune pour stimuler la production. Pailler généreusement."
  },
  "Carotte": {
    name: "Carotte",
    latinName: "Daucus carota",
    companions: ["Poireau", "Oignon", "Laitue", "Tomate", "Radis"],
    enemies: ["Aneth", "Menthe"],
    pests: ["Mouche de la carotte", "Limaces"],
    sun: "plein soleil",
    water: "modéré",
    soil: "Sableux, léger, sans cailloux",
    sowToHarvestWeeks: 12,
    tips: "Éclaircir pour laisser 3-4 cm entre chaque plant. Le compagnonnage avec le poireau ou l'oignon éloigne la mouche de la carotte."
  },
  "Laitue": {
    name: "Laitue",
    latinName: "Lactuca sativa",
    companions: ["Carotte", "Radis", "Chou", "Concombre", "Fraise"],
    enemies: ["Persil", "Tournesol"],
    pests: ["Limaces", "Pucerons"],
    sun: "mi-ombre",
    water: "élevé",
    soil: "Frais, riche en humus",
    sowToHarvestWeeks: 8,
    tips: "Préfère la mi-ombre en plein été pour éviter la montée en graine. Arroser régulièrement au pied."
  },
  "Haricot vert": {
    name: "Haricot vert",
    latinName: "Phaseolus vulgaris",
    companions: ["Maïs", "Courgette", "Aubergine", "Fraise", "Radis"],
    enemies: ["Oignon", "Ail", "Poireau", "Échalote"],
    pests: ["Pucerons", "Araignées rouges"],
    sun: "plein soleil",
    water: "modéré",
    soil: "Léger, réchauffé",
    sowToHarvestWeeks: 9,
    tips: "Ne semer que lorsque la terre est bien réchauffée (mai). Butter les plants lorsqu'ils atteignent 20 cm."
  },
  "Radis": {
    name: "Radis",
    latinName: "Raphanus sativus",
    companions: ["Carotte", "Laitue", "Haricot vert", "Tomate"],
    enemies: ["Vigne", "Cerfeuil"],
    pests: ["Altises", "Limaces"],
    sun: "mi-ombre",
    water: "élevé",
    soil: "Frais, meuble",
    sowToHarvestWeeks: 4,
    tips: "Semer toutes les deux semaines pour une récolte continue. Arroser très régulièrement sinon ils deviennent piquants."
  },
  "Poireau": {
    name: "Poireau",
    latinName: "Allium porrum",
    companions: ["Carotte", "Céleri", "Tomate", "Fraise"],
    enemies: ["Haricot vert", "Pois", "Fève"],
    pests: ["Teigne du poireau", "Mouche de l'oignon"],
    sun: "plein soleil",
    water: "modéré",
    soil: "Profond, riche",
    sowToHarvestWeeks: 20,
    tips: "Habiller les jeunes plants avant repiquage. Butter plusieurs fois pour obtenir un long fût blanc."
  },
  "Oignon": {
    name: "Oignon",
    latinName: "Allium cepa",
    companions: ["Carotte", "Tomate", "Laitue", "Betterave"],
    enemies: ["Haricot vert", "Pois", "Fève"],
    pests: ["Mouche de l'oignon", "Mildiou"],
    sun: "plein soleil",
    water: "faible",
    soil: "Léger, bien drainé",
    sowToHarvestWeeks: 24,
    tips: "Ne pas arroser excessivement ni ajouter de fumier frais. Laisser sécher sur le sol après l'arrachage."
  },
  "Épinards": {
    name: "Épinards",
    latinName: "Spinacia oleracea",
    companions: ["Fraise", "Radis", "Chou", "Céleri"],
    enemies: ["Betterave"],
    pests: ["Pucerons", "Limaces", "Mildiou"],
    sun: "mi-ombre",
    water: "élevé",
    soil: "Frais, riche en azote",
    sowToHarvestWeeks: 8,
    tips: "Ombrager en été. Cueillir les feuilles au fur et à mesure en commençant par le pourtour."
  },
  "Basilic": {
    name: "Basilic",
    latinName: "Ocimum basilicum",
    companions: ["Tomate", "Courgette", "Poivron", "Aubergine"],
    enemies: ["Rue"],
    pests: ["Limaces", "Pucerons"],
    sun: "plein soleil",
    water: "modéré",
    soil: "Léger, bien drainé",
    sowToHarvestWeeks: 10,
    tips: "Pincer les sommités pour éviter la floraison et favoriser la ramification. Craint le froid."
  },
  "Persil": {
    name: "Persil",
    latinName: "Petroselinum crispum",
    companions: ["Tomate", "Asperge", "Radis"],
    enemies: ["Laitue", "Pois", "Alliacées"],
    pests: ["Mouche de la carotte", "Pucerons"],
    sun: "mi-ombre",
    water: "modéré",
    soil: "Frais, riche en humus",
    sowToHarvestWeeks: 12,
    tips: "La levée est lente (jusqu'à un mois). Faire tremper les graines 24h avant le semis pour l'accélérer."
  },
  "Concombre": {
    name: "Concombre",
    latinName: "Cucumis sativus",
    companions: ["Laitue", "Chou", "Maïs", "Oignon"],
    enemies: ["Tomate", "Radis", "Pomme de terre"],
    pests: ["Oïdium", "Pucerons", "Limaces"],
    sun: "plein soleil",
    water: "élevé",
    soil: "Riche en humus, frais",
    sowToHarvestWeeks: 10,
    tips: "Peut être palissé pour gagner de la place. Arroser sans mouiller le feuillage. Éviter les arrosages à l'eau froide."
  },
  "Betterave": {
    name: "Betterave",
    latinName: "Beta vulgaris",
    companions: ["Oignon", "Chou", "Laitue"],
    enemies: ["Épinards", "Tomate", "Poireau"],
    pests: ["Pucerons", "Altises", "Limaces"],
    sun: "plein soleil",
    water: "modéré",
    soil: "Meuble, frais",
    sowToHarvestWeeks: 10,
    tips: "Éclaircir pour ne laisser qu'un plant par glomérule. Ne craint pas les petites gelées automnales."
  },
  "Aubergine": {
    name: "Aubergine",
    latinName: "Solanum melongena",
    companions: ["Haricot vert", "Thym", "Basilic"],
    enemies: ["Pomme de terre", "Oignon"],
    pests: ["Doryphores", "Pucerons", "Araignées rouges"],
    sun: "plein soleil",
    water: "élevé",
    soil: "Très riche, profond",
    sowToHarvestWeeks: 20,
    tips: "Exige beaucoup de chaleur. Pincer pour ne conserver que 3-4 branches principales dans les régions fraîches."
  },
  "Poivron": {
    name: "Poivron",
    latinName: "Capsicum annuum",
    companions: ["Tomate", "Basilic", "Carotte", "Oignon"],
    enemies: ["Chou", "Fenouil"],
    pests: ["Pucerons", "Aleurodes"],
    sun: "plein soleil",
    water: "modéré",
    soil: "Riche, bien drainé",
    sowToHarvestWeeks: 20,
    tips: "Tuteurer les plants chargés. La couleur (vert/rouge) ne dépend souvent que du stade de maturité."
  }
};
