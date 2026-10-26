import {
  AnalyticsMonthlyData,
  CategoryBreakdown,
  FunnelStage,
  mockCategoryBreakdown,
  mockConversionFunnel,
  mockMonthlyTrends,
} from '../data/analytics';
import { mockCampaigns } from '../data/marketing';
import { Campaign } from '../types';
import { delay } from './apiHelper';

export const analyticsService = {
  async getMonthlyTrends(): Promise<AnalyticsMonthlyData[]> {
    await delay(350);
    return [...mockMonthlyTrends];
  },

  async getCategoryBreakdown(): Promise<CategoryBreakdown[]> {
    await delay(350);
    return [...mockCategoryBreakdown];
  },

  async getConversionFunnel(): Promise<FunnelStage[]> {
    await delay(350);
    return [...mockConversionFunnel];
  },

  async getCampaigns(): Promise<Campaign[]> {
    await delay(350);
    return [...mockCampaigns];
  },
};
