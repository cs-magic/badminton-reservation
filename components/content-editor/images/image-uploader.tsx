import { Button } from "@cs-magic/shadcn/ui/button";
import { PlatformLogoGroup } from "@/components/publish-area/platform-logo-group.tsx";
import React from "react";
import { StoredImage } from "@/store/images";
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  images: StoredImage[];
  setImages: (images: StoredImage[]) => void;
}

export function ImageUploader({ images, setImages }: ImageUploaderProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const newStoredImages = newFiles.map((file) => ({
        id: uuidv4(),
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
        file: file,
      }));

      setImages([...images, ...newStoredImages]);

      if (e.target) {
        e.target.value = "";
      }
    }
  };

  return (
    <Button
      variant="outline"
      onClick={() => document.getElementById("image-upload")?.click()}
      className="gap-2"
    >
      <PlatformLogoGroup
        platforms={["jike", "wechat-moment", "zsxq", "xhs", "xls"]}
        className="mr-2"
      />
      上传图片
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
      />
    </Button>
  );
}
