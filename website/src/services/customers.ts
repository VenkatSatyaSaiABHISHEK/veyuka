import { mockCustomers } from '../data/customers';
import { CustomerProfile } from '../types';
import { delay } from './apiHelper';

let workingCustomers: CustomerProfile[] = [...mockCustomers];

export const customerService = {
  async getCustomers(): Promise<CustomerProfile[]> {
    await delay(400);
    return [...workingCustomers];
  },

  async getCustomerById(id: string): Promise<CustomerProfile | null> {
    await delay(350);
    const customer = workingCustomers.find((c) => c.id === id);
    return customer ? { ...customer } : null;
  },

  async updateNotes(id: string, notes: string): Promise<CustomerProfile> {
    await delay(350);
    const index = workingCustomers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');

    workingCustomers[index] = { ...workingCustomers[index], internalNotes: notes };
    return { ...workingCustomers[index] };
  },
};
