import { StoredImage } from "@/types/editor.ts";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils"; // 基础状态原子

// 基础状态原子
export const contentAtom = atomWithStorage<string>("editor.content", "");
export const imagesAtom = atomWithStorage<StoredImage[]>("editor.images", []);

// 派生原子 - 图片操作
export const addImagesAtom = atom(null, (get, set, newImages: File[]) => {
  const currentImages = get(imagesAtom);
  const newImageObjects = newImages.map((file) => ({
    id: crypto.randomUUID(),
    url: URL.createObjectURL(file),
    file,
    name: file.name,
  }));
  set(imagesAtom, [...currentImages, ...newImageObjects]);
});

export const reorderImagesAtom = atom(
  null,
  (
    get,
    set,
    {
      startIndex,
      endIndex,
    }: {
      startIndex: number;
      endIndex: number;
    },
  ) => {
    const images = get(imagesAtom);
    const newImages = [...images];
    const [removed] = newImages.splice(startIndex, 1);
    newImages.splice(endIndex, 0, removed);
    set(imagesAtom, newImages);
  },
);
