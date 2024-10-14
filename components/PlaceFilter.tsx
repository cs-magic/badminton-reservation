import React from 'react';

interface PlaceFilterProps {
  places: string[];
  selectedPlaces: string[];
  onPlaceToggle: (place: string) => void;
}

export default function PlaceFilter({ places, selectedPlaces, onPlaceToggle }: PlaceFilterProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">场地选择</h2>
      <div className="flex flex-wrap gap-3">
        {places.map(place => (
          <label key={place} className="inline-flex items-center bg-white border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPlaces.includes(place)}
              onChange={() => onPlaceToggle(place)}
              className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{place}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
