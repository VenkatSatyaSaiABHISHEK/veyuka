import { mockCustomers } from '../data/customers';
import { CustomerProfile } from '../types';
import { delay } from './apiHelper';

export const customerService = {
  async getCustomers(): Promise<CustomerProfile[]> {
    return delay(mockCustomers, 400);
  },

  async getCustomerById(id: string): Promise<CustomerProfile | null> {
    const cust = mockCustomers.find((c) => c.id === id) || null;
    return delay(cust, 300);
  },
};
