import React from "react";
import { motion } from "framer-motion";
import { Plant } from "@/data/db";
import { Sprout, Clock, Sun, CalendarCheck, Leaf, CloudRain, Snowflake } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VegetableCardProps {
  plant: Plant;
  mode: "consommer" | "planter";
  index: number;
  onOpenDetail?: (id: string) => void;
}

const getCategoryIcon = (cat: string) => {
  if (cat.includes("Herbes")) return <Leaf className="w-4 h-4 text-green-500" />;
  if (cat.includes("Fruits") || cat.includes("Arbustes")) return <Sun className="w-4 h-4 text-orange-500" />;
  return <Sprout className="w-4 h-4 text-primary" />;
};

export function VegetableCard({ plant, mode, index, onOpenDetail }: VegetableCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      data-testid={`card-vegetable-${plant.id}`}
    >
      <Card 
        className={`group relative h-full overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300 ${onOpenDetail ? 'cursor-pointer' : ''}`}
        onClick={() => onOpenDetail?.(plant.id)}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors">
              {plant.nom}
            </h3>
            <Tooltip content={plant.categorie}>
              <div className="p-2 bg-muted rounded-full text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {getCategoryIcon(plant.categorie)}
              </div>
            </Tooltip>
          </div>

          <div className="flex-grow space-y-3 text-sm">
            {mode === "consommer" && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{plant.conservation}</span>
              </div>
            )}

            {mode === "planter" && (
              <div className="flex items-start gap-2 text-foreground/80">
                <Sun className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
                <span className="leading-snug line-clamp-2">{plant.culture.exposition}</span>
              </div>
            )}

            {mode === "planter" && plant.conseils && plant.conseils.length > 0 && (
              <div className="flex items-start gap-2 text-foreground/80 pt-2 border-t border-border/50">
                <Sprout className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span className="leading-snug line-clamp-2">{plant.conseils[0]}</span>
              </div>
            )}

            {mode === "planter" && plant.culture.temps_recolte_semaines && (
              <div className="flex items-start gap-2 text-foreground/80 pt-2 border-t border-border/50">
                <CalendarCheck className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                <span className="leading-snug">{plant.culture.temps_recolte_semaines}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="relative group/tooltip flex items-center justify-center">
      {children}
      <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none bg-popover text-popover-foreground text-xs px-2 py-1 rounded border shadow-sm whitespace-nowrap z-50">
        {content}
      </div>
    </div>
  );
}
