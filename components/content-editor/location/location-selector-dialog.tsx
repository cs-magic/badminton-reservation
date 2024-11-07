import { Button } from "@cs-magic/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cs-magic/shadcn/ui/dialog";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface LocationSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectLocation: (
    location: { lat: number; lng: number; name: string } | null,
  ) => void;
  selectedLocation: { lat: number; lng: number; name: string } | null;
}

const defaultCenter = {
  lat: 39.915,
  lng: 116.404,
};

export function LocationSelectorDialog({
  open,
  onOpenChange,
  onSelectLocation,
  selectedLocation,
}: LocationSelectorDialogProps) {
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    // 使用 Google Geocoding 服务获取地址信息
    const geocoder = new google.maps.Geocoder();
    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        onSelectLocation({
          lat,
          lng,
          name: response.results[0].formatted_address,
        });
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>选择位置</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
          >
            <GoogleMap
              mapContainerClassName="w-full h-[400px] rounded-lg"
              center={selectedLocation || defaultCenter}
              zoom={12}
              onClick={handleMapClick}
            >
              {selectedLocation && (
                <Marker
                  position={{
                    lat: selectedLocation.lat,
                    lng: selectedLocation.lng,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>

          {selectedLocation && (
            <div className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
              <span className="text-sm">{selectedLocation.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectLocation(null)}
              >
                ✕
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
