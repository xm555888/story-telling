'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MapPoint {
  id: string;
  name: string;
  x: number; // 百分比位置
  y: number; // 百分比位置
  type: 'industrial' | 'conflict' | 'accident' | 'road';
  description?: string;
  details?: string;
  image?: string; // 详情图片URL
  images?: string[]; // 多张图片URL数组
}

interface SatelliteMapProps {
  className?: string;
  onPointClick?: (point: MapPoint) => void;
  backgroundImage?: string; // 卫星图片URL
  selectedPointId?: string; // 当前选中的点ID
  showHoverTooltip?: boolean; // 是否显示悬浮提示
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
    details: '警戒线外，在富源工业城工作的老谢表现出相当地克制，他告诉记者："民警也不容易，人多闹事没有意义，最好的办法是工业城和政府各派代表协商一下，如果可以的话就派代表进去，取一些必要的财物就出来，如果太过危险也希望有官方能派人出来解释里面的情况，安抚一下。"',
    image: '/images/fy.svg'
  },
  {
    id: 'qiangrong',
    name: '强荣东工业园',
    x: 76, // 右侧工业区
    y: 47,
    type: 'industrial',
    description: '右侧工业区',
    details: '强荣的几位员工在现场工作人员的陪同下，从飞达路内用小拖车运出一箱箱货物。一位富源工业城的工头忿忿不平地说："人家强荣的比我们团结，能找到代表进去拿东西，我们也该聚起来，你们找个代表来跟我们谈。我们也要进去拿东西出来。"\n\n"我们只是尽职来维持秩序，决定不了这些，还请大家配合。"一位年轻些的民警尽可能劝导着人群，仍架不住人群的怒火。\n\n"街道办、居委会的电话都打不通！"\n\n"人家周末休息呢，全都摆烂了。"\n\n"三天了，你们到底有没有应急预案？"\n\n"我们外面活人的事情到底还管不管？"\n\n现场有民警听不下去，大声谴责："人命关天，里面救援这么久，人家失联人员家属就在旁边，你说这种话，还有良心吗？"人群短暂安静了片刻，又有人开始嘀咕起来。\n\n双向马路中央的绿化带边停着救护车，失联人员家属坐在牙子上，一众工作人员围在他们身边进行安抚。事故封闭路口陆陆续续驶出装满泥沙的重型卡车，时不时有救援车辆进入，依然有人不顾阻挠，来回横穿马路。民警沉默，一次又一次拉起警戒线。',
    image: '/images/qrd.svg'
  },
  {
    id: 'accident-site',
    name: '深江铁路5标段施工现场',
    x: 50, // 北边事故现场，有栅栏围挡
    y: 15,
    type: 'accident',
    description: '事故发生地',
    details: '塌方路段冰冷的地表以下，还掩埋着13名遇难者，“失踪”是他们留在世人眼中最后的信息。'
  },
  {
    id: 'intersection',
    name: '洲石路与飞达路交叉口争执现场',
    x: 50, // 两轴交叉处的争执现场
    y: 67,
    type: 'conflict',
    description: '争执现场',
    details: '人群还在继续躁动。正午，有人提议大家去附近高楼楼顶"集体跳楼示威"，带头喧闹的几人风风火火地离开。直到下午四点，记者并未见有人攀上附近的楼顶，后来也再未见到这些人回到现场。\n\n聚集在路口的工人大多为附近工人与工厂主，诉求是复工和补偿；而对于附近住户来说，主要影响是交通、住所和生活物资问题。\n\n周围店铺老板告诉记者，下午六点左右路面发出异响，约八点道路封闭，十一点钟听见有人手持扩音喇叭在员工宿舍一带紧急疏散。员工普遍反映，疏散人员原称"估计三四天可以复工"。\n\n紧急疏散后部分住户被安置在附近的酒店，但聚集在十字路口"抗议"的住户反映没有得到安置，还有住户反映自己在航城街道网格综合管理中心临时休息。\n\n航城街道网格综合管理中心六楼会议室内，横七竖八地分散着几张折叠床，床上堆着凌乱的被褥。工作人员告诉记者，这间会议室在事故发生后作为临时安置点接待疏散人群，"5号晚上有几号人在这里睡过，不过一大早他们就又走了，也不知道去了哪里。"\n\n会议桌上摆放着矿泉水、面包和几床尚未开封的被褥。管理中心的办公区只有一位工作人员驻守，他告诉记者，事故发生之后，街道办和社区的工作压力很大，人手不够，其他同事全部被派往街道各处，对接疏散群众去了。',
    images: ['/images/zs1.svg', '/images/zs2.svg']
  }
];

export default function SatelliteMap({
  className = '',
  onPointClick,
  backgroundImage = '/images/simplified-map.svg', // 默认简化地图
  selectedPointId,
  showHoverTooltip = true
}: SatelliteMapProps) {
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
      {/* 地图背景 - 完全透明融入页面 */}
      <div
        ref={mapRef}
        className="relative w-full h-full bg-transparent overflow-hidden"
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
            <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center">
              <div className="text-white text-sm mb-2 bg-black/70 px-3 py-1 rounded">加载地图中...</div>
              <div className="text-gray-400 text-xs bg-black/50 px-2 py-1 rounded">{backgroundImage}</div>
              <div className="mt-4 w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
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
              ${selectedPointId === point.id ? 'ring-4 ring-white/50' : ''}
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
      {showHoverTooltip && (
        <AnimatePresence>
          {hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 bg-black/80 text-white p-3 rounded max-w-xs z-20 backdrop-blur-sm border border-white/10"
            >
              <h3 className="font-semibold text-lg mb-2">{hoveredPoint.name}</h3>
              <p className="text-sm text-gray-300 mb-2">{hoveredPoint.description}</p>
              {hoveredPoint.details && (
                <p className="text-xs text-gray-400 line-clamp-3">{hoveredPoint.details}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}



      {/* 图例 - 更融合的设计 */}
      <div className="absolute top-4 left-4 bg-black/70 text-white p-3 rounded backdrop-blur-sm z-10 border border-white/10">
        <h4 className="font-medium mb-2 text-xs text-gray-300">图例</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <span className="text-gray-200">事故现场</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
            <span className="text-gray-200">工业区</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            <span className="text-gray-200">争执现场</span>
          </div>
        </div>
      </div>


    </div>
  );
}
