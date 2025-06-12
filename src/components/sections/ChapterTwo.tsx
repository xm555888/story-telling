import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MediaSuppressionChart } from '../charts/MediaSuppressionChart';
import { PieChart } from '../charts/PieChart';
import { StatCard, StatIcons } from '../charts/StatCard';
import { processZSLData, getExclusiveStats, getVideoStats } from '../../utils/dataProcessor';

interface ChapterTwoProps {
  className?: string;
}

export function ChapterTwo({ className = '' }: ChapterTwoProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 加载数据
    const loadData = async () => {
      try {
        const response = await fetch('/data/zsl-data.json');
        const jsonData = await response.json();
        const processedData = processZSLData(jsonData.Sheet1.data);
        
        // 获取额外统计
        const exclusiveStats = getExclusiveStats(processedData.articles);
        const videoStats = getVideoStats(processedData.articles);
        
        setData({
          ...processedData,
          exclusiveStats,
          videoStats
        });
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">加载数据中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-xl">数据加载失败</div>
      </div>
    );
  }

  // 准备图表数据
  const dailyChartData = data.dailyStats.map((stat: any) => ({
    date: stat.date,
    count: stat.count
  }));

  const publisherTypeChartData = data.publisherTypeStats.map((stat: any, index: number) => ({
    label: stat.type,
    value: stat.count,
    percentage: stat.percentage,
    color: ['#3b82f6', '#10b981', '#f59e0b'][index] || '#6b7280'
  }));

  const locationChartData = data.locationStats.map((stat: any, index: number) => ({
    label: stat.location,
    value: stat.count,
    percentage: stat.percentage,
    color: index === 0 ? '#ef4444' : '#6b7280'
  }));

  return (
    <section className={`min-h-screen bg-gradient-to-b from-gray-900 to-black ${className}`}>
      {/* 章节标题 */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-white mb-6">掩埋</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            从救援的终结到信息的消失，170篇文章见证了一个事件如何从公众视野中逐渐淡出
          </p>
        </motion.div>

        {/* 第一部分：救援的终结 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">救援的终结</h2>
            <div className="bg-black/40 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  <span className="text-red-400 font-bold">12月8日</span>，塌方现场的南方电网抢修工人告诉记者，
                  截止当日，无人获救，仍在进行紧急抢救，挖掘机下沉了两辆。
                </p>
                <p className="text-lg">
                  知情人士向记者透露，最终为了防止地面塌陷扩大，现场被迫放弃救援开始掩埋坑洞，
                  <span className="text-white font-bold">13名失踪者再未出现过</span>。
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 第二部分：媒体的短暂关注 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">媒体的短暂关注</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="text-xl font-bold text-blue-400 mb-4">深圳广播电视台</h3>
                <p className="text-gray-300 leading-relaxed">
                  8日上午11时，一辆印有"深圳广播电视台"字样的黑色轿车驶达人群聚集的十字路口，
                  与现场民警交涉了约<span className="text-yellow-400 font-bold">5分钟</span>，掉头离开。
                </p>
              </div>
              <div className="bg-black/40 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                <h3 className="text-xl font-bold text-green-400 mb-4">学生记者的遭遇</h3>
                <p className="text-gray-300 leading-relaxed">
                  深圳大学传播学院学生记者于下午四点前往航城街道社区站媒体接待处，
                  当日晚，学生记者上级老师接到了航城街道<span className="text-red-400 font-bold">"核实身份"</span>的电话。
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 第三部分：信息的消失 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mb-20"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">信息的消失</h2>
            
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <StatCard
                title="总文章数"
                value={data.totalArticles}
                subtitle="篇"
                color="blue"
                icon={<StatIcons.Article />}
              />
              <StatCard
                title="发文高峰"
                value={data.peakDay.date}
                subtitle={`${data.peakDay.count}篇`}
                color="red"
                icon={<StatIcons.Calendar />}
              />
              <StatCard
                title="独家报道"
                value={data.exclusiveStats.totalExclusive}
                subtitle={`专业媒体仅${data.exclusiveStats.exclusiveByMedia}篇`}
                color="yellow"
                icon={<StatIcons.Media />}
              />
              <StatCard
                title="含视频文章"
                value={`${data.videoStats.videoPercentage}%`}
                subtitle={`${data.videoStats.totalWithVideo}篇`}
                color="green"
                icon={<StatIcons.Video />}
              />
            </div>

            {/* 主要图表 */}
            <div className="mb-12">
              <MediaSuppressionChart
                dailyData={dailyChartData}
                title="12月5-11日每日发文数量变化"
              />
            </div>

            {/* 分析图表 */}
            <div className="grid md:grid-cols-2 gap-8">
              <PieChart
                data={publisherTypeChartData}
                title="发布者类型分布"
              />
              <PieChart
                data={locationChartData}
                title="发布者地域分布"
              />
            </div>
          </div>
        </motion.div>

        {/* 第四部分：数据揭示的真相 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">数据揭示的真相</h2>
            <div className="bg-black/40 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  此前一日，三联周刊晚间七点发布了一篇谈论洲石路封路对于周围交通、生活用水用电影响的文章，
                  次日清晨，<span className="text-red-400 font-bold">该文章已显示不可见</span>。
                </p>
                <p className="text-lg">
                  在2025年4月洲石路同路段再次因为施工事故封路之前，
                  关于12月塌方的文章<span className="text-white font-bold">仅存7篇</span>。
                </p>
                <p className="text-lg">
                  170篇文章中，<span className="text-yellow-400 font-bold">独家文章仅8篇</span>，
                  8篇独家文章中<span className="text-red-400 font-bold">仅一篇来自专业新闻媒体</span>。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
