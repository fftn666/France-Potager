export type Season = 'Printemps' | 'Été' | 'Automne' | 'Hiver';

export interface VegetableInfo {
  name: string;
  season: Season;
  storage: string;
  prepAdvice?: string;
  plantAdvice?: string;
  type: 'consommer' | 'planter' | 'both';
}

export interface MonthData {
  name: string;
  index: number; // 0-11
  toConsume: string[];
  toPlant: string[];
}

const VEGETABLE_DETAILS: Record<string, Omit<VegetableInfo, 'name' | 'type'>> = {
  'Poireau': { season: 'Hiver', storage: '1 à 2 mois au frais', prepAdvice: 'En fondue, vinaigrette ou soupe.', plantAdvice: 'Semer en pépinière, repiquer quand ils ont la taille d\'un crayon.' },
  'Betterave': { season: 'Automne', storage: 'Plusieurs semaines au frais', prepAdvice: 'Cuite au four ou crue râpée en salade.', plantAdvice: 'Semer en place, éclaircir à 10 cm.' },
  'Céleri-rave': { season: 'Hiver', storage: 'Plusieurs semaines au frais', prepAdvice: 'En rémoulade ou purée.', plantAdvice: 'Semer en godet, repiquer en pleine terre.' },
  'Carotte': { season: 'Automne', storage: 'Plusieurs semaines au bac à légumes', prepAdvice: 'Crue, en purée ou rôtie.', plantAdvice: 'Semer clair en place, dans une terre fine sans cailloux.' },
  'Chou de Bruxelles': { season: 'Hiver', storage: '1 à 2 semaines', prepAdvice: 'Blanchis puis poêlés avec des lardons.', plantAdvice: 'Repiquer profondément dans un sol ferme.' },
  'Mâche': { season: 'Hiver', storage: '3 à 4 jours', prepAdvice: 'En salade avec de l\'huile de noix.', plantAdvice: 'Semer à la volée sur un sol ferme.' },
  'Épinards': { season: 'Printemps', storage: '2 à 3 jours', prepAdvice: 'Juste tombés au beurre ou crus en salade.', plantAdvice: 'Semer en ligne, préfère la mi-ombre en été.' },
  'Navet': { season: 'Automne', storage: '1 à 2 semaines', prepAdvice: 'Glacé au beurre et un peu de miel.', plantAdvice: 'Semer en place, terre fraîche.' },
  'Salsifis': { season: 'Hiver', storage: '1 semaine', prepAdvice: 'Sautés au beurre et persil.', plantAdvice: 'Semer en place, dans une terre profonde.' },
  'Panais': { season: 'Hiver', storage: 'Plusieurs semaines', prepAdvice: 'En frites au four ou purée.', plantAdvice: 'Semer en place au printemps.' },
  'Chou': { season: 'Hiver', storage: '1 à 2 semaines', prepAdvice: 'Braisé ou en potée.', plantAdvice: 'Semer en pépinière puis repiquer.' },
  'Endive': { season: 'Hiver', storage: '1 semaine à l\'abri de la lumière', prepAdvice: 'Braisée ou en salade aux noix.', plantAdvice: 'Forcer les racines dans l\'obscurité.' },
  'Radis': { season: 'Printemps', storage: '1 semaine', prepAdvice: 'Croque-au-sel avec un bon beurre.', plantAdvice: 'Semer régulièrement toutes les 2 semaines.' },
  'Asperge': { season: 'Printemps', storage: '3 à 4 jours', prepAdvice: 'Cuite à la vapeur, sauce hollandaise.', plantAdvice: 'Planter des griffes, attendre 3 ans pour une pleine récolte.' },
  'Blette': { season: 'Automne', storage: '3 à 4 jours', prepAdvice: 'Verts en fondue, côtes en gratin.', plantAdvice: 'Semer en poquet, arroser régulièrement.' },
  'Artichaut': { season: 'Printemps', storage: 'Quelques jours', prepAdvice: 'Cuit à l\'eau, vinaigrette.', plantAdvice: 'Planter des œilletons au printemps.' },
  'Petits pois': { season: 'Printemps', storage: '2 à 3 jours non écossés', prepAdvice: 'Cuits doucement à l\'étouffée.', plantAdvice: 'Semer en ligne, prévoir des rames.' },
  'Laitue': { season: 'Printemps', storage: 'Quelques jours', prepAdvice: 'En salade classique.', plantAdvice: 'Semer puis repiquer en espaçant de 25 cm.' },
  'Oignon nouveau': { season: 'Printemps', storage: '1 semaine', prepAdvice: 'Ciselé sur des plats ou croqué tel quel.', plantAdvice: 'Planter des bulbilles.' },
  'Fraise': { season: 'Printemps', storage: '2 à 3 jours', prepAdvice: 'Nature ou avec un peu de sucre et citron.', plantAdvice: 'Planter en sol riche, pailler.' },
  'Courgette': { season: 'Été', storage: '1 semaine', prepAdvice: 'Poêlée à l\'ail ou rôtie.', plantAdvice: 'Semer en godet à l\'abri, puis repiquer.' },
  'Fève': { season: 'Printemps', storage: 'Quelques jours non écossées', prepAdvice: 'Crue croque-au-sel ou purée.', plantAdvice: 'Semer en pleine terre dès l\'automne ou fin d\'hiver.' },
  'Tomate': { season: 'Été', storage: 'Température ambiante, 1 semaine', prepAdvice: 'En salade avec basilic ou sauce.', plantAdvice: 'Semer au chaud, repiquer après les saints de glace.' },
  'Haricot vert': { season: 'Été', storage: '3 à 4 jours', prepAdvice: 'Vapeur puis sautés à l\'ail.', plantAdvice: 'Semer en ligne quand la terre est réchauffée.' },
  'Poivron': { season: 'Été', storage: '1 à 2 semaines', prepAdvice: 'Rôti au four puis mariné.', plantAdvice: 'Semer très tôt au chaud, repiquer en plein soleil.' },
  'Concombre': { season: 'Été', storage: '1 semaine au frais', prepAdvice: 'En salade avec yaourt et menthe.', plantAdvice: 'Semer au chaud, demande de l\'eau.' },
  'Aubergine': { season: 'Été', storage: '1 semaine', prepAdvice: 'En caviar ou grillée.', plantAdvice: 'Semer tôt au chaud, aime la chaleur.' },
  'Maïs': { season: 'Été', storage: 'Quelques jours', prepAdvice: 'Bouilli puis beurré.', plantAdvice: 'Semer en place, en bloc plutôt qu\'en ligne.' },
  'Melons': { season: 'Été', storage: 'Quelques jours', prepAdvice: 'Nature, en entrée ou dessert.', plantAdvice: 'Semer au chaud, pincer pour faire ramifier.' },
  'Courge': { season: 'Automne', storage: 'Plusieurs mois au sec', prepAdvice: 'Velouté, ou rôtie en cubes.', plantAdvice: 'Semer en godet, prévoir beaucoup de place.' },
  'Céleri': { season: 'Automne', storage: '1 semaine', prepAdvice: 'En branche dans une sauce ou cru.', plantAdvice: 'Semer en godet, demande un sol riche et humide.' },
  'Ail': { season: 'Été', storage: 'Plusieurs mois au sec', prepAdvice: 'En chemise ou haché.', plantAdvice: 'Planter les caïeux à l\'automne ou fin d\'hiver.' },
  'Oignon': { season: 'Été', storage: 'Plusieurs mois au sec', prepAdvice: 'Base de nombreux plats.', plantAdvice: 'Planter des bulbilles au printemps.' },
  'Oignons blancs': { season: 'Printemps', storage: '1 semaine', prepAdvice: 'En salade ou rissolé.', plantAdvice: 'Semer fin d\'été.' },
  'Basilic': { season: 'Été', storage: 'Quelques jours, au frais en bouquet', prepAdvice: 'En pesto ou sur des tomates.', plantAdvice: 'Semer au chaud, pincer les fleurs.' },
  'Fenouil': { season: 'Été', storage: '1 semaine', prepAdvice: 'Braisé ou cru à la mandoline.', plantAdvice: 'Semer en place, butter pour blanchir.' },
  'Roquette': { season: 'Automne', storage: '2 à 3 jours', prepAdvice: 'En salade relevée.', plantAdvice: 'Semer régulièrement, monte vite en graine au chaud.' },
  'Pommes de terre': { season: 'Été', storage: 'Plusieurs mois à l\'abri de la lumière', prepAdvice: 'Rissolées, vapeur, purée.', plantAdvice: 'Planter les tubercules germés quand la terre est réchauffée.' },
  'Tulipes': { season: 'Printemps', storage: 'En vase', prepAdvice: 'Ornemental.', plantAdvice: 'Planter les bulbes à l\'automne.' },
};

