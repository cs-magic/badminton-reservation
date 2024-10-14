export interface BookingSlot {
  start_time: string; // HH:MM 格式
  end_time: string; // HH:MM 格式
  place: string;
  available_count: number;
}

export interface PlaceInfo {
  name: string;
  abbreviation: string;
  longitude: number;
  latitude: number;
  addressType: string;
  coordinateSystem: string;
}

export const PLACES: PlaceInfo[] = [
  {
    name: "北科大体育馆",
    abbreviation: "北科大体育馆",
    longitude: 113.9464959875219,
    latitude: 22.53159997324487,
    addressType: "商务大厦",
    coordinateSystem: "bd09"
  },
  {
    name: "清华大学气膜馆羽毛球场",
    abbreviation: "清华气膜馆",
    longitude: 116.33337396094367,
    latitude: 40.009645090734296,
    addressType: "教育",
    coordinateSystem: "bd09"
  },
  {
    name: "清华大学综体羽毛球场",
    abbreviation: "清华综体",
    longitude: 116.33337396094367,
    latitude: 40.009645090734296,
    addressType: "教育",
    coordinateSystem: "bd09"
  },
  {
    name: "清华大学西体羽毛球场",
    abbreviation: "清华西体",
    longitude: 116.33337396094367,
    latitude: 40.009645090734296,
    addressType: "教育",
    coordinateSystem: "bd09"
  }
];

export type Place = typeof PLACES[number]['name'];

export const PLACE_ABBREVIATIONS: Record<Place, string> = Object.fromEntries(
  PLACES.map(place => [place.name, place.abbreviation])
);
