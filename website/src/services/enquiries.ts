import { Enquiry } from '../types';
import { delay } from './apiHelper';

let mockEnquiries: Enquiry[] = [
  {
    id: 'ENQ-801',
    name: 'Rohan Mehra',
    phone: '+91 98204 88123',
    eventType: 'Wedding',
    eventDate: '2027-01-14',
    message: 'Looking for a royal palace wedding venue and complete decor setup in Udaipur.',
    createdAt: '2026-10-25T14:30:00Z',
    status: 'new',
  },
  {
    id: 'ENQ-802',
    name: 'Sneha Kulkarni',
    phone: '+91 98190 22345',
    eventType: 'Birthday',
    eventDate: '2026-11-20',
    message: 'First birthday party for 80 guests with pastel garden floral theme.',
    createdAt: '2026-10-26T09:15:00Z',
    status: 'contacted',
  },
];

export const enquiryService = {
  async getEnquiries(): Promise<Enquiry[]> {
    await delay(300);
    return [...mockEnquiries];
  },

  async submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> {
    await delay(500);
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `ENQ-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    mockEnquiries = [newEnquiry, ...mockEnquiries];
    return newEnquiry;
  },

  async updateStatus(id: string, status: Enquiry['status']): Promise<Enquiry> {
    await delay(300);
    const index = mockEnquiries.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Enquiry not found');
    mockEnquiries[index] = { ...mockEnquiries[index], status };
    return { ...mockEnquiries[index] };
  },
};
