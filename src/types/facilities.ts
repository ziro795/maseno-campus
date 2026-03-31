export type FacilityCategory = 'hostels' | 'administration' | 'labs' | 'lecture_halls' | 'religious_centres' | 'wifi_points' | 'tv_lounge' | 'cafeteria';

export interface FacilityFeature {
  type: 'Feature';
  properties: Record<string, any>;
  geometry: any;
  _category: FacilityCategory;
  _center: [number, number]; // [lat, lng]
  _name: string;
}

export interface HostelFilters {
  gender: string;
  minPrice: number;
  maxPrice: number;
  capacityPerRoom: number | null;
}

export interface LectureHallFilters {
  minLectureCapacity: number;
  minExamCapacity: number;
  minSeats: number;
}

export interface LabFilters {
  minCapacity: number;
}

export interface AdminFilters {
  type: string;
}

export interface WifiFilters {
  wifiName: string;
}

export type TravelMode = 'driving' | 'walking' | 'cycling';
export type MapView = 'street' | 'satellite' | 'terrain';
