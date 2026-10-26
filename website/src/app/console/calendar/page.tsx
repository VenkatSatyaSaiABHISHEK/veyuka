'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '@/services/bookings';
import { Booking } from '@/types';
import { formatEditorialDate, formatINR } from '@/lib/utils';

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [eventDayModeBooking, setEventDayModeBooking] = useState<Booking | null>(null);

  useEffect(() => {
    bookingService.getBookings().then(setBookings);
  }, []);

  const weddingsCount = bookings.filter((b) => b.eventType === 'Wedding').length;

  return (
    <div className="space-y-6">
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Staging Schedule</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Celebrations Calendar</h1>
          <p className="text-xs text-grey mt-1">
            Currently tracking <span className="text-ink font-medium">{weddingsCount} weddings</span> and {bookings.length - weddingsCount} celebrations this season.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-0.5 rounded-full bg-canvas hairline-border">
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3.5 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                  view === v ? 'bg-canvas-pure text-ink shadow-subtle' : 'text-grey hover:text-ink'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid (Month View) */}
      <div className="bg-canvas-pure rounded-card hairline-border shadow-card p-6">
        <div className="grid grid-cols-7 gap-px bg-hairline rounded-2xl overflow-hidden border border-hairline">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="bg-canvas/60 p-3 text-center text-[11px] uppercase tracking-wider text-grey font-medium">
              {d}
            </div>
          ))}

          {/* Sample November 2026 month days */}
          {Array.from({ length: 35 }).map((_, i) => {
            const dayNum = i - 1; // start offset
            const hasEvent = dayNum === 4 || dayNum === 18 || dayNum === 28;
            const event = bookings.find((b) => {
              const day = parseInt(b.date.split('-')[2], 10);
              return day === dayNum;
            });

            return (
              <div
                key={i}
                className={`min-h-[110px] p-2 bg-canvas-pure flex flex-col justify-between transition-colors ${
                  dayNum <= 0 || dayNum > 30 ? 'bg-canvas-subtle/50 text-grey-light' : 'text-ink'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs font-serif tabular-nums ${hasEvent ? 'text-gold font-medium' : ''}`}>
                    {dayNum > 0 && dayNum <= 30 ? dayNum : ''}
                  </span>
                </div>

                {event && (
                  <div
                    onClick={() => setEventDayModeBooking(event)}
                    className="p-2 rounded-xl bg-canvas hairline-border hover:border-plum transition-all cursor-pointer space-y-0.5"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-plum font-semibold line-clamp-1">{event.customerName}</p>
                    <p className="text-[9px] text-grey">{event.eventType} &bull; {event.city}</p>
                    <button className="text-[9px] text-gold font-medium underline mt-1 block">
                      Event Day Mode &rarr;
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* UNIQUE TOUCH: EVENT DAY MODE (Live Control Room Overlay)       */}
      {/* ============================================================== */}
      <AnimatePresence>
        {eventDayModeBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-4xl bg-canvas-pure rounded-[28px] hairline-border shadow-floating overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Control Room Header */}
              <div className="px-8 py-6 bg-canvas hairline-b flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-[11px] uppercase tracking-[0.24em] text-gold font-semibold">
                      Live Control Room &bull; Event Day Mode
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl text-ink font-medium mt-1">
                    {eventDayModeBooking.packageName}
                  </h2>
                  <p className="text-xs text-grey">
                    Client: {eventDayModeBooking.customerName} &bull; {eventDayModeBooking.address}
                  </p>
                </div>

                <button
                  onClick={() => setEventDayModeBooking(null)}
                  className="px-4 py-2 rounded-full hairline-border bg-canvas-pure text-xs text-ink hover:bg-canvas transition-colors"
                >
                  Exit Control Room &times;
                </button>
              </div>

              {/* Control Room Body */}
              <div className="p-8 overflow-y-auto space-y-8 flex-1">
                {/* Live Alert Area */}
                <div className="p-4 rounded-2xl bg-canvas hairline-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-status-success" />
                    <p className="text-xs text-ink">All on-site operations are progressing according to master run-sheet.</p>
                  </div>
                  <span className="text-xs text-grey font-mono">06:30 PM Show</span>
                </div>

                {/* Vertical Run-Sheet Timeline */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-grey font-medium mb-4">Day Timeline</h3>
                  <div className="space-y-3 relative border-l-2 border-hairline ml-3 pl-6">
                    <div className="relative text-xs">
                      <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-status-success" />
                      <span className="font-mono text-grey text-[10px]">10:00 AM</span>
                      <p className="font-medium text-ink mt-0.5">Venue Access & Freight Loading</p>
                      <p className="text-grey text-[11px]">Ballroom load-in completed. Carpentry commenced.</p>
                    </div>

                    <div className="relative text-xs">
                      <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-status-success" />
                      <span className="font-mono text-grey text-[10px]">02:00 PM</span>
                      <p className="font-medium text-ink mt-0.5">Floral Mandap Architecture Handover</p>
                      <p className="text-grey text-[11px]">Aura Florals finished Mandap arches. Quality approved.</p>
                    </div>

                    <div className="relative text-xs">
                      <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-plum" />
                      <span className="font-mono text-plum text-[10px] font-bold">04:30 PM &bull; IN PROGRESS</span>
                      <p className="font-medium text-ink mt-0.5">Acoustic Sound Check & Lighting Beam Alignment</p>
                      <p className="text-grey text-[11px]">Symphony Strings sound levels locked at 72dB.</p>
                    </div>

                    <div className="relative text-xs">
                      <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-grey-light" />
                      <span className="font-mono text-grey text-[10px]">06:30 PM</span>
                      <p className="font-medium text-ink mt-0.5">Red Carpet Guest Welcoming & Saffron Scenting</p>
                      <p className="text-grey text-[11px]">Hostess team and brass lanterns ready.</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Vendors Live Check-in */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-grey font-medium mb-4">Partner Status on Ground</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {eventDayModeBooking.assignedVendors.map((v) => (
                      <div key={v.vendorId} className="p-4 rounded-xl bg-canvas hairline-border flex items-center justify-between text-xs">
                        <div>
                          <p className="font-medium text-ink">{v.vendorName}</p>
                          <p className="text-[11px] text-grey">{v.category}</p>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-status-success/10 text-status-success font-medium">
                          Checked-In
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
