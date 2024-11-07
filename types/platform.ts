export interface OperationRecord {
  timestamp: number;
  type: OperationType;
  status: OperationStatus;
  userId?: string;
  avatar?: string;
  username?: string;
  message?: string;
} // 添加新的操作记录类型

export type OperationType = "login" | "publish";

export type OperationStatus = "success" | "error"; // 修改 PlatformInfo 类型中的 loginHistory 为 operationHistory

export type PlatformStatus = "idle" | "running" | "success" | "error";

export interface AuthField {
  key: string;
  label: string;
  type: "text" | "password";
  placeholder?: string;
  required: boolean;
}

// todo: generic instead of options
export interface PlatformInfo {
  isLoggedIn?: boolean;
  status: PlatformStatus;
  operationHistory: OperationRecord[];

  // Replace single cookie with auth fields
  authFields?: Record<string, string>;

  userId?: string;
  avatar?: string;
  username?: string;

  lastLoginTime?: number;

  options?: Record<string, any>;
}

export type PlatformType = "jike" | "xhs" | "xls" | "zsxq" | "wechat-moment";

export type PlatformsState = Record<PlatformType, PlatformInfo>;

export interface JikeTopic {
  id: string;
  name: string;
  avatarUrl: string;
}
