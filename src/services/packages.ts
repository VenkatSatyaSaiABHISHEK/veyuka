import { mockCategories } from '../data/categories';
import { mockPackages } from '../data/packages';
import { EventCategory, EventCategoryType, EventPackage } from '../types';
import { delay } from './apiHelper';

export const packageService = {
  async getCategories(): Promise<EventCategory[]> {
    return delay(mockCategories, 400);
  },

  async getFeaturedCategories(): Promise<EventCategory[]> {
    return delay(mockCategories.filter((c) => c.featured), 350);
  },

  async getPackages(category?: EventCategoryType): Promise<EventPackage[]> {
    if (category) {
      const filtered = mockPackages.filter((p) => p.category === category);
      if (filtered.length > 0) {
        return delay(filtered, 400);
      }
    }
    return delay(mockPackages, 400);
  },

  async getPackageById(id: string): Promise<EventPackage | null> {
    const pkg = mockPackages.find((p) => p.id === id) || null;
    return delay(pkg, 300);
  },
};
