import { useState, useEffect } from 'react';
import type { FacilityFeature, FacilityCategory } from '@/types/facilities';

function getCenter(geometry: any): [number, number] {
  if (!geometry) return [0, 0];
  
  if (geometry.type === 'Point') {
    return [geometry.coordinates[1], geometry.coordinates[0]];
  }
  
  // For MultiPolygon / Polygon
  const coords = geometry.type === 'MultiPolygon' 
    ? geometry.coordinates[0][0] 
    : geometry.coordinates[0];
  
  let latSum = 0, lngSum = 0;
  for (const c of coords) {
    lngSum += c[0];
    latSum += c[1];
  }
  return [latSum / coords.length, lngSum / coords.length];
}

function getName(props: Record<string, any>, category: FacilityCategory): string {
  if (category === 'wifi_points') return props.wifi_name || 'WiFi Point';
  if (category === 'tv_lounge') return props.name || 'TV Lounge';
  if (category === 'cafeteria') return props.name || 'Cafeteria';
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
      { path: '/data/wifi_points.geojson', category: 'wifi_points' },
      { path: '/data/tv_lounge.geojson', category: 'tv_lounge' },
      { path: '/data/cafeteria.geojson', category: 'cafeteria' },
    ];

    Promise.all(files.map(f => fetch(f.path).then(r => r.json()).then(data => {
      return data.features
        .filter((feat: any) => feat.geometry !== null)
        .map((feat: any) => ({
          ...feat,
          _category: f.category,
          _center: getCenter(feat.geometry),
          _name: getName(feat.properties, f.category),
        }));
    }))).then(results => {
      setFacilities(results.flat());
      setLoading(false);
    });
  }, []);

  return { facilities, loading };
}
