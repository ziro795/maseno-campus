import { Car, Footprints, Bike, X, Clock, Ruler } from 'lucide-react';
import type { TravelMode } from '@/types/facilities';

interface RoutingPanelProps {
  destination: string;
  mode: TravelMode;
  onModeChange: (m: TravelMode) => void;
  distance: string;
  duration: string;
  onClose: () => void;
}

const modes: { value: TravelMode; icon: any; label: string }[] = [
  { value: 'driving', icon: Car, label: 'Drive' },
  { value: 'walking', icon: Footprints, label: 'Walk' },
  { value: 'cycling', icon: Bike, label: 'Cycle' },
];

export default function RoutingPanel({ destination, mode, onModeChange, distance, duration, onClose }: RoutingPanelProps) {
  return (
    <div className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-auto sm:top-4 sm:w-72 z-[1000] bg-card rounded-xl shadow-xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-foreground">Directions</h3>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-3 truncate">To: <span className="font-medium text-foreground">{destination}</span></p>
      
      <div className="flex gap-1 mb-3">
        {modes.map(m => (
          <button
            key={m.value}
            onClick={() => onModeChange(m.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              mode === m.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <m.icon className="w-3.5 h-3.5" />
            {m.label}
          </button>
        ))}
      </div>

      {distance && (
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-foreground">
            <Ruler className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{distance}</span>
          </div>
          <div className="flex items-center gap-1.5 text-foreground">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">{duration}</span>
          </div>
        </div>
      )}
    </div>
  );
}
