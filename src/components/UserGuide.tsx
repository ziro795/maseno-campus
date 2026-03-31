import { X, Search, Filter, Navigation, MapPin, Layers } from 'lucide-react';

interface UserGuideProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { icon: Search, title: 'Search Facilities', desc: 'Use the search bar at the top of the sidebar to find any facility by name across all categories.' },
  { icon: Filter, title: 'Filter by Category', desc: 'Click a category to expand it. Use the filter controls (gender, price, capacity, type) to narrow results.' },
  { icon: MapPin, title: 'Select a Facility', desc: 'Click any facility in the list or on the map to view its details and zoom to its location.' },
  { icon: Navigation, title: 'Get Directions', desc: 'Click "Navigate here" on a facility popup or use the routing panel. Choose your travel mode (drive, walk, cycle) to see route, distance, and time.' },
  { icon: Layers, title: 'Change Map View', desc: 'Use the layer control in the top-right corner to switch between Street (OSM), Satellite, and Terrain views.' },
  { icon: MapPin, title: 'Your Location', desc: 'Click the location button (bottom-right) to center the map on your current GPS position. This is also used as the starting point for routing.' },
];

export default function UserGuide({ open, onClose }: UserGuideProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">📖 How to Use Campus Navigator</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-border">
          <button onClick={onClose} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
