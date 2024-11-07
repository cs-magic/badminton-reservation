import { LoginDialog } from "@/components/publish-area/platform-actions.tsx";
import { platformsConfig } from "@/config/platforms.tsx";
import { cn } from "@cs-magic/shadcn/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@cs-magic/shadcn/ui/accordion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import Image from "next/image";

export function Platform({
  platform,
}: {
  platform: (typeof platformsConfig)[0];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: platform.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <AccordionItem
      ref={setNodeRef}
      style={style}
      key={platform.id}
      value={platform.id}
      className={cn("relative", isDragging && "opacity-50")}
    >
      <div className="flex items-center justify-between py-2">
        <AccordionTrigger className="flex-1 hover:no-underline gap-2">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className={cn("cursor-grab hover:text-gray-600 touch-none")}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </div>
            <div className={"w-6 rounded-lg overflow-hidden"}>
              <Image
                src={platform.icon}
                alt={`${platform.name} icon`}
                width={24}
                height={24}
                className={"w-6 h-6 rounded-lg"}
              />
            </div>
            <span>{platform.name}</span>
          </div>
        </AccordionTrigger>

        <div className="flex items-center gap-2">
          <LoginDialog platform={platform} />
        </div>
      </div>

      <AccordionContent>
        <div className="mt-2 border rounded-lg p-2">
          <div className="text-sm text-gray-500 mb-2">预览效果</div>
          <div className="bg-gray-100 rounded-lg p-4 min-h-[200px]">
            <div className="text-center text-gray-400">
              平台预览内容将在这里显示
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
