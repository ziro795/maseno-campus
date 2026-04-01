import { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import MapViewComponent from '@/components/MapView';
import UserGuide from '@/components/UserGuide';
import { useGeoData } from '@/hooks/useGeoData';
import type { FacilityFeature } from '@/types/facilities';

export default function Index() {
  const { facilities, loading } = useGeoData();
  const [selected, setSelected] = useState<FacilityFeature | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSelect = useCallback((f: FacilityFeature) => setSelected(f), []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading campus data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar facilities={facilities} onSelectFacility={handleSelect} onOpenGuide={() => setGuideOpen(true)} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(p => !p)} />
      <MapViewComponent facilities={facilities} selectedFacility={selected} onSelectFacility={handleSelect} />
      <UserGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
