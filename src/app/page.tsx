'use client';

import HeroSection from '@/components/sections/HeroSection';
import ChapterOne from '@/components/sections/ChapterOne';
import Navigation from '@/components/layout/Navigation';
import ScrollProgress from '@/components/ui/ScrollProgress';

export default function Home() {
  return (
    <main className="relative">
      {/* 滚动进度条 */}
      <ScrollProgress />

      {/* 导航 */}
      <Navigation />

      {/* 页面内容 */}
      <div className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* 第一章 */}
        <ChapterOne />

        {/* 占位符：第二章和第三章 */}
        <section id="chapter-2" className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">第二章：掩埋</h2>
            <p className="text-gray-400">即将推出...</p>
          </div>
        </section>

        <section id="chapter-3" className="min-h-screen bg-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">第三章：70条公路的死亡档案</h2>
            <p className="text-gray-400">即将推出...</p>
          </div>
        </section>
      </div>
    </main>
  );
}
