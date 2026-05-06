import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRegion, getRegionOffset } from '@/hooks/use-region';
import { ALL_PLANTS, buildSowingEntries, ActionType } from '@/data/db';
import { usePlantModal } from '@/components/PlantModal';
import type { Region } from '@/hooks/use-region';

const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

const ACTION_COLORS: Record<ActionType, { bg: string; label: string }> = {
  indoor:    { bg: 'bg-green-500',  label: 'Int. (semis intérieur)' },
  outdoor:   { bg: 'bg-amber-500',  label: 'Ext. (semis extérieur)' },
  transplant:{ bg: 'bg-blue-500',   label: 'Rep. (repiquage/plantation)' },
  harvest:   { bg: 'bg-rose-500',   label: 'Réc. (récolte)' },
};

type FilterCategory = 'Tous' | 'Légumes' | 'Herbes aromatiques' | 'Fruits & Fleurs';

// ── Lunar calculations ──────────────────────────────────────────────────────
const LUNAR_CYCLE_MS = 29.53058867 * 24 * 60 * 60 * 1000;
const REF_NEW_MOON = new Date(Date.UTC(2000, 0, 6, 18, 14)).getTime();

interface MonthLunar { newMoon: number | null; fullMoon: number | null }

function computeLunarCalendar(year: number): MonthLunar[] {
  const result: MonthLunar[] = Array.from({ length: 12 }, () => ({ newMoon: null, fullMoon: null }));
  const yearStart = Date.UTC(year, 0, 1);
  const yearEnd   = Date.UTC(year + 1, 0, 1);

  const cyclesElapsed = Math.ceil((yearStart - REF_NEW_MOON) / LUNAR_CYCLE_MS);

  // New moons
  let t = REF_NEW_MOON + cyclesElapsed * LUNAR_CYCLE_MS;
  while (t < yearEnd) {
    const d = new Date(t);
    const m = d.getUTCMonth();
    if (!result[m].newMoon) result[m].newMoon = d.getUTCDate();
    t += LUNAR_CYCLE_MS;
  }

  // Full moons (half-cycle offset)
  let tf = REF_NEW_MOON + LUNAR_CYCLE_MS / 2 + (cyclesElapsed - 1) * LUNAR_CYCLE_MS;
  while (tf < yearEnd) {
    if (tf >= yearStart) {
      const d = new Date(tf);
      const m = d.getUTCMonth();
      if (!result[m].fullMoon) result[m].fullMoon = d.getUTCDate();
    }
    tf += LUNAR_CYCLE_MS;
  }

  return result;
}

// ── Frost risk months (0-indexed) by region ─────────────────────────────────
const FROST_MONTHS: Record<Region, number[]> = {
  Nord:     [0, 1, 2, 3, 4],     // Jan–Mai
  Centre:   [0, 1, 2, 3],        // Jan–Avr
  Sud:      [0, 1, 2],           // Jan–Mar
  Montagne: [0, 1, 2, 3, 4, 5],  // Jan–Juin
};

// Saints de glace: May 11–13
const SAINTS_GLACE_MONTH = 4; // May (0-indexed)
const SAINTS_GLACE_DATES = [11, 12, 13];

// ── Moon circle SVG ─────────────────────────────────────────────────────────
function MoonIcon({ phase }: { phase: 'new' | 'full' }) {
  return phase === 'new' ? (
    <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" className="w-4 h-4">
      <circle cx="8" cy="8" r="7" fill="currentColor" className="text-muted-foreground" />
    </svg>
  );
}

