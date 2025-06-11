// 数据类型定义
export interface AccidentData {
  road_type: string;
  accident_time: string;
  accident_location: string;
  injury_statistics: string;
  accident_report: string;
  construction_company: string | null;
  completion_time: string | null;
  normal_lifespan: string | null;
  maintenance_cycle: string | null;
  time_since_completion: string | null;
  url: string;
  error: string | null;
}

export interface MediaData {
  article_character_count: number;
  publisher_id_location: string;
  publish_time: number;
  publisher_name: string;
  publisher_type: string;
  publish_form_type: string;
  content_type: string;
  on_site_video: string;
  url: string;
  error: string | null;
}

export interface ProcessedAccidentData extends AccidentData {
  id: string;
  parsedDate: Date | null;
  province: string;
  casualties: number;
  roadTypeCategory: 'highway' | 'bridge' | 'railway' | 'tunnel' | 'other';
}

export interface ProcessedMediaData extends MediaData {
  id: string;
  parsedDate: Date | null;
  isGovernmentSource: boolean;
  hasVideo: boolean;
}

// 数据处理函数
export class DataProcessor {
  // 解析时间字符串
  static parseTimeString(timeStr: string): Date | null {
    if (!timeStr || timeStr === 'null') return null;
    
    try {
      // 处理各种时间格式
      const patterns = [
        /(\d{4})年(\d{1,2})月(\d{1,2})日/,
        /(\d{4})-(\d{1,2})-(\d{1,2})/,
        /(\d{1,2})月(\d{1,2})日/,
      ];
      
      for (const pattern of patterns) {
        const match = timeStr.match(pattern);
        if (match) {
          const year = match[1] ? parseInt(match[1]) : new Date().getFullYear();
          const month = parseInt(match[2] || match[1]) - 1;
          const day = parseInt(match[3] || match[2]);
          return new Date(year, month, day);
        }
      }
      
      return new Date(timeStr);
    } catch {
      return null;
    }
  }

  // 提取省份信息
  static extractProvince(location: string): string {
    if (!location) return '未知';
    
    const provinces = [
      '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
      '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南',
      '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
      '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'
    ];
    
    for (const province of provinces) {
      if (location.includes(province)) {
        return province;
      }
    }
    
    return '未知';
  }

  // 提取伤亡人数
  static extractCasualties(injuryStats: string): number {
    if (!injuryStats) return 0;
    
    const patterns = [
      /(\d+)人死亡/,
      /(\d+)人失联/,
      /(\d+)人失踪/,
      /死亡(\d+)人/,
      /失联(\d+)人/,
    ];
    
    let total = 0;
    for (const pattern of patterns) {
      const match = injuryStats.match(pattern);
      if (match) {
        total += parseInt(match[1]);
      }
    }
    
    return total;
  }

  // 分类道路类型
  static categorizeRoadType(roadType: string): 'highway' | 'bridge' | 'railway' | 'tunnel' | 'other' {
    if (!roadType) return 'other';
    
    if (roadType.includes('高速') || roadType.includes('公路')) return 'highway';
    if (roadType.includes('桥') || roadType.includes('大桥')) return 'bridge';
    if (roadType.includes('铁路') || roadType.includes('地铁')) return 'railway';
    if (roadType.includes('隧道')) return 'tunnel';
    
    return 'other';
  }

  // 处理事故数据
  static processAccidentData(rawData: any[]): ProcessedAccidentData[] {
    return rawData.map((item, index) => ({
      ...item,
      id: `accident-${index}`,
      parsedDate: this.parseTimeString(item.accident_time),
      province: this.extractProvince(item.accident_location),
      casualties: this.extractCasualties(item.injury_statistics),
      roadTypeCategory: this.categorizeRoadType(item.road_type),
    }));
  }

  // 处理媒体数据
  static processMediaData(rawData: any[]): ProcessedMediaData[] {
    return rawData.map((item, index) => ({
      ...item,
      id: `media-${index}`,
      parsedDate: this.excelDateToJSDate(item.publish_time),
      isGovernmentSource: this.isGovernmentPublisher(item.publisher_type),
      hasVideo: item.on_site_video === '有',
    }));
  }

  // Excel日期转换
  static excelDateToJSDate(excelDate: number): Date | null {
    if (!excelDate || typeof excelDate !== 'number') return null;
    
    // Excel日期从1900年1月1日开始计算
    const excelEpoch = new Date(1900, 0, 1);
    const jsDate = new Date(excelEpoch.getTime() + (excelDate - 1) * 24 * 60 * 60 * 1000);
    return jsDate;
  }

  // 判断是否为政府发布者
  static isGovernmentPublisher(publisherType: string): boolean {
    return publisherType === '政府官方账号';
  }

  // 获取统计数据
  static getAccidentStatistics(data: ProcessedAccidentData[]) {
    const stats = {
      totalAccidents: data.length,
      totalCasualties: data.reduce((sum, item) => sum + item.casualties, 0),
      byProvince: {} as Record<string, number>,
      byRoadType: {} as Record<string, number>,
      byYear: {} as Record<string, number>,
      recentAccidents: data
        .filter(item => item.parsedDate)
        .sort((a, b) => (b.parsedDate?.getTime() || 0) - (a.parsedDate?.getTime() || 0))
        .slice(0, 10),
    };

    // 按省份统计
    data.forEach(item => {
      stats.byProvince[item.province] = (stats.byProvince[item.province] || 0) + 1;
    });

    // 按道路类型统计
    data.forEach(item => {
      const type = item.roadTypeCategory;
      stats.byRoadType[type] = (stats.byRoadType[type] || 0) + 1;
    });

    // 按年份统计
    data.forEach(item => {
      if (item.parsedDate) {
        const year = item.parsedDate.getFullYear().toString();
        stats.byYear[year] = (stats.byYear[year] || 0) + 1;
      }
    });

    return stats;
  }

  // 获取媒体统计数据
  static getMediaStatistics(data: ProcessedMediaData[]) {
    const stats = {
      totalArticles: data.length,
      byPublisherType: {} as Record<string, number>,
      byLocation: {} as Record<string, number>,
      withVideo: data.filter(item => item.hasVideo).length,
      governmentSources: data.filter(item => item.isGovernmentSource).length,
      averageLength: Math.round(
        data.reduce((sum, item) => sum + item.article_character_count, 0) / data.length
      ),
    };

    // 按发布者类型统计
    data.forEach(item => {
      stats.byPublisherType[item.publisher_type] = 
        (stats.byPublisherType[item.publisher_type] || 0) + 1;
    });

    // 按地区统计
    data.forEach(item => {
      stats.byLocation[item.publisher_id_location] = 
        (stats.byLocation[item.publisher_id_location] || 0) + 1;
    });

    return stats;
  }
}
