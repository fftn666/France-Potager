import React from "react";
import { motion } from "framer-motion";
import { VegetableInfo } from "@/data/vegetables";
import { Sprout, ChefHat, Clock, Sun, CloudRain, Snowflake, Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VegetableCardProps {
  vegetable: VegetableInfo;
  mode: "consommer" | "planter";
  index: number;
}

const getSeasonIcon = (season: string) => {
  switch (season) {
    case "Printemps":
      return <CloudRain className="w-4 h-4 text-blue-500" />;
    case "Été":
      return <Sun className="w-4 h-4 text-yellow-500" />;
    case "Automne":
      return <Leaf className="w-4 h-4 text-orange-500" />;
    case "Hiver":
      return <Snowflake className="w-4 h-4 text-blue-300" />;
    default:
      return <Sprout className="w-4 h-4 text-primary" />;
  }
};

export function VegetableCard({ vegetable, mode, index }: VegetableCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      data-testid={`card-vegetable-${vegetable.name}`}
    >
      <Card className="group relative h-full overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-300">
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors">
              {vegetable.name}
            </h3>
            <Tooltip content={vegetable.season}>
              <div className="p-2 bg-muted rounded-full text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                {getSeasonIcon(vegetable.season)}
              </div>
            </Tooltip>
          </div>

          <div className="flex-grow space-y-3 text-sm">
            <div className="flex items-start gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{vegetable.storage}</span>
            </div>

            {mode === "consommer" && vegetable.prepAdvice && (
              <div className="flex items-start gap-2 text-foreground/80 pt-2 border-t border-border/50">
                <ChefHat className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
                <span className="leading-snug">{vegetable.prepAdvice}</span>
              </div>
            )}

            {mode === "planter" && vegetable.plantAdvice && (
              <div className="flex items-start gap-2 text-foreground/80 pt-2 border-t border-border/50">
                <Sprout className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span className="leading-snug">{vegetable.plantAdvice}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Simple internal tooltip for the card since TooltipProvider is in App.tsx
function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="relative group/tooltip flex items-center justify-center">
      {children}
      <div className="absolute bottom-full mb-2 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none bg-popover text-popover-foreground text-xs px-2 py-1 rounded border shadow-sm whitespace-nowrap z-50">
        {content}
      </div>
    </div>
  );
}
