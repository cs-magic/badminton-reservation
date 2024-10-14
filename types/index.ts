export interface BookingSlot {
  start_time: string; // HH:MM 格式
  end_time: string; // HH:MM 格式
  place: string;
  available_count: number;
}

export const PLACES = [
  "北科大体育馆",
  "清华大学气膜馆羽毛球场",
  "清华大学综体羽毛球场",
  "清华大学西体羽毛球场"
] as const;

export type Place = typeof PLACES[number];

export const PLACE_ABBREVIATIONS: Record<Place, string> = {
  "北科大体育馆": "北科大体育馆",
  "清华大学气膜馆羽毛球场": "清华气膜馆",
  "清华大学综体羽毛球场": "清华综体",
  "清华大学西体羽毛球场": "清华西体"
};
