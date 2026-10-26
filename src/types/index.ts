export type UserRole = 'customer' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  city?: string;
}

export type EventCategoryType =
  | 'Wedding'
  | 'Birthday'
  | 'Engagement'
  | 'Baby Shower'
  | 'Housewarming'
  | 'Corporate'
  | 'College'
  | 'Cultural'
  | 'Private'
  | 'Custom';

export interface EventCategory {
  id: string;
  title: EventCategoryType;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  accentColor?: string;
  featured?: boolean;
}

export type PackageTier = 'basic' | 'premium' | 'royal';

export interface PackageInclusion {
  title: string;
  description: string;
}

export interface EventPackage {
  id: string;
  category: EventCategoryType;
  tier: PackageTier;
  name: string;
  tagline: string;
  priceFrom: number;
  guestCapacity: string;
  description: string;
  inclusions: string[];
  popular?: boolean;
}

export type BookingStatus =
  | 'confirmed'
  | 'planning'
  | 'preparation'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  note?: string;
}

export interface AssignedVendorRef {
  vendorId: string;
  vendorName: string;
  category: VendorCategory;
  assignedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
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
  advancePaid: number;
  balanceDue: number;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  timeline: TimelineStep[];
  // NOTE: internal vendor assignments are strictly for owner dashboard
  assignedVendors?: AssignedVendorRef[];
  notes?: string;
}

export type VendorCategory =
  | 'Decoration'
  | 'Catering'
  | 'Photography'
  | 'Music'
  | 'Venue'
  | 'Makeup';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  phone: string;
  email: string;
  areas: string[];
  rating: number;
  reviewsCount: number;
  status: 'available' | 'assigned' | 'busy' | 'suspended';
  completedEvents: number;
  paymentPending: number;
}

export interface UpdateCard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tag?: string;
  linkText?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  roleOrEvent: string;
  city: string;
  comment: string;
  rating: number;
  image: string;
}

export interface OwnerDashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activeEvents: number;
  weddingsCount: number;
  birthdaysCount: number;
  othersCount: number;
  customersCount: number;
  revenueGrowth: number;
  monthlyRevenue: { month: string; amount: number }[];
  bookingsByType: { type: string; count: number; percentage: number }[];
  needsAttention: {
    id: string;
    title: string;
    type: 'new_booking' | 'delay' | 'complaint' | 'unassigned';
    time: string;
    bookingId?: string;
  }[];
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  totalBookings: number;
  totalSpent: number;
  avatarUrl: string;
  memberSince: string;
}
