import { Link, useLocation } from "wouter";
import { Home as HomeIcon, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Thermometer } from "lucide-react";
import { useWeather, getWeatherIcon } from "@/hooks/use-weather";

const NAV_LINKS = [
  { href: "/", label: "Calendrier" },
  { href: "/semis", label: "Semis" },
  { href: "/plantes", label: "Plantes" },
  { href: "/potager", label: "Potager" },
  { href: "/carbone", label: "Carbone" },
  { href: "/marches", label: "Marchés" },
];

function WeatherWidget() {
  const { weather, loading } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
        <Thermometer className="w-3.5 h-3.5" />
        <span>Météo…</span>
      </div>
    );
  }

  if (!weather) return null;

  const iconType = getWeatherIcon(weather.weatherCode);
  const IconComponent =
    iconType === "sun" ? Sun :
    iconType === "cloud-sun" ? Cloud :
    iconType === "cloud-rain" ? CloudRain :
    iconType === "cloud-snow" ? CloudSnow :
    iconType === "cloud-lightning" ? CloudLightning :
    Cloud;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title={weather.city}>
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span className="font-medium">{weather.temperature}°C</span>
      <span className="hidden sm:inline truncate max-w-[120px]">— {weather.city}</span>
    </div>
  );
}

export default function Footer() {
  const [location] = useLocation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4">
        <nav className="flex flex-wrap items-center justify-center gap-1">
          <Link
            href="/"
            title="Accueil"
            className={`p-2 rounded-full transition-colors ${
              location === "/"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <HomeIcon className="w-3.5 h-3.5" />
          </Link>
          <div className="w-px h-4 bg-border/60 mx-1" />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                location === link.href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <WeatherWidget />
          <p className="text-center">
            © {year} Légumes de Saison — Tous droits réservés
          </p>
          <p className="hidden sm:block text-right opacity-50">
            Données statiques, usage libre
          </p>
        </div>
      </div>
    </footer>
  );
}
