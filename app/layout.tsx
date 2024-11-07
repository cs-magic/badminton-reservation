import { Toaster } from "@cs-magic/shadcn/ui/sonner";
import { Inter } from "next/font/google";
import "@assets/styles/main.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Uni Pusher - 统一社交平台发布工具",
  description: "一键将内容同步发布到多个社交平台",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">{children}</main>

        <Toaster
          richColors
          position={"top-right"}
          duration={3000}
          closeButton={false}
        />
      </body>
    </html>
  );
}
