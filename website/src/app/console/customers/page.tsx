'use client';

import React, { useEffect, useState } from 'react';
import { useConsoleStore } from '@/store/useConsoleStore';
import { customerService } from '@/services/customers';
import { enquiryService } from '@/services/enquiries';
import { CustomerProfile, Enquiry } from '@/types';
import { formatINR, formatEditorialDate } from '@/lib/utils';

export default function CustomersPage() {
  const { openDrawer } = useConsoleStore();
  const [tab, setTab] = useState<'profiles' | 'enquiries'>('profiles');
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    customerService.getCustomers().then(setCustomers);
    enquiryService.getEnquiries().then(setEnquiries);
  }, []);

  const handleUpdateEnquiryStatus = async (id: string, status: Enquiry['status']) => {
    const updated = await enquiryService.updateStatus(id, status);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Client Relations</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Customers & Enquiries</h1>
        </div>

        <div className="flex p-0.5 rounded-full bg-canvas hairline-border">
          <button
            onClick={() => setTab('profiles')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              tab === 'profiles' ? 'bg-canvas-pure text-ink shadow-subtle' : 'text-grey hover:text-ink'
            }`}
          >
            VIP Profiles ({customers.length})
          </button>
          <button
            onClick={() => setTab('enquiries')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              tab === 'enquiries' ? 'bg-canvas-pure text-ink shadow-subtle' : 'text-grey hover:text-ink'
            }`}
          >
            Showcase Enquiries ({enquiries.length})
          </button>
        </div>
      </div>

      {/* Tab 1: VIP Profiles */}
      {tab === 'profiles' && (
        <div className="bg-canvas-pure rounded-card hairline-border shadow-card overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-hairline">
            <thead className="bg-canvas/50 text-grey uppercase tracking-wider text-[10px] font-medium">
              <tr>
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Celebrations</th>
                <th className="py-4 px-6">Total Spend</th>
                <th className="py-4 px-6">Member Since</th>
                <th className="py-4 px-6 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openDrawer('customer', c.id)}
                  className="hover:bg-canvas-subtle cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium text-ink">{c.name}</p>
                    <p className="text-[11px] text-grey">{c.email} &bull; {c.phone}</p>
                  </td>
                  <td className="py-4 px-6 text-grey">{c.city}</td>
                  <td className="py-4 px-6 font-serif text-sm font-medium tabular-nums">{c.totalBookings}</td>
                  <td className="py-4 px-6 font-serif text-sm font-medium tabular-nums">{formatINR(c.totalSpent)}</td>
                  <td className="py-4 px-6 text-grey">{c.memberSince}</td>
                  <td className="py-4 px-6 text-right text-plum font-medium">View &rarr;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Showcase Enquiries */}
      {tab === 'enquiries' && (
        <div className="bg-canvas-pure rounded-card hairline-border shadow-card overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-hairline">
            <thead className="bg-canvas/50 text-grey uppercase tracking-wider text-[10px] font-medium">
              <tr>
                <th className="py-4 px-6">Lead ID & Date</th>
                <th className="py-4 px-6">Prospective Client</th>
                <th className="py-4 px-6">Event Type & Date</th>
                <th className="py-4 px-6">Message</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-canvas-subtle transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gold">{e.id}</p>
                    <p className="text-[11px] text-grey">{formatEditorialDate(e.createdAt)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-ink">{e.name}</p>
                    <a href={`tel:${e.phone}`} className="text-[11px] text-plum hover:underline">{e.phone}</a>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-ink">{e.eventType}</p>
                    <p className="text-[11px] text-grey">{e.eventDate ? formatEditorialDate(e.eventDate) : 'Not specified'}</p>
                  </td>
                  <td className="py-4 px-6 text-grey max-w-xs truncate">{e.message || '—'}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full capitalize font-medium ${
                      e.status === 'new' ? 'bg-status-warning/10 text-status-warning' : 'bg-status-success/10 text-status-success'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {e.status === 'new' ? (
                      <button
                        onClick={() => handleUpdateEnquiryStatus(e.id, 'contacted')}
                        className="text-xs text-plum hover:underline font-medium"
                      >
                        Mark Contacted
                      </button>
                    ) : (
                      <span className="text-[11px] text-grey">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
