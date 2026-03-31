import { useState, useEffect } from 'react';
import type { FacilityFeature, FacilityCategory } from '@/types/facilities';
import L from 'leaflet';

function getCenter(geometry: any): [number, number] {
  const coords = geometry.coordinates[0][0];
  let latSum = 0, lngSum = 0;
  for (const c of coords) {
    lngSum += c[0];
    latSum += c[1];
  }
  return [latSum / coords.length, lngSum / coords.length];
}

function getName(props: Record<string, any>): string {
  return props.name || props.Name || props.NAME || 'Unknown';
}

export function useGeoData() {
  const [facilities, setFacilities] = useState<FacilityFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const files: { path: string; category: FacilityCategory }[] = [
      { path: '/data/hostels.geojson', category: 'hostels' },
      { path: '/data/administration.geojson', category: 'administration' },
      { path: '/data/labs.geojson', category: 'labs' },
      { path: '/data/lecture_halls.geojson', category: 'lecture_halls' },
      { path: '/data/religious_centres.geojson', category: 'religious_centres' },
    ];

    Promise.all(files.map(f => fetch(f.path).then(r => r.json()).then(data => {
      return data.features.map((feat: any) => ({
        ...feat,
        _category: f.category,
        _center: getCenter(feat.geometry),
        _name: getName(feat.properties),
      }));
    }))).then(results => {
      setFacilities(results.flat());
      setLoading(false);
    });
  }, []);

  return { facilities, loading };
}
