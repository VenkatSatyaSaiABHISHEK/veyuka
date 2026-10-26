'use client';

import React, { useEffect, useState } from 'react';
import { analyticsService } from '@/services/analytics';
import { Campaign } from '@/types';
import { formatINR } from '@/lib/utils';

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    analyticsService.getCampaigns().then(setCampaigns);
  }, []);

  const totalSpend = campaigns.reduce((acc, c) => acc + c.spend, 0);
  const totalLeads = campaigns.reduce((acc, c) => acc + c.leadsCount, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenueGenerated, 0);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Growth & Acquisition</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Marketing Campaigns</h1>
          <p className="text-xs text-grey mt-1">Client acquisition channels, CAC benchmarks, and conversion economics.</p>
        </div>

        <div className="text-right">
          <span className="font-serif text-xs text-gold font-medium">Active Channels</span>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Total Campaign Spend</span>
          <p className="font-serif text-3xl text-ink font-normal mt-3 tabular-nums">{formatINR(totalSpend)}</p>
          <p className="text-xs text-grey mt-1">Across 4 major channels</p>
        </div>

        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">High Net Worth Leads</span>
          <p className="font-serif text-3xl text-ink font-normal mt-3 tabular-nums">{totalLeads}</p>
          <p className="text-xs text-grey mt-1">Expos, Instagram & Referrals</p>
        </div>

        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Influenced Revenue</span>
          <p className="font-serif text-3xl text-status-success font-normal mt-3 tabular-nums">{formatINR(totalRevenue, true)}</p>
          <p className="text-xs text-grey mt-1">ROI: ~62x spend</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-canvas-pure rounded-card hairline-border shadow-card overflow-hidden">
        <table className="w-full text-left text-xs divide-y divide-hairline">
          <thead className="bg-canvas/50 text-grey uppercase tracking-wider text-[10px] font-medium">
            <tr>
              <th className="py-4 px-6">Campaign</th>
              <th className="py-4 px-6">Channel</th>
              <th className="py-4 px-6">Budget & Spend</th>
              <th className="py-4 px-6">Leads</th>
              <th className="py-4 px-6">Conversions</th>
              <th className="py-4 px-6">Acquisition Cost (CAC)</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-canvas-subtle transition-colors">
                <td className="py-4 px-6 font-medium text-ink">{c.name}</td>
                <td className="py-4 px-6 text-grey">{c.channel}</td>
                <td className="py-4 px-6 font-serif text-sm tabular-nums">
                  {formatINR(c.spend)} <span className="text-grey text-[10px]">/ {formatINR(c.budget)}</span>
                </td>
                <td className="py-4 px-6 font-serif text-sm tabular-nums">{c.leadsCount}</td>
                <td className="py-4 px-6 font-serif text-sm tabular-nums">{c.conversionsCount}</td>
                <td className="py-4 px-6 font-serif text-sm text-gold font-medium tabular-nums">{formatINR(c.cac)}</td>
                <td className="py-4 px-6">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full capitalize font-medium ${
                    c.status === 'active' ? 'bg-status-success/10 text-status-success' : 'bg-canvas hairline-border text-grey'
                  }`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
