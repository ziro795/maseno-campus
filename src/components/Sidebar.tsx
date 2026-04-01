import { useState, useMemo } from 'react';
import { Search, Building2, GraduationCap, FlaskConical, BookOpen, Church, ChevronDown, ChevronRight, X, HelpCircle, Wifi, Tv, UtensilsCrossed, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { FacilityFeature, FacilityCategory, HostelFilters, LectureHallFilters, LabFilters, AdminFilters, WifiFilters } from '@/types/facilities';
import { cafeteriaMenu } from '@/data/cafeteriaMenu';

interface SidebarProps {
  facilities: FacilityFeature[];
  onSelectFacility: (f: FacilityFeature) => void;
  onOpenGuide: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const categoryConfig: Record<FacilityCategory, { label: string; icon: any; colorClass: string }> = {
  hostels: { label: 'Hostels', icon: Building2, colorClass: 'bg-hostel' },
  administration: { label: 'Administration', icon: GraduationCap, colorClass: 'bg-admin' },
  labs: { label: 'Labs', icon: FlaskConical, colorClass: 'bg-lab' },
  lecture_halls: { label: 'Lecture Halls', icon: BookOpen, colorClass: 'bg-lecture' },
  religious_centres: { label: 'Religious Centres', icon: Church, colorClass: 'bg-religious' },
  wifi_points: { label: 'WiFi Points', icon: Wifi, colorClass: 'bg-wifi' },
  tv_lounge: { label: 'TV Lounges', icon: Tv, colorClass: 'bg-tvlounge' },
  cafeteria: { label: 'Cafeteria', icon: UtensilsCrossed, colorClass: 'bg-cafeteria' },
};

export default function Sidebar({ facilities, onSelectFacility, onOpenGuide, collapsed, onToggleCollapse }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [expandedCat, setExpandedCat] = useState<FacilityCategory | null>(null);
  const [hostelFilters, setHostelFilters] = useState<HostelFilters>({ gender: '', minPrice: 0, maxPrice: 100000, capacityPerRoom: null });
  const [lectureFilters, setLectureFilters] = useState<LectureHallFilters>({ minLectureCapacity: 0, minExamCapacity: 0, minSeats: 0 });
  const [labFilters, setLabFilters] = useState<LabFilters>({ minCapacity: 0 });
  const [adminFilters, setAdminFilters] = useState<AdminFilters>({ type: '' });
  const [wifiFilters, setWifiFilters] = useState<WifiFilters>({ wifiName: '' });
  const [showMenu, setShowMenu] = useState(false);
  const [menuSearch, setMenuSearch] = useState('');

  const filtered = useMemo(() => {
    let f = facilities;
    if (search) {
      const s = search.toLowerCase();
      f = f.filter(x => x._name.toLowerCase().includes(s));
    }
    // When not searching, hide room sub-features from the main list
    if (!search) {
      f = f.filter(x => !x._isRoom);
    }
    return f;
  }, [facilities, search]);

  const getFiltered = (cat: FacilityCategory) => {
    let items = filtered.filter(f => f._category === cat);
    if (cat === 'hostels') {
      if (hostelFilters.gender) items = items.filter(i => i.properties.Gender === hostelFilters.gender);
      if (hostelFilters.minPrice > 0) items = items.filter(i => (i.properties.Price || 0) >= hostelFilters.minPrice);
      if (hostelFilters.maxPrice < 100000) items = items.filter(i => (i.properties.Price || 0) <= hostelFilters.maxPrice);
      if (hostelFilters.capacityPerRoom) items = items.filter(i => i.properties['Capacity Per Room'] === hostelFilters.capacityPerRoom);
    }
    if (cat === 'lecture_halls') {
      if (lectureFilters.minLectureCapacity > 0) items = items.filter(i => (i.properties['LECTURE CAPACITY'] || 0) >= lectureFilters.minLectureCapacity);
      if (lectureFilters.minExamCapacity > 0) items = items.filter(i => (i.properties['EXAMINATION CAPACITY'] || 0) >= lectureFilters.minExamCapacity);
      if (lectureFilters.minSeats > 0) items = items.filter(i => (i.properties['CURRENT NUMBER OF SEATS'] || 0) >= lectureFilters.minSeats);
    }
    if (cat === 'labs') {
      if (labFilters.minCapacity > 0) items = items.filter(i => parseInt(i.properties.CAPACITY || '0') >= labFilters.minCapacity);
    }
    if (cat === 'administration') {
      if (adminFilters.type) items = items.filter(i => i.properties.type === adminFilters.type);
    }
    if (cat === 'wifi_points') {
      if (wifiFilters.wifiName) items = items.filter(i => i.properties.wifi_name === wifiFilters.wifiName);
    }
    return items;
  };

  const adminTypes = useMemo(() => {
    const types = new Set(facilities.filter(f => f._category === 'administration').map(f => f.properties.type));
    return Array.from(types).filter(Boolean);
  }, [facilities]);

  const lectureCapacities = useMemo(() => {
    const vals = facilities.filter(f => f._category === 'lecture_halls').map(f => f.properties['LECTURE CAPACITY']).filter(Boolean);
    return [...new Set(vals)].sort((a, b) => a - b);
  }, [facilities]);

  const examCapacities = useMemo(() => {
    const vals = facilities.filter(f => f._category === 'lecture_halls').map(f => f.properties['EXAMINATION CAPACITY']).filter(Boolean);
    return [...new Set(vals)].sort((a, b) => a - b);
  }, [facilities]);

  const currentSeats = useMemo(() => {
    const vals = facilities.filter(f => f._category === 'lecture_halls').map(f => f.properties['CURRENT NUMBER OF SEATS']).filter(Boolean);
    return [...new Set(vals)].sort((a, b) => a - b);
  }, [facilities]);

  const wifiNames = useMemo(() => {
    const names = new Set(facilities.filter(f => f._category === 'wifi_points').map(f => f.properties.wifi_name));
    return Array.from(names).filter(Boolean);
  }, [facilities]);

  const toggle = (cat: FacilityCategory) => setExpandedCat(prev => prev === cat ? null : cat);

  return (
    <div className="w-80 h-full flex flex-col bg-sidebar-bg text-sidebar-fg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-muted">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold tracking-tight">🗺️ Campus Navigator</h1>
          <button onClick={onOpenGuide} className="p-1.5 rounded-md hover:bg-sidebar-muted transition-colors" title="User Guide">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search all facilities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-lg bg-sidebar-muted text-sidebar-fg placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-sidebar-accent transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto sidebar-scroll p-2 space-y-1">
        {(Object.keys(categoryConfig) as FacilityCategory[]).map(cat => {
          const config = categoryConfig[cat];
          const Icon = config.icon;
          const items = getFiltered(cat);
          const isOpen = expandedCat === cat;

          return (
            <div key={cat} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(cat)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-sidebar-muted rounded-lg transition-colors"
              >
                <span className={`w-7 h-7 rounded-md ${config.colorClass} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-primary-foreground" />
                </span>
                <span className="flex-1 text-left text-sm font-medium">{config.label}</span>
                <span className="text-xs text-muted-foreground mr-1">{items.length}</span>
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isOpen && (
                <div className="animate-fade-in px-2 pb-2">
                  {/* Filters */}
                  {cat === 'hostels' && (
                    <div className="bg-sidebar-muted rounded-md p-2.5 mb-2 space-y-2 text-xs">
                      <div className="flex gap-2">
                        <select value={hostelFilters.gender} onChange={e => setHostelFilters(p => ({ ...p, gender: e.target.value }))} className="flex-1 bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg">
                          <option value="">All Genders</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                        <select value={hostelFilters.capacityPerRoom ?? ''} onChange={e => setHostelFilters(p => ({ ...p, capacityPerRoom: e.target.value ? Number(e.target.value) : null }))} className="flex-1 bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg">
                          <option value="">Any Capacity</option>
                          <option value="2">2 per room</option>
                          <option value="4">4 per room</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input type="number" placeholder="Min Price" value={hostelFilters.minPrice || ''} onChange={e => setHostelFilters(p => ({ ...p, minPrice: Number(e.target.value) || 0 }))} className="flex-1 bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg w-0" />
                        <input type="number" placeholder="Max Price" value={hostelFilters.maxPrice < 100000 ? hostelFilters.maxPrice : ''} onChange={e => setHostelFilters(p => ({ ...p, maxPrice: Number(e.target.value) || 100000 }))} className="flex-1 bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg w-0" />
                      </div>
                    </div>
                  )}
                  {cat === 'lecture_halls' && (
                    <div className="bg-sidebar-muted rounded-md p-2.5 mb-2 space-y-2 text-xs">
                      <select value={lectureFilters.minLectureCapacity || ''} onChange={e => setLectureFilters(p => ({ ...p, minLectureCapacity: Number(e.target.value) || 0 }))} className="w-full bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg">
                        <option value="">All Lecture Capacities</option>
                        {lectureCapacities.map(v => <option key={v} value={v}>{v} seats</option>)}
                      </select>
                      <select value={lectureFilters.minExamCapacity || ''} onChange={e => setLectureFilters(p => ({ ...p, minExamCapacity: Number(e.target.value) || 0 }))} className="w-full bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg">
                        <option value="">All Exam Capacities</option>
                        {examCapacities.map(v => <option key={v} value={v}>{v} seats</option>)}
                      </select>
                      <select value={lectureFilters.minSeats || ''} onChange={e => setLectureFilters(p => ({ ...p, minSeats: Number(e.target.value) || 0 }))} className="w-full bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg">
                        <option value="">All Current Seats</option>
                        {currentSeats.map(v => <option key={v} value={v}>{v} seats</option>)}
                      </select>
                    </div>
                  )}
                  {cat === 'labs' && (
                    <div className="bg-sidebar-muted rounded-md p-2.5 mb-2 text-xs">
                      <input type="number" placeholder="Min Capacity" value={labFilters.minCapacity || ''} onChange={e => setLabFilters(p => ({ ...p, minCapacity: Number(e.target.value) || 0 }))} className="w-full bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg" />
                    </div>
                  )}
                  {cat === 'administration' && (
                    <div className="bg-sidebar-muted rounded-md p-2.5 mb-2 text-xs">
                      <select value={adminFilters.type} onChange={e => setAdminFilters(p => ({ ...p, type: e.target.value }))} className="w-full bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg">
                        <option value="">All Types</option>
                        {adminTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  )}
                  {cat === 'wifi_points' && (
                    <div className="bg-sidebar-muted rounded-md p-2.5 mb-2 text-xs">
                      <select value={wifiFilters.wifiName} onChange={e => setWifiFilters(p => ({ ...p, wifiName: e.target.value }))} className="w-full bg-sidebar-bg rounded px-2 py-1 text-sidebar-fg">
                        <option value="">All WiFi Networks</option>
                        {wifiNames.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Cafeteria Menu Table */}
                  {cat === 'cafeteria' && (
                    <div className="bg-sidebar-muted rounded-md p-2.5 mb-2 text-xs">
                      <button
                        onClick={() => setShowMenu(p => !p)}
                        className="w-full text-left font-medium text-sidebar-fg mb-1"
                      >
                        {showMenu ? '▾ Hide Menu' : '▸ View Food Menu'}
                      </button>
                      {showMenu && (
                        <div className="max-h-60 overflow-y-auto sidebar-scroll mt-1">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-sidebar-bg">
                                <th className="text-left py-1 px-1">#</th>
                                <th className="text-left py-1 px-1">Item</th>
                                <th className="text-right py-1 px-1">KES</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cafeteriaMenu.map(item => (
                                <tr key={item.code} className="border-b border-sidebar-bg/50 hover:bg-sidebar-bg/50">
                                  <td className="py-0.5 px-1 text-muted-foreground">{item.code}</td>
                                  <td className="py-0.5 px-1">{item.name}</td>
                                  <td className="py-0.5 px-1 text-right font-medium">{item.price}/-</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Items */}
                  <div className="space-y-0.5 max-h-60 overflow-y-auto sidebar-scroll">
                    {items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectFacility(item)}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-sidebar-muted text-xs transition-colors truncate"
                      >
                        {item._name}
                      </button>
                    ))}
                    {items.length === 0 && <p className="text-xs text-muted-foreground px-3 py-2">No results</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
