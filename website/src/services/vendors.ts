import { mockVendors } from '../data/vendors';
import { Vendor, VendorCategory } from '../types';
import { delay } from './apiHelper';

let workingVendors: Vendor[] = [...mockVendors];

export const vendorService = {
  async getVendors(): Promise<Vendor[]> {
    await delay(400);
    return [...workingVendors];
  },

  async getVendorById(id: string): Promise<Vendor | null> {
    await delay(350);
    const vendor = workingVendors.find((v) => v.id === id);
    return vendor ? { ...vendor } : null;
  },

  async getVendorsByCategory(category: VendorCategory): Promise<Vendor[]> {
    await delay(350);
    return workingVendors.filter((v) => v.category === category);
  },

  async updateStatus(id: string, status: 'available' | 'assigned' | 'busy' | 'suspended'): Promise<Vendor> {
    await delay(400);
    const index = workingVendors.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vendor not found');

    workingVendors[index] = { ...workingVendors[index], status };
    return { ...workingVendors[index] };
  },

  async addVendor(newVendor: Omit<Vendor, 'id' | 'completedEvents' | 'paymentPending' | 'rating' | 'reviewsCount'>): Promise<Vendor> {
    await delay(500);
    const vendor: Vendor = {
      ...newVendor,
      id: `ven-${Date.now()}`,
      completedEvents: 0,
      paymentPending: 0,
      rating: 5.0,
      reviewsCount: 1,
    };

    workingVendors = [vendor, ...workingVendors];
    return { ...vendor };
  },
};
