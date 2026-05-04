import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Mail, AlertTriangle } from 'lucide-react';

interface SeedListing {
  id: string;
  plant: string;
  variety: string;
  quantity: string;
  department: string;
  contact: string;
  date: string;
}

export default function SeedExchange() {
  const [listings, setListings] = useState<SeedListing[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('legumesSaison_seeds');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [
      { id: '1', plant: 'Tomate', variety: 'Cœur de Bœuf', quantity: 'Une vingtaine', department: '75 - Paris', contact: 'jardinier@example.com', date: new Date().toISOString() },
      { id: '2', plant: 'Courgette', variety: 'Ronde de Nice', quantity: '10 graines', department: '33 - Gironde', contact: 'sudiste@example.com', date: new Date(Date.now() - 86400000).toISOString() },
      { id: '3', plant: 'Radis', variety: '18 jours', quantity: 'Sachet entamé', department: '69 - Rhône', contact: 'lyon@example.com', date: new Date(Date.now() - 86400000 * 2).toISOString() }
    ];
  });

  const [form, setForm] = useState({ plant: '', variety: '', quantity: '', department: '', contact: '' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('legumesSaison_seeds', JSON.stringify(listings));
  }, [listings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.plant || !form.contact) return;
    
    const newListing: SeedListing = {
      id: crypto.randomUUID(),
      ...form,
      date: new Date().toISOString()
    };
    
    setListings([newListing, ...listings]);
    setForm({ plant: '', variety: '', quantity: '', department: '', contact: '' });
  };

  const filtered = listings.filter(l => 
    l.plant.toLowerCase().includes(search.toLowerCase()) || 
    l.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background pb-24">
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-primary mb-4">Échange de Graines</h1>
        <p className="text-muted-foreground">Partagez vos surplus de semences avec d'autres jardiniers.</p>
      </header>

      <main className="max-w-6xl mx-auto w-full px-4 grid md:grid-cols-[350px_1fr] gap-8">
        
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-fit sticky top-20">
          <h2 className="text-xl font-semibold mb-4">Proposer des graines</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Plante</label>
              <Input required placeholder="Ex: Tomate" value={form.plant} onChange={e => setForm({...form, plant: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Variété</label>
              <Input placeholder="Ex: Cœur de bœuf" value={form.variety} onChange={e => setForm({...form, variety: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Quantité</label>
              <Input placeholder="Ex: Une dizaine" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Département</label>
              <Input placeholder="Ex: 75 - Paris" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email de contact</label>
              <Input type="email" required placeholder="votre@email.com" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
            </div>
            <Button type="submit" className="w-full">Publier l'annonce</Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <Input 
              placeholder="Rechercher une plante ou un département..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
              Aucune annonce trouvée. Soyez le premier à en proposer !
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map(l => (
                <div key={l.id} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{l.plant}</h3>
                      {l.variety && <p className="text-sm text-muted-foreground italic">{l.variety}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(l.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="mt-2 space-y-1 text-sm flex-1">
                    <p><span className="text-muted-foreground">Qté:</span> {l.quantity || 'Non précisé'}</p>
                    <p className="flex items-center gap-1 text-muted-foreground"><MapPin className="w-3.5 h-3.5"/> {l.department || 'Non précisé'}</p>
                  </div>

                  <div className="mt-4 flex gap-2 pt-4 border-t border-border/50">
                    <Button variant="default" size="sm" className="flex-1 gap-2" asChild>
                      <a href={`mailto:${l.contact}?subject=Échange de graines - ${l.plant}`}>
                        <Mail className="w-4 h-4"/> Contacter
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground" asChild title="Signaler">
                      <a href={`mailto:admin@legumes-saison.fr?subject=Signalement annonce ${l.id}`}>
                        <AlertTriangle className="w-4 h-4"/>
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
