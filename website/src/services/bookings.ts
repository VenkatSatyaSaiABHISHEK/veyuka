import { mockBookings } from '../data/bookings';
import { Booking, BookingStatus, TimelineStep, VendorCategory } from '../types';
import { delay } from './apiHelper';

// In-memory working copy to reflect edits during runtime
let workingBookings: Booking[] = [...mockBookings];

export const bookingService = {
  /**
   * Fetch all bookings with optional filters
   */
  async getBookings(filters?: {
    status?: BookingStatus;
    city?: string;
    eventType?: string;
    search?: string;
  }): Promise<Booking[]> {
    await delay(400);
    let results = [...workingBookings];

    if (filters?.status) {
      results = results.filter((b) => b.status === filters.status);
    }
    if (filters?.city) {
      results = results.filter((b) => b.city.toLowerCase() === filters.city?.toLowerCase());
    }
    if (filters?.eventType) {
      results = results.filter((b) => b.eventType.toLowerCase() === filters.eventType?.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          b.packageName.toLowerCase().includes(q)
      );
    }

    return results;
  },

  /**
   * Fetch booking by ID
   */
  async getBookingById(id: string): Promise<Booking | null> {
    await delay(350);
    const booking = workingBookings.find((b) => b.id === id);
    return booking ? { ...booking } : null;
  },

  /**
   * Update booking pipeline status
   */
  async updateStage(id: string, newStatus: BookingStatus, updatedBy = 'Operations Lead'): Promise<Booking> {
    await delay(400);
    const index = workingBookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    const booking = { ...workingBookings[index] };
    booking.status = newStatus;

    // Append automatic timeline entry
    const newStep: TimelineStep = {
      id: `t-${Date.now()}`,
      title: `Moved to ${newStatus.toUpperCase()}`,
      description: `Stage updated to ${newStatus} on the pipeline board.`,
      status: 'current',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      updatedBy,
    };

    booking.timeline = [newStep, ...booking.timeline];
    workingBookings[index] = booking;
    return { ...booking };
  },

  /**
   * Update internal booking notes
   */
  async updateNotes(id: string, notes: string): Promise<Booking> {
    await delay(350);
    const index = workingBookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    workingBookings[index] = { ...workingBookings[index], notes };
    return { ...workingBookings[index] };
  },

  /**
   * Assign vendor to booking
   */
  async assignVendor(
    bookingId: string,
    vendor: { id: string; name: string; category: VendorCategory; agreedAmount: number; notes?: string }
  ): Promise<Booking> {
    await delay(400);
    const index = workingBookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    const booking = { ...workingBookings[index] };
    const existingIndex = booking.assignedVendors.findIndex((v) => v.vendorId === vendor.id);

    const ref = {
      vendorId: vendor.id,
      vendorName: vendor.name,
      category: vendor.category,
      agreedAmount: vendor.agreedAmount,
      assignedAt: new Date().toISOString().split('T')[0],
      status: 'confirmed' as const,
      notes: vendor.notes,
    };

    if (existingIndex >= 0) {
      booking.assignedVendors[existingIndex] = ref;
    } else {
      booking.assignedVendors = [...booking.assignedVendors, ref];
    }

    // Add timeline entry
    booking.timeline = [
      {
        id: `t-${Date.now()}`,
        title: `Vendor Assigned: ${vendor.name}`,
        description: `Allocated for ${vendor.category} with agreed fee of ₹${vendor.agreedAmount.toLocaleString('en-IN')}.`,
        status: 'completed',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        updatedBy: 'Operations Concierge',
      },
      ...booking.timeline,
    ];

    workingBookings[index] = booking;
    return { ...booking };
  },

  /**
   * Remove vendor assignment
   */
  async unassignVendor(bookingId: string, vendorId: string): Promise<Booking> {
    await delay(350);
    const index = workingBookings.findIndex((b) => b.id === bookingId);
    if (index === -1) throw new Error('Booking not found');

    const booking = { ...workingBookings[index] };
    booking.assignedVendors = booking.assignedVendors.filter((v) => v.vendorId !== vendorId);
    workingBookings[index] = booking;
    return { ...booking };
  },
};
