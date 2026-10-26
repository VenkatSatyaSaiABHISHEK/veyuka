import { mockBookings } from '../data/bookings';
import { Booking, BookingStatus, TimelineStep, AssignedVendorRef } from '../types';
import { delay } from './apiHelper';

// In-memory working copy of bookings for session mutations
let workingBookings: Booking[] = [...mockBookings];

export const bookingService = {
  /**
   * Get all bookings or filter by customer / status.
   * If customer view, strips vendor assignments.
   */
  async getBookings(options?: {
    customerId?: string;
    status?: BookingStatus | 'all';
    isCustomerView?: boolean;
  }): Promise<Booking[]> {
    let result = [...workingBookings];

    if (options?.customerId) {
      result = result.filter((b) => b.customerId === options.customerId);
    }

    if (options?.status && options.status !== 'all') {
      result = result.filter((b) => b.status === options.status);
    }

    if (options?.isCustomerView) {
      result = result.map((b) => {
        const { assignedVendors, ...customerSafe } = b;
        return customerSafe as Booking;
      });
    }

    return delay(result, 400);
  },

  /**
   * Get a single booking by ID.
   * Enforces customer safety by stripping vendor details when isCustomerView is true.
   */
  async getBookingById(id: string, isCustomerView = true): Promise<Booking | null> {
    const booking = workingBookings.find((b) => b.id === id);
    if (!booking) return delay(null, 300);

    if (isCustomerView) {
      const { assignedVendors, ...customerSafe } = booking;
      return delay(customerSafe as Booking, 350);
    }

    return delay(booking, 350);
  },

  /**
   * Create a new booking
   */
  async createBooking(newBookingData: Omit<Booking, 'id' | 'createdAt' | 'timeline' | 'status'>): Promise<Booking> {
    const newId = `VYK-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeline: TimelineStep[] = [
      {
        id: `t-${Date.now()}-1`,
        title: 'Booking Confirmed',
        description: 'Advance payment received & event director assigned.',
        status: 'completed',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        note: `Advance paid: ₹${newBookingData.advancePaid.toLocaleString('en-IN')}`,
      },
      {
        id: `t-${Date.now()}-2`,
        title: 'Planning in Progress',
        description: 'Moodboards, floral blueprints & menu curated.',
        status: 'current',
        date: 'In progress',
      },
      {
        id: `t-${Date.now()}-3`,
        title: 'Preparation & Stage Fabrication',
        description: 'Mandap carpentry, artisan sourcing & lighting rehearsals.',
        status: 'upcoming',
      },
      {
        id: `t-${Date.now()}-4`,
        title: 'Event Ready & Final Walkthrough',
        description: 'Full venue dress rehearsal & culinary briefing.',
        status: 'upcoming',
      },
      {
        id: `t-${Date.now()}-5`,
        title: 'Event Completed & Delivered',
        description: 'Grand celebration execution & memory keepsake handover.',
        status: 'upcoming',
      },
    ];

    const newBooking: Booking = {
      ...newBookingData,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'planning',
      timeline,
      assignedVendors: [],
    };

    workingBookings = [newBooking, ...workingBookings];
    return delay(newBooking, 450);
  },

  /**
   * Update booking status (Owner action that propagates to customer timeline)
   */
  async updateStatus(id: string, newStatus: BookingStatus): Promise<Booking> {
    const index = workingBookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    const booking = workingBookings[index];
    const statusOrder: BookingStatus[] = ['confirmed', 'planning', 'preparation', 'ready', 'completed'];

    const targetIdx = statusOrder.indexOf(newStatus);
    const updatedTimeline = booking.timeline.map((step, idx) => {
      if (idx < targetIdx) {
        return { ...step, status: 'completed' as const };
      } else if (idx === targetIdx) {
        return { ...step, status: 'current' as const };
      } else {
        return { ...step, status: 'upcoming' as const };
      }
    });

    const updatedBooking: Booking = {
      ...booking,
      status: newStatus,
      timeline: updatedTimeline,
    };

    workingBookings[index] = updatedBooking;
    return delay(updatedBooking, 350);
  },

  /**
   * Assign vendor to a booking (Owner action only)
   */
  async assignVendor(bookingId: string, vendorRef: AssignedVendorRef): Promise<Booking> {
    const index = workingBookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    const booking = workingBookings[index];
    const currentVendors = booking.assignedVendors || [];
    const filtered = currentVendors.filter((v) => v.category !== vendorRef.category);

    const updatedBooking: Booking = {
      ...booking,
      assignedVendors: [...filtered, vendorRef],
    };

    workingBookings[index] = updatedBooking;
    return delay(updatedBooking, 350);
  },

  /**
   * Customer reschedule request
   */
  async requestReschedule(bookingId: string, newDate: string, newTime: string, notes?: string): Promise<boolean> {
    const index = workingBookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      workingBookings[index] = {
        ...workingBookings[index],
        notes: `Reschedule requested for ${newDate} at ${newTime}. Note: ${notes || 'None'}`,
      };
    }
    return delay(true, 400);
  },

  /**
   * Customer cancellation request
   */
  async requestCancellation(bookingId: string, reason?: string): Promise<boolean> {
    const index = workingBookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      workingBookings[index] = {
        ...workingBookings[index],
        status: 'cancelled',
        notes: `Cancellation requested: ${reason || 'Customer request'}`,
      };
    }
    return delay(true, 400);
  },
};
