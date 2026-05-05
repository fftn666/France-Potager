import rawDb from './plants-database.json';

export type PlantCategory =
  | 'Légumes fruits' | 'Légumes racines' | 'Légumes feuilles'
  | 'Légumes bulbes' | 'Légumes tiges' | 'Légumineuses'
  | 'Cucurbitacées' | 'Herbes aromatiques' | 'Fruits rouges'
  | 'Arbustes fruitiers';

export interface PlantVariete {
  nom: string;
  type: string;
  description: string;
}

export interface PlantCalendrier {
  semis_interieur?: number[];
  semis_exterieur?: number[];
  repiquage?: number[];
  plantation?: number[];
  recolte?: number[];
}

export interface PlantCulture {
  exposition: string;
  arrosage: string;
  sol: string;
  espacement: string;
  profondeur_semis?: string;
  germination_jours?: string;
  temps_recolte_semaines: string;
}

export interface PlantAssociations {
  benefiques: string[];
  nefastes: string[];
}

export interface PlantEmpreinteCarbone {
  local: number;
  importe: number;
  unite: string;
}

export interface Plant {
  id: string;
  nom: string;
  nom_latin: string;
  categorie: string;
  emoji: string;
  varietes: PlantVariete[];
  calendrier: PlantCalendrier;
  culture: PlantCulture;
  associations: PlantAssociations;
  ravageurs: string[];
  conseils: string[];
  conservation: string;
  empreinte_carbone?: PlantEmpreinteCarbone;
}

export const ALL_PLANTS: Plant[] = rawDb.plants as Plant[];

// Convert 1-12 month to 0-11 index
export function toMonthIndex(m: number): number { return m - 1; }

// Get plants by category
export function getByCategory(cat: PlantCategory): Plant[] {
  return ALL_PLANTS.filter(p => p.categorie === cat);
}

// Get plant by id
export function getPlantById(id: string): Plant | undefined {
  return ALL_PLANTS.find(p => p.id === id);
}

// Get plant by name (case-insensitive)
export function getPlantByName(name: string): Plant | undefined {
  return ALL_PLANTS.find(p => p.nom.toLowerCase() === name.toLowerCase());
}

// Get plants to consume in a given month (0-11)
export function getPlantsToConsumeInMonth(monthIndex: number): Plant[] {
  const m = monthIndex + 1; // JSON uses 1-12
  return ALL_PLANTS.filter(p => p.calendrier.recolte?.includes(m));
}

// Get plants to sow/plant in a given month (0-11)
export function getPlantsToPlantInMonth(monthIndex: number): Plant[] {
  const m = monthIndex + 1;
  return ALL_PLANTS.filter(p =>
    p.calendrier.semis_interieur?.includes(m) ||
    p.calendrier.semis_exterieur?.includes(m) ||
    p.calendrier.plantation?.includes(m)
  );
}

// Build SowingEntry format from JSON for use in SowingCalendar
export type ActionType = 'indoor' | 'outdoor' | 'transplant' | 'harvest';
export interface SowingEntry {
  id: string;
  vegetable: string;
  categorie: string;
  months: Partial<Record<number, ActionType[]>>; // keys are 0-11
}

export function buildSowingEntries(plants: Plant[]): SowingEntry[] {
  return plants.map(p => {
    const months: Partial<Record<number, ActionType[]>> = {};
    const add = (arr: number[] | undefined, action: ActionType) => {
      arr?.forEach(m => {
        const idx = m - 1;
        months[idx] = [...(months[idx] || []), action];
      });
    };
    add(p.calendrier.semis_interieur, 'indoor');
    add(p.calendrier.semis_exterieur, 'outdoor');
    add(p.calendrier.repiquage, 'transplant');
    add(p.calendrier.plantation, 'transplant');
    add(p.calendrier.recolte, 'harvest');
    return { id: p.id, vegetable: p.nom, categorie: p.categorie, months };
  });
}

// Plants with carbon data
export function getPlantsWithCarbon(): Plant[] {
  return ALL_PLANTS.filter(p => p.empreinte_carbone != null);
}
