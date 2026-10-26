import { mockDashboardStats } from '../data/dashboard';
import { OwnerDashboardStats } from '../types';
import { delay } from './apiHelper';

export const dashboardService = {
  async getStats(): Promise<OwnerDashboardStats> {
    return delay(mockDashboardStats, 450);
  },
};
