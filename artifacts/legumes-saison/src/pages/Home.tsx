import React, { useState } from "react";
import { getPlantsToConsumeInMonth, getPlantsToPlantInMonth, ALL_PLANTS } from "@/data/db";
import { VegetableCard } from "@/components/VegetableCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlantModal } from "@/components/PlantModal";

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

const CATEGORIES = Array.from(new Set(ALL_PLANTS.map(p => p.categorie))).sort();

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to April (index 3)
  const [mode, setMode] = useState<"consommer" | "planter">("consommer");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  const { openPlant, PlantModalComponent } = usePlantModal();

  const activePlants = mode === "consommer" 
    ? getPlantsToConsumeInMonth(selectedMonth)
    : getPlantsToPlantInMonth(selectedMonth);
  
  const filteredPlants = activePlants.filter(p => !categoryFilter || p.categorie === categoryFilter);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-4">
            Légumes de Saison
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Votre compagnon du marché et du potager. Qu'est-ce qu'on mange et qu'est-ce qu'on sème ce mois-ci ?
          </p>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 pb-24 space-y-12">
        
        {/* Month Selector */}
        <section className="bg-card border border-border/50 rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex sm:justify-center min-w-max gap-1">
            {MONTH_NAMES.map((name, index) => (
              <button
                key={name}
                data-testid={`btn-month-${name}`}
                onClick={() => setSelectedMonth(index)}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  selectedMonth === index 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {selectedMonth === index && (
                  <motion.div
                    layoutId="activeMonth"
                    className="absolute inset-0 bg-primary rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Controls: Mode & Filters */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex p-1 bg-muted/50 border border-border/50 rounded-full inline-flex shrink-0">
            <button
              data-testid="tab-consommer"
              onClick={() => setMode("consommer")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === "consommer" 
                  ? "bg-card shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Utensils className="w-4 h-4" />
              À consommer
            </button>
            <button
              data-testid="tab-planter"
              onClick={() => setMode("planter")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === "planter" 
                  ? "bg-card shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sprout className="w-4 h-4" />
              À planter
            </button>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end gap-2">
            <Button
              variant={categoryFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(null)}
              className="rounded-full font-medium"
            >
              Toutes catégories
            </Button>
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={categoryFilter === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(cat)}
                className="rounded-full font-medium"
              >
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="min-h-[400px]">
          {filteredPlants.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground"
            >
              <Sprout className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">Aucune plante ne correspond à vos critères.</p>
              <p className="text-sm mt-2">Essayez de changer le filtre ou le mois.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredPlants.map((plant, index) => (
                  <VegetableCard 
                    key={`${plant.id}-${mode}-${selectedMonth}`} 
                    plant={plant} 
                    mode={mode} 
                    index={index}
                    onOpenDetail={openPlant}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </main>
      
      <PlantModalComponent />
    </div>
  );
}
