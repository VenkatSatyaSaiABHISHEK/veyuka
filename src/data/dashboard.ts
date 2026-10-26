import { OwnerDashboardStats } from '../types';

export const mockDashboardStats: OwnerDashboardStats = {
  totalRevenue: 8670000,
  totalBookings: 24,
  activeEvents: 6,
  weddingsCount: 11,
  birthdaysCount: 7,
  othersCount: 6,
  customersCount: 18,
  revenueGrowth: 28.4,
  monthlyRevenue: [
    { month: 'Jun', amount: 850000 },
    { month: 'Jul', amount: 1150000 },
    { month: 'Aug', amount: 980000 },
    { month: 'Sep', amount: 1650000 },
    { month: 'Oct', amount: 1850000 },
    { month: 'Nov', amount: 2190000 },
  ],
  bookingsByType: [
    { type: 'Weddings', count: 11, percentage: 46 },
    { type: 'Birthdays', count: 7, percentage: 29 },
    { type: 'Others', count: 6, percentage: 25 },
  ],
  needsAttention: [
    {
      id: 'att-1',
      title: 'New Booking VYK-2024-8904 needs Catering vendor assignment',
      type: 'unassigned',
      time: '15 mins ago',
      bookingId: 'VYK-2024-8904',
    },
    {
      id: 'att-2',
      title: 'Floral decor confirmation pending for Taj Palace wedding',
      type: 'delay',
      time: '1 hour ago',
      bookingId: 'VYK-2024-8901',
    },
    {
      id: 'att-3',
      title: 'Client request: Add cold-spark pyros to Starlight Engagement',
      type: 'new_booking',
      time: '3 hours ago',
      bookingId: 'VYK-2024-8903',
    },
  ],
};
