'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedText from '../ui/AnimatedText';

export default function HeroSection() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSubtitle(true), 2000);
    const timer2 = setTimeout(() => setShowQuote(true), 4000);
    const timer3 = setTimeout(() => setShowScrollHint(true), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById('chapter-1');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景图片/视频 */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-bg.svg')`,
          }}
        >
          <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>
      </div>

      {/* 内容区域 - 使用绝对定位避免布局挤压 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 主标题 - 固定位置 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wider">
              <AnimatedText
                text="Asphyxiation"
                animation="typewriter"
                speed={100}
                className="text-gradient"
              />
            </h1>
            <div className="text-2xl md:text-3xl text-gray-300 font-light">
              窒息死亡
            </div>
          </motion.div>

          {/* 副标题 - 预留空间 */}
          <div className="h-16 flex items-center justify-center">
            {showSubtitle && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              >
                <h2 className="text-xl md:text-2xl text-gray-200 font-light">
                  <AnimatedText
                    text="不止洲石，70条路的死亡记录"
                    animation="slideUp"
                    delay={500}
                  />
                </h2>
              </motion.div>
            )}
          </div>

          {/* 诗句引用 - 预留空间 */}
          <div className="min-h-[200px] flex items-center justify-center">
            {showQuote && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                className="max-w-2xl mx-auto"
              >
                <blockquote className="text-gray-400 italic text-lg md:text-xl leading-relaxed">
                  <AnimatedText
                    text="Hay cementerios que son solos, sepulcros llenos de huesos sin sonido, el corazón pasando por un túnel, oscuro, oscuro, oscuro, como un naufragio hacia adentro nos morimos…"
                    animation="fadeIn"
                    delay={1000}
                  />
                  <footer className="mt-4 text-sm text-gray-500">
                    —— Nada Más Que La Muerte
                  </footer>
                </blockquote>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 滚动提示 - 独立定位 */}
      {showScrollHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <button
            onClick={scrollToNext}
            className="flex flex-col items-center text-gray-300 hover:text-white transition-colors duration-300 group"
          >
            <span className="text-sm mb-2 opacity-80">向下滚动继续</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center group-hover:border-white transition-colors duration-300"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2 group-hover:bg-white transition-colors duration-300"
              />
            </motion.div>
          </button>
        </motion.div>
      )}

      {/* 渐变遮罩 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-5" />
    </section>
  );
}
