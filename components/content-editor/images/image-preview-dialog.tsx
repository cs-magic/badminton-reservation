import { StoredImage } from "@/types/editor.ts";
import { X } from "lucide-react";
import React, { useCallback, useMemo } from "react";

interface ImagePreviewDialogProps {
  images: StoredImage[];
  previewIndex: number | null;
  setPreviewIndex: (index: number | null) => void;
}

export function ImagePreviewDialog({
  images,
  previewIndex,
  setPreviewIndex,
}: ImagePreviewDialogProps) {
  const handleClose = useCallback(() => {
    setPreviewIndex(null);
  }, [setPreviewIndex]);

  const handlePrevious = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreviewIndex((prev) =>
        prev !== null ? (prev > 0 ? prev - 1 : images.length - 1) : null,
      );
    },
    [images.length, setPreviewIndex],
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreviewIndex((prev) =>
        prev !== null ? (prev < images.length - 1 ? prev + 1 : 0) : null,
      );
    },
    [images.length, setPreviewIndex],
  );

  const currentImage = useMemo(() => {
    if (previewIndex === null) return null;
    return images[previewIndex];
  }, [images, previewIndex]);

  if (!currentImage) return null;

  const imageUrl = currentImage.url;
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <button
        className="absolute top-4 right-4 text-white p-2"
        onClick={handleClose}
      >
        <X className="h-6 w-6" />
      </button>

      <div onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2"
          onClick={handlePrevious}
        >
          ←
        </button>

        <img
          src={imageUrl}
          alt={`预览图片 ${previewIndex + 1}`}
          className="max-h-[80vh] max-w-[80vw] object-contain"
        />

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2"
          onClick={handleNext}
        >
          →
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
          {previewIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
