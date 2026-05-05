import { useState, useEffect } from 'react';
import { ALL_PLANTS, Plant, getPlantById, getPlantByName, PlantCategory } from '@/data/db';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Check, X, AlertTriangle, Sun, Droplets, Mountain, Clock, Sprout, CalendarCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function usePlantModal() {
  const [open, setOpen] = useState(false);
  const [plant, setPlant] = useState<Plant | null>(null);

  const openPlant = (identifier: string) => {
    const details = getPlantById(identifier) || getPlantByName(identifier);
    if (details) {
      setPlant(details);
      setOpen(true);
    }
  };

  const closePlant = () => {
    setOpen(false);
    setTimeout(() => setPlant(null), 300);
  };

  const handleCompanionClick = (id: string) => {
    const comp = getPlantById(id);
    if (comp) {
      setPlant(comp);
    }
  };

  const PlantModalComponent = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        {plant && (
          <ScrollArea className="h-full px-6 py-6">
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <SheetTitle className="text-3xl text-primary font-serif">{plant.nom}</SheetTitle>
                    <SheetDescription className="italic text-lg">{plant.nom_latin}</SheetDescription>
                  </div>
                  <Badge variant="secondary" className="capitalize">{plant.categorie}</Badge>
                </div>
              </SheetHeader>

              {plant.varietes && plant.varietes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg border-b pb-1">Variétés notables</h4>
                  <div className="grid gap-2">
                    {plant.varietes.map(v => (
                      <div key={v.nom} className="bg-muted/30 p-3 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{v.nom}</span>
                          <Badge variant="outline" className="text-[10px] h-5">{v.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-semibold text-lg border-b pb-1">Culture</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 bg-muted/30 p-2 rounded-lg">
                    <Sun className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Exposition</div>
                      <div className="text-sm">{plant.culture.exposition}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-muted/30 p-2 rounded-lg">
                    <Droplets className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Arrosage</div>
                      <div className="text-sm">{plant.culture.arrosage}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-muted/30 p-2 rounded-lg">
                    <Mountain className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Sol</div>
                      <div className="text-sm">{plant.culture.sol}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-muted/30 p-2 rounded-lg">
                    <div className="w-4 h-4 mt-0.5 flex items-center justify-center shrink-0">📏</div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Espacement</div>
                      <div className="text-sm">{plant.culture.espacement}</div>
                    </div>
                  </div>
                  {plant.culture.germination_jours && (
                    <div className="flex items-start gap-2 bg-muted/30 p-2 rounded-lg">
                      <Sprout className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground font-medium">Germination</div>
                        <div className="text-sm">{plant.culture.germination_jours} jours</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-2 bg-muted/30 p-2 rounded-lg">
                    <CalendarCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Récolte</div>
                      <div className="text-sm">{plant.culture.temps_recolte_semaines}</div>
                    </div>
                  </div>
                </div>
              </div>

              {(plant.associations.benefiques.length > 0 || plant.associations.nefastes.length > 0) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg border-b pb-1">Associations</h4>
                  {plant.associations.benefiques.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><Check className="w-3.5 h-3.5 text-green-500"/> Bénéfiques</div>
                      <div className="flex flex-wrap gap-1.5">
                        {plant.associations.benefiques.map(id => {
                          const p = getPlantById(id);
                          return (
                            <Badge 
                              key={id} 
                              variant="outline" 
                              className="bg-green-500/10 hover:bg-green-500/20 text-green-700 border-green-200 cursor-pointer transition-colors"
                              onClick={() => handleCompanionClick(id)}
                            >
                              {p?.nom || id}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {plant.associations.nefastes.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1"><X className="w-3.5 h-3.5 text-red-500"/> Néfastes</div>
                      <div className="flex flex-wrap gap-1.5">
                        {plant.associations.nefastes.map(id => {
                          const p = getPlantById(id);
                          return (
                            <Badge 
                              key={id} 
                              variant="outline" 
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-700 border-red-200 cursor-pointer transition-colors"
                              onClick={() => handleCompanionClick(id)}
                            >
                              {p?.nom || id}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {plant.ravageurs && plant.ravageurs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg border-b pb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Ravageurs & Maladies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {plant.ravageurs.map(r => (
                      <Badge key={r} variant="secondary" className="bg-amber-500/10 text-amber-700">{r}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {plant.conseils && plant.conseils.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-lg border-b pb-1">Conseils du jardinier</h4>
                  <ul className="space-y-1.5 list-disc pl-4">
                    {plant.conseils.map((c, i) => (
                      <li key={i} className="text-sm text-muted-foreground leading-relaxed pl-1">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/10">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                  <Clock className="w-4 h-4" /> Conservation
                </h4>
                <p className="text-sm">{plant.conservation}</p>
              </div>

              {plant.empreinte_carbone && (
                <div className="space-y-2 bg-stone-100 p-4 rounded-xl border border-stone-200">
                  <h4 className="font-semibold text-sm text-stone-700">Empreinte Carbone</h4>
                  <p className="text-sm text-stone-600">
                    Local: <span className="font-bold text-green-600">{plant.empreinte_carbone.local}</span> vs Importé: <span className="font-bold text-red-500">{plant.empreinte_carbone.importe}</span> {plant.empreinte_carbone.unite}
                  </p>
                </div>
              )}

            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  );

  return { openPlant, closePlant, PlantModalComponent };
}
