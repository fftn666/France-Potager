import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { ALL_PLANTS } from '@/data/db';
import { usePlantModal } from '@/components/PlantModal';
import { Sun, Droplets, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type FilterCategory = 'Tous' | 'Légumes' | 'Herbes aromatiques' | 'Fruits & Fleurs';

export default function PlantList() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterCategory>('Tous');
  const { openPlant, PlantModalComponent } = usePlantModal();

  const filteredPlants = useMemo(() => {
    return ALL_PLANTS.filter(p => {
      const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) || 
                          p.nom_latin.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      if (filter === 'Tous') return true;
      if (filter === 'Herbes aromatiques') return p.categorie === 'Herbes aromatiques';
      if (filter === 'Fruits & Fleurs') {
        const isFruit = p.categorie === 'Fruits rouges' || p.categorie === 'Arbustes fruitiers';
        const isCompanionFlower = ['bourrache', 'capucine', 'tagetes'].includes(p.id.toLowerCase());
        return isFruit || isCompanionFlower;
      }
      if (filter === 'Légumes') {
        return p.categorie !== 'Herbes aromatiques' && p.categorie !== 'Fruits rouges' && p.categorie !== 'Arbustes fruitiers';
      }
      return true;
    });
  }, [search, filter]);

  const FILTERS: FilterCategory[] = ['Tous', 'Légumes', 'Herbes aromatiques', 'Fruits & Fleurs'];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-24">
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Encyclopédie des Plantes
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Explorez les fiches détaillées de nos légumes, herbes et fruits.
          </p>
          
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Rechercher une plante (ex: Tomate, Solanum...)" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 py-6 rounded-full text-base shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filter === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground hover:bg-muted border-border'}`}
              >
                {f}
              </button>
            ))}
          </div>

        </motion.div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlants.map((plant, i) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              onClick={() => openPlant(plant.id)}
              className="bg-card border border-border p-5 rounded-2xl cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2 text-xs font-medium bg-muted text-muted-foreground">{plant.categorie}</Badge>
                <h3 className="font-serif font-bold text-xl group-hover:text-primary transition-colors leading-tight">{plant.nom}</h3>
                <p className="text-xs text-muted-foreground italic mt-1">{plant.nom_latin}</p>
              </div>
              
              <div className="mt-auto space-y-2 pt-4 border-t border-border/50">
                <div className="flex items-start gap-2 text-xs text-foreground/80">
                  <Sun className="w-3.5 h-3.5 mt-0.5 text-amber-500 shrink-0"/> 
                  <span className="line-clamp-1">{plant.culture.exposition}</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-foreground/80">
                  <Droplets className="w-3.5 h-3.5 mt-0.5 text-blue-500 shrink-0"/> 
                  <span className="line-clamp-1">{plant.culture.arrosage}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredPlants.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground flex flex-col items-center"
          >
            <div className="text-4xl mb-4">🌱</div>
            <p className="text-lg font-medium">Aucune plante trouvée.</p>
            <p className="text-sm">Essayez de modifier vos filtres ou votre recherche.</p>
          </motion.div>
        )}
      </main>

      <PlantModalComponent />
    </div>
  );
}
