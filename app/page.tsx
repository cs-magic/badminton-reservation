'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import SwimLaneChart from "../components/SwimLaneChart";
import DatePicker from "../components/DatePicker";
import { BookingSlot } from "../types";
import { PLACES } from "../types";
import { getMockBookingData } from "./getMockBookingData";

export default function Home() {
  const [bookingData, setBookingData] = useState<BookingSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isInitialMount = useRef(true);

  const handlePlaceChange = useCallback(async (places: string[]) => {
    const allData = await Promise.all(places.map(place => getMockBookingData(selectedDate, place)));
    setBookingData(allData.flat());
  }, [selectedDate]);

  const handleDateChange = useCallback(async (date: Date) => {
    setSelectedDate(date);
    const allData = await Promise.all(PLACES.map(place => getMockBookingData(date, place)));
    setBookingData(allData.flat());
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      handlePlaceChange([...PLACES]);
    }
  }, [handlePlaceChange]);

  return (
    <main className="space-y-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
        羽毛球场地预约
      </h1>
      <div className="card p-6">
        <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
        <SwimLaneChart bookingData={bookingData} onPlaceChange={handlePlaceChange} selectedDate={selectedDate} />
      </div>
    </main>
  );
}


