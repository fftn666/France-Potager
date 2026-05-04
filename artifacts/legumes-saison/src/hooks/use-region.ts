import { useState, useEffect } from 'react';

export type Region = 'Nord' | 'Centre' | 'Sud' | 'Montagne';

export function useRegion() {
  const [region, setRegionState] = useState<Region>(() => {
    if (typeof window === 'undefined') return 'Centre';
    const saved = localStorage.getItem('legumesSaison_region');
    if (saved && ['Nord', 'Centre', 'Sud', 'Montagne'].includes(saved)) {
      return saved as Region;
    }
    return 'Centre';
  });

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion);
    localStorage.setItem('legumesSaison_region', newRegion);
    window.dispatchEvent(new Event('region_changed'));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('legumesSaison_region');
      if (saved && ['Nord', 'Centre', 'Sud', 'Montagne'].includes(saved)) {
        setRegionState(saved as Region);
      }
    };
    window.addEventListener('region_changed', handleStorageChange);
    return () => window.removeEventListener('region_changed', handleStorageChange);
  }, []);

  return [region, setRegion] as const;
}

export function getRegionOffset(region: Region): number {
  switch (region) {
    case 'Nord': return 2;
    case 'Centre': return 0;
    case 'Sud': return -2;
    case 'Montagne': return 3;
    default: return 0;
  }
}
