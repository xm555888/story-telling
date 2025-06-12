// 数据处理工具函数

// Excel日期转换为JavaScript Date
export function excelDateToJSDate(excelDate: number): Date {
  // Excel日期是从1900年1月1日开始的天数
  const excelEpoch = new Date(1900, 0, 1);
  const jsDate = new Date(excelEpoch.getTime() + (excelDate - 1) * 24 * 60 * 60 * 1000);
  return jsDate;
}

// 格式化日期为中文显示
export function formatChineseDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}月${day}日`;
}

// 处理洲石路数据
export interface ProcessedArticle {
  id: string;
  characterCount: number;
  publisherLocation: string;
  publishTime: Date;
  publishTimeFormatted: string;
  publisherName: string;
  publisherType: '政府官方账号' | '新闻媒体' | '自媒体';
  publishFormType: string;
  contentType: string;
  hasVideo: boolean;
  url: string;
}

export interface DailyStats {
  date: string;
  count: number;
  articles: ProcessedArticle[];
}

export interface PublisherTypeStats {
  type: string;
  count: number;
  percentage: number;
}

export interface LocationStats {
  location: string;
  count: number;
  percentage: number;
}

export function processZSLData(rawData: any[]): {
  articles: ProcessedArticle[];
  dailyStats: DailyStats[];
  publisherTypeStats: PublisherTypeStats[];
  locationStats: LocationStats[];
  totalArticles: number;
  peakDay: { date: string; count: number };
} {
  // 处理文章数据
  const articles: ProcessedArticle[] = rawData.map((item, index) => {
    const publishDate = excelDateToJSDate(item.publish_time);
    return {
      id: `article-${index}`,
      characterCount: item.article_character_count,
      publisherLocation: item.publisher_id_location,
      publishTime: publishDate,
      publishTimeFormatted: formatChineseDate(publishDate),
      publisherName: item.publisher_name,
      publisherType: item.publisher_type,
      publishFormType: item.publish_form_type,
      contentType: item.content_type,
      hasVideo: item.on_site_video === '有',
      url: item.url
    };
  });

  // 按日期分组统计
  const dailyMap = new Map<string, ProcessedArticle[]>();
  articles.forEach(article => {
    const dateKey = article.publishTimeFormatted;
    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, []);
    }
    dailyMap.get(dateKey)!.push(article);
  });

  const dailyStats: DailyStats[] = Array.from(dailyMap.entries())
    .map(([date, articles]) => ({
      date,
      count: articles.length,
      articles
    }))
    .sort((a, b) => {
      // 按日期排序
      const dateA = new Date(`2024-12-${a.date.replace('月', '-').replace('日', '')}`);
      const dateB = new Date(`2024-12-${b.date.replace('月', '-').replace('日', '')}`);
      return dateA.getTime() - dateB.getTime();
    });

  // 发布者类型统计
  const publisherTypeMap = new Map<string, number>();
  articles.forEach(article => {
    const type = article.publisherType;
    publisherTypeMap.set(type, (publisherTypeMap.get(type) || 0) + 1);
  });

  const publisherTypeStats: PublisherTypeStats[] = Array.from(publisherTypeMap.entries())
    .map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / articles.length) * 100)
    }))
    .sort((a, b) => b.count - a.count);

  // 地域统计（广东 vs 非广东）
  const guangdongCount = articles.filter(a => a.publisherLocation === '广东').length;
  const nonGuangdongCount = articles.length - guangdongCount;

  const locationStats: LocationStats[] = [
    {
      location: '广东',
      count: guangdongCount,
      percentage: Math.round((guangdongCount / articles.length) * 100)
    },
    {
      location: '非广东',
      count: nonGuangdongCount,
      percentage: Math.round((nonGuangdongCount / articles.length) * 100)
    }
  ];

  // 找出发文高峰日
  const peakDay = dailyStats.reduce((max, current) => 
    current.count > max.count ? current : max
  );

  return {
    articles,
    dailyStats,
    publisherTypeStats,
    locationStats,
    totalArticles: articles.length,
    peakDay
  };
}

// 获取独家报道统计
export function getExclusiveStats(articles: ProcessedArticle[]) {
  const exclusiveArticles = articles.filter(a => a.publishFormType === '独家');
  const exclusiveByMedia = exclusiveArticles.filter(a => a.publisherType === '新闻媒体');
  
  return {
    totalExclusive: exclusiveArticles.length,
    exclusiveByMedia: exclusiveByMedia.length,
    exclusivePercentage: Math.round((exclusiveArticles.length / articles.length) * 100)
  };
}

// 获取视频文章统计
export function getVideoStats(articles: ProcessedArticle[]) {
  const videoArticles = articles.filter(a => a.hasVideo);
  
  return {
    totalWithVideo: videoArticles.length,
    videoPercentage: Math.round((videoArticles.length / articles.length) * 100)
  };
}
