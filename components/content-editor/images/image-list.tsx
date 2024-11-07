import { ImagePreviewDialog } from "@/components/content-editor/images/image-preview-dialog.tsx";
import { SortableImage } from "@/components/content-editor/images/sortable-image.tsx";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useAtom } from "jotai";
import { memo, useEffect, useState } from "react";
import { imagesAtom, reorderImagesAtom } from '@/store/editor'

interface ImageListProps {
  onDelete: (index: number) => void;
  onPreview: (index: number) => void;
}

function ImageListComponent({
  onDelete,
  onPreview,
}: ImageListProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const [images] = useAtom(imagesAtom)
  const [, reorderImages] = useAtom(reorderImagesAtom)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = images.findIndex(img => img.id === active.id);
    const newIndex = images.findIndex(img => img.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      reorderImages({ startIndex: oldIndex, endIndex: newIndex });
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="grid grid-cols-4 gap-2 w-fit p-2">
        {images.map((image, index) => (
          <div
            key={`${index}-${image.name}`}
            className="relative w-[120px] h-[120px]"
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={images.map(img => img.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <SortableImage
                key={image.id}
                image={image}
                index={index}
                onDelete={onDelete}
                onPreview={onPreview}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ImagePreviewDialog
        images={images}
        previewIndex={previewIndex}
        setPreviewIndex={setPreviewIndex}
      />
    </>
  );
}

export const ImageList = memo(ImageListComponent, (prev, next) => {
  return (
    prev.onDelete === next.onDelete &&
    prev.onPreview === next.onPreview
  );
});

ImageList.displayName = "ImageList";
