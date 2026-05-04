import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Loader2, LocateFixed, AlertCircle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Market {
  id: number;
  lat: number;
  lon: number;
  name: string;
  tags: Record<string, string>;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:16px;height:16px;background:#2d6a4f;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

async function fetchMarkets(lat: number, lon: number, radius: number = 10000): Promise<Market[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="marketplace"]["organic"~"only|yes|limited",i](around:${radius},${lat},${lon});
      node["amenity"="marketplace"]["name"~"bio|producteur|paysan|fermier|marché",i](around:${radius},${lat},${lon});
      node["shop"="farm"](around:${radius},${lat},${lon});
      node["amenity"="marketplace"](around:${radius/2},${lat},${lon});
    );
    out body;
  `;
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  if (!response.ok) throw new Error("Erreur lors de la récupération des marchés");
  const data = await response.json();
  return (data.elements || []).map((el: { id: number; lat: number; lon: number; tags?: Record<string, string> }) => ({
    id: el.id,
    lat: el.lat,
    lon: el.lon,
    name: el.tags?.name || "Marché local",
    tags: el.tags || {},
  }));
}

function getBadge(tags: Record<string, string>): { label: string; color: string } | null {
  if (tags.organic === "only") return { label: "100% Bio", color: "bg-green-100 text-green-800" };
  if (tags.organic === "yes") return { label: "Bio", color: "bg-green-100 text-green-800" };
  if (tags.organic === "limited") return { label: "Partiel Bio", color: "bg-yellow-100 text-yellow-800" };
  if (tags.shop === "farm") return { label: "Vente à la ferme", color: "bg-amber-100 text-amber-800" };
  return null;
}

export default function MarketMap() {
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334]);
  const [mapZoom] = useState(5);
  const hasFetched = useRef(false);

  const locate = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur votre navigateur.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setMapCenter(coords);
        setLocating(false);
        loadMarkets(coords[0], coords[1]);
      },
      () => {
        setLocating(false);
        setError("Impossible d'obtenir votre position. Vérifiez les permissions de localisation.");
      }
    );
  };

  const loadMarkets = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchMarkets(lat, lon);
      setMarkets(results);
      if (results.length === 0) {
        setError("Aucun marché trouvé dans un rayon de 10 km. Essayez depuis une autre position.");
      }
    } catch {
      setError("Impossible de charger les marchés. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      locate();
    }
  }, []);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="pt-12 pb-8 px-6 text-center max-w-3xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-8 h-8 text-primary" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-primary">
              Marchés bio & locaux
            </h1>
          </div>
          <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Trouvez les marchés de producteurs bio et locaux près de chez vous.
          </p>
        </motion.div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            onClick={locate}
            disabled={locating || loading}
            data-testid="btn-locate"
            className="gap-2 rounded-full"
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
            {locating ? "Localisation…" : "Me localiser"}
          </Button>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Recherche des marchés en cours…
            </div>
          )}

          {!loading && markets.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{markets.length}</span> marché{markets.length > 1 ? "s" : ""} trouvé{markets.length > 1 ? "s" : ""} dans un rayon de 10 km
            </p>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="rounded-2xl overflow-hidden border border-border/50 shadow-sm" style={{ height: "520px" }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userPos && (
              <>
                <RecenterMap center={userPos} />
                <Marker position={userPos} icon={userIcon}>
                  <Popup>
                    <span className="font-medium text-sm">Votre position</span>
                  </Popup>
                </Marker>
              </>
            )}
            {markets.map((market) => {
              const badge = getBadge(market.tags);
              const openingHours = market.tags.opening_hours;
              const website = market.tags.website || market.tags["contact:website"];
              return (
                <Marker key={market.id} position={[market.lat, market.lon]} icon={markerIcon}>
                  <Popup maxWidth={240}>
                    <div className="space-y-1.5 py-1">
                      <p className="font-semibold text-sm leading-tight">{market.name}</p>
                      {badge && (
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      )}
                      {openingHours && (
                        <p className="text-xs text-gray-600 flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                          {openingHours}
                        </p>
                      )}
                      {website && (
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline block"
                        >
                          Voir le site
                        </a>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Données issues d'OpenStreetMap. Si un marché manque,{" "}
          <a
            href="https://www.openstreetmap.org/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            contribuez à l'ajouter
          </a>
          .
        </p>
      </main>
    </div>
  );
}
