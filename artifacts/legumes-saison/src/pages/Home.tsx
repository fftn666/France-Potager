import React, { useState, useEffect } from "react";
import { getPlantsToConsumeInMonth, getPlantsToPlantInMonth, ALL_PLANTS } from "@/data/db";
import { VegetableCard } from "@/components/VegetableCard";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Utensils, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlantModal } from "@/components/PlantModal";

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const CATEGORIES = Array.from(new Set(ALL_PLANTS.map(p => p.categorie))).sort();

// ── Simple Markdown renderer ─────────────────────────────────────────────────
function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside text-sm text-muted-foreground space-y-0.5 my-1">
          {listItems.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith('# ')) {
      // skip top title
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="font-semibold text-base text-foreground mt-4 mb-1 first:mt-0">{line.slice(3)}</h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-sm font-medium text-muted-foreground mt-3 mb-1">{line.slice(4)}</h3>
      );
    } else if (line.startsWith('- ')) {
      listItems.push(line.slice(2));
    } else if (line.startsWith('---')) {
      flushList();
      elements.push(<hr key={i} className="border-border/50 my-3" />);
    } else if (line.trim()) {
      flushList();
      elements.push(<p key={i} className="text-sm text-muted-foreground">{line}</p>);
    } else {
      flushList();
    }
  });
  flushList();
  return elements;
}

function ChangelogSection() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!open || content !== null) return;
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}CHANGELOG.md`)
      .then(res => {
        if (!res.ok) throw new Error('not found');
        return res.text();
      })
      .then(text => { setContent(text); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [open, content]);

  return (
    <section className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Changelog & à venir</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-border/50">
              {loading && <p className="text-sm text-muted-foreground mt-4">Chargement…</p>}
              {error && <p className="text-sm text-muted-foreground mt-4">Impossible de charger le changelog.</p>}
              {content && <div className="mt-4">{renderMarkdown(content)}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [mode, setMode] = useState<"consommer" | "planter">("consommer");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { openPlant, PlantModalComponent } = usePlantModal();

  const activePlants = mode === "consommer"
    ? getPlantsToConsumeInMonth(selectedMonth)
    : getPlantsToPlantInMonth(selectedMonth);

  const filteredPlants = activePlants.filter(p => !categoryFilter || p.categorie === categoryFilter);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
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

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-10">

        {/* Month Selector */}
        <section className="bg-card border border-border/50 rounded-2xl p-2 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex sm:justify-center min-w-max gap-1">
            {MONTH_NAMES.map((name, index) => (
              <button
                key={name}
                data-testid={`btn-month-${name}`}
                onClick={() => setSelectedMonth(index)}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                  selectedMonth === index ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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

        {/* Controls */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex p-1 bg-muted/50 border border-border/50 rounded-full shrink-0">
            <button
              data-testid="tab-consommer"
              onClick={() => setMode("consommer")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === "consommer" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Utensils className="w-4 h-4" />
              À consommer
            </button>
            <button
              data-testid="tab-planter"
              onClick={() => setMode("planter")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                mode === "planter" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sprout className="w-4 h-4" />
              À planter
            </button>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-end gap-2">
            <Button variant={categoryFilter === null ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(null)} className="rounded-full font-medium">
              Toutes catégories
            </Button>
            {CATEGORIES.map(cat => (
              <Button key={cat} variant={categoryFilter === cat ? "default" : "outline"} size="sm" onClick={() => setCategoryFilter(cat)} className="rounded-full font-medium">
                {cat}
              </Button>
            ))}
          </div>
        </section>

        {/* Plant grid */}
        <section className="min-h-[400px]">
          {filteredPlants.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
              <Sprout className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">Aucune plante ne correspond à vos critères.</p>
              <p className="text-sm mt-2">Essayez de changer le filtre ou le mois.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Changelog */}
        <ChangelogSection />
      </main>

      <PlantModalComponent />
    </div>
  );
}
