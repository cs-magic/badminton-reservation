import { Button } from "@cs-magic/shadcn/ui/button";
import { PlatformLogoGroup } from "@/components/content-editor/platform-logo-group.tsx";
import React from "react";
import { useSetAtom } from "jotai";
import { addImagesAtom } from "@/store/editor";

export function ImageUploader() {
  const addImages = useSetAtom(addImagesAtom);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      addImages(newFiles);

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
