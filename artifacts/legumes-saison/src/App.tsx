import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MarketMap from "@/pages/MarketMap";
import "leaflet/dist/leaflet.css";

const queryClient = new QueryClient();

function Nav() {
  const [location] = useLocation();
  const links = [
    { href: "/", label: "Calendrier" },
    { href: "/marches", label: "Marchés bio" },
  ];
  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 h-14">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              location === link.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {link.label}
          </Link>
        ))}
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