export default function SowingCalendar() {
  const [region] = useRegion();
  const offset = getRegionOffset(region);
  const { openPlant, PlantModalComponent } = usePlantModal();
  const [filter, setFilter] = useState<FilterCategory>('Tous');
  const [showLunar, setShowLunar] = useState(true);

  const year = new Date().getFullYear();
  const lunarCalendar = useMemo(() => computeLunarCalendar(year), [year]);
  const frostMonths = FROST_MONTHS[region];

  const filteredPlants = ALL_PLANTS.filter(p => {
    if (filter === 'Tous') return true;
    if (filter === 'Herbes aromatiques') return p.categorie === 'Herbes aromatiques';
    if (filter === 'Fruits & Fleurs') {
      return p.categorie === 'Fruits rouges' || p.categorie === 'Arbustes fruitiers' ||
        ['bourrache', 'capucine', 'tagetes'].includes(p.id.toLowerCase());
    }
    return p.categorie !== 'Herbes aromatiques' && p.categorie !== 'Fruits rouges' && p.categorie !== 'Arbustes fruitiers';
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

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 flex flex-col gap-4 overflow-hidden pb-8">

        {/* Category filters */}
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

        {/* Action legend */}
        <div className="flex flex-wrap gap-4 justify-center bg-card px-4 py-3 rounded-xl border border-border/50 shadow-sm">
          {Object.entries(ACTION_COLORS).map(([key, { bg, label }]) => (
            <div key={key} className="flex items-center gap-2 text-sm font-medium text-foreground">
              <div className={`w-3.5 h-3.5 rounded-full ${bg} shadow-sm shrink-0`} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Lunar calendar toggle */}
        <div className="flex items-center justify-between bg-card px-4 py-2.5 rounded-xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-foreground">Cycles lunaires & événements</span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3.5 h-3.5 rounded-full border border-muted-foreground" />
                Nouvelle lune
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3.5 h-3.5 rounded-full bg-muted-foreground" />
                Pleine lune
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3.5 h-3.5 rounded-sm bg-sky-100 border border-sky-300" />
                Gel possible
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3.5 h-3.5 rounded-sm bg-orange-100 border border-orange-300" />
                Saints de glace (11-13 mai)
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowLunar(v => !v)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${showLunar ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'}`}
          >
            {showLunar ? 'Masquer' : 'Afficher'}
          </button>
        </div>

        {/* Main table */}
        <div className="overflow-x-auto border border-border/50 rounded-xl bg-card shadow-sm flex-1">
          <table className="w-full text-sm text-left min-w-[800px] border-collapse relative">
            <thead className="bg-muted/80 sticky top-0 z-20 border-b border-border/50">
              <tr>
                <th className="px-4 py-3 font-semibold w-40 sticky left-0 bg-muted/90 backdrop-blur-sm z-30 shadow-[1px_0_0_rgba(0,0,0,0.05)]">Légume</th>
                {MONTH_NAMES.map((m, mIdx) => (
                  <th key={m} className="px-2 py-3 font-medium text-center w-16 border-l border-border/50">
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{m}</span>
                      {mIdx === SAINTS_GLACE_MONTH && (
                        <span className="text-[9px] text-orange-500 font-semibold leading-none">Saints glace</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Lunar row */}
              {showLunar && (
                <tr className="border-b border-border/70 bg-muted/20">
                  <td className="px-4 py-2 text-xs text-muted-foreground font-medium sticky left-0 bg-muted/30 backdrop-blur-sm z-10 shadow-[1px_0_0_rgba(0,0,0,0.05)] whitespace-nowrap">
                    Lune {year}
                  </td>
                  {lunarCalendar.map((lunar, mIdx) => {
                    const isFrost = frostMonths.includes(mIdx);
                    const isSaintsGlace = mIdx === SAINTS_GLACE_MONTH;
                    return (
                      <td
                        key={mIdx}
                        className={`px-1 py-2 text-center border-l border-border/50 h-10 ${
                          isSaintsGlace ? 'bg-orange-50' : isFrost ? 'bg-sky-50' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          {lunar.newMoon && (
                            <div
                              title={`Nouvelle lune le ${lunar.newMoon} ${MONTH_NAMES[mIdx]}`}
                              className="flex flex-col items-center"
                            >
                              <MoonIcon phase="new" />
                              <span className="text-[9px] text-muted-foreground leading-none">{lunar.newMoon}</span>
                            </div>
                          )}
                          {lunar.fullMoon && (
                            <div
                              title={`Pleine lune le ${lunar.fullMoon} ${MONTH_NAMES[mIdx]}`}
                              className="flex flex-col items-center"
                            >
                              <MoonIcon phase="full" />
                              <span className="text-[9px] text-muted-foreground leading-none">{lunar.fullMoon}</span>
                            </div>
                          )}
                          {isSaintsGlace && (
                            <span
                              className="text-[9px] text-orange-500 font-bold leading-none mt-0.5"
                              title={`Saints de glace : ${SAINTS_GLACE_DATES.map(d => `${d}/05`).join(', ')}`}
                            >
                              11-13
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              )}

              {/* Plant rows */}
              {entries.map((entry) => {
                const shiftedMonths = getShiftedMonths(entry.months);
                return (
                  <tr key={entry.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td
                      className="px-4 py-3 font-medium sticky left-0 bg-card/95 backdrop-blur-sm z-10 shadow-[1px_0_0_rgba(0,0,0,0.05)] cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                      onClick={() => openPlant(entry.vegetable)}
                    >
                      {entry.vegetable}
                    </td>
                    {Array.from({ length: 12 }).map((_, mIdx) => {
                      const actions = shiftedMonths[mIdx];
                      const isFrost = showLunar && frostMonths.includes(mIdx);
                      const isSaintsGlace = showLunar && mIdx === SAINTS_GLACE_MONTH;
                      return (
                        <td
                          key={mIdx}
                          className={`px-1 py-2 text-center border-l border-border/50 h-14 ${
                            isSaintsGlace ? 'bg-orange-50/40' : isFrost ? 'bg-sky-50/40' : ''
                          }`}
                        >
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
