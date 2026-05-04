import { useState } from 'react';
import { motion } from 'framer-motion';
import { CARBON_DATA } from '@/data/carbon';

export default function CarbonCalc() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const updateQuantity = (name: string, val: number) => {
    setQuantities(prev => ({ ...prev, [name]: Math.max(0, val) }));
  };

  const calculateSavings = () => {
    let weeklySaved = 0;
    CARBON_DATA.forEach(veg => {
      const q = quantities[veg.name] || 0;
      const importedImpact = veg.importedKg * q;
      const localImpact = veg.localKg * q;
      weeklySaved += (importedImpact - localImpact);
    });
    return weeklySaved * 52; // Annual savings
  };

  const annualSaved = calculateSavings();
  const kmEquivalent = Math.round(annualSaved / 0.21);
  const tgvEquivalent = Math.round(annualSaved / 1.7);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-24">
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-primary mb-4">Impact Carbone</h1>
        <p className="text-muted-foreground">Découvrez le CO2 économisé en consommant local et de saison.</p>
      </header>

      <main className="max-w-4xl mx-auto w-full px-4 grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-4">
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr_100px_100px] gap-4 p-4 bg-muted/50 border-b border-border text-sm font-semibold">
              <div>Légume</div>
              <div className="text-center">Kg / sem.</div>
              <div className="text-right">CO2 / an</div>
            </div>
            
            <div className="divide-y divide-border">
              {CARBON_DATA.map(veg => {
                const q = quantities[veg.name] || 0;
                const saved = (veg.importedKg - veg.localKg) * q * 52;
                
                return (
                  <div key={veg.name} className="grid grid-cols-[1fr_100px_100px] gap-4 p-4 items-center hover:bg-muted/20 transition-colors">
                    <div className="font-medium">{veg.name}</div>
                    <div>
                      <input 
                        type="number" 
                        min="0" max="20" step="0.5" 
                        value={q}
                        onChange={e => updateQuantity(veg.name, parseFloat(e.target.value) || 0)}
                        className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:ring-1 focus:ring-ring outline-none text-center"
                      />
                    </div>
                    <div className="text-right font-mono text-green-600 font-medium">
                      -{saved.toFixed(1)} kg
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="sticky top-20 bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg space-y-6">
            <div>
              <h3 className="font-medium opacity-90 mb-1">CO2 Économisé par an</h3>
              <div className="text-4xl font-bold font-serif">{annualSaved.toFixed(1)} <span className="text-xl">kg</span></div>
            </div>

            {annualSaved > 100 && (
              <div className="inline-block px-3 py-1 bg-green-400 text-green-950 text-xs font-bold rounded-full uppercase tracking-wider">
                Impact Positif !
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-primary-foreground/20">
              <h4 className="text-sm font-semibold uppercase tracking-wider opacity-80">Équivalences</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>🚗 Voiture</span>
                  <span className="font-mono font-medium">{kmEquivalent} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>🚄 Paris-Lyon</span>
                  <span className="font-mono font-medium">{tgvEquivalent} trajets</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-primary-foreground/20 text-xs opacity-75 leading-relaxed">
              Basé sur les données de l'ADEME. La différence représente l'impact d'une culture sous serre chauffée ou d'une importation hors saison.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
