'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useConsoleStore } from '@/store/useConsoleStore';
import { bookingService } from '@/services/bookings';
import { paymentService } from '@/services/payments';
import { operationsService } from '@/services/operations';
import { Booking, FinanceSummary, OperationsIncident } from '@/types';
import { formatINR, formatEditorialDate } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const mockRevenueChart = [
  { day: 'Mon', revenue: 420000 },
  { day: 'Tue', revenue: 680000 },
  { day: 'Wed', revenue: 950000 },
  { day: 'Thu', revenue: 1420000 },
  { day: 'Fri', revenue: 1850000 },
  { day: 'Sat', revenue: 2400000 },
  { day: 'Sun', revenue: 3100000 },
];

export default function TodayPage() {
  const { user, openDrawer } = useConsoleStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [incidents, setIncidents] = useState<OperationsIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingService.getBookings(),
      paymentService.getFinanceSummary(),
      operationsService.getIncidents(),
    ]).then(([b, f, inc]) => {
      setBookings(b);
      setFinance(f);
      setIncidents(inc);
      setLoading(false);
    });
  }, []);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Director';

  const unassignedCount = bookings.filter((b) => b.assignedVendors.length === 0 && b.status !== 'completed').length;
  const newBookings = bookings.filter((b) => b.status === 'new' || b.status === 'reviewing');
  const activeEvents = bookings.filter((b) => ['confirmed', 'planning', 'preparation', 'ready'].includes(b.status));
  const weddingsCount = bookings.filter((b) => b.eventType === 'Wedding').length;

  return (
    <div className="space-y-10">
      {/* 1. Large Serif Greeting & Weekly Digest */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Executive Focus</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal mt-2">
            Good evening, {firstName}.
          </h1>
          <p className="text-xs text-grey mt-2">
            Here is the operational pulse of Veyuka celebrations for today.
          </p>
        </div>

        {/* Weekly Digest Card */}
        <div className="bg-canvas-pure p-5 rounded-2xl hairline-border shadow-card max-w-lg lg:text-right">
          <span className="text-[10px] uppercase tracking-wider text-gold font-medium block">Weekly Digest</span>
          <p className="font-serif text-sm text-ink leading-relaxed mt-1">
            &ldquo;Revenue paced 18% higher with two sovereign weddings advancing into final staging. All vendor milestones for the Colaba celebration remain green.&rdquo;
          </p>
        </div>
      </div>

      {/* 2. Big Count-Up Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Revenue This Month</span>
          <p className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-3 tabular-nums">
            {finance ? formatINR(finance.totalRevenue, true) : '—'}
          </p>
          <p className="text-xs text-grey mt-2">
            Net Profit: <span className="text-ink font-medium">{finance ? formatINR(finance.netProfit, true) : '—'}</span>
          </p>
        </div>

        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Pipeline Bookings</span>
          <p className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-3 tabular-nums">
            {bookings.length}
          </p>
          <p className="text-xs text-grey mt-2">
            {newBookings.length} awaiting review
          </p>
        </div>

        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Active Events in Staging</span>
          <p className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-3 tabular-nums">
            {activeEvents.length}
          </p>
          <p className="text-xs text-grey mt-2">
            Across Mumbai & Alibaug
          </p>
        </div>

        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Weddings</span>
          <p className="font-serif text-3xl sm:text-4xl text-ink font-normal mt-3 tabular-nums">
            {weddingsCount}
          </p>
          <p className="text-xs text-grey mt-2">
            Royal and Signature Tiers
          </p>
        </div>
      </div>

      {/* 3. "What Needs You Today" Focus Section */}
      <section className="bg-canvas-pure rounded-card hairline-border shadow-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl text-ink font-normal">What Needs You Today</h2>
            <p className="text-xs text-grey mt-1">Priority decisions requiring executive or lead action</p>
          </div>
          <span className="text-xs text-grey tabular-nums">
            {newBookings.length + unassignedCount + incidents.length} items
          </span>
        </div>

        <div className="divide-y divide-hairline">
          {/* New Bookings to Review */}
          {newBookings.map((b) => (
            <div
              key={b.id}
              onClick={() => openDrawer('booking', b.id)}
              className="py-4 hover:bg-canvas-subtle transition-colors flex items-center justify-between cursor-pointer rounded-lg px-3 -mx-3"
            >
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-status-warning" />
                <div>
                  <p className="text-xs font-medium text-ink">New Booking to Review: {b.customerName}</p>
                  <p className="text-[11px] text-grey">{b.eventType} &bull; {b.city} &bull; Budget: {formatINR(b.budget)}</p>
                </div>
              </div>
              <span className="text-xs text-plum font-medium">Review &rarr;</span>
            </div>
          ))}

          {/* Unassigned Vendors Warning */}
          {bookings
            .filter((b) => b.assignedVendors.length === 0 && b.status !== 'completed' && b.status !== 'new')
            .map((b) => (
              <div
                key={`unassigned-${b.id}`}
                onClick={() => openDrawer('booking', b.id)}
                className="py-4 hover:bg-canvas-subtle transition-colors flex items-center justify-between cursor-pointer rounded-lg px-3 -mx-3"
              >
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-status-error" />
                  <div>
                    <p className="text-xs font-medium text-ink">Vendors Unassigned: {b.packageName}</p>
                    <p className="text-[11px] text-grey">Event on {formatEditorialDate(b.date)} &bull; {b.address}</p>
                  </div>
                </div>
                <span className="text-xs text-plum font-medium">Assign Team &rarr;</span>
              </div>
            ))}

          {/* Active Incidents */}
          {incidents
            .filter((i) => i.status !== 'resolved')
            .map((inc) => (
              <div
                key={inc.id}
                className="py-4 hover:bg-canvas-subtle transition-colors flex items-center justify-between rounded-lg px-3 -mx-3"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-2 h-2 rounded-full ${inc.severity === 'high' ? 'bg-status-error' : 'bg-status-warning'}`} />
                  <div>
                    <p className="text-xs font-medium text-ink">{inc.eventTitle}</p>
                    <p className="text-[11px] text-grey">{inc.description}</p>
                  </div>
                </div>
                <span className="text-[11px] text-grey font-medium">{inc.time}</span>
              </div>
            ))}
        </div>
      </section>

      {/* 4. Thin Animated Revenue Line & Events This Week */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Velocity Chart */}
        <div className="bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-ink font-normal">Revenue Trajectory</h3>
              <p className="text-xs text-grey">Receipts pacing over the last 7 days</p>
            </div>
            <span className="font-serif text-lg text-gold font-medium tabular-nums">+24.5%</span>
          </div>

          <div className="h-56 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="plumFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4A2275" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#4A2275" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#8B8794" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B8794" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
                <Tooltip
                  formatter={(val: any) => [formatINR(val as number), 'Revenue']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#ECE8E4', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4A2275" strokeWidth={1.5} fill="url(#plumFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Events This Week Horizontal Timeline */}
        <div className="bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-ink font-normal">Events in Motion</h3>
              <p className="text-xs text-grey">Staging schedule for this week</p>
            </div>
            <span className="text-xs text-grey">All regions</span>
          </div>

          <div className="space-y-4 pt-2">
            {bookings.slice(0, 3).map((b) => (
              <div
                key={b.id}
                onClick={() => openDrawer('booking', b.id)}
                className="p-4 rounded-xl bg-canvas hairline-border hover:border-plum transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-ink">{b.customerName}</span>
                    <span className="text-[10px] text-grey">&bull; {b.eventType}</span>
                  </div>
                  <p className="text-[11px] text-grey mt-0.5">{b.address}</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-xs text-gold font-medium">{formatEditorialDate(b.date)}</span>
                  <p className="text-[10px] text-grey capitalize">{b.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
