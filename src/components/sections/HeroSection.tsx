'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedText from '../ui/AnimatedText';

export default function HeroSection() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  // 滚动监听 - 监听整个页面的滚动
  const { scrollY } = useScroll();

  // 内容透明度变化 - 在临界值处突然消失，模仿华盛顿邮报效果
  const contentOpacity = useTransform(scrollY, [0, 200, 400, 401], [1, 0.7, 0.1, 0]);

  // Hero组件整体可见性 - 在临界值处完全隐藏
  const heroVisibility = useTransform(scrollY, [0, 399, 400], [1, 1, 0]);

  // 背景变暗效果 - 随着滚动逐渐变暗
  const backgroundDarkness = useTransform(scrollY, [0, 200, 400], [0, 0.3, 0.7]);

  // Hero组件整体模糊效果 - 随着滚动逐渐模糊
  const heroBlur = useTransform(scrollY, [0, 200, 400], ["blur(0px)", "blur(3px)", "blur(8px)"]);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSubtitle(true), 1500);
    const timer2 = setTimeout(() => setShowQuote(true), 2800);
    const timer3 = setTimeout(() => setShowScrollHint(true), 4200);

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
    <>
      {/* Hero组件 - 固定位置，占满整个视口 */}
      <motion.section
        id="hero"
        className="fixed inset-0 z-50 overflow-hidden"
        style={{
          opacity: heroVisibility,
          filter: heroBlur
        }}
      >
        {/* 背景图片 - 固定不变 */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/hero-bg.svg')`,
            }}
          >
            <div className="w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
            {/* 滚动变暗遮罩 */}
            <motion.div
              className="absolute inset-0 bg-black"
              style={{ opacity: backgroundDarkness }}
            />
          </div>
        </div>

        {/* 内容区域 - 固定位置 */}
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

          {/* 副标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={showSubtitle ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="h-16 flex items-center justify-center"
          >
            <h2 className="text-xl md:text-2xl text-gray-200 font-light">
              <AnimatedText
                text="不止洲石，70条路的死亡记录"
                animation="slideUp"
                delay={300}
              />
            </h2>
          </motion.div>

          {/* 诗句引用 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={showQuote ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-[200px] flex items-center justify-center"
          >
            <div className="max-w-2xl mx-auto">
              <blockquote className="text-gray-400 italic text-lg md:text-xl leading-relaxed">
                <AnimatedText
                  text="Hay cementerios que son solos, sepulcros llenos de huesos sin sonido, el corazón pasando por un túnel, oscuro, oscuro, oscuro, como un naufragio hacia adentro nos morimos…"
                  animation="fadeIn"
                  delay={600}
                />
                <footer className="mt-4 text-sm text-gray-500">
                  —— Nada Más Que La Muerte
                </footer>
              </blockquote>
            </div>
          </motion.div>
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
      </motion.section>
    </>
  );
}
