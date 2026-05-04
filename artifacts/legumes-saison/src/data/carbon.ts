export interface CarbonVegetable {
  name: string;
  localKg: number; // kg CO2 per kg vegetable, local seasonal
  importedKg: number; // imported out-of-season
}

export const CARBON_DATA: CarbonVegetable[] = [
  { name: 'Tomate', localKg: 0.3, importedKg: 3.5 },
  { name: 'Courgette', localKg: 0.2, importedKg: 2.8 },
  { name: 'Haricot vert', localKg: 0.4, importedKg: 4.0 },
  { name: 'Salade', localKg: 0.15, importedKg: 1.8 },
  { name: 'Poivron', localKg: 0.35, importedKg: 3.2 },
  { name: 'Fraise', localKg: 0.5, importedKg: 5.0 },
  { name: 'Carotte', localKg: 0.15, importedKg: 0.9 },
  { name: 'Pomme de terre', localKg: 0.1, importedKg: 0.7 }
];
