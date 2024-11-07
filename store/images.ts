import { atom } from "jotai/index";
import { atomWithStorage } from "jotai/utils";

export interface StoredImage {
  id: string;
  url: string;
  name: string;
  type: string;
  file?: File;
}

export const imagesAtom = atomWithStorage<StoredImage[]>("editor-images", []);
export type ImageUrlCache = Record<string, string>;
export const imageUrlCacheAtom = atom<ImageUrlCache>({});

// 清理函数
export const cleanupImageUrls = (cache: ImageUrlCache) => {
  Object.values(cache).forEach((url) => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
};
