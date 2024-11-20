import debounce from 'lodash/debounce';
import React, { useState, useEffect, useCallback } from 'react';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  isLoading: boolean;
}

export default function DatePicker({ selectedDate, onDateChange, isLoading }: DatePickerProps) {
  const [dayOffset, setDayOffset] = useState(0);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    setDayOffset(diffDays);
  }, [selectedDate]);

  const debouncedDateChange = useCallback(
    debounce((newDate: Date) => {
      onDateChange(newDate);
    }, 300),
    [onDateChange]
  );

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOffset = parseInt(e.target.value);
    setDayOffset(newOffset);
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + newOffset);
    debouncedDateChange(newDate);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('zh-CN', options);
  };

  const getDateFromOffset = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  };

  return (
    <div className="mb-6 relative">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        日期选择: {formatDate(getDateFromOffset(dayOffset))}
      </h2>
      <input
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        disabled={isLoading}
        max="6"
        min="0"
        type="range"
        value={dayOffset}
        onChange={handleSliderChange}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{formatDate(getDateFromOffset(0))}</span>
        <span>{formatDate(getDateFromOffset(6))}</span>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        </div>
      )}
    </div>
  );
}
