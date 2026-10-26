export interface AnalyticsMonthlyData {
  month: string;
  revenue: number; // in INR
  bookings: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
  revenue: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  rate: string;
}

export const mockMonthlyTrends: AnalyticsMonthlyData[] = [
  { month: 'May', revenue: 2100000, bookings: 1 },
  { month: 'Jun', revenue: 1450000, bookings: 2 },
  { month: 'Jul', revenue: 980000, bookings: 1 },
  { month: 'Aug', revenue: 3200000, bookings: 3 },
  { month: 'Sep', revenue: 2850000, bookings: 2 },
  { month: 'Oct', revenue: 4720000, bookings: 5 },
  { month: 'Nov', revenue: 5400000, bookings: 6 },
  { month: 'Dec', revenue: 6800000, bookings: 8 },
];

export const mockCategoryBreakdown: CategoryBreakdown[] = [
  { category: 'Weddings', count: 18, percentage: 48, revenue: 33300000 },
  { category: 'Engagements', count: 9, percentage: 24, revenue: 5850000 },
  { category: 'Birthdays & Galas', count: 6, percentage: 16, revenue: 2520000 },
  { category: 'Corporate Summits', count: 5, percentage: 12, revenue: 6000000 },
];

export const mockConversionFunnel: FunnelStage[] = [
  { stage: 'App Inquiries', count: 240, rate: '100%' },
  { stage: 'Operations Review', count: 186, rate: '77.5%' },
  { stage: 'Proposal & Tasting', count: 112, rate: '46.6%' },
  { stage: 'Advance Received', count: 74, rate: '30.8%' },
  { stage: 'Celebration Executed', count: 68, rate: '28.3%' },
];
