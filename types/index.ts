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
    latitude: 39.996240052065495
  },
  {
    name: "清华大学气膜馆",
    abbreviation: "清华气膜馆",
    longitude: 116.337926,
    latitude: 40.018185
  },
  {
    name: "清华大学综合体育馆",
    abbreviation: "清华综体",
    longitude: 116.338963,
    latitude: 40.010072
  },
  {
    name: "清华大学西区体育馆",
    abbreviation: "清华西体",
    longitude:  116.327846,
    latitude: 40.010848
  }
];

export type Place = typeof PLACES[number]['name'];

export const PLACE_ABBREVIATIONS: Record<Place, string> = Object.fromEntries(
  PLACES.map(place => [place.name, place.abbreviation])
);