export const MONTHS: MonthData[] = [
  {
    name: 'Janvier',
    index: 0,
    toConsume: ['Poireau', 'Betterave', 'Céleri-rave', 'Carotte', 'Chou de Bruxelles', 'Mâche', 'Épinards', 'Navet', 'Salsifis', 'Panais'],
    toPlant: ['Tomate', 'Poivron', 'Aubergine']
  },
  {
    name: 'Février',
    index: 1,
    toConsume: ['Poireau', 'Betterave', 'Céleri-rave', 'Carotte', 'Chou', 'Mâche', 'Épinards', 'Navet', 'Endive'],
    toPlant: ['Tomate', 'Poivron', 'Aubergine', 'Laitue', 'Céleri', 'Pommes de terre']
  },
  {
    name: 'Mars',
    index: 2,
    toConsume: ['Épinards', 'Radis', 'Asperge', 'Poireau', 'Chou', 'Blette', 'Artichaut', 'Carotte'],
    toPlant: ['Radis', 'Épinards', 'Carotte', 'Petits pois', 'Laitue', 'Oignon', 'Pommes de terre']
  },
  {
    name: 'Avril',
    index: 3,
    toConsume: ['Asperge', 'Radis', 'Épinards', 'Petits pois', 'Laitue', 'Artichaut', 'Blette', 'Oignon nouveau'],
    toPlant: ['Radis', 'Carotte', 'Betterave', 'Épinards', 'Haricot vert', 'Courgette', 'Pommes de terre', 'Oignon', 'Ail']
  },
  {
    name: 'Mai',
    index: 4,
    toConsume: ['Asperge', 'Petits pois', 'Radis', 'Laitue', 'Fraise', 'Artichaut', 'Courgette', 'Fève'],
    toPlant: ['Haricot vert', 'Courgette', 'Concombre', 'Courge', 'Maïs', 'Basilic', 'Tomate', 'Poivron', 'Aubergine']
  },
  {
    name: 'Juin',
    index: 5,
    toConsume: ['Courgette', 'Tomate', 'Haricot vert', 'Poivron', 'Artichaut', 'Petits pois', 'Concombre', 'Laitue', 'Betterave', 'Radis'],
    toPlant: ['Haricot vert', 'Radis', 'Laitue', 'Fenouil', 'Navet', 'Poireau', 'Chou']
  },
  {
    name: 'Juillet',
    index: 6,
    toConsume: ['Tomate', 'Courgette', 'Haricot vert', 'Poivron', 'Aubergine', 'Concombre', 'Maïs', 'Betterave', 'Laitue', 'Oignon'],
    toPlant: ['Radis', 'Navet', 'Haricot vert', 'Laitue', 'Épinards', 'Chou', 'Poireau']
  },
  {
    name: 'Août',
    index: 7,
    toConsume: ['Tomate', 'Courgette', 'Haricot vert', 'Poivron', 'Aubergine', 'Concombre', 'Maïs', 'Melons', 'Courge', 'Oignon'],
    toPlant: ['Épinards', 'Mâche', 'Radis', 'Laitue', 'Navet', 'Roquette', 'Chou', 'Poireau']
  },
  {
    name: 'Septembre',
    index: 8,
    toConsume: ['Tomate', 'Poivron', 'Aubergine', 'Courge', 'Haricot vert', 'Courgette', 'Panais', 'Céleri', 'Carotte', 'Betterave'],
    toPlant: ['Mâche', 'Épinards', 'Ail', 'Oignons blancs', 'Fraise']
  },
  {
    name: 'Octobre',
    index: 9,
    toConsume: ['Courge', 'Carotte', 'Betterave', 'Céleri-rave', 'Poireau', 'Chou', 'Endive', 'Navet'],
    toPlant: ['Ail', 'Tulipes', 'Fraise', 'Mâche', 'Épinards']
  },
  {
    name: 'Novembre',
    index: 10,
    toConsume: ['Poireau', 'Chou', 'Betterave', 'Carotte', 'Céleri-rave', 'Navet', 'Mâche', 'Endive', 'Salsifis'],
    toPlant: ['Ail', 'Oignon']
  },
  {
    name: 'Décembre',
    index: 11,
    toConsume: ['Poireau', 'Chou de Bruxelles', 'Betterave', 'Céleri-rave', 'Carotte', 'Mâche', 'Navet', 'Endive', 'Salsifis'],
    toPlant: [] // Repos
  }
];

export function getVegetableDetails(name: string): VegetableInfo {
  const details = VEGETABLE_DETAILS[name] || { season: 'Hiver', storage: '1 semaine', prepAdvice: 'À découvrir.', plantAdvice: 'Semer au bon moment.' };
  return { name, ...details, type: 'both' };
}
