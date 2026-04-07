import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import type { FacilityFeature, FacilityCategory, TravelMode, MapView as MapViewType } from '@/types/facilities';
import { Locate, Layers } from 'lucide-react';
import RoutingPanel from './RoutingPanel';
import { cafeteriaMenu } from '@/data/cafeteriaMenu';
import { buildingRooms } from '@/data/lectureRooms';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const categoryColors: Record<FacilityCategory, string> = {
  hostels: '#e03e6a',
  administration: '#1a73e8',
  labs: '#2d9d6a',
  lecture_halls: '#d4a017',
  religious_centres: '#8b5cf6',
  wifi_points: '#06b6d4',
  tv_lounge: '#f97316',
  cafeteria: '#84cc16',
};

const tileLayers: Record<MapViewType, { url: string; attr: string }> = {
  street: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', attr: '&copy; OpenStreetMap' },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr: '&copy; Esri' },
  terrain: { url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attr: '&copy; OpenTopoMap' },
};

const wifiIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg>`;

const tvIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`;

interface MapViewProps {
  facilities: FacilityFeature[];
  selectedFacility: FacilityFeature | null;
  onSelectFacility: (f: FacilityFeature) => void;
}

export default function MapViewComponent({ facilities, selectedFacility, onSelectFacility }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<L.LayerGroup>(L.layerGroup());
  const routingRef = useRef<any>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const userPosRef = useRef<[number, number] | null>(null);

  const [mapView, setMapView] = useState<MapViewType>('street');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [routing, setRouting] = useState<{ dest: FacilityFeature; mode: TravelMode; distance: string; duration: string } | null>(null);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true }).setView([-0.004, 34.606], 15);
    mapRef.current = map;
    const tile = L.tileLayer(tileLayers.street.url, { attribution: tileLayers.street.attr, maxZoom: 19 });
    tile.addTo(map);
    tileRef.current = tile;
    layersRef.current.addTo(map);

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Change tile layer
  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    tileRef.current.setUrl(tileLayers[mapView].url);
  }, [mapView]);

  // Render facilities (skip room sub-features — they share parent geometry)
  useEffect(() => {
    const group = layersRef.current;
    group.clearLayers();

    const renderedFacilities = facilities.filter(f => !f._isRoom);

    renderedFacilities.forEach(f => {
      const color = categoryColors[f._category];

      if (f._category === 'wifi_points') {
        const marker = L.marker([f._center[0], f._center[1]], {
          icon: L.divIcon({
            className: '',
            html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${wifiIconSvg}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })
        });
        marker.on('click', () => onSelectFacility(f));
        marker.bindPopup(buildPopup(f), { className: 'facility-popup', maxWidth: 350 });
        marker.addTo(group);
      } else if (f._category === 'tv_lounge') {
        const marker = L.marker([f._center[0], f._center[1]], {
          icon: L.divIcon({
            className: '',
            html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${tvIconSvg}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          })
        });
        marker.on('click', () => onSelectFacility(f));
        marker.bindPopup(buildPopup(f), { className: 'facility-popup', maxWidth: 350 });
        marker.addTo(group);
      } else if (f.geometry.type === 'Point') {
        const marker = L.circleMarker([f._center[0], f._center[1]], {
          radius: 8, color, fillColor: color, fillOpacity: 0.7, weight: 2,
        });
        marker.on('click', () => onSelectFacility(f));
        marker.bindPopup(buildPopup(f), { className: 'facility-popup', maxWidth: 350 });
        marker.addTo(group);
      } else {
        const geoLayer = L.geoJSON(f.geometry, {
          style: { color, fillColor: color, fillOpacity: 0.35, weight: 2 },
        });
        geoLayer.on('click', () => onSelectFacility(f));
        geoLayer.bindPopup(buildPopup(f), { className: 'facility-popup', maxWidth: 350 });
        geoLayer.addTo(group);
      }
    });
  }, [facilities, onSelectFacility]);

  // Handle selected facility
  useEffect(() => {
    if (!selectedFacility || !mapRef.current) return;
    mapRef.current.setView(selectedFacility._center, 18, { animate: true });

    L.popup({ className: 'facility-popup', maxWidth: 350 })
      .setLatLng(selectedFacility._center)
      .setContent(buildPopup(selectedFacility))
      .openOn(mapRef.current);
  }, [selectedFacility]);

  function buildPopup(f: FacilityFeature): string {
    const props = f.properties;
    let html = `<div class="p-3"><h3 class="font-bold text-sm mb-2" style="color: ${categoryColors[f._category]}">${f._name}</h3>`;
    html += `<p class="text-xs text-gray-500 mb-2 capitalize">${f._category.replace(/_/g, ' ')}</p>`;

    if (f._category === 'hostels') {
      html += `<div class="space-y-1 text-xs"><p>👤 Gender: <b>${props.Gender}</b></p><p>💰 Price: <b>KES ${props.Price?.toLocaleString()}</b></p><p>🛏️ Per Room: <b>${props['Capacity Per Room']}</b></p></div>`;
    } else if (f._category === 'lecture_halls') {
      // Check if this building has rooms attached
      const buildingName = (props.Name || '').trim().toUpperCase();
      const matchKey = Object.keys(buildingRooms).find(k => buildingName.includes(k));
      
      if (f._isRoom) {
        // Show individual room details
        html += `<p class="text-xs">🏢 Building: <b>${f._parentBuilding}</b></p>`;
        html += `<p class="text-xs">🏗️ Floor: <b>${props.floor_number}</b></p>`;
        if (props['LECTURE CAPACITY']) html += `<p class="text-xs">📚 Lecture: <b>${props['LECTURE CAPACITY']}</b></p>`;
        if (props['EXAMINATION CAPACITY']) html += `<p class="text-xs">📝 Exam: <b>${props['EXAMINATION CAPACITY']}</b></p>`;
        if (props['CURRENT NUMBER OF SEATS']) html += `<p class="text-xs">💺 Seats: <b>${props['CURRENT NUMBER OF SEATS']}</b></p>`;
      } else if (matchKey) {
        // Show rooms table for buildings with room data
        const rooms = buildingRooms[matchKey];
        html += `<div class="text-xs max-h-48 overflow-y-auto"><table class="w-full"><thead><tr style="border-bottom:1px solid #ddd"><th class="text-left py-0.5 px-1">Room</th><th class="text-right py-0.5 px-1">Floor</th><th class="text-right py-0.5 px-1">Lec.</th><th class="text-right py-0.5 px-1">Exam</th><th class="text-right py-0.5 px-1">Seats</th></tr></thead><tbody>`;
        rooms.forEach(room => {
          html += `<tr style="border-bottom:1px solid #eee"><td class="py-0.5 px-1">${room.name}</td><td class="py-0.5 px-1 text-right">${room.floorNumber}</td><td class="py-0.5 px-1 text-right">${room.lectureCapacity ?? '-'}</td><td class="py-0.5 px-1 text-right">${room.examCapacity ?? '-'}</td><td class="py-0.5 px-1 text-right">${room.currentSeats ?? '-'}</td></tr>`;
        });
        html += `</tbody></table></div>`;
      } else {
        if (props['LECTURE CAPACITY']) html += `<p class="text-xs">📚 Lecture: <b>${props['LECTURE CAPACITY']}</b></p>`;
        if (props['EXAMINATION CAPACITY']) html += `<p class="text-xs">📝 Exam: <b>${props['EXAMINATION CAPACITY']}</b></p>`;
        if (props['CURRENT NUMBER OF SEATS']) html += `<p class="text-xs">💺 Seats: <b>${props['CURRENT NUMBER OF SEATS']}</b></p>`;
      }
    } else if (f._category === 'labs') {
      html += `<p class="text-xs">👥 Capacity: <b>${props.CAPACITY}</b></p>`;
    } else if (f._category === 'administration') {
      html += `<p class="text-xs">📋 Type: <b>${props.type}</b></p>`;
    } else if (f._category === 'wifi_points') {
      html += `<p class="text-xs">📶 Network: <b>${props.wifi_name}</b></p>`;
      html += `<p class="text-xs">🔑 Password: <b>${props.PASSWORD}</b></p>`;
    } else if (f._category === 'tv_lounge') {
      html += `<p class="text-xs">📺 TV Lounge</p>`;
    } else if (f._category === 'cafeteria') {
      html += `<div class="text-xs max-h-48 overflow-y-auto"><table class="w-full"><thead><tr style="border-bottom:1px solid #ddd"><th class="text-left py-0.5 px-1">#</th><th class="text-left py-0.5 px-1">Item</th><th class="text-right py-0.5 px-1">KES</th></tr></thead><tbody>`;
      cafeteriaMenu.forEach(item => {
        html += `<tr style="border-bottom:1px solid #eee"><td class="py-0.5 px-1" style="color:#888">${item.code}</td><td class="py-0.5 px-1">${item.name}</td><td class="py-0.5 px-1 text-right" style="font-weight:600">${item.price}/-</td></tr>`;
      });
      html += `</tbody></table></div>`;
    }

    html += `<button onclick="window.__navigateTo(${f._center[0]}, ${f._center[1]}, '${f._name.replace(/'/g, "\\'")}')" class="mt-3 w-full text-xs py-1.5 rounded-md" style="background: ${categoryColors[f._category]}; color: white; border: none; cursor: pointer;">🧭 Navigate here</button>`;
    html += `</div>`;
    return html;
  }

  // Global navigate function
  useEffect(() => {
    (window as any).__navigateTo = (lat: number, lng: number, name: string) => {
      const dest = facilities.find(f => f._center[0] === lat && f._center[1] === lng);
      if (dest) startRouting(dest, 'driving');
    };
    return () => { delete (window as any).__navigateTo; };
  }, [facilities]);

  const routeMarkersRef = useRef<L.Marker[]>([]);

  const clearRouteMarkers = () => {
    routeMarkersRef.current.forEach(m => { if (mapRef.current) mapRef.current.removeLayer(m); });
    routeMarkersRef.current = [];
  };

  const startRouting = useCallback((dest: FacilityFeature, mode: TravelMode) => {
    if (!mapRef.current) return;
    if (routingRef.current) {
      mapRef.current.removeControl(routingRef.current);
      routingRef.current = null;
    }
    clearRouteMarkers();

    const start = userPosRef.current || [-0.004, 34.606] as [number, number];
    const profile = mode === 'driving' ? 'car' : mode === 'walking' ? 'foot' : 'bike';

    // Add start marker
    const startMarker = L.marker(start, {
      icon: L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;border-radius:50%;background:#2c3e50;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold">A</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })
    }).addTo(mapRef.current).bindPopup('📍 Start');

    // Add destination marker
    const destMarker = L.marker(dest._center, {
      icon: L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${categoryColors[dest._category]};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold">B</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })
    }).addTo(mapRef.current).bindPopup(`🏁 ${dest._name}`);

    routeMarkersRef.current = [startMarker, destMarker];

    const control = (L as any).Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(dest._center[0], dest._center[1])],
      router: (L as any).Routing.osrmv1({ serviceUrl: 'https://router.project-osrm.org/route/v1', profile }),
      lineOptions: { styles: [{ color: categoryColors[dest._category], weight: 6, opacity: 0.8 }] },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null,
    }).addTo(mapRef.current);

    control.on('routesfound', (e: any) => {
      const route = e.routes[0];
      const dist = route.summary.totalDistance;
      const time = route.summary.totalTime;
      const distStr = dist > 1000 ? `${(dist / 1000).toFixed(2)} km` : `${Math.round(dist)} m`;
      const mins = Math.round(time / 60);
      const durStr = mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} min`;
      setRouting({ dest, mode, distance: distStr, duration: durStr });
    });

    control.on('routingerror', () => {
      setRouting({ dest, mode, distance: 'N/A', duration: 'N/A' });
    });

    routingRef.current = control;
    setRouting({ dest, mode, distance: '...', duration: '...' });
  }, []);

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
      const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      userPosRef.current = latlng;
      if (mapRef.current) {
        mapRef.current.setView(latlng, 17);
        if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current);
        if (userCircleRef.current) mapRef.current.removeLayer(userCircleRef.current);

        userCircleRef.current = L.circle(latlng, {
          radius: pos.coords.accuracy,
          color: '#2c3e50',
          weight: 1,
          fillColor: '#2c3e50',
          fillOpacity: 0.1,
        }).addTo(mapRef.current);

        userMarkerRef.current = L.marker(latlng, {
          icon: L.divIcon({
            className: 'user-location-marker',
            html: `<div style="width:16px;height:16px;border-radius:50%;background:#2c3e50;border:3px solid white;box-shadow:0 0 8px rgba(0,0,0,0.3)"></div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          })
        }).addTo(mapRef.current).bindPopup('📍 You are here').openPopup();
      }
    }, (error) => alert('Unable to retrieve your location: ' + error.message),
    { enableHighAccuracy: true, timeout: 10000 });
  };

  const clearRouting = () => {
    if (routingRef.current && mapRef.current) {
      mapRef.current.removeControl(routingRef.current);
      routingRef.current = null;
    }
    clearRouteMarkers();
    setRouting(null);
  };

  return (
    <div className="relative flex-1 h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* Layer switcher */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={() => setShowLayerMenu(p => !p)}
          className="bg-card shadow-lg rounded-lg p-2.5 hover:bg-muted transition-colors"
        >
          <Layers className="w-5 h-5 text-foreground" />
        </button>
        {showLayerMenu && (
          <div className="absolute right-0 mt-2 bg-card rounded-lg shadow-xl p-1 w-36 animate-fade-in">
            {(['street', 'satellite', 'terrain'] as MapViewType[]).map(v => (
              <button
                key={v}
                onClick={() => { setMapView(v); setShowLayerMenu(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-xs capitalize transition-colors ${
                  mapView === v ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                }`}
              >
                {v === 'street' ? '🗺️ Street (OSM)' : v === 'satellite' ? '🛰️ Satellite' : '⛰️ Terrain'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locate button */}
      <button
        onClick={locateUser}
        className="absolute bottom-8 right-4 z-[1000] bg-card shadow-lg rounded-lg p-2.5 hover:bg-muted transition-colors"
        title="My Location"
      >
        <Locate className="w-5 h-5 text-primary" />
      </button>

      {/* Routing panel */}
      {routing && (
        <RoutingPanel
          destination={routing.dest._name}
          mode={routing.mode}
          onModeChange={m => startRouting(routing.dest, m)}
          distance={routing.distance}
          duration={routing.duration}
          onClose={clearRouting}
        />
      )}
    </div>
  );
}
