'use client';

import React, { useEffect, useState } from 'react';
import { useConsoleStore } from '@/store/useConsoleStore';
import { vendorService } from '@/services/vendors';
import { Vendor, VendorCategory } from '@/types';
import { formatINR } from '@/lib/utils';

export default function VendorsPage() {
  const { openDrawer } = useConsoleStore();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // One question at a time Add Vendor form state
  const [addStep, setAddStep] = useState(1);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState<VendorCategory>('Decoration');
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorEmail, setNewVendorEmail] = useState('');
  const [newVendorArea, setNewVendorArea] = useState('');

  const loadVendors = () => {
    vendorService.getVendors().then(setVendors);
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleToggleSuspend = async (v: Vendor) => {
    const nextStatus = v.status === 'suspended' ? 'available' : 'suspended';
    if (confirm(`Are you sure you want to ${nextStatus === 'suspended' ? 'suspend' : 'reinstate'} ${v.name}?`)) {
      const updated = await vendorService.updateStatus(v.id, nextStatus);
      setVendors((prev) => prev.map((item) => (item.id === v.id ? updated : item)));
    }
  };

  const handleCreateVendor = async () => {
    await vendorService.addVendor({
      name: newVendorName,
      category: newVendorCategory,
      phone: newVendorPhone,
      email: newVendorEmail,
      areas: [newVendorArea || 'Mumbai'],
      status: 'available',
      documents: { aadhaar: true, pan: true, gst: true, license: true, bank: true },
      performance: { acceptanceRate: 100, punctuality: 100, qualityScore: 5.0 },
    });
    setAddModalOpen(false);
    setAddStep(1);
    setNewVendorName('');
    setNewVendorPhone('');
    loadVendors();
  };

  const filteredVendors = vendors.filter((v) =>
    categoryFilter === 'all' ? true : v.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Internal Sourcing</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Managed Vendors</h1>
          <p className="text-xs text-grey mt-1">Zero vendor app. All partner operations managed through this console.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-1.5 rounded-full bg-canvas-pure hairline-border text-xs text-ink focus:outline-none"
          >
            <option value="all">All Services</option>
            <option value="Decoration">Decoration</option>
            <option value="Catering">Catering</option>
            <option value="Photography">Photography</option>
            <option value="Music">Music</option>
            <option value="Venue">Venue</option>
            <option value="Makeup">Makeup</option>
          </select>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-1.5 rounded-full bg-plum text-white text-xs font-medium tracking-wide hover:bg-plum-hover transition-colors shadow-subtle"
          >
            + Add Vendor
          </button>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-canvas-pure rounded-card hairline-border shadow-card overflow-hidden">
        <table className="w-full text-left text-xs divide-y divide-hairline">
          <thead className="bg-canvas/50 text-grey uppercase tracking-wider text-[10px] font-medium">
            <tr>
              <th className="py-4 px-6">Vendor & Service</th>
              <th className="py-4 px-6">Coverage Areas</th>
              <th className="py-4 px-6">Performance</th>
              <th className="py-4 px-6">KYC Status</th>
              <th className="py-4 px-6">Pending Payout</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {filteredVendors.map((v) => (
              <tr key={v.id} className="hover:bg-canvas-subtle transition-colors">
                <td
                  onClick={() => openDrawer('vendor', v.id)}
                  className="py-4 px-6 cursor-pointer"
                >
                  <p className="font-medium text-ink hover:text-plum">{v.name}</p>
                  <p className="text-[11px] text-grey">{v.category} &bull; {v.phone}</p>
                </td>
                <td className="py-4 px-6 text-grey">{v.areas.join(', ')}</td>
                <td className="py-4 px-6">
                  <div className="text-[11px]">
                    <span className="font-medium text-ink">{v.rating} / 5.0</span>
                    <span className="text-grey ml-2">({v.performance.punctuality}% on-time)</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-success/10 text-status-success font-medium">
                    Verified
                  </span>
                </td>
                <td className="py-4 px-6 font-serif text-sm font-medium tabular-nums">{formatINR(v.paymentPending)}</td>
                <td className="py-4 px-6">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full capitalize font-medium ${
                    v.status === 'suspended' ? 'bg-status-error/10 text-status-error' : 'bg-canvas hairline-border text-ink'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  <button
                    onClick={() => openDrawer('vendor', v.id)}
                    className="text-plum font-medium hover:underline"
                  >
                    Dossier
                  </button>
                  <button
                    onClick={() => handleToggleSuspend(v)}
                    className="text-grey hover:text-status-error text-[11px]"
                  >
                    {v.status === 'suspended' ? 'Reinstate' : 'Suspend'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Vendor Modal (One Question at a Time) */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-canvas-pure rounded-2xl p-8 hairline-border shadow-palette space-y-6">
            <div className="flex justify-between items-center hairline-b pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-grey">Step {addStep} of 4</span>
                <h3 className="font-serif text-xl text-ink font-normal mt-0.5">Onboard Internal Vendor</h3>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-grey hover:text-ink text-xs">&times; Close</button>
            </div>

            {addStep === 1 && (
              <div className="space-y-4">
                <label className="text-xs text-ink font-medium block">What is the partner or studio name?</label>
                <input
                  type="text"
                  autoFocus
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder="e.g. Royal Brass Chamber Collective"
                  className="w-full p-3 rounded-xl bg-canvas hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                />
                <button
                  disabled={!newVendorName}
                  onClick={() => setAddStep(2)}
                  className="w-full py-2.5 rounded-full bg-plum text-white text-xs font-medium hover:bg-plum-hover transition-colors disabled:opacity-40"
                >
                  Continue &rarr;
                </button>
              </div>
            )}

            {addStep === 2 && (
              <div className="space-y-4">
                <label className="text-xs text-ink font-medium block">What category of celebration service?</label>
                <select
                  value={newVendorCategory}
                  onChange={(e) => setNewVendorCategory(e.target.value as VendorCategory)}
                  className="w-full p-3 rounded-xl bg-canvas hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                >
                  <option value="Decoration">Decoration</option>
                  <option value="Catering">Catering</option>
                  <option value="Photography">Photography</option>
                  <option value="Music">Music</option>
                  <option value="Venue">Venue</option>
                  <option value="Makeup">Makeup</option>
                </select>
                <div className="flex gap-3">
                  <button onClick={() => setAddStep(1)} className="w-1/3 py-2.5 rounded-full hairline-border text-xs text-grey">Back</button>
                  <button onClick={() => setAddStep(3)} className="w-2/3 py-2.5 rounded-full bg-plum text-white text-xs font-medium hover:bg-plum-hover">Continue &rarr;</button>
                </div>
              </div>
            )}

            {addStep === 3 && (
              <div className="space-y-4">
                <label className="text-xs text-ink font-medium block">Direct contact credentials</label>
                <input
                  type="tel"
                  placeholder="Official Phone (+91 ...)"
                  value={newVendorPhone}
                  onChange={(e) => setNewVendorPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-canvas hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                />
                <input
                  type="email"
                  placeholder="Official Email"
                  value={newVendorEmail}
                  onChange={(e) => setNewVendorEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-canvas hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                />
                <div className="flex gap-3">
                  <button onClick={() => setAddStep(2)} className="w-1/3 py-2.5 rounded-full hairline-border text-xs text-grey">Back</button>
                  <button onClick={() => setAddStep(4)} className="w-2/3 py-2.5 rounded-full bg-plum text-white text-xs font-medium hover:bg-plum-hover">Continue &rarr;</button>
                </div>
              </div>
            )}

            {addStep === 4 && (
              <div className="space-y-4">
                <label className="text-xs text-ink font-medium block">Operating territory</label>
                <input
                  type="text"
                  placeholder="e.g. South Mumbai, Bandra, Alibaug"
                  value={newVendorArea}
                  onChange={(e) => setNewVendorArea(e.target.value)}
                  className="w-full p-3 rounded-xl bg-canvas hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                />
                <div className="flex gap-3">
                  <button onClick={() => setAddStep(3)} className="w-1/3 py-2.5 rounded-full hairline-border text-xs text-grey">Back</button>
                  <button onClick={handleCreateVendor} className="w-2/3 py-2.5 rounded-full bg-plum text-white text-xs font-medium hover:bg-plum-hover">Finish & Save</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
