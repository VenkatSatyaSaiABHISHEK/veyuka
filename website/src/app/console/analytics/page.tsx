'use client';

import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analytics';
import { AnalyticsMonthlyData, CategoryBreakdown, FunnelStage } from '@/data/analytics';
import { formatINR } from '@/lib/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

export default function AnalyticsPage() {
  const [trends, setTrends] = useState<AnalyticsMonthlyData[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);

  useEffect(() => {
    analyticsService.getMonthlyTrends().then(setTrends);
    analyticsService.getCategoryBreakdown().then(setCategories);
    analyticsService.getConversionFunnel().then(setFunnel);
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Business Intelligence</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Analytics & Funnels</h1>
          <p className="text-xs text-grey mt-1">Inquiry-to-celebration conversion rates, gross volume, and category mix.</p>
        </div>

        <div className="text-xs text-grey">
          Reporting period: <span className="font-medium text-ink">FY 2026-27</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Booking Velocity */}
        <div className="bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-4">
          <h3 className="font-serif text-xl text-ink font-normal">Monthly Gross Volume</h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B8924A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#B8924A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#8B8794" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B8794" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
                <Tooltip
                  formatter={(val: any) => [formatINR(val as number), 'Revenue']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#ECE8E4', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#B8924A" strokeWidth={1.5} fill="url(#goldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-4">
          <h3 className="font-serif text-xl text-ink font-normal">Inquiry to Event Funnel</h3>
          <div className="space-y-4 pt-2">
            {funnel.map((f, i) => (
              <div key={f.stage} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-ink">{f.stage}</span>
                  <span className="text-grey font-mono">{f.count} ({f.rate})</span>
                </div>
                <div className="h-2 w-full bg-canvas rounded-full overflow-hidden hairline-border">
                  <div
                    className="h-full bg-plum rounded-full"
                    style={{ width: `${100 - i * 18}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-6">
        <h3 className="font-serif text-xl text-ink font-normal">Category Revenue Contribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c) => (
            <div key={c.category} className="p-5 rounded-2xl bg-canvas hairline-border space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-grey block">{c.category}</span>
              <p className="font-serif text-2xl text-ink font-normal tabular-nums">{formatINR(c.revenue, true)}</p>
              <div className="flex justify-between text-xs text-grey pt-1">
                <span>{c.count} Celebrations</span>
                <span className="font-medium text-plum">{c.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
