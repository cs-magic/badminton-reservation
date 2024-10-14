import { BookingSlot, PLACES } from '../types';
import { useState, useCallback, useEffect, useMemo } from 'react';
import PlaceFilter from './PlaceFilter';
import React from 'react';

interface SwimLaneChartProps {
  bookingData: BookingSlot[];
  onPlaceChange: (places: string[]) => void;
  selectedDate: Date;
}

export default function SwimLaneChart({ bookingData, onPlaceChange, selectedDate }: SwimLaneChartProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([...PLACES]);

  const handlePlaceToggle = useCallback((place: string) => {
    setSelectedPlaces(prev => {
      const newSelectedPlaces = prev.includes(place)
        ? prev.filter(p => p !== place)
        : [...prev, place];
      return newSelectedPlaces;
    });
  }, []);

  useEffect(() => {
    onPlaceChange(selectedPlaces);
  }, [selectedPlaces, onPlaceChange]);

  const { timeSlots, groupedBookingData } = useMemo(() => {
    let earliestTime = '23:59';
    let latestTime = '00:00';
    
    const grouped = bookingData.reduce((acc, slot) => {
      if (!acc[slot.place]) {
        acc[slot.place] = [];
      }
      acc[slot.place].push(slot);
      
      earliestTime = slot.start_time < earliestTime ? slot.start_time : earliestTime;
      latestTime = slot.end_time > latestTime ? slot.end_time : latestTime;
      return acc;
    }, {} as Record<string, BookingSlot[]>);

    const startHour = Math.floor(parseInt(earliestTime.split(':')[0]));
    const endHour = Math.ceil(parseInt(latestTime.split(':')[0]) + parseInt(latestTime.split(':')[1]) / 60);

    const slots = Array.from({ length: (endHour - startHour) * 2 }, (_, i) => {
      const hour = startHour + Math.floor(i / 2);
      const minute = i % 2 === 0 ? '00' : '30';
      return `${hour.toString().padStart(2, '0')}:${minute}`;
    });

    return { timeSlots: slots, groupedBookingData: grouped };
  }, [bookingData]);

  return (
    <div className="space-y-6">
      <PlaceFilter
        places={[...PLACES]}
        selectedPlaces={selectedPlaces}
        onPlaceToggle={handlePlaceToggle}
      />
      <div className="relative overflow-x-auto">
        <div className="flex">
          <div className="w-16 flex-shrink-0"></div>
          {selectedPlaces.map(place => (
            <div key={place} className="flex-1 text-center text-sm font-medium p-2 border-r border-gray-200">
              {place}
            </div>
          ))}
        </div>
        <div className="flex justify-end py-2 bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4 px-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 mr-2"></div>
              <span className="text-xs">可预订</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 mr-2"></div>
              <span className="text-xs">不可预订</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-200 mr-2"></div>
              <span className="text-xs">无数据</span>
            </div>
          </div>
        </div>
        <div className="relative">
          {timeSlots.map((time, index) => (
            <div key={time} className="flex">
              <div className="w-16 flex-shrink-0 relative">
                {index % 2 === 0 && (
                  <span className="absolute right-2 top-0 -translate-y-1/2 text-xs text-gray-500">
                    {time}
                  </span>
                )}
              </div>
              {selectedPlaces.map(place => {
                const slot = groupedBookingData[place]?.find(s => 
                  s.start_time <= time && s.end_time > time
                );
                return (
                  <div key={`${time}-${place}`} className="flex-1 h-8 border-r border-t border-gray-200 relative">
                    <div className={`absolute inset-0 ${slot ? (slot.available_count > 0 ? 'bg-green-100' : 'bg-gray-100') : 'bg-white'}`}>
                      {slot && slot.available_count > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-green-800">
                            {/* {slot.available_count} */}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
