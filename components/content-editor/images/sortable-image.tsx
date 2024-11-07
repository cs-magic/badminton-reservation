import { StoredImage } from "@/types/editor.ts";
import { Button } from "@cs-magic/shadcn/ui/button";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useState } from "react";

interface SortableImageProps {
  image: StoredImage;
  index: number;
  onDelete: (index: number) => void;
  onPreview: (index: number) => void;
  animateLayoutChanges?: AnimateLayoutChanges;
}

function SortableImageComponent({
  image,
  index,
  onDelete,
  onPreview,
  animateLayoutChanges,
}: SortableImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (image.url) {
      setImageUrl(image.url);
    } else if (image.file) {
      const url = URL.createObjectURL(image.file);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [image]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: image.id,
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    touchAction: "none",
    zIndex: isDragging ? 999 : "auto",
  };

  if (!imageUrl) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative group w-[120px] h-[120px] select-none will-change-transform bg-gray-100 animate-pulse"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group w-[120px] h-[120px] select-none will-change-transform"
    >
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => onPreview(index)}
      >
        <Image
          src={imageUrl}
          alt={`Uploaded image ${index + 1}`}
          fill
          sizes="120px"
          className="object-cover rounded-lg"
          draggable={false}
          priority
          loading="eager"
        />
      </div>

      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const SortableImage = memo(SortableImageComponent, (prev, next) => {
  return (
    prev.image === next.image &&
    prev.index === next.index &&
    prev.onDelete === next.onDelete &&
    prev.onPreview === next.onPreview
  );
});

SortableImage.displayName = "SortableImage";
