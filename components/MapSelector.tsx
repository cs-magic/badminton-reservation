import { useEffect, useRef, useState } from "react";

import { type Place, PLACES } from "../types";

interface MapSelectorProps {
  onPlacesSelected: (places: Place[]) => void;
}

declare global {
  interface Window {
    BMap: any;
    BMAP_STATUS_SUCCESS: number;
  }
}

export default function MapSelector({ onPlacesSelected }: MapSelectorProps) {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    if (mapRef.current && !map && window.BMap) {
      const bmap = new window.BMap.Map(mapRef.current);
      setMap(bmap);

      // 创建地图实例
      const point = new window.BMap.Point(116.404, 39.915); // 默认北京坐标
      bmap.centerAndZoom(point, 12);
      bmap.enableScrollWheelZoom(true);

      // 添加地图控件
      bmap.addControl(new window.BMap.NavigationControl());
      bmap.addControl(new window.BMap.ScaleControl());
      bmap.addControl(new window.BMap.OverviewMapControl());
      bmap.addControl(new window.BMap.MapTypeControl());

      // 在用户位置周围添加场地标记
      addPlaceMarkers(bmap);

      // 获取用户位置
      const geolocation = new window.BMap.Geolocation();
      geolocation.getCurrentPosition((r: any) => {
        if (geolocation.getStatus() === window.BMAP_STATUS_SUCCESS) {
          const mk = new window.BMap.Marker(r.point);
          bmap.addOverlay(mk);
          bmap.panTo(r.point);
        } else {
          console.log("Failed to get user location:", geolocation.getStatus());
        }
      });
    }
  }, [mapRef]);

  const addPlaceMarkers = (bmap: any) => {
    PLACES.forEach((placeInfo) => {
      const point = new window.BMap.Point(
        placeInfo.longitude,
        placeInfo.latitude
      );
      const marker = new window.BMap.Marker(point);
      bmap.addOverlay(marker);

      const label = new window.BMap.Label(placeInfo.abbreviation, {
        offset: new window.BMap.Size(20, -10),
      });
      marker.setLabel(label);

      marker.addEventListener("click", () => handlePlaceToggle(placeInfo.name));
    });
  };

  const handlePlaceToggle = (place: Place) => {
    setSelectedPlaces((prev) => {
      const newSelectedPlaces = prev.includes(place)
        ? prev.filter((p) => p !== place)
        : [...prev, place];
      onPlacesSelected(newSelectedPlaces);
      return newSelectedPlaces;
    });
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">选择附近场地</h2>
      <div
        ref={mapRef}
        className="w-full h-64 bg-gray-200 rounded-lg mb-4"
      ></div>
      <div className="flex flex-wrap gap-3">
        {PLACES.map((placeInfo) => (
          <label
            key={placeInfo.name}
            className="inline-flex items-center bg-white border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <input
              checked={selectedPlaces.includes(placeInfo.name)}
              className="form-checkbox h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
              type="checkbox"
              onChange={() => handlePlaceToggle(placeInfo.name)}
            />
            <span className="ml-2 text-sm text-gray-700">
              {placeInfo.abbreviation}
            </span>
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        如果您附近没有合适的体育馆，请联系我们的工作人员（微信：youshouldspeakhow）提交新的体育馆信息。
      </p>
    </div>
  );
}
