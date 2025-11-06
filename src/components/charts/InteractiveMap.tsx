'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapPoint {
  id: string;
  name: string;
  x: number; // 百分比位置
  y: number; // 百分比位置
  type: 'industrial' | 'residential' | 'accident' | 'road';
  description?: string;
  details?: string;
}

interface InteractiveMapProps {
  className?: string;
  onPointClick?: (point: MapPoint) => void;
}

// 基于提供的地图标注点位
const mapPoints: MapPoint[] = [
  {
    id: 'fuyuan',
    name: '富源工业城',
    x: 25,
    y: 45,
    type: 'industrial',
    description: '左侧工业区',
    details: '富源工业城的老板和员工聚集抗议，要求复工和进入取物'
  },
  {
    id: 'qiangrong',
    name: '强荣东工业园',
    x: 75,
    y: 40,
    type: 'industrial',
    description: '右侧工业区',
    details: '强荣的员工在工作人员陪同下，从飞达路内用小拖车运出货物'
  },
  {
    id: 'accident-site',
    name: '深江铁路5标段施工现场',
    x: 50,
    y: 55,
    type: 'accident',
    description: '事故发生地',
    details: '2024年12月4日23时许，13名现场作业人员失联'
  },
  {
    id: 'zhoushi-road',
    name: '洲石路',
    x: 50,
    y: 50,
    type: 'road',
    description: '封锁路段',
    details: '以洲石路为界，左侧是富源工业城，右侧是强荣东工业园'
  },
  {
    id: 'feida-road',
    name: '飞达路',
    x: 60,
    y: 35,
    type: 'road',
    description: '交叉路口',
    details: '洲石路与飞达路交叉路口，人声嘈杂，现场显得很混乱'
  },
  {
    id: 'intersection',
    name: '争执十字路口',
    x: 55,
    y: 45,
    type: 'residential',
    description: '冲突现场',
    details: '民警在道路中间绿化带与斑马线的交界处一字排开，形成一道人墙'
  }
];

export default function InteractiveMap({ className = '', onPointClick }: InteractiveMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<MapPoint | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handlePointClick = (point: MapPoint) => {
    setSelectedPoint(point);
    onPointClick?.(point);
  };

  const getPointColor = (type: MapPoint['type']) => {
    switch (type) {
      case 'industrial':
        return 'bg-blue-500';
      case 'residential':
        return 'bg-green-500';
      case 'accident':
        return 'bg-red-500';
      case 'road':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPointSize = (type: MapPoint['type']) => {
    return type === 'accident' ? 'w-4 h-4' : 'w-3 h-3';
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* 地图背景 */}
      <div 
        ref={mapRef}
        className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* 地图点位 */}
        {mapPoints.map((point) => (
          <motion.div
            key={point.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
            }}
            whileHover={{ scale: 1.2 }}
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
                  scale: [1, 2, 1],
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
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {point.name}
              </div>
            </div>
          </motion.div>
        ))}

        {/* 连接线（洲石路） */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern id="roadPattern" patternUnits="userSpaceOnUse" width="10" height="2">
              <rect width="5" height="2" fill="white" />
              <rect x="5" width="5" height="2" fill="transparent" />
            </pattern>
          </defs>
          
          {/* 洲石路主干道 */}
          <line
            x1="50%"
            y1="20%"
            x2="50%"
            y2="80%"
            stroke="url(#roadPattern)"
            strokeWidth="3"
            opacity="0.6"
          />
          
          {/* 飞达路 */}
          <line
            x1="20%"
            y1="45%"
            x2="80%"
            y2="45%"
            stroke="url(#roadPattern)"
            strokeWidth="2"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* 悬浮信息卡片 */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-xs z-20 backdrop-blur-sm"
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
            className="absolute bottom-4 left-4 right-4 bg-black/95 text-white p-6 rounded-lg backdrop-blur-sm z-20"
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
      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm z-10">
        <h4 className="font-semibold mb-3 text-sm">图例</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>事故现场</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>工业区</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>道路</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>冲突点</span>
          </div>
        </div>
      </div>
    </div>
  );
}
