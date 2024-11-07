import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cs-magic/shadcn/ui/dialog";
import { Input } from "@cs-magic/shadcn/ui/input";
import { Button } from "@cs-magic/shadcn/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { JikeTopic } from "@/types/platform";
import { api } from "@cs-magic/common/api/api";

interface TopicSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTopic: (topic: JikeTopic | null) => void;
  authFields: Record<string, string>;
  selectedTopic: JikeTopic | null;
}

export function TopicSelectorDialog({
  open,
  onOpenChange,
  onSelectTopic,
  authFields,
  selectedTopic,
}: TopicSelectorDialogProps) {
  const [topicSearch, setTopicSearch] = useState("");
  const [topics, setTopics] = useState<JikeTopic[]>([]);

  const searchJikeTopics = async (keywords: string) => {
    try {
      const response = await api.post(
        `https://api.cs-magic.cn/uni-pusher/jike/search/quanzi?keywords=${keywords}`,
        null,
        { headers: authFields },
      );
      const data = response.data;
      setTopics(
        data[0].data.search.topics.nodes.map((item: any) => ({
          id: item.id,
          name: item.content,
          avatarUrl: item.squarePicture.thumbnailUrl || "",
        })),
      );
    } catch (error) {
      console.error("Failed to search topics:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>选择即刻圈子</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="搜索圈子..."
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  searchJikeTopics(topicSearch);
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => searchJikeTopics(topicSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {topics.length > 0 && (
            <div className="max-h-[240px] overflow-auto border rounded-md">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic);
                    onOpenChange(false);
                    setTopicSearch("");
                    setTopics([]);
                  }}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={topic.avatarUrl}
                    alt={topic.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {topic.name}
                </div>
              ))}
            </div>
          )}

          {selectedTopic && (
            <div className="mt-2 p-2 bg-gray-100 rounded-md flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src={selectedTopic.avatarUrl}
                  alt={selectedTopic.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span>{selectedTopic.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectTopic(null)}
              >
                ✕
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
