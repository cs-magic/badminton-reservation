"use client";

import { ImageList } from "@/components/content-editor/images/image-list.tsx";
import { ImageUploader } from "@/components/content-editor/images/image-uploader.tsx";
import { LocationSelectorDialog } from "@/components/content-editor/location/location-selector-dialog.tsx";
import { TopicSelectorDialog } from "@/components/content-editor/topic/topic-selector-dialog.tsx";
import { PlatformLogoGroup } from "@/components/content-editor/platform-logo-group.tsx";
import { contentAtom, imagesAtom } from "@/store/editor";
import { platformsAtom } from "@/store/platforms.ts";
import { JikeTopic } from "@/types/platform.ts";
import { Button } from "@cs-magic/shadcn/ui/button";
import { useAtom } from "jotai";
import { MapPin } from "lucide-react";
import React, { useCallback, useState } from "react";

export function ContentEditor() {
  const [platforms, setPlatforms] = useAtom(platformsAtom);
  const [content, setContent] = useAtom(contentAtom);
  const [images, setImages] = useAtom(imagesAtom);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  // 即刻圈子相关状态
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const selectedTopic = platforms.jike.options?.topic;
  const setSelectedTopic = (selectedTopic: JikeTopic | null) => {
    setPlatforms((platforms) => ({
      ...platforms,
      jike: {
        ...platforms.jike,
        options: {
          ...platforms.jike.options,
          topic: selectedTopic,
        },
      },
    }));
  };

  // 微信朋友圈位置相关状态
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);

  // 更新处理图片的函数
  const handleDeleteImage = useCallback(
    (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
      if (previewIndex === index) {
        setPreviewIndex(null);
      }
    },
    [previewIndex, setImages],
  );

  const handlePreviewImage = useCallback((index: number) => {
    setPreviewIndex(index);
  }, []);

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-40 p-4 border rounded-lg resize-none"
        placeholder="输入要发布的内容..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* 按钮组 */}
      <div className="flex gap-2">
        <ImageUploader />

        <Button
          variant="outline"
          onClick={() => setTopicDialogOpen(true)}
          className="gap-2"
        >
          <PlatformLogoGroup platforms={["jike"]} className="mr-2" />
          {selectedTopic ? `圈子: ${selectedTopic.name}` : "添加圈子（可选）"}
        </Button>

        <Button
          variant="outline"
          onClick={() => setLocationDialogOpen(true)}
          className="gap-2"
        >
          <PlatformLogoGroup
            platforms={["jike", "wechat-moment"]}
            className="mr-2"
          />
          <MapPin className="h-5 w-5" />
          {location ? `位置: ${location.name}` : "添加位置（可选）"}
        </Button>
      </div>

      {/* 图片列表 */}
      {images.length > 0 && (
        <div className="mt-4">
          <ImageList
            onDelete={handleDeleteImage}
            onPreview={handlePreviewImage}
          />
        </div>
      )}

      {/* 对话框组件 */}
      <TopicSelectorDialog
        open={topicDialogOpen}
        onOpenChange={setTopicDialogOpen}
        onSelectTopic={setSelectedTopic}
        authFields={platforms.jike.authFields!}
        selectedTopic={selectedTopic}
      />

      <LocationSelectorDialog
        open={locationDialogOpen}
        onOpenChange={setLocationDialogOpen}
        onSelectLocation={setLocation}
        selectedLocation={location}
      />
    </div>
  );
}
