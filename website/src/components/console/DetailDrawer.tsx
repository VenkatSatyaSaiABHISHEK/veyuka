'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsoleStore } from '@/store/useConsoleStore';
import { bookingService } from '@/services/bookings';
import { customerService } from '@/services/customers';
import { vendorService } from '@/services/vendors';
import { Booking, CustomerProfile, Vendor } from '@/types';
import { formatINR, formatEditorialDate } from '@/lib/utils';
import { drawerVariants, backdropVariants } from '@/lib/motion';

export function DetailDrawer() {
  const { drawerOpen, drawerType, selectedEntityId, closeDrawer } = useConsoleStore();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);

  // Load details whenever selectedEntityId changes
  useEffect(() => {
    if (!selectedEntityId) return;

    if (drawerType === 'booking') {
      bookingService.getBookingById(selectedEntityId).then((b) => {
        if (b) {
          setBooking(b);
          setNotesInput(b.notes || '');
        }
      });
      vendorService.getVendors().then(setAllVendors);
    } else if (drawerType === 'customer') {
      customerService.getCustomerById(selectedEntityId).then(setCustomer);
    } else if (drawerType === 'vendor') {
      vendorService.getVendorById(selectedEntityId).then(setVendor);
    }
  }, [drawerType, selectedEntityId]);

  // Keyboard navigation: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && drawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen, closeDrawer]);

  const handleSaveNotes = async () => {
    if (!booking) return;
    const updated = await bookingService.updateNotes(booking.id, notesInput);
    setBooking(updated);
  };

  const handleAssignVendor = async (v: Vendor) => {
    if (!booking) return;
    const agreedAmount = 250000; // standard mock fee
    const updated = await bookingService.assignVendor(booking.id, {
      id: v.id,
      name: v.name,
      category: v.category,
      agreedAmount,
    });
    setBooking(updated);
    setAssignModalOpen(false);
  };

  const handleUnassignVendor = async (vendorId: string) => {
    if (!booking) return;
    const updated = await bookingService.unassignVendor(booking.id, vendorId);
    setBooking(updated);
  };

  if (!drawerOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={closeDrawer}
          className="fixed inset-0 bg-ink/30 backdrop-blur-[2px]"
        />

        {/* Drawer Panel */}
        <motion.div
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-2xl bg-canvas-pure h-full z-10 flex flex-col shadow-drawer overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-5 hairline-b flex items-center justify-between bg-canvas/40">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg font-medium text-ink">
                {drawerType === 'booking' && `Booking ${booking?.id || ''}`}
                {drawerType === 'customer' && `Client Profile`}
                {drawerType === 'vendor' && `Vendor Dossier`}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-grey px-2 py-0.5 rounded-full bg-canvas hairline-border">
                Detail View
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="text-xs text-grey hover:text-ink px-2 py-1 rounded bg-canvas-pure hairline-border"
            >
              Esc &times;
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* ================= BOOKING DRAWER ================= */}
            {drawerType === 'booking' && booking && (
              <>
                {/* Status & Living Story */}
                <div className="p-5 rounded-2xl bg-canvas hairline-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-gold font-medium">Living Story</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-canvas-pure hairline-border text-ink capitalize font-medium">
                      Stage: {booking.status}
                    </span>
                  </div>
                  <p className="font-serif text-base text-ink leading-relaxed">&ldquo;{booking.story}&rdquo;</p>
                  <p className="text-[11px] text-grey">Event Director: {booking.ownerStaff || 'Unassigned'}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-canvas-subtle hairline-border">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Total Value</span>
                    <p className="font-serif text-lg text-ink font-medium mt-1 tabular-nums">{formatINR(booking.totalAmount)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-canvas-subtle hairline-border">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Advance Paid</span>
                    <p className="font-serif text-lg text-ink font-medium mt-1 tabular-nums">{formatINR(booking.advancePaid)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-canvas-subtle hairline-border">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Balance Due</span>
                    <p className="font-serif text-lg text-ink font-medium mt-1 tabular-nums">{formatINR(booking.balanceDue)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-canvas-subtle hairline-border">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Guests</span>
                    <p className="font-serif text-lg text-ink font-medium mt-1 tabular-nums">{booking.guestCount}</p>
                  </div>
                </div>

                {/* Customer & Location */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-grey font-medium">Event & Venue Logistics</h4>
                  <div className="p-4 rounded-xl bg-canvas-pure hairline-border space-y-2 text-xs">
                    <p><span className="text-grey">Client:</span> <strong className="text-ink">{booking.customerName}</strong> ({booking.customerPhone} &bull; {booking.customerEmail})</p>
                    <p><span className="text-grey">Type & Date:</span> {booking.eventType} &bull; {formatEditorialDate(booking.date)} at {booking.time}</p>
                    <p><span className="text-grey">Venue:</span> {booking.address}, {booking.city}</p>
                    <p><span className="text-grey">Package:</span> {booking.packageName} ({booking.packageTier.toUpperCase()})</p>
                  </div>
                </div>

                {/* Assigned Vendors (Internal Only) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wider text-grey font-medium">Assigned Vendors ({booking.assignedVendors.length})</h4>
                    <button
                      onClick={() => setAssignModalOpen(true)}
                      className="text-xs text-plum hover:underline font-medium"
                    >
                      + Assign Vendor
                    </button>
                  </div>

                  {booking.assignedVendors.length === 0 ? (
                    <div className="p-6 text-center rounded-xl bg-canvas-subtle hairline-border text-xs text-grey">
                      No vendors assigned yet. Click &ldquo;+ Assign Vendor&rdquo; to allocate internal team.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {booking.assignedVendors.map((av) => (
                        <div key={av.vendorId} className="p-3.5 rounded-xl bg-canvas-pure hairline-border flex items-center justify-between text-xs">
                          <div>
                            <span className="font-medium text-ink">{av.vendorName}</span>
                            <span className="text-grey ml-2">({av.category})</span>
                            <span className="text-grey ml-2">&bull; Fee: {formatINR(av.agreedAmount)}</span>
                          </div>
                          <button
                            onClick={() => handleUnassignVendor(av.vendorId)}
                            className="text-grey hover:text-status-error text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Assign Modal */}
                  {assignModalOpen && (
                    <div className="p-4 rounded-xl bg-canvas hairline-border space-y-3">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span>Select vendor to allocate:</span>
                        <button onClick={() => setAssignModalOpen(false)} className="text-grey hover:text-ink">Cancel</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {allVendors.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => handleAssignVendor(v)}
                            className="p-2.5 rounded-lg bg-canvas-pure hairline-border text-left hover:border-plum text-xs flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium text-ink">{v.name}</p>
                              <p className="text-[10px] text-grey">{v.category} &bull; Rating {v.rating}</p>
                            </div>
                            <span className="text-[10px] text-plum font-medium">Assign</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Internal Notes */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-grey font-medium">Internal Operations Notes</h4>
                  <textarea
                    rows={3}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-canvas hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                    placeholder="Add confidential notes for operations lead..."
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-1.5 rounded-full bg-ink text-white text-xs font-medium hover:bg-black"
                  >
                    Save Notes
                  </button>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-wider text-grey font-medium">Milestone Progress</h4>
                  <div className="space-y-3 relative border-l border-hairline ml-2 pl-4">
                    {booking.timeline.map((step) => (
                      <div key={step.id} className="relative text-xs">
                        <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${
                          step.status === 'completed' ? 'bg-status-success' : step.status === 'current' ? 'bg-plum' : 'bg-grey-light'
                        }`} />
                        <div className="font-medium text-ink">{step.title} <span className="text-grey font-normal text-[11px] ml-1">({step.date})</span></div>
                        <p className="text-grey text-[11px] mt-0.5">{step.description}</p>
                        {step.note && <p className="text-[11px] text-gold mt-0.5 italic">{step.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ================= CUSTOMER DRAWER ================= */}
            {drawerType === 'customer' && customer && (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-canvas-subtle hairline-border flex items-center justify-center font-serif text-xl text-ink font-semibold">
                    {customer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-ink font-medium">{customer.name}</h3>
                    <p className="text-xs text-grey">{customer.city} &bull; Member since {customer.memberSince}</p>
                    <p className="text-xs text-grey mt-0.5">{customer.phone} &bull; {customer.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-canvas hairline-border">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Lifetime Value</span>
                    <p className="font-serif text-xl text-ink font-medium mt-1 tabular-nums">{formatINR(customer.totalSpent)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-canvas hairline-border">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Total Celebrations</span>
                    <p className="font-serif text-xl text-ink font-medium mt-1 tabular-nums">{customer.totalBookings}</p>
                  </div>
                </div>

                {customer.internalNotes && (
                  <div className="p-4 rounded-xl bg-canvas-pure hairline-border space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-gold font-medium">Confidential Client Notes</span>
                    <p className="text-xs text-grey leading-relaxed">{customer.internalNotes}</p>
                  </div>
                )}
              </>
            )}

            {/* ================= VENDOR DRAWER ================= */}
            {drawerType === 'vendor' && vendor && (
              <>
                <div>
                  <h3 className="font-serif text-2xl text-ink font-medium">{vendor.name}</h3>
                  <p className="text-xs text-grey">{vendor.category} &bull; Status: <span className="capitalize text-ink font-medium">{vendor.status}</span></p>
                  <p className="text-xs text-grey mt-0.5">{vendor.phone} &bull; {vendor.email}</p>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-canvas hairline-border text-center">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Acceptance</span>
                    <p className="font-serif text-xl text-ink font-medium mt-1">{vendor.performance.acceptanceRate}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-canvas hairline-border text-center">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Punctuality</span>
                    <p className="font-serif text-xl text-ink font-medium mt-1">{vendor.performance.punctuality}%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-canvas hairline-border text-center">
                    <span className="text-[10px] uppercase tracking-wider text-grey">Quality Score</span>
                    <p className="font-serif text-xl text-ink font-medium mt-1">{vendor.performance.qualityScore} / 5</p>
                  </div>
                </div>

                {/* Documents Verification Status */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-grey font-medium">KYC & Document Verification</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {Object.entries(vendor.documents).map(([doc, verified]) => (
                      <div key={doc} className="p-3 rounded-lg bg-canvas-pure hairline-border flex items-center justify-between">
                        <span className="capitalize text-ink">{doc}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${verified ? 'bg-status-success/10 text-status-success' : 'bg-status-warning/10 text-status-warning'}`}>
                          {verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rates & Bank */}
                <div className="p-4 rounded-xl bg-canvas hairline-border space-y-2 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-grey">Rates & Terms</span>
                  <p className="text-grey">{vendor.ratesDescription}</p>
                  <p className="pt-2 text-ink font-medium">Pending Payout: {formatINR(vendor.paymentPending)}</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
