import { useState, useEffect } from "react";

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  city: string;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
            ),
            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            ),
          ]);

          const weatherJson = await weatherRes.json();
          const geoJson = await geoRes.json();

          const city =
            geoJson.address?.city ||
            geoJson.address?.town ||
            geoJson.address?.village ||
            geoJson.address?.county ||
            "Ma position";

          setWeather({
            temperature: Math.round(weatherJson.current.temperature_2m),
            weatherCode: weatherJson.current.weather_code,
            city,
          });
        } catch {
          // silently fail — weather is optional
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      },
      { timeout: 8000 }
    );
  }, []);

  return { weather, loading };
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return "sun";
  if (code <= 3) return "cloud-sun";
  if (code <= 48) return "cloud";
  if (code <= 67) return "cloud-rain";
  if (code <= 77) return "cloud-snow";
  if (code <= 82) return "cloud-rain";
  return "cloud-lightning";
}
