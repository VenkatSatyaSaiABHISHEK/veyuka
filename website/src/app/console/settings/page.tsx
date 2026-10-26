'use client';

import React, { useState } from 'react';
import { useConsoleStore } from '@/store/useConsoleStore';

const mockAuditLogs = [
  { id: 'LOG-401', user: 'Vikramaditya S.', action: 'Assigned vendor Aura Floral to VYK-2024-8901', time: '10 mins ago' },
  { id: 'LOG-402', user: 'Aditi Chawla', action: 'Approved advance payout of ₹2,50,000 to Saffron & Bay', time: '1 hour ago' },
  { id: 'LOG-403', user: 'Tanya Singhal', action: 'Updated milestone stage for Golden Jubilee Gala to READY', time: '3 hours ago' },
  { id: 'LOG-404', user: 'Samir Joshi', action: 'Logged VIP customer feedback for Vikramaditya Oberoi', time: '5 hours ago' },
];

export default function SettingsPage() {
  const { user } = useConsoleStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'rbac' | 'audit'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Administration</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Console & Governance</h1>
          <p className="text-xs text-grey mt-1">Company profile, access permissions, branches, and compliance audit logs.</p>
        </div>

        <div className="flex p-0.5 rounded-full bg-canvas hairline-border">
          {(['profile', 'rbac', 'audit'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3.5 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                activeTab === t ? 'bg-canvas-pure text-ink shadow-subtle' : 'text-grey hover:text-ink'
              }`}
            >
              {t === 'profile' ? 'Company Profile' : t === 'rbac' ? 'RBAC Permissions' : 'Audit Log'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Company Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-6">
          <h3 className="font-serif text-xl text-ink font-normal">Entity Information</h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">Corporate Name</label>
              <input
                type="text"
                defaultValue="Veyuka Private Limited"
                className="w-full p-3 rounded-xl bg-canvas hairline-border text-ink font-medium focus:outline-none focus:border-plum"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">Registered Flagship Office</label>
              <input
                type="text"
                defaultValue="Level 14, The Capital, G Block, BKC, Mumbai 400051"
                className="w-full p-3 rounded-xl bg-canvas hairline-border text-ink font-medium focus:outline-none focus:border-plum"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">GSTIN</label>
                <input
                  type="text"
                  defaultValue="27AABCV1234F1Z8"
                  className="w-full p-3 rounded-xl bg-canvas hairline-border text-ink font-mono focus:outline-none focus:border-plum"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">Primary Operating Currency</label>
                <input
                  type="text"
                  defaultValue="INR (₹) Indian Rupee"
                  disabled
                  className="w-full p-3 rounded-xl bg-canvas hairline-border text-grey font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-plum text-white text-xs font-medium hover:bg-plum-hover transition-colors shadow-subtle"
              >
                {saveSuccess ? 'Changes Saved ✓' : 'Save Organization Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Roles Editor */}
      {activeTab === 'rbac' && (
        <div className="bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl text-ink font-normal">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-grey">Configured module accessibility matrix by employee role</p>
            </div>
            <span className="text-xs text-gold font-medium">Strict Security Enforcement</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-hairline">
              <thead className="text-[10px] uppercase tracking-wider text-grey bg-canvas">
                <tr>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Today</th>
                  <th className="py-3 px-4">Bookings</th>
                  <th className="py-3 px-4">Vendors</th>
                  <th className="py-3 px-4">Finance</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                <tr>
                  <td className="py-3 px-4 font-medium text-ink">Owner (Executive)</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-ink">Operations Lead</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-grey">Restricted</td>
                  <td className="py-3 px-4 text-grey">View Only</td>
                  <td className="py-3 px-4 text-grey">Restricted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-ink">Finance Director</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-grey">View Only</td>
                  <td className="py-3 px-4 text-grey">View Only</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-grey">Restricted</td>
                  <td className="py-3 px-4 text-grey">Restricted</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-ink">Client Support</td>
                  <td className="py-3 px-4 text-status-success font-medium">Full</td>
                  <td className="py-3 px-4 text-grey">View Only</td>
                  <td className="py-3 px-4 text-grey">Restricted</td>
                  <td className="py-3 px-4 text-grey">Restricted</td>
                  <td className="py-3 px-4 text-grey">Restricted</td>
                  <td className="py-3 px-4 text-grey">Restricted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-canvas-pure p-8 rounded-card hairline-border shadow-card space-y-4">
          <h3 className="font-serif text-xl text-ink font-normal">Immutable Action Log</h3>
          <p className="text-xs text-grey">Security trace of vendor allocations, stage movements, and financial authorizations.</p>

          <div className="divide-y divide-hairline pt-2">
            {mockAuditLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gold text-[10px]">{log.id}</span>
                    <strong className="text-ink font-medium">{log.user}</strong>
                    <span className="text-grey">{log.action}</span>
                  </div>
                </div>
                <span className="text-[11px] text-grey">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
