import { cn } from "@cs-magic/shadcn/lib/utils";
import { useMemo } from "react";
import { BookingSlot, PLACE_ABBREVIATIONS, Place } from "../types";

interface SwimLaneChartProps {
  bookingData: BookingSlot[];
  selectedPlaces: Place[];
  selectedDate: Date;
}

export default function SwimLaneChart({
  bookingData,
  selectedPlaces,
  selectedDate,
}: SwimLaneChartProps) {
  // Remove the state and callbacks related to place selection
  // The rest of the component remains largely the same

  // 计算时间槽和分组预订数据
  const { timeSlots, groupedBookingData } = useMemo(() => {
    let earliestTime = "23:59";
    let latestTime = "00:00";

    // 按场地分组预订数据
    const grouped = bookingData.reduce(
      (acc, slot) => {
        if (!acc[slot.place]) {
          acc[slot.place] = [];
        }
        acc[slot.place].push(slot);

        // 更新最早和最晚时间
        earliestTime =
          slot.start_time < earliestTime ? slot.start_time : earliestTime;
        latestTime = slot.end_time > latestTime ? slot.end_time : latestTime;
        return acc;
      },
      {} as Record<string, BookingSlot[]>
    );

    // 计算时间槽
    const startHour = Math.floor(parseInt(earliestTime.split(":")[0]));
    const endHour = Math.ceil(
      parseInt(latestTime.split(":")[0]) +
        parseInt(latestTime.split(":")[1]) / 60
    );

    const slots = Array.from({ length: (endHour - startHour) * 2 }, (_, i) => {
      const hour = startHour + Math.floor(i / 2);
      const minute = i % 2 === 0 ? "00" : "30";
      return `${hour.toString().padStart(2, "0")}:${minute}`;
    });

    return { timeSlots: slots, groupedBookingData: grouped };
  }, [bookingData]);

  console.log({ bookingData });

  return (
    <div className="space-y-6">
      <div className="relative overflow-x-auto">
        {/* 场地标题行 */}
        <div className="flex">
          <div className="w-16 flex-shrink-0"></div>
          {selectedPlaces.map((place) => (
            <div
              key={place}
              className="flex-1 text-center text-sm font-medium p-2 border-r border-gray-200"
            >
              {PLACE_ABBREVIATIONS[place]}
            </div>
          ))}
        </div>
        {/* 图例 */}
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
              <div className="w-4 h-4 bg-white mr-2"></div>
              <span className="text-xs">无数据</span>
            </div>
          </div>
        </div>
        {/* 时间槽网格 */}
        <div className="relative">
          {timeSlots.map((time, index) => (
            <div key={time} className="flex">
              {/* 时间标签 */}
              <div className="w-16 flex-shrink-0 relative">
                {time.endsWith("00") && (
                  <span className="absolute right-2 top-0 -translate-y-1/2 text-xs text-gray-500">
                    {time}
                  </span>
                )}
              </div>
              {/* 每个场地的时间槽 */}
              {selectedPlaces.map((place) => {
                const slot = groupedBookingData[place]?.find(
                  (s) => s.start_time <= time && s.end_time > time
                );
                const isAvailable = slot && slot.available_count > 0;
                const isHourBoundary = time.endsWith("00");
                const shouldHideBorder =
                  slot &&
                  (time.endsWith("30") ||
                    (time.endsWith("00") &&
                      slot.start_time <= time &&
                      time < slot.end_time));

                return (
                  <div
                    key={`${time}-${place}`}
                    className={cn(
                      `flex-1 h-8 relative border-r border-gray-200`,
                      isHourBoundary && "border-t",
                      // shouldHideBorder ? 'border-t-transparent' : 'border-t-gray-200'
                      !shouldHideBorder && "border-t-transparent"
                    )}
                  >
                    {/* 时间槽背景 */}
                    <div
                      className={`absolute inset-0 ${
                        slot
                          ? isAvailable
                            ? "bg-green-500/50"
                            : "bg-gray-100"
                          : "bg-white"
                      }`}
                    >
                      {isAvailable && (
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
