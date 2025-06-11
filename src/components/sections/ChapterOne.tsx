'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import SatelliteMap, { MapPoint } from '../charts/SatelliteMap';

export default function ChapterOne() {
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapPoint | null>(null);

  // 滚动进度 - 监听整个页面的滚动
  const { scrollY } = useScroll();

  // 背景模糊效果 - 从0到50px模糊（大幅增加模糊程度）
  const backgroundBlur = useTransform(
    scrollY,
    [0, 800],
    [0, 50]
  );

  // 背景变暗效果 - 增加不透明度从0.5到0.8
  const backgroundDarkness = useTransform(
    scrollY,
    [0, 800],
    [0, 0.8]
  );

  // Chapter1标题模糊效果 - 与背景模糊反向（背景模糊时标题清晰）
  const titleBlur = useTransform(
    scrollY,
    [0, 800],
    [50, 0]
  );

  // 固定标题的最终透明度 - 从模糊到清晰再到隐藏，延长标题显示时间
  const finalTitleOpacity = useTransform(
    scrollY,
    [0, 800, 1200],
    [0.3, 1, 0]
  );

  const handleMapPointClick = (point: MapPoint) => {
    setSelectedMapPoint(point);
  };

  return (
    <div className="relative">
      {/* 固定背景图片 - section1.svg 占满整个屏幕 */}
      <div className="fixed inset-0 z-0">
        <motion.div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/section1.svg')`,
            filter: `blur(${backgroundBlur}px)`
          }}
        />
        {/* 动态变暗遮罩 */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: backgroundDarkness }}
        />
      </div>

      {/* Chapter1标题 - 固定在屏幕中央，与背景模糊反向 */}
      <motion.div
        className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none"
        style={{
          opacity: finalTitleOpacity,
          filter: `blur(${titleBlur}px)`
        }}
      >
        <h2 className="text-6xl md:text-7xl font-bold text-white text-center drop-shadow-2xl">
          第一章：失踪13人
        </h2>
      </motion.div>

      {/* 可滚动内容区域 */}
      <div className="relative z-20 min-h-screen" style={{ paddingTop: '85vh' }}>

        {/* 标题消失后的正常滚动区域 */}
        <div className="min-h-screen">
          {/* 事件陈述部分 */}
          <div className="py-12">
            <div className="flex items-center justify-center min-h-[40vh]">
              <p className="text-xl md:text-2xl text-white text-center max-w-5xl leading-relaxed drop-shadow-lg px-8">
                12月7日上午11点，距离深江铁路5标段施工现场坍塌84小时，洲石路与飞达路交叉路口，人声嘈杂，尼古丁和飞扬的沙尘交织，现场显得很混乱。工人闹着复工，民警要维持秩序，停工三天，员工们积压的情绪终于在这个上午爆发开来。
              </p>
            </div>
          </div>

          {/* 群众声音 - 缩短间距 */}
          <div className="py-8">
            <div className="space-y-8 max-w-4xl mx-auto px-8">
              <div className="flex items-center justify-center min-h-[25vh]">
                <p className="text-2xl md:text-3xl text-white text-center leading-relaxed drop-shadow-lg">
                  "说好的三四天能开工，到今天还是没有回复！"
                </p>
              </div>

              <div className="flex items-center justify-center min-h-[25vh]">
                <p className="text-2xl md:text-3xl text-white text-center leading-relaxed drop-shadow-lg">
                  "富源几千上万员工，都是外地来打工的，快年底过年了，不开工怎么赚钱。"
                </p>
              </div>

              <div className="flex items-center justify-center min-h-[25vh]">
                <p className="text-2xl md:text-3xl text-white text-center leading-relaxed drop-shadow-lg">
                  "四号下午就把路围起来了，晚上十一点紧急遣散我们，孩子的书包、药、生活用品全在里面，该怎么办才好？"
                </p>
              </div>
            </div>
          </div>

          {/* 现场描述 */}
          <div className="py-8">
            <div className="flex items-center justify-center min-h-[30vh]">
              <p className="text-xl md:text-2xl text-white text-center max-w-5xl leading-relaxed drop-shadow-lg px-8">
                以洲石路为界，左侧是富源工业城，右侧是强荣东工业园。人声嘈杂的人群中，有路过看热闹的群众，更多是与现场执法人员争吵的富源工业城一带的老板和员工。民警在道路中间绿化带与斑马线的交界处一字排开，形成一道人墙，隔开了封锁路段与愤躁动的人群。
              </p>
            </div>
          </div>

          {/* 现场态势图 - 适中大小，可滚动查看 */}
          <div className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-2xl">现场态势图</h3>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                  洲石路与飞达路交叉口现场态势图 - 点击标记点了解详细信息
                </p>
              </div>

              {/* 地图容器 */}
              <div className="relative bg-black/30 rounded-2xl border border-gray-600 overflow-hidden backdrop-blur-sm">
                <div className="aspect-[3/2] w-full">
                  <SatelliteMap
                    onPointClick={handleMapPointClick}
                    className="w-full h-full"
                    backgroundImage="/images/simplified-map.svg"
                    selectedPointId={selectedMapPoint?.id}
                    showHoverTooltip={true}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 添加一些底部空间 */}
          <div className="h-screen"></div>
        </div>
      </div>

      {/* 侧边栏详情面板 */}
      <AnimatePresence>
        {selectedMapPoint && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSelectedMapPoint(null)}
            />

            {/* 侧边栏 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-gray-900 border-l border-gray-600 z-50 overflow-y-auto"
            >
              {/* 头部 */}
              <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{selectedMapPoint.name}</h3>
                  <p className="text-gray-400 text-sm">{selectedMapPoint.description}</p>
                </div>
                <button
                  onClick={() => setSelectedMapPoint(null)}
                  className="text-gray-400 hover:text-white text-xl transition-colors ml-4 flex-shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* 内容区域 */}
              <div className="p-6">
                {/* 详细文字内容 */}
                {selectedMapPoint.details && (
                  <div className="text-gray-300 text-sm leading-relaxed space-y-4 mb-6">
                    {selectedMapPoint.details.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {/* 如果有单张图片，显示图片 */}
                {selectedMapPoint.image && (
                  <div className="mb-6">
                    <img
                      src={selectedMapPoint.image}
                      alt={selectedMapPoint.name}
                      className="w-full rounded-lg border border-gray-600"
                    />
                  </div>
                )}

                {/* 如果有多张图片，显示在文字下方 */}
                {selectedMapPoint.images && selectedMapPoint.images.length > 0 && (
                  <div className="space-y-4">
                    {selectedMapPoint.images.map((imageSrc, index) => (
                      <div key={index}>
                        <img
                          src={imageSrc}
                          alt={`${selectedMapPoint.name} - 图片 ${index + 1}`}
                          className="w-full rounded-lg border border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
