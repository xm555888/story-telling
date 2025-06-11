'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapPoint {
  id: string;
  name: string;
  x: number; // 百分比位置
  y: number; // 百分比位置
  type: 'industrial' | 'conflict' | 'accident' | 'road';
  description?: string;
  details?: string;
}

interface SatelliteMapProps {
  className?: string;
  onPointClick?: (point: MapPoint) => void;
  backgroundImage?: string; // 卫星图片URL
}

// 基于重新设计的洲石路卫星图的标注点位
const mapPoints: MapPoint[] = [
  {
    id: 'fuyuan',
    name: '富源工业城',
    x: 24, // 左侧工业区
    y: 47,
    type: 'industrial',
    description: '左侧工业区',
    details: '富源工业城的老板和员工聚集抗议，要求复工和进入取物'
  },
  {
    id: 'qiangrong',
    name: '强荣东工业园',
    x: 76, // 右侧工业区
    y: 47,
    type: 'industrial',
    description: '右侧工业区',
    details: '强荣的员工在工作人员陪同下，从飞达路内用小拖车运出货物'
  },
  {
    id: 'accident-site',
    name: '深江铁路5标段施工现场',
    x: 50, // 北边事故现场，有栅栏围挡
    y: 15,
    type: 'accident',
    description: '事故发生地',
    details: '2024年12月4日23时许，13名现场作业人员失联'
  },
  {
    id: 'intersection',
    name: '洲石路与飞达路交叉口争执现场',
    x: 50, // 两轴交叉处的争执现场
    y: 67,
    type: 'conflict',
    description: '争执现场',
    details: '民警在道路中间绿化带与斑马线的交界处一字排开，形成一道人墙'
  }
];

export default function SatelliteMap({
  className = '',
  onPointClick,
  backgroundImage = '/images/satellite-map.svg' // 默认卫星图
}: SatelliteMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<MapPoint | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // 强制加载超时机制
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!imageLoaded) {
        console.log('强制设置图片为已加载（超时）');
        setImageLoaded(true);
      }
    }, 3000); // 3秒后强制显示

    return () => clearTimeout(timer);
  }, [imageLoaded]);

  const handlePointClick = (point: MapPoint) => {
    setSelectedPoint(point);
    onPointClick?.(point);
  };

  const getPointColor = (type: MapPoint['type']) => {
    switch (type) {
      case 'industrial':
        return 'bg-blue-500 border-blue-300';
      case 'conflict':
        return 'bg-green-500 border-green-300';
      case 'accident':
        return 'bg-red-500 border-red-300';
      case 'road':
        return 'bg-yellow-500 border-yellow-300';
      default:
        return 'bg-gray-500 border-gray-300';
    }
  };

  const getPointSize = (type: MapPoint['type']) => {
    return type === 'accident' ? 'w-5 h-5' : 'w-4 h-4';
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 卫星图背景 */}
      <div 
        ref={mapRef}
        className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden"
      >
        {/* 背景图片 */}
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt="洲石路卫星图"
            width="800"
            height="600"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              minWidth: '100%',
              minHeight: '100%',
              maxWidth: 'none',
              maxHeight: 'none'
            }}
            onLoad={(e) => {
              console.log('卫星图加载成功:', backgroundImage);
              console.log('图片尺寸:', (e.target as HTMLImageElement).naturalWidth, 'x', (e.target as HTMLImageElement).naturalHeight);
              console.log('图片完整性:', (e.target as HTMLImageElement).complete);
              setImageLoaded(true);
            }}
            onError={(e) => {
              console.error('卫星图加载失败:', backgroundImage);
              console.error('错误详情:', e);
              // 尝试使用简单版本作为备选
              if (backgroundImage === '/images/satellite-map.svg') {
                console.log('尝试加载简单版本...');
                (e.target as HTMLImageElement).src = '/images/satellite-map-simple.svg';
              } else {
                setImageLoaded(true); // 即使失败也设置为已加载，显示错误状态
              }
            }}
          />
          
          {/* 如果图片未加载，显示默认背景 */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 flex flex-col items-center justify-center">
              <div className="text-white text-sm mb-2">加载卫星图中...</div>
              <div className="text-gray-400 text-xs">{backgroundImage}</div>
              <div className="mt-4 w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* 半透明遮罩，增强标注点的可见性 */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* 地图标注点 */}
        {imageLoaded && mapPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHoveredPoint(point)}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={() => handlePointClick(point)}
          >
            {/* 点位标记 */}
            <div className={`
              ${getPointColor(point.type)} 
              ${getPointSize(point.type)} 
              rounded-full border-2 border-white shadow-lg
              ${selectedPoint?.id === point.id ? 'ring-4 ring-white/50' : ''}
            `} />
            
            {/* 脉冲动画（仅事故点） */}
            {point.type === 'accident' && (
              <motion.div
                className="absolute inset-0 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 2.5, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* 标签 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
              <div className="bg-black/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-white/20">
                {point.name}
              </div>
            </div>
          </motion.div>
        ))}

        {/* 道路连接线 - 更新位置以匹配新SVG设计 */}
        {imageLoaded && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
            <defs>
              <pattern id="roadPattern" patternUnits="userSpaceOnUse" width="10" height="2">
                <rect width="5" height="2" fill="white" />
                <rect x="5" width="5" height="2" fill="transparent" />
              </pattern>
            </defs>

            {/* 洲石路主干道 (纵轴，正中间) */}
            <line
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              stroke="url(#roadPattern)"
              strokeWidth="3"
              opacity="0.6"
            />

            {/* 飞达路 (横轴，下三分之一位置) */}
            <line
              x1="0%"
              y1="67%"
              x2="100%"
              y2="67%"
              stroke="url(#roadPattern)"
              strokeWidth="3"
              opacity="0.6"
            />
          </svg>
        )}
      </div>

      {/* 悬浮信息卡片 */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 bg-black/95 text-white p-4 rounded-lg max-w-xs z-20 backdrop-blur-sm border border-white/20"
          >
            <h3 className="font-semibold text-lg mb-2">{hoveredPoint.name}</h3>
            <p className="text-sm text-gray-300 mb-2">{hoveredPoint.description}</p>
            {hoveredPoint.details && (
              <p className="text-xs text-gray-400">{hoveredPoint.details}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 详细信息面板 */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-4 right-4 bg-black/95 text-white p-6 rounded-lg backdrop-blur-sm z-20 border border-white/20"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl">{selectedPoint.name}</h3>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 mb-3">{selectedPoint.description}</p>
            {selectedPoint.details && (
              <p className="text-sm text-gray-400 leading-relaxed">{selectedPoint.details}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图例 */}
      <div className="absolute top-4 left-4 bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm z-10 border border-white/20">
        <h4 className="font-semibold mb-3 text-sm">图例</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-red-300"></div>
            <span>事故现场</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full border border-blue-300"></div>
            <span>工业区</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full border border-green-300"></div>
            <span>争执现场</span>
          </div>
        </div>
      </div>

      {/* 清除选择按钮 */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={() => setSelectedPoint(null)}
          className="bg-black/80 text-white p-2 rounded border border-white/20 hover:bg-black/90 transition-colors text-xs"
          title="清除选择"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
