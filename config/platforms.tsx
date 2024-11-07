import { AuthField, PlatformType } from "@/types/platform.ts";
import JikeLogoPng from "@assets/branding/platforms/jike.png";
import WechatMomentLogoPng from "@assets/branding/platforms/wechat-moments.png";
import WechatLogoPng from "@assets/branding/platforms/wechat.png";
import XhsLogoPng from "@assets/branding/platforms/xhs.png";
import ZsxqLogoPng from "@assets/branding/platforms/zsxq.png";

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  previewImage: string;
  icon: typeof WechatLogoPng;
  authFields: AuthField[];
}

export const platformsConfig: PlatformConfig[] = [
  {
    id: "jike",
    name: "即刻",
    previewImage: "/images/jike-preview.png",
    icon: JikeLogoPng,
    authFields: [
      {
        key: "custom-cookie",
        label: "Cookie",
        type: "text",
        placeholder: "请输入即刻 Cookie",
        required: true,
      },
    ],
  },
  {
    id: "zsxq",
    name: "知识星球",
    previewImage: "/images/zsxq-preview.png",
    icon: ZsxqLogoPng,
    authFields: [
      {
        key: "custom-cookie",
        label: "Cookie",
        type: "text",
        placeholder: "请输入知识星球 Cookie",
        required: true,
      },
      {
        key: "x-timestamp",
        label: "Timestamp",
        type: "text",
        placeholder: "请输入 x-timestamp",
        required: true,
      },
    ],
  },
  {
    id: "xhs",
    name: "小红书",
    previewImage: "/images/xhs-preview.png",
    icon: XhsLogoPng,
    authFields: [
      {
        key: "custom-cookie",
        label: "Cookie",
        type: "text",
        placeholder: "请输入小红书 Cookie",
        required: true,
      },
    ],
  },
  {
    id: "xls",
    name: "小绿书",
    previewImage: "/images/xls-preview.png",
    icon: WechatLogoPng,
    authFields: [
      {
        key: "custom-cookie",
        label: "Cookie",
        type: "text",
        placeholder: "请输入小绿书 Cookie",
        required: true,
      },
    ],
  },
  {
    id: "wechat-moment",
    name: "微信朋友圈",
    previewImage: "/images/wechat-preview.png",
    icon: WechatMomentLogoPng,
    authFields: [
      {
        key: "custom-cookie",
        label: "Cookie",
        type: "text",
        placeholder: "请输入微信朋友圈 Cookie",
        required: true,
      },
    ],
  },
];
