import { useState } from 'react';
import { PLANTS, PlantDetail } from '@/data/plants';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Check, X, AlertTriangle, Sun, Droplets, Mountain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function usePlantModal() {
  const [open, setOpen] = useState(false);
  const [plant, setPlant] = useState<PlantDetail | null>(null);

  const openPlant = (name: string) => {
    const details = PLANTS[name];
    if (details) {
      setPlant(details);
      setOpen(true);
    }
  };

  const PlantModalComponent = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        {plant && (
          <div className="space-y-6 py-4">
            <SheetHeader>
              <SheetTitle className="text-2xl text-primary font-serif">{plant.name}</SheetTitle>
              <SheetDescription className="italic">{plant.latinName}</SheetDescription>
            </SheetHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> Compagnons</h4>
                <div className="flex flex-wrap gap-2">
                  {plant.companions.map(c => <Badge key={c} variant="outline" className="bg-green-50">{c}</Badge>)}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><X className="w-4 h-4 text-red-500"/> Ennemis</h4>
                <div className="flex flex-wrap gap-2">
                  {plant.enemies.map(e => <Badge key={e} variant="outline" className="bg-red-50 text-red-700">{e}</Badge>)}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500"/> Ravageurs</h4>
                <div className="flex flex-wrap gap-2">
                  {plant.pests.map(p => <Badge key={p} variant="secondary" className="bg-amber-50 text-amber-700">{p}</Badge>)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-xl">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Sun className="w-4 h-4"/> Ensoleillement</div>
                  <div className="font-medium capitalize">{plant.sun}</div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Droplets className="w-4 h-4"/> Arrosage</div>
                  <div className="font-medium capitalize">{plant.water}</div>
                </div>
                <div className="space-y-1 text-sm col-span-2">
                  <div className="flex items-center gap-2 text-muted-foreground"><Mountain className="w-4 h-4"/> Sol</div>
                  <div className="font-medium">{plant.soil}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">De la graine à la récolte</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full"></div>
                  </div>
                  <span className="text-sm font-medium">{plant.sowToHarvestWeeks} semaines</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Conseils du jardinier</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{plant.tips}</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );

  return { openPlant, PlantModalComponent };
}
