import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ALL_PLANTS, getPlantById } from '@/data/db';
import { AlertCircle, Download, RotateCcw, Info, Plus, X } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CellData {
  plantId: string | null;
  customName?: string | null;
}

type FilterCategory = 'Tous' | 'Légumes' | 'Herbes aromatiques' | 'Fruits & Fleurs';

const CUSTOM_PREFIX = '__custom__';

function loadCustomPlants(): string[] {
  try {
    const saved = localStorage.getItem('legumesSaison_custom_plants');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function GardenPlanner() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [grid, setGrid] = useState<CellData[][]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legumesSaison_garden_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.grid && parsed.rows && parsed.cols) {
            setRows(parsed.rows);
            setCols(parsed.cols);
            return parsed.grid;
          }
        } catch {/* ignore */}
      }
    }
    return Array(4).fill(null).map(() => Array(4).fill({ plantId: null }));
  });

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState<FilterCategory>('Tous');
  const [customPlants, setCustomPlants] = useState<string[]>(loadCustomPlants);
  const [customInput, setCustomInput] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('legumesSaison_garden_v2', JSON.stringify({ grid, rows, cols }));
  }, [grid, rows, cols]);

  useEffect(() => {
    localStorage.setItem('legumesSaison_custom_plants', JSON.stringify(customPlants));
  }, [customPlants]);

  const updateGridSize = (newRows: number, newCols: number) => {
    const newGrid = Array(newRows).fill(null).map((_, r) =>
      Array(newCols).fill(null).map((_, c) => grid[r]?.[c] || { plantId: null })
    );
    setRows(newRows);
    setCols(newCols);
    setGrid(newGrid);
  };

  const handleDrop = (r: number, c: number) => {
    if (!draggingId) return;
    const newGrid = grid.map(row => [...row]);
    if (draggingId.startsWith(CUSTOM_PREFIX)) {
      newGrid[r][c] = { plantId: null, customName: draggingId.slice(CUSTOM_PREFIX.length) };
    } else {
      newGrid[r][c] = { plantId: draggingId, customName: null };
    }
    setGrid(newGrid);
    setDraggingId(null);
  };

  const clearCell = (r: number, c: number) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = { plantId: null, customName: null };
    setGrid(newGrid);
  };

  const resetGrid = () => {
    setGrid(Array(rows).fill(null).map(() => Array(cols).fill({ plantId: null })));
  };

  const exportGrid = async () => {
    if (!gridRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(gridRef.current, { backgroundColor: '#f8fafc', scale: 2 });
      const link = document.createElement('a');
      link.download = 'mon-potager.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {/* ignore */} finally {
      setExporting(false);
    }
  };

  const addCustomPlant = () => {
    const name = customInput.trim();
    if (!name || customPlants.includes(name)) return;
    setCustomPlants(prev => [...prev, name]);
    setCustomInput('');
  };

  const removeCustomPlant = (name: string) => {
    setCustomPlants(prev => prev.filter(p => p !== name));
  };

  const checkConflict = (r: number, c: number) => {
    const cell = grid[r][c];
    if (!cell.plantId) return null;
    const plant = getPlantById(cell.plantId);
    if (!plant) return null;
    const neighborIds = [
      grid[r-1]?.[c]?.plantId,
      grid[r+1]?.[c]?.plantId,
      grid[r]?.[c-1]?.plantId,
      grid[r]?.[c+1]?.plantId,
    ].filter(Boolean) as string[];
    const conflicts = neighborIds.filter(nid => {
      const nPlant = getPlantById(nid);
      if (!nPlant) return false;
      return plant.associations.nefastes.includes(nid) || nPlant.associations.nefastes.includes(plant.id);
    });
    return conflicts.length > 0 ? conflicts.map(id => getPlantById(id)?.nom || id) : null;
  };

  const checkCompanion = (r: number, c: number) => {
    const cell = grid[r][c];
    if (!cell.plantId) return false;
    const plant = getPlantById(cell.plantId);
    if (!plant) return false;
    const neighborIds = [
      grid[r-1]?.[c]?.plantId,
      grid[r+1]?.[c]?.plantId,
      grid[r]?.[c-1]?.plantId,
      grid[r]?.[c+1]?.plantId,
    ].filter(Boolean) as string[];
    return neighborIds.some(nid => {
      const nPlant = getPlantById(nid);
      if (!nPlant) return false;
      return plant.associations.benefiques.includes(nid) || nPlant.associations.benefiques.includes(plant.id);
    });
  };

  const getEmptyCellSuggestions = (r: number, c: number) => {
    if (grid[r][c].plantId || grid[r][c].customName) return null;
    const neighborIds = [
      grid[r-1]?.[c]?.plantId,
      grid[r+1]?.[c]?.plantId,
      grid[r]?.[c-1]?.plantId,
      grid[r]?.[c+1]?.plantId,
    ].filter(Boolean) as string[];
    const suggestions = new Set<string>();
    neighborIds.forEach(nid => {
      const p = getPlantById(nid);
      if (p) p.associations.benefiques.forEach(bid => {
        const bp = getPlantById(bid);
        if (bp) suggestions.add(bp.nom);
      });
    });
    return suggestions.size > 0 ? Array.from(suggestions) : null;
  };

  const filteredPalette = ALL_PLANTS.filter(p => {
    if (paletteFilter === 'Tous') return true;
    if (paletteFilter === 'Herbes aromatiques') return p.categorie === 'Herbes aromatiques';
    if (paletteFilter === 'Fruits & Fleurs') {
      return p.categorie === 'Fruits rouges' || p.categorie === 'Arbustes fruitiers' ||
        ['bourrache', 'capucine', 'tagetes'].includes(p.id.toLowerCase());
    }
    return p.categorie !== 'Herbes aromatiques' && p.categorie !== 'Fruits rouges' && p.categorie !== 'Arbustes fruitiers';
  });

  const getFilterBtnName = (f: FilterCategory) => {
    if (f === 'Herbes aromatiques') return 'Herbes';
    if (f === 'Fruits & Fleurs') return 'Fruits';
    return f;
  };

  const getCategoryDot = (cat: string) =>
    cat === 'Herbes aromatiques' ? 'bg-green-400' : cat.includes('Fruits') ? 'bg-red-400' : 'bg-amber-400';

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-24">
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-primary mb-4">Potager</h1>
        <p className="text-muted-foreground">Organisez vos plantations. Glissez-déposez les plantes.</p>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 flex flex-col md:flex-row gap-8">
        {/* Left Palette */}
        <div className="w-full md:w-72 space-y-4 shrink-0 flex flex-col">
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col">
            <h3 className="font-semibold mb-3 text-sm flex items-center justify-between">
              Catalogue
              <span className="bg-muted px-2 py-0.5 rounded-full text-xs text-muted-foreground">{filteredPalette.length}</span>
            </h3>

            <div className="flex flex-wrap gap-1 mb-3">
              {(['Tous', 'Légumes', 'Herbes aromatiques', 'Fruits & Fleurs'] as FilterCategory[]).map(f => (
                <button
                  key={f}
                  onClick={() => setPaletteFilter(f)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${paletteFilter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                >
                  {getFilterBtnName(f)}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto max-h-[40vh] md:max-h-[50vh] pr-1 space-y-1.5">
              {filteredPalette.map(p => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => setDraggingId(p.id)}
                  onDragEnd={() => setDraggingId(null)}
                  className="px-3 py-2 w-full bg-muted/50 border border-border rounded-lg text-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors flex items-center gap-2"
                >
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getCategoryDot(p.categorie)}`} />
                  <span className="font-medium truncate">{p.nom}</span>
                </div>
              ))}
            </div>

            {/* Custom plants */}
            {customPlants.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                <p className="text-xs text-muted-foreground font-medium mb-2">Plantes personnalisées</p>
                {customPlants.map(name => (
                  <div
                    key={name}
                    draggable
                    onDragStart={() => setDraggingId(CUSTOM_PREFIX + name)}
                    onDragEnd={() => setDraggingId(null)}
                    className="px-3 py-2 w-full bg-violet-50 border border-violet-200 rounded-lg text-sm cursor-grab active:cursor-grabbing hover:border-violet-400 transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-violet-400" />
                    <span className="font-medium truncate flex-1">{name}</span>
                    <button
                      onClick={() => removeCustomPlant(name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add custom plant */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground font-medium mb-2">Ajouter une plante</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={e => setCustomInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCustomPlant()}
                  placeholder="Ex: Patisson…"
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-border bg-muted/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
                <button
                  onClick={addCustomPlant}
                  disabled={!customInput.trim()}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4 shrink-0">
            <h3 className="font-semibold text-sm">Dimensions</h3>
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm">Lignes ({rows})</span>
              <input type="range" min="2" max="10" value={rows} onChange={e => updateGridSize(Number(e.target.value), cols)} className="w-24 accent-primary" />
            </div>
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm">Colonnes ({cols})</span>
              <input type="range" min="2" max="10" value={cols} onChange={e => updateGridSize(rows, Number(e.target.value))} className="w-24 accent-primary" />
            </div>
            <div className="flex gap-2 pt-2 flex-col">
              <Button variant="outline" size="sm" onClick={resetGrid} className="w-full justify-start"><RotateCcw className="w-4 h-4 mr-2" /> Réinitialiser</Button>
              <Button variant="secondary" size="sm" onClick={exportGrid} disabled={exporting} className="w-full justify-start"><Download className="w-4 h-4 mr-2" /> {exporting ? 'Export en cours…' : 'Exporter'}</Button>
            </div>
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-x-auto pb-8">
          <div ref={gridRef} className="inline-block p-6 bg-card rounded-2xl border border-border shadow-sm min-w-max">
            <div
              className="grid gap-3"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr))` }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const conflicts = checkConflict(r, c);
                  const isCompanion = checkCompanion(r, c);
                  const suggestions = getEmptyCellSuggestions(r, c);
                  const plant = cell.plantId ? getPlantById(cell.plantId) : null;
                  const isCustom = !!cell.customName;
                  const hasContent = !!plant || isCustom;

                  return (
                    <div
                      key={`${r}-${c}`}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => handleDrop(r, c)}
                      className={`
                        w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl flex flex-col items-center justify-center relative transition-all group
                        ${hasContent ? (isCustom ? 'bg-violet-50 border-2 border-violet-200' : 'bg-primary/5 border-2 border-primary/20') : 'border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50'}
                        ${conflicts ? '!border-red-500 !bg-red-50' : ''}
                        ${isCompanion && !conflicts ? 'shadow-[0_0_15px_rgba(34,197,94,0.3)] border-green-400/50' : ''}
                      `}
                    >
                      {hasContent ? (
                        <>
                          <div className={`w-3 h-3 rounded-full absolute top-2 left-2 ${
                            isCustom ? 'bg-violet-400' :
                            plant?.categorie === 'Herbes aromatiques' ? 'bg-green-400' :
                            plant?.categorie.includes('Fruits') ? 'bg-red-400' : 'bg-amber-400'
                          }`} />
                          <span className="font-serif font-medium text-sm md:text-base text-center px-2 leading-tight">
                            {plant?.nom ?? cell.customName}
                          </span>
                          <button
                            onClick={() => clearCell(r, c)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm"
                          >
                            ×
                          </button>
                          {conflicts && (
                            <div className="absolute bottom-2 right-2 text-red-500" title={`Incompatible avec: ${conflicts.join(', ')}`}>
                              <AlertCircle className="w-5 h-5 drop-shadow-sm" />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-muted-foreground/30 text-3xl group-hover:text-primary/50 transition-colors font-light">+</span>
                          {suggestions && suggestions.length > 0 && (
                            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-xl p-2 flex flex-col items-center justify-center text-center border border-primary/20 pointer-events-none">
                              <span className="text-[10px] font-semibold text-green-600 mb-1 flex items-center gap-1"><Info className="w-3 h-3" /> Idéal ici:</span>
                              <span className="text-[10px] text-muted-foreground line-clamp-3">{suggestions.slice(0, 3).join(', ')}{suggestions.length > 3 ? '…' : ''}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
