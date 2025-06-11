import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export const metadata: Metadata = {
  title: "Asphyxiation - 窒息死亡 | Story Telling",
  description: "一个关于道路安全事故的沉浸式数据可视化故事网站，以窒息死亡为主题，通过数据驱动的叙述方式展现道路安全问题的严重性。",
  keywords: "数据可视化,道路安全,事故统计,新闻报道,交互式地图",
  authors: [{ name: "Story Telling Team" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
