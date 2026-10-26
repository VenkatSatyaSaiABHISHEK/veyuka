import { create } from 'zustand';
import { Booking, BookingStatus, EventCategoryType, PackageTier, AssignedVendorRef } from '../types';
import { bookingService } from '../services/bookings';

export interface BookingDraft {
  eventType: EventCategoryType;
  date: string;
  time: string;
  city: string;
  address: string;
  guestCount: number;
  budget: number;
  packageTier: PackageTier;
  packageName: string;
  totalAmount: number;
  specialRequests?: string;
}

const defaultDraft: BookingDraft = {
  eventType: 'Wedding',
  date: '2026-12-15',
  time: '06:00 PM',
  city: 'Mumbai',
  address: 'The Taj Mahal Palace, Colaba, Mumbai',
  guestCount: 350,
  budget: 1500000,
  packageTier: 'royal',
  packageName: 'Imperial Heritage Wedding',
  totalAmount: 1850000,
  specialRequests: '',
};

interface BookingState {
  draft: BookingDraft;
  allBookings: Booking[];
  activeCustomerBooking: Booking | null;
  isLoading: boolean;
  setDraft: (partial: Partial<BookingDraft>) => void;
  resetDraft: () => void;
  loadBookings: (isCustomerView?: boolean, customerId?: string) => Promise<void>;
  createBookingFromDraft: (customerId: string, customerName: string, customerPhone: string, customerEmail: string) => Promise<Booking>;
  updateStatus: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  assignVendor: (bookingId: string, vendorRef: AssignedVendorRef) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  draft: defaultDraft,
  allBookings: [],
  activeCustomerBooking: null,
  isLoading: false,

  setDraft: (partial) => {
    set((state) => ({
      draft: { ...state.draft, ...partial },
    }));
  },

  resetDraft: () => {
    set({ draft: defaultDraft });
  },

  loadBookings: async (isCustomerView = false, customerId?: string) => {
    set({ isLoading: true });
    try {
      const list = await bookingService.getBookings({ isCustomerView, customerId });
      // Find customer's active booking (e.g. not completed/cancelled or most relevant)
      const active =
        list.find((b) => b.status === 'preparation' || b.status === 'planning' || b.status === 'ready' || b.status === 'confirmed') ||
        list[0] ||
        null;

      set({
        allBookings: list,
        activeCustomerBooking: active,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  createBookingFromDraft: async (customerId, customerName, customerPhone, customerEmail) => {
    set({ isLoading: true });
    const { draft } = get();
    const advancePaid = Math.round(draft.totalAmount * 0.3);
    const balanceDue = draft.totalAmount - advancePaid;

    const newBooking = await bookingService.createBooking({
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      eventType: draft.eventType,
      date: draft.date,
      time: draft.time,
      city: draft.city,
      address: draft.address,
      guestCount: draft.guestCount,
      budget: draft.budget,
      packageTier: draft.packageTier,
      packageName: draft.packageName,
      totalAmount: draft.totalAmount,
      advancePaid,
      balanceDue,
      specialRequests: draft.specialRequests,
    });

    set((state) => ({
      allBookings: [newBooking, ...state.allBookings],
      activeCustomerBooking: newBooking,
      isLoading: false,
    }));

    return newBooking;
  },

  updateStatus: async (bookingId, newStatus) => {
    const updated = await bookingService.updateStatus(bookingId, newStatus);
    set((state) => {
      const updatedList = state.allBookings.map((b) => (b.id === bookingId ? updated : b));
      return {
        allBookings: updatedList,
        activeCustomerBooking:
          state.activeCustomerBooking?.id === bookingId ? updated : state.activeCustomerBooking,
      };
    });
  },

  assignVendor: async (bookingId, vendorRef) => {
    const updated = await bookingService.assignVendor(bookingId, vendorRef);
    set((state) => {
      const updatedList = state.allBookings.map((b) => (b.id === bookingId ? updated : b));
      return {
        allBookings: updatedList,
      };
    });
  },
}));
