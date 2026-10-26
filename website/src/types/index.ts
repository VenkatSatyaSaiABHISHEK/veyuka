export type UserRole = 'owner' | 'operations' | 'finance' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  permissions: string[];
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
  | 'new'
  | 'reviewing'
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
  updatedBy?: string;
}

export interface AssignedVendorRef {
  vendorId: string;
  vendorName: string;
  category: VendorCategory;
  assignedAt: string;
  agreedAmount: number;
  status: 'assigned' | 'confirmed' | 'delivered';
  notes?: string;
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
  assignedVendors: AssignedVendorRef[];
  notes?: string;
  story: string; // Plain sentence summary: e.g. "Priya confirmed Royal package. Advance 3.2 lakhs received."
  ownerStaff?: string; // Veyuka operations coordinator
}

export type VendorCategory =
  | 'Decoration'
  | 'Catering'
  | 'Photography'
  | 'Music'
  | 'Venue'
  | 'Makeup';

export interface VendorDocuments {
  aadhaar: boolean;
  pan: boolean;
  gst: boolean;
  license: boolean;
  bank: boolean;
}

export interface VendorPerformance {
  acceptanceRate: number; // e.g. 96 (%)
  punctuality: number;    // e.g. 98 (%)
  qualityScore: number;   // e.g. 4.9 (out of 5)
}

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
  documents: VendorDocuments;
  performance: VendorPerformance;
  ratesDescription?: string;
  bankDetails?: {
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
}

export interface CustomerFeedback {
  id: string;
  bookingId: string;
  date: string;
  rating: number;
  comment: string;
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
  feedback: CustomerFeedback[];
  complaintsCount: number;
  internalNotes?: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: 'operations' | 'sales' | 'support' | 'finance';
  avatarUrl?: string;
  attendance: 'present' | 'absent' | 'leave';
  leaveBalance: number;
  activeTasks: number;
  rating: number;
  joinedDate: string;
}

export interface Transaction {
  id: string;
  bookingId?: string;
  vendorId?: string;
  type: 'customer_advance' | 'customer_balance' | 'vendor_payout' | 'operating_expense' | 'refund';
  amount: number;
  date: string;
  description: string;
  paymentMethod: 'NEFT' | 'UPI' | 'Card' | 'Cheque';
  status: 'completed' | 'pending' | 'processing';
  referenceNumber: string;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  vendorPayouts: number;
  customerReceipts: number;
  pendingPayouts: number;
  netProfit: number;
  gstPayable: number;
  gstCollected: number;
  recentTransactions: Transaction[];
}

export interface OperationsIncident {
  id: string;
  bookingId: string;
  eventTitle: string;
  customerName: string;
  type: 'delay' | 'complaint' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  assignedStaff: string;
  status: 'open' | 'investigating' | 'resolved';
  time: string;
  resolutionNotes?: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'Instagram' | 'Google' | 'Referral' | 'Bridal Expo' | 'Direct';
  budget: number;
  spend: number;
  leadsCount: number;
  conversionsCount: number;
  revenueGenerated: number;
  cac: number; // Customer acquisition cost in INR
  status: 'active' | 'paused' | 'completed';
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  eventType: EventCategoryType;
  eventDate?: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted' | 'dismissed';
}

