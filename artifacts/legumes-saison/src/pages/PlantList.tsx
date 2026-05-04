import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { PLANTS } from '@/data/plants';
import { usePlantModal } from '@/components/PlantModal';
import { Sun, Droplets } from 'lucide-react';

export default function PlantList() {
  const [search, setSearch] = useState('');
  const { openPlant, PlantModalComponent } = usePlantModal();

  const filteredPlants = Object.values(PLANTS).filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.latinName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-24">
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Encyclopédie des Plantes
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Explorez les fiches détaillées de nos légumes.
          </p>
          <Input 
            placeholder="Rechercher une plante..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-md mx-auto"
          />
        </motion.div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlants.map((plant, i) => (
            <motion.div
              key={plant.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => openPlant(plant.name)}
              className="bg-card border border-border p-4 rounded-xl cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{plant.name}</h3>
              <p className="text-sm text-muted-foreground italic mb-4">{plant.latinName}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1" title="Ensoleillement"><Sun className="w-3.5 h-3.5"/> {plant.sun}</span>
                <span className="flex items-center gap-1" title="Arrosage"><Droplets className="w-3.5 h-3.5"/> {plant.water}</span>
              </div>
            </motion.div>
          ))}
        </div>
        {filteredPlants.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">Aucune plante trouvée.</div>
        )}
      </main>

      <PlantModalComponent />
    </div>
  );
}
