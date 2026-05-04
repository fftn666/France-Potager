export type Season = 'Printemps' | 'Été' | 'Automne' | 'Hiver';

export interface VegetableInfo {
  name: string;
  season: Season;
  storage: string;
  prepAdvice?: string;
  plantAdvice?: string;
  harvestTime?: string;
  type: 'consommer' | 'planter' | 'both';
}

export interface MonthData {
  name: string;
  index: number;
  toConsume: string[];
  toPlant: string[];
}

const VEGETABLE_DETAILS: Record<string, Omit<VegetableInfo, 'name' | 'type'>> = {
  'Poireau': { season: 'Hiver', storage: '1 à 2 mois au frais', prepAdvice: 'En fondue, vinaigrette ou soupe.', plantAdvice: 'Semer en pépinière, repiquer quand ils ont la taille d\'un crayon.', harvestTime: '4 à 5 mois après le repiquage, d\'octobre à mars.' },
  'Betterave': { season: 'Automne', storage: 'Plusieurs semaines au frais', prepAdvice: 'Cuite au four ou crue râpée en salade.', plantAdvice: 'Semer en place, éclaircir à 10 cm.', harvestTime: '2 à 3 mois après semis, de juillet à novembre.' },
  'Céleri-rave': { season: 'Hiver', storage: 'Plusieurs semaines au frais', prepAdvice: 'En rémoulade ou purée.', plantAdvice: 'Semer en godet, repiquer en pleine terre.', harvestTime: '6 mois après semis, d\'octobre à février.' },
  'Carotte': { season: 'Automne', storage: 'Plusieurs semaines au bac à légumes', prepAdvice: 'Crue, en purée ou rôtie.', plantAdvice: 'Semer clair en place, dans une terre fine sans cailloux.', harvestTime: '3 à 4 mois après semis selon la variété.' },
  'Chou de Bruxelles': { season: 'Hiver', storage: '1 à 2 semaines', prepAdvice: 'Blanchis puis poêlés avec des lardons.', plantAdvice: 'Repiquer profondément dans un sol ferme.', harvestTime: '5 à 6 mois après semis, de novembre à février.' },
  'Mâche': { season: 'Hiver', storage: '3 à 4 jours', prepAdvice: 'En salade avec de l\'huile de noix.', plantAdvice: 'Semer à la volée sur un sol ferme.', harvestTime: '6 à 8 semaines après semis, d\'octobre à mars.' },
  'Épinards': { season: 'Printemps', storage: '2 à 3 jours', prepAdvice: 'Juste tombés au beurre ou crus en salade.', plantAdvice: 'Semer en ligne, préfère la mi-ombre en été.', harvestTime: '6 à 8 semaines après semis.' },
  'Navet': { season: 'Automne', storage: '1 à 2 semaines', prepAdvice: 'Glacé au beurre et un peu de miel.', plantAdvice: 'Semer en place, terre fraîche.', harvestTime: '6 à 8 semaines après semis.' },
  'Salsifis': { season: 'Hiver', storage: '1 semaine', prepAdvice: 'Sautés au beurre et persil.', plantAdvice: 'Semer en place, dans une terre profonde.', harvestTime: '5 à 6 mois après semis, d\'octobre à mars.' },
  'Panais': { season: 'Hiver', storage: 'Plusieurs semaines', prepAdvice: 'En frites au four ou purée.', plantAdvice: 'Semer en place au printemps.', harvestTime: '4 à 6 mois après semis, d\'octobre à février.' },
  'Chou': { season: 'Hiver', storage: '1 à 2 semaines', prepAdvice: 'Braisé ou en potée.', plantAdvice: 'Semer en pépinière puis repiquer.', harvestTime: '3 à 6 mois selon la variété.' },
  'Endive': { season: 'Hiver', storage: '1 semaine à l\'abri de la lumière', prepAdvice: 'Braisée ou en salade aux noix.', plantAdvice: 'Forcer les racines dans l\'obscurité.', harvestTime: '3 à 4 semaines de forçage après arrachage des racines.' },
  'Radis': { season: 'Printemps', storage: '1 semaine', prepAdvice: 'Croque-au-sel avec un bon beurre.', plantAdvice: 'Semer régulièrement toutes les 2 semaines.', harvestTime: '3 à 4 semaines après semis.' },
  'Asperge': { season: 'Printemps', storage: '3 à 4 jours', prepAdvice: 'Cuite à la vapeur, sauce hollandaise.', plantAdvice: 'Planter des griffes, attendre 3 ans pour une pleine récolte.', harvestTime: 'Avril à juin, dès la 3e année après plantation.' },
  'Blette': { season: 'Automne', storage: '3 à 4 jours', prepAdvice: 'Verts en fondue, côtes en gratin.', plantAdvice: 'Semer en poquet, arroser régulièrement.', harvestTime: '2 à 3 mois après semis, on récolte feuille par feuille.' },
  'Artichaut': { season: 'Printemps', storage: 'Quelques jours', prepAdvice: 'Cuit à l\'eau, vinaigrette.', plantAdvice: 'Planter des œilletons au printemps.', harvestTime: 'Juin à septembre, avant que les capitules s\'ouvrent.' },
  'Petits pois': { season: 'Printemps', storage: '2 à 3 jours non écossés', prepAdvice: 'Cuits doucement à l\'étouffée.', plantAdvice: 'Semer en ligne, prévoir des rames.', harvestTime: '10 à 14 semaines après semis, de mai à juillet.' },
  'Laitue': { season: 'Printemps', storage: 'Quelques jours', prepAdvice: 'En salade classique.', plantAdvice: 'Semer puis repiquer en espaçant de 25 cm.', harvestTime: '6 à 8 semaines après repiquage.' },
  'Oignon nouveau': { season: 'Printemps', storage: '1 semaine', prepAdvice: 'Ciselé sur des plats ou croqué tel quel.', plantAdvice: 'Planter des bulbilles.', harvestTime: '3 à 4 semaines après plantation des bulbilles.' },
  'Fraise': { season: 'Printemps', storage: '2 à 3 jours', prepAdvice: 'Nature ou avec un peu de sucre et citron.', plantAdvice: 'Planter en sol riche, pailler.', harvestTime: 'Mai à septembre selon la variété.' },
  'Courgette': { season: 'Été', storage: '1 semaine', prepAdvice: 'Poêlée à l\'ail ou rôtie.', plantAdvice: 'Semer en godet à l\'abri, puis repiquer.', harvestTime: '50 à 60 jours après semis, récolter souvent pour stimuler la production.' },
  'Fève': { season: 'Printemps', storage: 'Quelques jours non écossées', prepAdvice: 'Crue croque-au-sel ou purée.', plantAdvice: 'Semer en pleine terre dès l\'automne ou fin d\'hiver.', harvestTime: 'Mai à juin, quand les graines sont bien formées.' },
  'Tomate': { season: 'Été', storage: 'Température ambiante, 1 semaine', prepAdvice: 'En salade avec basilic ou sauce.', plantAdvice: 'Semer au chaud, repiquer après les saints de glace.', harvestTime: '3 à 4 mois après semis, de juillet à octobre.' },
  'Haricot vert': { season: 'Été', storage: '3 à 4 jours', prepAdvice: 'Vapeur puis sautés à l\'ail.', plantAdvice: 'Semer en ligne quand la terre est réchauffée.', harvestTime: '60 à 70 jours après semis, de juillet à septembre.' },
  'Poivron': { season: 'Été', storage: '1 à 2 semaines', prepAdvice: 'Rôti au four puis mariné.', plantAdvice: 'Semer très tôt au chaud, repiquer en plein soleil.', harvestTime: '4 à 5 mois après semis, de juillet à octobre.' },
  'Concombre': { season: 'Été', storage: '1 semaine au frais', prepAdvice: 'En salade avec yaourt et menthe.', plantAdvice: 'Semer au chaud, demande de l\'eau.', harvestTime: '50 à 60 jours après semis, de juillet à septembre.' },
  'Aubergine': { season: 'Été', storage: '1 semaine', prepAdvice: 'En caviar ou grillée.', plantAdvice: 'Semer tôt au chaud, aime la chaleur.', harvestTime: '4 à 5 mois après semis, de juillet à octobre.' },
  'Maïs': { season: 'Été', storage: 'Quelques jours', prepAdvice: 'Bouilli puis beurré.', plantAdvice: 'Semer en place, en bloc plutôt qu\'en ligne.', harvestTime: '3 mois après semis, en août-septembre.' },
  'Melons': { season: 'Été', storage: 'Quelques jours', prepAdvice: 'Nature, en entrée ou dessert.', plantAdvice: 'Semer au chaud, pincer pour faire ramifier.', harvestTime: '3 à 4 mois après semis, en juillet-août.' },
  'Courge': { season: 'Automne', storage: 'Plusieurs mois au sec', prepAdvice: 'Velouté, ou rôtie en cubes.', plantAdvice: 'Semer en godet, prévoir beaucoup de place.', harvestTime: '3 à 4 mois après semis, de septembre à novembre.' },
  'Céleri': { season: 'Automne', storage: '1 semaine', prepAdvice: 'En branche dans une sauce ou cru.', plantAdvice: 'Semer en godet, demande un sol riche et humide.', harvestTime: '5 à 6 mois après semis, d\'août à novembre.' },
  'Ail': { season: 'Été', storage: 'Plusieurs mois au sec', prepAdvice: 'En chemise ou haché.', plantAdvice: 'Planter les caïeux à l\'automne ou fin d\'hiver.', harvestTime: 'Juin à juillet, quand les feuilles jaunissent.' },
  'Oignon': { season: 'Été', storage: 'Plusieurs mois au sec', prepAdvice: 'Base de nombreux plats.', plantAdvice: 'Planter des bulbilles au printemps.', harvestTime: 'Juillet à août, quand les fanes tombent.' },
  'Oignons blancs': { season: 'Printemps', storage: '1 semaine', prepAdvice: 'En salade ou rissolé.', plantAdvice: 'Semer fin d\'été.', harvestTime: '4 à 5 mois après semis.' },
  'Basilic': { season: 'Été', storage: 'Quelques jours, au frais en bouquet', prepAdvice: 'En pesto ou sur des tomates.', plantAdvice: 'Semer au chaud, pincer les fleurs.', harvestTime: 'Récolter feuille par feuille dès que la plante est bien développée.' },
  'Fenouil': { season: 'Été', storage: '1 semaine', prepAdvice: 'Braisé ou cru à la mandoline.', plantAdvice: 'Semer en place, butter pour blanchir.', harvestTime: '3 mois après semis, quand le bulbe est bien formé.' },
  'Roquette': { season: 'Automne', storage: '2 à 3 jours', prepAdvice: 'En salade relevée.', plantAdvice: 'Semer régulièrement, monte vite en graine au chaud.', harvestTime: '4 à 6 semaines après semis.' },
  'Pommes de terre': { season: 'Été', storage: 'Plusieurs mois à l\'abri de la lumière', prepAdvice: 'Rissolées, vapeur, purée.', plantAdvice: 'Planter les tubercules germés quand la terre est réchauffée.', harvestTime: '3 à 4 mois après plantation, de juillet à octobre.' },
  'Tulipes': { season: 'Printemps', storage: 'En vase', prepAdvice: 'Ornemental.', plantAdvice: 'Planter les bulbes à l\'automne.', harvestTime: 'Floraison en mars-mai selon la variété.' },
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
    toPlant: []
  }
];

export function getVegetableDetails(name: string): VegetableInfo {
  const details = VEGETABLE_DETAILS[name] || { season: 'Hiver' as Season, storage: '1 semaine', prepAdvice: 'À découvrir.', plantAdvice: 'Semer au bon moment.', harvestTime: 'Variable selon la variété.' };
  return { name, ...details, type: 'both' };
}
