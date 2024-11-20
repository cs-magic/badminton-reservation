import React from 'react';

import type { Place } from '../types';

interface PlaceFilterProps {
  places: Place[];
  selectedPlaces: Place[];
  onPlaceToggle: (place: Place) => void;
  placeAbbreviations: Record<Place, string>;
}

export default function PlaceFilter({ places, selectedPlaces, onPlaceToggle, placeAbbreviations }: PlaceFilterProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">场地选择</h2>
      <div className="flex flex-wrap gap-3">
        {places.map(place => (
          <label key={place} className="inline-flex items-center bg-white border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <input
              checked={selectedPlaces.includes(place)}
              className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
              type="checkbox"
              onChange={() => onPlaceToggle(place)}
            />
            <span className="ml-2 text-sm text-gray-700">{placeAbbreviations[place]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
