import { editTextAtom } from "@/store/text.ts";
import { Label } from "@cs-magic/shadcn/ui/label";
import { Textarea } from "@cs-magic/shadcn/ui/textarea";
import { PlatformConfig } from "@/config/platforms.tsx";
import { platformsAtom } from "@/store/platforms.ts";
import { PlatformInfo } from "@/types/platform.ts";
import { UserAvatar } from "@cs-magic/assistant-frontend-common/components/user-avatar";
import { api } from "@cs-magic/common/api/api";
import { cn } from "@cs-magic/shadcn/lib/utils";
import { Button } from "@cs-magic/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@cs-magic/shadcn/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@cs-magic/shadcn/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useAtom } from "jotai/index";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export function LoginDialog({ platform }: { platform: PlatformConfig }) {
  const [platforms, setPlatforms] = useAtom(platformsAtom);
  const [content] = useAtom(editTextAtom);
  const [isPublishing, setIsPublishing] = useState(false);
  const [authValues, setAuthValues] = useState<Record<string, string>>({});

  const authInfo = platforms[platform.id] || {
    isLoggedIn: false,
    status: "idle",
    operationHistory: [],
  };

  const setAuthField = (key: string, value: string) => {
    setAuthValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const missingFields = platform.authFields.filter(
        (field) => field.required && !authValues[field.key],
      );

      if (missingFields.length > 0) {
        toast.error(
          `请填写必填字段: ${missingFields.map((f) => f.label).join(", ")}`,
        );
        return;
      }

      let mockUserData: {
        username: string;
        userId: string;
        avatar: string;
      };

      const headers = Object.entries(authValues).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key === "cookie" ? "custom-cookie" : key]: value,
        }),
        {},
      );

      const profile_res = await api.get(
        `https://api.cs-magic.cn/uni-pusher/${platform.id}/profile`,
        { headers },
      );
      const profile_data = await profile_res.data;

      switch (platform.id) {
        case "jike":
          mockUserData = {
            userId: profile_data.user.id,
            avatar: profile_data.user.avatarImage.thumbnailUrl,
            username: profile_data.user.screenName,
          };
          break;
        case "zsxq":
          mockUserData = {
            userId: profile_data.resp_data.user.uid,
            avatar: profile_data.resp_data.user.avatar_url,
            username: profile_data.resp_data.user.name,
          };
          break;
        default:
          return toast.error("Not Implementend");
      }

      const newAuthInfo: PlatformInfo = {
        isLoggedIn: true,
        authFields: authValues,
        ...mockUserData,
        lastLoginTime: Date.now(),
        status: "success",
        operationHistory: [
          {
            timestamp: Date.now(),
            type: "login",
            status: "success",
            ...mockUserData,
            message: "登录成功",
          },
          ...(authInfo.operationHistory?.slice(0, 9) || []),
        ],
      };

      setPlatforms((prev) => ({
        ...prev,
        [platform.id]: newAuthInfo,
      }));
    } catch (error) {
      console.error("Login failed:", error);
      setPlatforms((prev) => ({
        ...prev,
        [platform.id]: {
          ...authInfo,
          isLoggedIn: false,
          status: "error",
          operationHistory: [
            {
              timestamp: Date.now(),
              type: "login",
              status: "error",
              message: "登录失败：Cookie 无效或已过期",
            },
            ...(authInfo.operationHistory?.slice(0, 9) || []),
          ],
        },
      }));
      toast.error("登录失败：Cookie 无效或已过期");
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast.error("请输入要发布的内容");
      return;
    }

    setIsPublishing(true);

    const data: Record<string, any> = { text: content };
    if (platform.id === "jike") {
      data["syncToPersonalUpdate"] = true;
      data["submitToTopic"] = platforms.jike.options?.topic?.id;
    }

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...authValues,
      };
      console.log({ headers });

      const response = await fetch(
        `https://api.cs-magic.cn/uni-pusher/${platform.id}/content`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) throw new Error(`Failed to publish to ${platform.id}`);
      const result = await response.json();

      if (platform.id === "jike" && !result[0].data.createMessage) {
        throw new Error(`Failed to publish to ${platform.id}`);
      }

      console.log("published: ", result);
      toast.success("发布成功！");

      setPlatforms((prev) => {
        const p = prev[platform.id];
        p.operationHistory.splice(0, 0, {
          timestamp: Date.now(),
          type: "publish",
          status: "success",
          userId: authInfo.userId,
          avatar: authInfo.avatar,
          username: authInfo.username,
          message: "内容发布成功",
        });
      });

      toast.success("发布成功！");
    } catch (error) {
      console.error("发布失败:", error);

      setPlatforms((prev) => {
        const p = prev[platform.id];
        p.isLoggedIn = false; // reset auth
        p.operationHistory.splice(0, 0, {
          timestamp: Date.now(),
          type: "publish",
          userId: authInfo.userId,
          avatar: authInfo.avatar,
          username: authInfo.username,
          status: "error",
          message: "发布失败：请检查账号状态",
        });
      });

      toast.error("发布失败：请检查账号状态");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2">
          {authInfo.isLoggedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePublish();
              }}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  发布中
                </>
              ) : (
                "发布"
              )}
            </Button>
          )}
          <Button
            variant={authInfo.isLoggedIn ? "outline" : "default"}
            size="sm"
            className={cn(
              "w-32 overflow-hidden p-2",
              authInfo.isLoggedIn ? "justify-start" : "justify-center",
            )}
          >
            {authInfo.isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <UserAvatar
                  user={{
                    id: authInfo.userId!,
                    image: authInfo.avatar!,
                    name: authInfo.username!,
                  }}
                  withName
                />
                {/*<span className="truncate">{authInfo.username || "已登录"}</span>*/}
              </div>
            ) : (
              "登录"
            )}
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image
              src={platform.icon}
              alt={`${platform.name} icon`}
              width={24}
              height={24}
              className="w-6 h-6 rounded-lg"
            />
            <span>{platform.name}登录</span>
          </DialogTitle>
          <DialogDescription>
            请输入您的登录信息以连接{platform.name}账号
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs defaultValue={"auth"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="auth">Cookie 登录</TabsTrigger>
              <TabsTrigger value="sdk" disabled>
                SDK 登录 (todo)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="auth">
              <div className="space-y-4">
                {platform.authFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label
                      htmlFor={field.key}
                      className={"text-primary font-medium"}
                    >
                      {field.label}
                    </Label>
                    <Textarea
                      id={field.key}
                      placeholder={field.placeholder}
                      value={authValues[field.key] || ""}
                      onChange={(e) => setAuthField(field.key, e.target.value)}
                    />
                  </div>
                ))}
                <Button
                  variant="default"
                  className="w-full"
                  disabled={!Object.keys(authValues).length}
                  onClick={handleLogin}
                >
                  验证登录信息
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* 修改操作记录展示部分 */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-2">操作记录</h4>
            <div className="space-y-2 text-sm max-h-[240px] overflow-auto">
              {authInfo.operationHistory?.length > 0 ? (
                authInfo.operationHistory.map((record, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex justify-between items-center p-2 rounded",
                      record.status === "error" ? "bg-red-50" : "bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {record.avatar && (
                        <UserAvatar
                          user={{
                            id: record.userId!,
                            image: record.avatar,
                            name: record.username!,
                          }}
                          className="h-6 w-6"
                        />
                      )}
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "text-sm",
                            record.status === "error"
                              ? "text-red-600"
                              : "text-gray-700",
                          )}
                        >
                          {record.message}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(record.timestamp, {
                            locale: zhCN,
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {record.type === "login" ? "登录" : "发布"}
                      <span
                        className={cn(
                          "ml-2",
                          record.status === "error"
                            ? "text-destructive"
                            : "text-green-600",
                        )}
                      >
                        ●
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400">暂无操作记录</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
