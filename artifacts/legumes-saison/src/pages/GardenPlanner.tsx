import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PLANTS } from '@/data/plants';
import { AlertCircle, Download, RotateCcw } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CellData {
  plant: string | null;
}

export default function GardenPlanner() {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [grid, setGrid] = useState<CellData[][]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legumesSaison_garden');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.grid && parsed.rows && parsed.cols) {
            setRows(parsed.rows);
            setCols(parsed.cols);
            return parsed.grid;
          }
        } catch (e) {}
      }
    }
    return Array(4).fill(null).map(() => Array(4).fill({ plant: null }));
  });

  const [dragging, setDragging] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('legumesSaison_garden', JSON.stringify({ grid, rows, cols }));
  }, [grid, rows, cols]);

  const updateGridSize = (newRows: number, newCols: number) => {
    const newGrid = Array(newRows).fill(null).map((_, r) => 
      Array(newCols).fill(null).map((_, c) => 
        grid[r]?.[c] || { plant: null }
      )
    );
    setRows(newRows);
    setCols(newCols);
    setGrid(newGrid);
  };

  const handleDrop = (r: number, c: number) => {
    if (dragging) {
      const newGrid = [...grid];
      newGrid[r] = [...newGrid[r]];
      newGrid[r][c] = { plant: dragging };
      setGrid(newGrid);
      setDragging(null);
    }
  };

  const resetGrid = () => {
    setGrid(Array(rows).fill(null).map(() => Array(cols).fill({ plant: null })));
  };

  const exportGrid = async () => {
    if (!gridRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: '#f8fafc', // match roughly background color
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'mon-potager.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setExporting(false);
    }
  };

  const checkConflict = (r: number, c: number) => {
    const cell = grid[r][c];
    if (!cell.plant) return null;
    const plant = PLANTS[cell.plant];
    if (!plant) return null;

    const neighbors = [
      grid[r-1]?.[c]?.plant,
      grid[r+1]?.[c]?.plant,
      grid[r]?.[c-1]?.plant,
      grid[r]?.[c+1]?.plant
    ].filter(Boolean) as string[];

    const conflicts = neighbors.filter(n => plant.enemies.includes(n));
    return conflicts.length > 0 ? conflicts : null;
  };

  const checkCompanion = (r: number, c: number) => {
    const cell = grid[r][c];
    if (!cell.plant) return false;
    const plant = PLANTS[cell.plant];
    if (!plant) return false;

    const neighbors = [
      grid[r-1]?.[c]?.plant,
      grid[r+1]?.[c]?.plant,
      grid[r]?.[c-1]?.plant,
      grid[r]?.[c+1]?.plant
    ].filter(Boolean) as string[];

    return neighbors.some(n => plant.companions.includes(n));
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-24">
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-primary mb-4">Potager</h1>
        <p className="text-muted-foreground">Organisez vos plantations. Glissez-déposez les légumes.</p>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 flex flex-col md:flex-row gap-8">
        {/* Left Palette */}
        <div className="w-full md:w-64 space-y-4 shrink-0">
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
            <h3 className="font-semibold mb-4 text-sm">Légumes</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PLANTS).map(p => (
                <div
                  key={p}
                  draggable
                  onDragStart={() => setDragging(p)}
                  onDragEnd={() => setDragging(null)}
                  className="px-3 py-1.5 bg-muted border border-border rounded-md text-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
            <h3 className="font-semibold text-sm">Dimensions</h3>
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm">Lignes ({rows})</span>
              <input type="range" min="3" max="8" value={rows} onChange={e => updateGridSize(Number(e.target.value), cols)} className="w-24"/>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm">Colonnes ({cols})</span>
              <input type="range" min="3" max="8" value={cols} onChange={e => updateGridSize(rows, Number(e.target.value))} className="w-24"/>
            </div>
            <div className="flex gap-2 pt-2 flex-col">
              <Button variant="outline" size="sm" onClick={resetGrid} className="w-full justify-start"><RotateCcw className="w-4 h-4 mr-2"/> Réinitialiser</Button>
              <Button variant="secondary" size="sm" onClick={exportGrid} disabled={exporting} className="w-full justify-start"><Download className="w-4 h-4 mr-2"/> {exporting ? 'Export en cours...' : 'Exporter'}</Button>
            </div>
          </div>
        </div>

        {/* Grid Area */}
        <div className="flex-1 overflow-x-auto pb-8">
          <div ref={gridRef} className="inline-block p-6 bg-card rounded-2xl border border-border shadow-sm min-w-max">
            <div 
              className="grid gap-2" 
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(80px, 1fr))` }}
            >
              {grid.map((row, r) => (
                row.map((cell, c) => {
                  const conflicts = checkConflict(r, c);
                  const isCompanion = checkCompanion(r, c);
                  
                  return (
                    <div
                      key={`${r}-${c}`}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => handleDrop(r, c)}
                      className={`
                        w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl flex flex-col items-center justify-center relative transition-all group
                        ${cell.plant ? 'bg-primary/10 border-2 border-primary/20' : 'border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/50'}
                        ${conflicts ? '!border-red-500 !bg-red-50' : ''}
                        ${isCompanion && !conflicts ? 'shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}
                      `}
                    >
                      {cell.plant ? (
                        <>
                          <span className="font-medium text-sm md:text-base text-center px-1">{cell.plant}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newGrid = [...grid];
                              newGrid[r] = [...newGrid[r]];
                              newGrid[r][c] = { plant: null };
                              setGrid(newGrid);
                            }}
                            className="absolute -top-2 -right-2 bg-destructive text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            ×
                          </button>
                          {conflicts && (
                            <div className="absolute bottom-1 right-1 text-red-500" title={`Incompatible avec: ${conflicts.join(', ')}`}>
                              <AlertCircle className="w-4 h-4" />
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-muted-foreground/30 text-2xl group-hover:text-primary/50 transition-colors">+</span>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
