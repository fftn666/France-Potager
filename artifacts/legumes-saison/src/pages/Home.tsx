import React, { useState, useEffect } from "react";
import { MONTHS, getVegetableDetails } from "@/data/vegetables";
import { VegetableCard } from "@/components/VegetableCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlantModal } from "@/components/PlantModal";

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [mode, setMode] = useState<"consommer" | "planter">("consommer");
  const [seasonFilter, setSeasonFilter] = useState<string | null>(null);
  
  const { openPlant, PlantModalComponent } = usePlantModal();

  const monthData = MONTHS[selectedMonth];
  const activeList = mode === "consommer" ? monthData.toConsume : monthData.toPlant;
  
  const vegetables = activeList
    .map(getVegetableDetails)
    .filter(veg => !seasonFilter || veg.season === seasonFilter);

  const seasons = ["Printemps", "Été", "Automne", "Hiver"];

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
            {MONTHS.map((month) => (
              <button
                key={month.name}
                data-testid={`btn-month-${month.name}`}
                onClick={() => setSelectedMonth(month.index)}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  selectedMonth === month.index 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {selectedMonth === month.index && (
                  <motion.div
                    layoutId="activeMonth"
                    className="absolute inset-0 bg-primary rounded-xl"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{month.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Controls: Mode & Filters */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex p-1 bg-muted/50 border border-border/50 rounded-full inline-flex">
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

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={seasonFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSeasonFilter(null)}
              className="rounded-full font-medium"
              data-testid="filter-season-all"
            >
              Toutes saisons
            </Button>
            {seasons.map(season => (
              <Button
                key={season}
                variant={seasonFilter === season ? "default" : "outline"}
                size="sm"
                onClick={() => setSeasonFilter(season)}
                className="rounded-full font-medium"
                data-testid={`filter-season-${season}`}
              >
                {season}
              </Button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="min-h-[400px]">
          {vegetables.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground"
            >
              <Sprout className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg">Aucun légume ne correspond à vos critères pour ce mois.</p>
              <p className="text-sm mt-2">Essayez de changer la saison ou le mois.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {vegetables.map((veg, index) => (
                  <VegetableCard 
                    key={`${veg.name}-${mode}-${selectedMonth}`} 
                    vegetable={veg} 
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
