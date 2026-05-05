import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRegion, getRegionOffset } from '@/hooks/use-region';
import { ALL_PLANTS, buildSowingEntries, ActionType } from '@/data/db';
import { usePlantModal } from '@/components/PlantModal';

const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const ACTION_COLORS: Record<ActionType, { bg: string, label: string }> = {
  indoor: { bg: 'bg-green-500', label: 'Int. (semis intérieur)' },
  outdoor: { bg: 'bg-amber-500', label: 'Ext. (semis extérieur)' },
  transplant: { bg: 'bg-blue-500', label: 'Rep. (repiquage/plantation)' },
  harvest: { bg: 'bg-rose-500', label: 'Réc. (récolte)' }
};

type FilterCategory = 'Tous' | 'Légumes' | 'Herbes aromatiques' | 'Fruits & Fleurs';

export default function SowingCalendar() {
  const [region] = useRegion();
  const offset = getRegionOffset(region);
  const { openPlant, PlantModalComponent } = usePlantModal();
  const [filter, setFilter] = useState<FilterCategory>('Tous');

  const filteredPlants = ALL_PLANTS.filter(p => {
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

  const entries = buildSowingEntries(filteredPlants);

  const getShiftedMonths = (months: Partial<Record<number, ActionType[]>>) => {
    const shifted: Partial<Record<number, ActionType[]>> = {};
    const monthShift = offset >= 2 ? 1 : offset <= -2 ? -1 : 0;
    
    Object.entries(months).forEach(([month, actions]) => {
      const newMonth = (parseInt(month) + monthShift + 12) % 12;
      shifted[newMonth] = actions;
    });
    return shifted;
  };

  const FILTERS: FilterCategory[] = ['Tous', 'Légumes', 'Herbes aromatiques', 'Fruits & Fleurs'];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground pb-24">
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Calendrier de Semis
          </h1>
          <p className="text-muted-foreground text-lg">
            Région actuelle : <span className="font-semibold text-foreground">{region}</span>
            <span className="text-sm block mt-1 opacity-75">
              (Décalage de {offset > 0 ? `+${offset}` : offset} semaines)
            </span>
          </p>
        </motion.div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 flex flex-col h-full overflow-hidden">
        
        <div className="flex flex-wrap gap-2 justify-center mb-6">
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

        <div className="mb-4 flex flex-wrap gap-4 justify-center bg-card px-4 py-3 rounded-xl border border-border/50 shadow-sm">
          {Object.entries(ACTION_COLORS).map(([key, {bg, label}]) => (
            <div key={key} className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className={`w-3.5 h-3.5 rounded-full ${bg} shadow-sm shrink-0`} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto border border-border/50 rounded-xl bg-card shadow-sm flex-1">
          <table className="w-full text-sm text-left min-w-[800px] border-collapse relative">
            <thead className="bg-muted/80 sticky top-0 z-20 border-b border-border/50">
              <tr>
                <th className="px-4 py-3 font-semibold w-40 sticky left-0 bg-muted/90 backdrop-blur-sm z-30 shadow-[1px_0_0_rgba(0,0,0,0.05)]">Légume</th>
                {MONTH_NAMES.map(m => (
                  <th key={m} className="px-2 py-3 font-medium text-center w-16 border-l border-border/50">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => {
                const shiftedMonths = getShiftedMonths(entry.months);
                return (
                  <tr key={entry.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium sticky left-0 bg-card/95 backdrop-blur-sm z-10 shadow-[1px_0_0_rgba(0,0,0,0.05)] cursor-pointer hover:text-primary transition-colors whitespace-nowrap" onClick={() => openPlant(entry.vegetable)}>
                      {entry.vegetable}
                    </td>
                    {Array.from({ length: 12 }).map((_, mIdx) => {
                      const actions = shiftedMonths[mIdx];
                      return (
                        <td key={mIdx} className="px-1 py-2 text-center border-l border-border/50 h-14">
                          <div className="flex flex-col items-center gap-1">
                            {actions?.map((a, i) => (
                              <div key={`${a}-${i}`} title={ACTION_COLORS[a].label} className={`w-3 h-3 rounded-full ${ACTION_COLORS[a].bg} shadow-sm`} />
                            ))}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </main>
      
      <PlantModalComponent />
    </div>
  );
}
