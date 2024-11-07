"use client";

import { PlatformItem } from "./platform-item";
import { platformsConfig } from "@/config/platforms";
import { platformOrderAtom } from "@/store/platforms.ts";
import { Accordion } from "@cs-magic/shadcn/ui/accordion";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAtom } from "jotai";
import { useState } from "react";

export default function Platforms() {
  const [platformOrder, setPlatformOrder] = useAtom(platformOrderAtom);
  const [expandedPlatforms, setExpandedPlatforms] = useState<string[]>([]);
  const [dndContextId] = useState("platforms-dnd-context");

  const sortedPlatforms = [...platformsConfig].sort((a, b) => {
    const aIndex = platformOrder.indexOf(a.id);
    const bIndex = platformOrder.indexOf(b.id);
    return aIndex - bIndex;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = platformOrder.indexOf(active.id);
    const newIndex = platformOrder.indexOf(over.id);

    const newOrder = [...platformOrder];
    newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, active.id);
    setPlatformOrder(newOrder);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="font-semibold mb-4">发布平台</h2>
      <DndContext
        id={dndContextId}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Accordion
          type="multiple"
          value={expandedPlatforms}
          onValueChange={setExpandedPlatforms}
        >
          <SortableContext
            items={sortedPlatforms.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedPlatforms.map((platform) => (
              <PlatformItem key={platform.id} platform={platform} />
            ))}
          </SortableContext>
        </Accordion>
      </DndContext>
    </div>
  );
}
