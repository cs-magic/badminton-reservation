'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import SwimLaneChart from "../components/SwimLaneChart";
import DatePicker from "../components/DatePicker";
import { BookingSlot, Place, PLACES } from "../types";
import { getMockBookingData } from "./getMockBookingData";

export default function Home() {
  const [bookingData, setBookingData] = useState<BookingSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handlePlaceChange = useCallback(async (places: Place[]) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    const dateString = selectedDate.toISOString().split('T')[0];

    try {
      const allData = await Promise.all(places.map(place => 
        getMockBookingData(dateString, place)
      ));
      setBookingData(allData.flat());
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Fetch error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const handleDateChange = useCallback(async (date: Date) => {
    setSelectedDate(date);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    const dateString = date.toISOString().split('T')[0];

    try {
      const allData = await Promise.all(PLACES.map(place => 
        getMockBookingData(dateString, place)
      ));
      setBookingData(allData.flat());
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Fetch error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      handlePlaceChange(PLACES);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [handlePlaceChange]);

  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
        羽毛球场地预约
      </h1>
      <div className="card p-6">
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} isLoading={isLoading} />
        <SwimLaneChart bookingData={bookingData} onPlaceChange={handlePlaceChange} selectedDate={selectedDate} />
      </div>
    </main>
  );
}
