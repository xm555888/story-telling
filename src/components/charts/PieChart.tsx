import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PieData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  title: string;
  className?: string;
}

export function PieChart({ data, title, className = '' }: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = svgRef.current;
    const size = 300;
    const radius = 100;
    const centerX = size / 2;
    const centerY = size / 2;

    // 清空之前的内容
    svg.innerHTML = '';

    // 设置SVG尺寸
    svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

    // 计算角度
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // 从顶部开始

    data.forEach((item, index) => {
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // 转换为弧度
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // 计算路径点
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      // 大弧标志
      const largeArcFlag = angle > 180 ? 1 : 0;

      // 创建路径
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', item.color);
      path.setAttribute('stroke', '#1f2937');
      path.setAttribute('stroke-width', '2');
      svg.appendChild(path);

      // 添加标签
      const labelAngle = startAngle + angle / 2;
      const labelRad = (labelAngle * Math.PI) / 180;
      const labelRadius = radius + 30;
      const labelX = centerX + labelRadius * Math.cos(labelRad);
      const labelY = centerY + labelRadius * Math.sin(labelRad);

      // 标签文字
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX.toString());
      text.setAttribute('y', labelY.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('fill', '#e5e7eb');
      text.setAttribute('font-size', '12');
      text.setAttribute('font-weight', 'bold');
      text.textContent = `${item.label} ${item.percentage}%`;
      svg.appendChild(text);

      // 连接线
      const lineX = centerX + (radius + 10) * Math.cos(labelRad);
      const lineY = centerY + (radius + 10) * Math.sin(labelRad);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', lineX.toString());
      line.setAttribute('y1', lineY.toString());
      line.setAttribute('x2', (centerX + (radius + 20) * Math.cos(labelRad)).toString());
      line.setAttribute('y2', (centerY + (radius + 20) * Math.sin(labelRad)).toString());
      line.setAttribute('stroke', '#6b7280');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);

      currentAngle += angle;
    });

  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className={`w-full ${className}`}
    >
      <h3 className="text-lg font-bold text-white mb-4 text-center">{title}</h3>
      <div className="bg-black/30 rounded-lg p-6 backdrop-blur-sm border border-white/10">
        <svg
          ref={svgRef}
          className="w-full h-auto mx-auto"
          style={{ maxWidth: '300px', maxHeight: '300px' }}
        />
        
        {/* 图例 */}
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300">{item.label}</span>
              </div>
              <div className="text-white font-medium">
                {item.value}篇 ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
