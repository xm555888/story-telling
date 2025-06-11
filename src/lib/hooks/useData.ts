'use client';

import { useState, useEffect } from 'react';
import { DataProcessor, ProcessedAccidentData, ProcessedMediaData } from '../data/dataProcessor';

interface UseDataReturn {
  accidentData: ProcessedAccidentData[];
  mediaData: ProcessedMediaData[];
  accidentStats: ReturnType<typeof DataProcessor.getAccidentStatistics> | null;
  mediaStats: ReturnType<typeof DataProcessor.getMediaStatistics> | null;
  loading: boolean;
  error: string | null;
}

export function useData(): UseDataReturn {
  const [accidentData, setAccidentData] = useState<ProcessedAccidentData[]>([]);
  const [mediaData, setMediaData] = useState<ProcessedMediaData[]>([]);
  const [accidentStats, setAccidentStats] = useState<ReturnType<typeof DataProcessor.getAccidentStatistics> | null>(null);
  const [mediaStats, setMediaStats] = useState<ReturnType<typeof DataProcessor.getMediaStatistics> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // 加载事故数据
        const accidentResponse = await fetch('/data/accident-data.json');
        if (!accidentResponse.ok) {
          throw new Error('Failed to load accident data');
        }
        const accidentJson = await accidentResponse.json();
        
        // 加载媒体数据
        const mediaResponse = await fetch('/data/zsl-data.json');
        if (!mediaResponse.ok) {
          throw new Error('Failed to load media data');
        }
        const mediaJson = await mediaResponse.json();

        // 处理数据
        const processedAccidentData = DataProcessor.processAccidentData(
          accidentJson.Sheet1?.data || []
        );
        const processedMediaData = DataProcessor.processMediaData(
          mediaJson.Sheet1?.data || []
        );

        // 生成统计数据
        const accidentStatistics = DataProcessor.getAccidentStatistics(processedAccidentData);
        const mediaStatistics = DataProcessor.getMediaStatistics(processedMediaData);

        // 更新状态
        setAccidentData(processedAccidentData);
        setMediaData(processedMediaData);
        setAccidentStats(accidentStatistics);
        setMediaStats(mediaStatistics);

      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    accidentData,
    mediaData,
    accidentStats,
    mediaStats,
    loading,
    error,
  };
}

// 专门用于获取洲石路相关数据的Hook
export function useZslData() {
  const { mediaData, mediaStats, loading, error } = useData();
  
  // 过滤洲石路相关的媒体报道
  const zslMediaData = mediaData.filter(item => 
    item.publisher_id_location === '广东' || 
    item.publisher_name.includes('深圳') ||
    item.publisher_name.includes('宝安')
  );

  return {
    zslMediaData,
    totalReports: zslMediaData.length,
    mediaStats,
    loading,
    error,
  };
}

// 获取特定省份的事故数据
export function useProvinceData(province?: string) {
  const { accidentData, loading, error } = useData();
  
  const provinceData = province 
    ? accidentData.filter(item => item.province === province)
    : accidentData;

  return {
    provinceData,
    totalAccidents: provinceData.length,
    totalCasualties: provinceData.reduce((sum, item) => sum + item.casualties, 0),
    loading,
    error,
  };
}
