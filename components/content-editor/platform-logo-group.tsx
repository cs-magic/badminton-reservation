import { platformsConfig } from "@/config/platforms.tsx";
import { PlatformType } from "@/types/platform.ts";
import Image from "next/image";

interface PlatformLogoGroupProps {
  platforms: PlatformType[];
  className?: string;
}

export function PlatformLogoGroup({
  platforms,
  className = "",
}: PlatformLogoGroupProps) {
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {platforms.map((platform) => {
        const logo = platformsConfig.find((item) => item.id === platform)?.icon;
        if (!logo) return null;
        return (
          <Image
            src={logo}
            alt={"logo"}
            className={"w-6 h-6 rounded-lg"}
            key={platform}
          />
        );
      })}
    </div>
  );
}
