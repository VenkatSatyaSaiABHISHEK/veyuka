'use client';

import React, { useEffect, useState } from 'react';
import { operationsService } from '@/services/operations';
import { employeeService } from '@/services/employees';
import { OperationsIncident, Employee } from '@/types';

export default function OperationsPage() {
  const [incidents, setIncidents] = useState<OperationsIncident[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    operationsService.getIncidents().then(setIncidents);
    employeeService.getEmployees().then(setEmployees);
  }, []);

  const handleResolve = async (id: string) => {
    const updated = await operationsService.updateIncidentStatus(id, 'resolved', 'Resolved on-site by operations team.');
    setIncidents((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Operations & Escalations</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Live Escalation Control</h1>
          <p className="text-xs text-grey mt-1">Real-time incident dispatch, customs clearing, sound permits, and client support.</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-serif text-gold font-medium">
            {incidents.filter((i) => i.status !== 'resolved').length} Active Alerts
          </span>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-4">
        {incidents.map((inc) => (
          <div
            key={inc.id}
            className="p-6 bg-canvas-pure rounded-card hairline-border shadow-card space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    inc.severity === 'critical'
                      ? 'bg-status-error animate-ping'
                      : inc.severity === 'high'
                      ? 'bg-status-error'
                      : inc.severity === 'medium'
                      ? 'bg-status-warning'
                      : 'bg-status-info'
                  }`}
                />
                <span className="font-mono text-xs text-gold uppercase font-medium">{inc.id}</span>
                <span className="text-xs text-grey uppercase tracking-wider">&bull; {inc.type}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${
                  inc.status === 'resolved' ? 'bg-status-success/10 text-status-success' : 'bg-canvas hairline-border text-ink'
                }`}>
                  {inc.status}
                </span>
              </div>
              <span className="text-xs text-grey">{inc.time}</span>
            </div>

            <div>
              <h3 className="font-serif text-lg text-ink font-medium">{inc.eventTitle}</h3>
              <p className="text-xs text-grey leading-relaxed mt-1">{inc.description}</p>
            </div>

            {inc.resolutionNotes && (
              <div className="p-3.5 rounded-xl bg-canvas text-xs text-grey space-y-0.5">
                <span className="text-[10px] uppercase tracking-wider text-ink font-medium">Staff Action Note</span>
                <p>{inc.resolutionNotes}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 hairline-t gap-3 text-xs">
              <span className="text-grey">
                Assigned Lead: <strong className="text-ink font-medium">{inc.assignedStaff}</strong>
              </span>

              {inc.status !== 'resolved' && (
                <button
                  onClick={() => handleResolve(inc.id)}
                  className="px-4 py-1.5 rounded-full bg-ink text-white text-xs font-medium hover:bg-black transition-colors"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
