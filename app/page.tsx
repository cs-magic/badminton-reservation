import { ContentEditor } from "components/content-editor/content-editor.tsx";
import Platforms from "@/components/publish-area/platforms.tsx";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 inline-flex gap-1">
        <span className={"text-primary"}>UniPusher</span>
        <span className={"text-primary"}>统一发布平台</span>
      </h1>

      <div className="grid grid-cols-1 gap-8">
        <ContentEditor />

        <Platforms />
      </div>
    </div>
  );
}
