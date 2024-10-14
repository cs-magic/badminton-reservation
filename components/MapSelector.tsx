'use client'

import { useState } from 'react';
import { Place, PLACE_ABBREVIATIONS, PLACES } from '../types';

import { InfoWindow, Map, Marker, NavigationControl } from 'react-bmapgl';


interface MapSelectorProps {
  onPlacesSelected: (places: Place[]) => void;
}


export default function MapSelector({ onPlacesSelected }: MapSelectorProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

  const handlePlaceToggle = (place: Place) => {
    setSelectedPlaces(prev => {
      const newSelectedPlaces = prev.includes(place)
        ? prev.filter(p => p !== place)
        : [...prev, place];
      onPlacesSelected(newSelectedPlaces);
      return newSelectedPlaces;
    });
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">选择附近场地</h2>
      <div  className="w-full h-64 bg-gray-200 rounded-lg mb-4">
      <Map center={{lng: 116.402544, lat: 39.928216}} zoom="11">
            <Marker position={{lng: 116.402544, lat: 39.928216}} />
            <NavigationControl /> 
            <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/>
        </Map>
      </div>
      <div className="flex flex-wrap gap-3">
        {PLACES.map(place => (
          <label key={place} className="inline-flex items-center bg-white border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedPlaces.includes(place)}
              onChange={() => handlePlaceToggle(place)}
              className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">{PLACE_ABBREVIATIONS[place]}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        如果您附近没有合适的体育馆，请联系我们的工作人员（微信：youshouldspeakhow）提交新的体育馆信息。
      </p>
    </div>
  );
}
