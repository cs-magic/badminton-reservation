import { PlatformsState, PlatformType } from "@/types/platform.ts";
import { withImmer } from "jotai-immer";
import { atomWithStorage } from "jotai/utils";

// Add new atom for platform order
export const platformOrderAtom = atomWithStorage<PlatformType[]>(
  "platformOrder",
  ["jike", "zsxq", "xhs", "xls", "wechat-moment"],
);

// Initialize platforms with all available platforms
export const platformsAtom = withImmer(
  atomWithStorage<PlatformsState>("platforms", {
    jike: {
      status: "idle",
      operationHistory: [],
    },
    zsxq: {
      status: "idle",
      operationHistory: [],
    },
    xhs: {
      status: "idle",
      operationHistory: [],
    },
    xls: {
      status: "idle",
      operationHistory: [],
    },
    "wechat-moment": {
      status: "idle",
      operationHistory: [],
    },
  }),
);
