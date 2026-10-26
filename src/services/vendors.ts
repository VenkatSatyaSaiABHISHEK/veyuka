import { mockVendors } from '../data/vendors';
import { Vendor, VendorCategory } from '../types';
import { delay } from './apiHelper';

let workingVendors: Vendor[] = [...mockVendors];

export const vendorService = {
  async getVendors(category?: VendorCategory): Promise<Vendor[]> {
    if (category) {
      return delay(workingVendors.filter((v) => v.category === category), 350);
    }
    return delay(workingVendors, 400);
  },

  async getVendorById(id: string): Promise<Vendor | null> {
    const v = workingVendors.find((item) => item.id === id) || null;
    return delay(v, 300);
  },

  async addVendor(newVendorData: Omit<Vendor, 'id' | 'rating' | 'reviewsCount' | 'completedEvents' | 'paymentPending'>): Promise<Vendor> {
    const newVendor: Vendor = {
      ...newVendorData,
      id: `ven-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      completedEvents: 0,
      paymentPending: 0,
    };
    workingVendors = [newVendor, ...workingVendors];
    return delay(newVendor, 400);
  },

  async toggleSuspend(id: string): Promise<Vendor> {
    const index = workingVendors.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vendor not found');

    const v = workingVendors[index];
    const newStatus = v.status === 'suspended' ? 'available' : 'suspended';
    const updated: Vendor = { ...v, status: newStatus };
    workingVendors[index] = updated;

    return delay(updated, 300);
  },
};
