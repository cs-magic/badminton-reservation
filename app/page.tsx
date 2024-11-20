'use client';

import { useState, useEffect, useCallback, useRef } from "react";

import DatePicker from "../components/DatePicker";
import MapSelector from "../components/MapSelector";
import SwimLaneChart from "../components/SwimLaneChart";
import { type BookingSlot, type Place, PLACES } from "../types";

import { getBookingData } from "./getBookingData";



export default function Home() {
  const [bookingData, setBookingData] = useState<BookingSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handlePlaceChange = useCallback((places: Place[]) => {
    setSelectedPlaces(places);
  }, []);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  useEffect(() => {
    if (selectedPlaces.length > 0 && selectedDate) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      const dateString = selectedDate.toISOString().split('T')[0];

      Promise.all(selectedPlaces.map(place => 
        getBookingData(dateString, place)
      )).then(allData => {
        setBookingData(allData.flat());
        setIsLoading(false);
      }).catch(error => {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Fetch error:', error);
        }
        setIsLoading(false);
      });
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedPlaces, selectedDate]);

  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
        羽毛球场地预约
      </h1>
      <div className="card p-6">
        <MapSelector onPlacesSelected={handlePlaceChange} />
        <DatePicker isLoading={isLoading} selectedDate={selectedDate} onDateChange={handleDateChange} />
        <SwimLaneChart bookingData={bookingData} selectedDate={selectedDate} selectedPlaces={selectedPlaces} />
      </div>
    </main>
  );
}
