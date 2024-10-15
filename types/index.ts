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

/**
 * fixed lng/lat via Baidu Map via limiting the city to be "北京"
 * try it at: https://api.cs-magic.cn/docs#/Map/baidu_geocoding_map_baidu_geocoding_get
 */
export const PLACES: PlaceInfo[] = [
  {
    name: "北科大体育馆",
    abbreviation: "北科大体育馆",
    longitude: 116.36878597262196,
    latitude: 39.996240052065495,
    addressType: "商务大厦",
    coordinateSystem: "bd09"
  },
  {
    name: "清华大学气膜馆",
    abbreviation: "清华气膜馆",
    longitude: 116.33337396094367,
    latitude: 40.009645090734296,
    addressType: "教育",
    coordinateSystem: "bd09"
  },
  {
    name: "清华大学综合体育馆",
    abbreviation: "清华综体",
    longitude: 116.33896330765732,
    latitude: 40.01007248455777,
    addressType: "教育",
    coordinateSystem: "bd09"
  },
  {
    name: "清华大学西区体育馆",
    abbreviation: "清华西体",
    longitude:  116.32784614815749,
    latitude: 40.010847547774894,
    addressType: "教育",
    coordinateSystem: "bd09"
  }
];

export type Place = typeof PLACES[number]['name'];

export const PLACE_ABBREVIATIONS: Record<Place, string> = Object.fromEntries(
  PLACES.map(place => [place.name, place.abbreviation])
);
