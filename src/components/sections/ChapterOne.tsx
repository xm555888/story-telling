'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedText from '../ui/AnimatedText';
import SatelliteMap from '../charts/SatelliteMap';
import { useZslData } from '@/lib/hooks/useData';

interface MapPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'industrial' | 'conflict' | 'accident' | 'road';
  description?: string;
  details?: string;
}

export default function ChapterOne() {
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapPoint | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // 使用真实数据
  const { zslMediaData, totalReports, loading, error } = useZslData();

  // 故事片段
  const storySegments = [
    {
      id: 'opening',
      text: '"说好的三四天能开工，到今天还是没有回复！"',
      speaker: '工人A',
      timestamp: '12月7日上午11点'
    },
    {
      id: 'complaint',
      text: '"富源几千上万员工，都是外地来打工的，快年底过年了，不开工怎么赚钱。"',
      speaker: '工人B',
      timestamp: '现场'
    },
    {
      id: 'emergency',
      text: '"四号下午就把路围起来了，晚上十一点紧急遣散我们，孩子的书包、药、生活用品全在里面，该怎么办才好？"',
      speaker: '受影响居民',
      timestamp: '疏散后'
    }
  ];

  useEffect(() => {
    if (inView) {
      const timer = setInterval(() => {
        setCurrentStoryIndex((prev) => 
          prev < storySegments.length - 1 ? prev + 1 : prev
        );
      }, 4000);

      return () => clearInterval(timer);
    }
  }, [inView, storySegments.length]);

  const handleMapPointClick = (point: MapPoint) => {
    setSelectedMapPoint(point);
  };

  return (
    <section id="chapter-1" className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 章节标题 */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black via-black/80 to-transparent">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-4 text-white">
              失踪13人
            </h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              距离深江铁路5标段施工现场坍塌84小时，洲石路与飞达路交叉路口，人声嘈杂，尼古丁和飞扬的沙尘交织，现场显得很混乱。
            </p>
          </motion.div>
        </div>
      </div>

      {/* 主要内容区域 - 垂直滚动布局 */}
      <div ref={ref} className="pt-80 pb-20">
        <div className="max-w-4xl mx-auto px-4 space-y-32">

          {/* 第一部分：现场描述 */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="text-center space-y-8"
          >
            <div className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                12月7日上午11点，距离深江铁路5标段施工现场坍塌84小时，洲石路与飞达路交叉路口，人声嘈杂，尼古丁和飞扬的沙尘交织，现场显得很混乱。
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                工人闹着复工，民警要维持秩序，停工三天，员工们积压的情绪终于在这个上午爆发开来。
              </p>
            </div>
          </motion.section>

          {/* 第二部分：交互式地图 - 全屏显示 */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">洲石路现场卫星图</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                基于真实卫星图像的事故现场态势 - 点击标记点了解详细信息
              </p>
            </div>

            {/* 地图容器 - 增大尺寸 */}
            <div className="relative bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              <div className="aspect-[4/3] w-full min-h-[600px]">
                <SatelliteMap
                  onPointClick={handleMapPointClick}
                  className="w-full h-full"
                  backgroundImage="/images/satellite-map.svg"
                />
              </div>
            </div>
          </motion.section>

          {/* 第三部分：事件时间线 */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-white">事件时间线</h3>
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="flex items-center space-x-6 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                <div className="text-left">
                  <div className="text-lg font-medium text-white">12月4日 23:00</div>
                  <div className="text-gray-400">施工现场发生坍塌，13人失联</div>
                </div>
              </div>
              <div className="flex items-center space-x-6 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0"></div>
                <div className="text-left">
                  <div className="text-lg font-medium text-white">12月5日 早晨</div>
                  <div className="text-gray-400">道路封闭，紧急疏散周边人员</div>
                </div>
              </div>
              <div className="flex items-center space-x-6 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></div>
                <div className="text-left">
                  <div className="text-lg font-medium text-white">12月7日 11:00</div>
                  <div className="text-gray-400">工人聚集抗议，要求复工</div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 第四部分：现场声音 */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-yellow-400">现场声音</h3>
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="min-h-[200px] bg-gray-900/50 rounded-lg p-8 border border-gray-700 backdrop-blur-sm"
                >
                  <blockquote className="text-2xl md:text-3xl text-gray-200 italic mb-8 leading-relaxed text-center">
                    "{storySegments[currentStoryIndex]?.text}"
                  </blockquote>
                  <div className="flex justify-between items-center text-lg text-gray-400">
                    <span>— {storySegments[currentStoryIndex]?.speaker}</span>
                    <span>{storySegments[currentStoryIndex]?.timestamp}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* 进度指示器 */}
              <div className="flex space-x-2 mt-8 justify-center">
                {storySegments.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-12 rounded-full transition-colors duration-500 ${
                      index <= currentStoryIndex ? 'bg-yellow-400' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.section>

          {/* 第五部分：现场目击详述 */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-red-400">现场目击</h3>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700 backdrop-blur-sm text-left">
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  以洲石路为界，左侧是富源工业城，右侧是强荣东工业园。人声嘈杂的人群中，有路过看热闹的群众，更多是与现场执法人员争吵的富源工业城一带的老板和员工。
                </p>
                <div className="border-l-4 border-red-500 pl-6">
                  <p className="text-lg text-gray-400 leading-relaxed">
                    民警在道路中间绿化带与斑马线的交界处一字排开，形成一道人墙，隔开了封锁路段与愤躁动的人群。
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 第六部分：数据统计 */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.8, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-white">数据统计</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
              <div className="bg-red-900/30 rounded-lg p-8 border border-red-700">
                <div className="text-6xl font-bold text-red-400 mb-4">13</div>
                <div className="text-xl text-gray-300">失联人员</div>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-8 border border-blue-700">
                <div className="text-6xl font-bold text-blue-400 mb-4">
                  {loading ? '...' : totalReports}
                </div>
                <div className="text-xl text-gray-300">媒体报道</div>
              </div>
            </div>

            {/* 媒体报道详细统计 */}
            {!loading && !error && (
              <div className="max-w-3xl mx-auto bg-gray-900/50 rounded-lg p-8 border border-gray-700 backdrop-blur-sm">
                <h4 className="text-2xl font-semibold mb-8 text-green-400">媒体关注度分析</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">{totalReports}</div>
                    <div className="text-gray-300">总报道数量</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {zslMediaData.filter(item => item.isGovernmentSource).length}
                    </div>
                    <div className="text-gray-300">政府官方报道</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {zslMediaData.filter(item => item.hasVideo).length}
                    </div>
                    <div className="text-gray-300">包含视频</div>
                  </div>
                </div>
              </div>
            )}
          </motion.section>
        </div>
      </div>

      {/* 底部渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
