'use client';

import React, { useEffect, useState } from 'react';
import { paymentService } from '@/services/payments';
import { FinanceSummary, Transaction } from '@/types';
import { formatINR, formatEditorialDate } from '@/lib/utils';

export default function FinancePage() {
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    paymentService.getFinanceSummary().then(setFinance);
  }, []);

  const handleDownloadReport = (name: string) => {
    setDownloading(name);
    setTimeout(() => {
      setDownloading(null);
      alert(`Downloaded: ${name}_Q4_2026.csv`);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Title & Report Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Treasury & Accounting</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Financial Ledger & P&L</h1>
          <p className="text-xs text-grey mt-1">Complete record of receipts, operating margins, partner settlements, and GST.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownloadReport('Veyuka_PL_Report')}
            className="px-4 py-1.5 rounded-full hairline-border bg-canvas-pure text-xs text-ink hover:bg-canvas transition-colors"
          >
            {downloading === 'Veyuka_PL_Report' ? 'Generating...' : 'Export P&L Report'}
          </button>
          <button
            onClick={() => handleDownloadReport('Veyuka_GST_Ledger')}
            className="px-4 py-1.5 rounded-full bg-plum text-white text-xs font-medium tracking-wide hover:bg-plum-hover transition-colors shadow-subtle"
          >
            {downloading === 'Veyuka_GST_Ledger' ? 'Generating...' : 'Export GST Summary'}
          </button>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Customer Receipts</span>
          <p className="font-serif text-3xl text-ink font-normal mt-3 tabular-nums">
            {finance ? formatINR(finance.customerReceipts) : '—'}
          </p>
          <p className="text-xs text-grey mt-2">Advances & balance settlements</p>
        </div>

        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Vendor Payouts Settled</span>
          <p className="font-serif text-3xl text-ink font-normal mt-3 tabular-nums">
            {finance ? formatINR(finance.vendorPayouts) : '—'}
          </p>
          <p className="text-xs text-grey mt-2">Catering, Florals & Studio fees</p>
        </div>

        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Pending Partner Payouts</span>
          <p className="font-serif text-3xl text-gold font-normal mt-3 tabular-nums">
            {finance ? formatINR(finance.pendingPayouts) : '—'}
          </p>
          <p className="text-xs text-grey mt-2">Due on post-event delivery</p>
        </div>

        <div className="bg-canvas-pure p-6 rounded-card hairline-border shadow-card">
          <span className="text-[11px] uppercase tracking-wider text-grey font-medium">Net Operating Profit</span>
          <p className="font-serif text-3xl text-status-success font-normal mt-3 tabular-nums">
            {finance ? formatINR(finance.netProfit) : '—'}
          </p>
          <p className="text-xs text-grey mt-2">Margin: ~39.5%</p>
        </div>
      </div>

      {/* GST Summary & Ledger Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GST Card */}
        <div className="bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-4">
          <h3 className="font-serif text-xl text-ink font-normal">GST & Tax Compliance</h3>
          <p className="text-xs text-grey">Summary of 18% GST collected vs input credit liability</p>

          <div className="space-y-4 pt-4 text-xs">
            <div className="flex justify-between py-2 hairline-b">
              <span className="text-grey">Total GST Collected (18%)</span>
              <span className="font-serif font-medium text-ink tabular-nums">{finance ? formatINR(finance.gstCollected) : '—'}</span>
            </div>
            <div className="flex justify-between py-2 hairline-b">
              <span className="text-grey">Input Tax Credit (Vendors)</span>
              <span className="font-serif font-medium text-ink tabular-nums">{finance ? formatINR(finance.gstPayable) : '—'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-ink font-medium">Net GST Payable (Nov 2026)</span>
              <span className="font-serif font-bold text-plum tabular-nums">
                {finance ? formatINR(finance.gstCollected - finance.gstPayable) : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl text-ink font-normal">Recent Ledger Transactions</h3>
            <span className="text-xs text-grey">Audited records</span>
          </div>

          <div className="divide-y divide-hairline">
            {finance?.recentTransactions.map((t) => (
              <div key={t.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gold text-[10px]">{t.id}</span>
                    <span className="font-medium text-ink">{t.description}</span>
                  </div>
                  <p className="text-[11px] text-grey mt-0.5">
                    {formatEditorialDate(t.date)} &bull; {t.paymentMethod} &bull; Ref: {t.referenceNumber}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`font-serif text-sm font-medium tabular-nums ${
                    t.type.startsWith('customer') ? 'text-status-success' : 'text-ink'
                  }`}>
                    {t.type.startsWith('customer') ? '+' : '-'} {formatINR(t.amount)}
                  </span>
                  <p className="text-[10px] text-grey capitalize">{t.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
