import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegion, Region } from "@/hooks/use-region";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MarketMap from "@/pages/MarketMap";
import SowingCalendar from "@/pages/SowingCalendar";
import GardenPlanner from "@/pages/GardenPlanner";
import SeedExchange from "@/pages/SeedExchange";
import CarbonCalc from "@/pages/CarbonCalc";
import PlantList from "@/pages/PlantList";
import "leaflet/dist/leaflet.css";

const queryClient = new QueryClient();

function Nav() {
  const [location] = useLocation();
  const [region, setRegion] = useRegion();

  const links = [
    { href: "/", label: "Calendrier" },
    { href: "/semis", label: "Semis" },
    { href: "/plantes", label: "Plantes" },
    { href: "/potager", label: "Potager" },
    { href: "/graines", label: "Graines" },
    { href: "/carbone", label: "Carbone" },
    { href: "/marches", label: "Marchés" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-14">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
              className={`px-4 py-1.5 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
                location === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto pl-4">
          <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-muted/30 border-none shadow-none text-muted-foreground focus:ring-0">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nord">Nord</SelectItem>
              <SelectItem value="Centre">Centre</SelectItem>
              <SelectItem value="Sud">Sud</SelectItem>
              <SelectItem value="Montagne">Montagne</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <>
      <Nav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/semis" component={SowingCalendar} />
        <Route path="/plantes" component={PlantList} />
        <Route path="/potager" component={GardenPlanner} />
        <Route path="/graines" component={SeedExchange} />
        <Route path="/carbone" component={CarbonCalc} />
        <Route path="/marches" component={MarketMap} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
