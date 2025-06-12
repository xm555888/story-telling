import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DailyData {
  date: string;
  count: number;
}

interface MediaSuppressionChartProps {
  dailyData: DailyData[];
  title: string;
  className?: string;
}

export function MediaSuppressionChart({ dailyData, title, className = '' }: MediaSuppressionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !dailyData.length) return;

    const svg = svgRef.current;
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // 清空之前的内容
    svg.innerHTML = '';

    // 设置SVG尺寸
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // 创建主容器
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
    svg.appendChild(g);

    // 数据处理
    const maxCount = Math.max(...dailyData.map(d => d.count));
    const xScale = (index: number) => (index / (dailyData.length - 1)) * chartWidth;
    const yScale = (value: number) => chartHeight - (value / maxCount) * chartHeight;

    // 创建网格线
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('class', 'grid');
    g.appendChild(gridGroup);

    // 水平网格线
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * chartHeight;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', y.toString());
      line.setAttribute('x2', chartWidth.toString());
      line.setAttribute('y2', y.toString());
      line.setAttribute('stroke', '#374151');
      line.setAttribute('stroke-width', '0.5');
      line.setAttribute('opacity', '0.3');
      gridGroup.appendChild(line);
    }

    // 创建路径
    const pathData = dailyData.map((d, i) => {
      const x = xScale(i);
      const y = yScale(d.count);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#ef4444');
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    g.appendChild(path);

    // 创建面积填充
    const areaData = `${pathData} L ${xScale(dailyData.length - 1)} ${chartHeight} L ${xScale(0)} ${chartHeight} Z`;
    const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    area.setAttribute('d', areaData);
    area.setAttribute('fill', 'url(#gradient)');
    area.setAttribute('opacity', '0.3');
    g.appendChild(area);

    // 创建渐变
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#ef4444');
    stop1.setAttribute('stop-opacity', '0.8');

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', '#ef4444');
    stop2.setAttribute('stop-opacity', '0.1');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, g);

    // 添加数据点
    dailyData.forEach((d, i) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', xScale(i).toString());
      circle.setAttribute('cy', yScale(d.count).toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#ef4444');
      circle.setAttribute('stroke', '#ffffff');
      circle.setAttribute('stroke-width', '2');
      g.appendChild(circle);

      // 添加数值标签
      if (d.count > 10 || i === 0) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', xScale(i).toString());
        text.setAttribute('y', (yScale(d.count) - 10).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#e5e7eb');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = d.count.toString();
        g.appendChild(text);
      }
    });

    // X轴标签
    dailyData.forEach((d, i) => {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', xScale(i).toString());
      text.setAttribute('y', (chartHeight + 20).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#9ca3af');
      text.setAttribute('font-size', '11');
      text.textContent = d.date;
      g.appendChild(text);
    });

    // Y轴标签
    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxCount / 5) * i);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '-10');
      text.setAttribute('y', (chartHeight - (i / 5) * chartHeight + 4).toString());
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('fill', '#9ca3af');
      text.setAttribute('font-size', '11');
      text.textContent = value.toString();
      g.appendChild(text);
    }

  }, [dailyData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`w-full ${className}`}
    >
      <h3 className="text-xl font-bold text-white mb-4 text-center">{title}</h3>
      <div className="bg-black/30 rounded-lg p-6 backdrop-blur-sm border border-white/10">
        <svg
          ref={svgRef}
          className="w-full h-auto"
          style={{ maxHeight: '400px' }}
        />
      </div>
    </motion.div>
  );
}
