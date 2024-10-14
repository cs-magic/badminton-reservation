import { useState, useEffect } from 'react';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [date, setDate] = useState(selectedDate.toISOString().split('T')[0]);

  useEffect(() => {
    setDate(selectedDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    onDateChange(new Date(newDate));
  };

  return (
    <div className="mb-6">
      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
        选择日期
      </label>
      <input
        type="date"
        id="date"
        name="date"
        value={date}
        onChange={handleDateChange}
        className="input"
      />
    </div>
  );
}
