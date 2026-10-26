'use client';

import React, { useEffect, useState } from 'react';
import { employeeService } from '@/services/employees';
import { Employee } from '@/types';

export default function TeamPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [deptFilter, setDeptFilter] = useState<string>('all');

  useEffect(() => {
    employeeService.getEmployees().then(setEmployees);
  }, []);

  const handleToggleAttendance = async (emp: Employee) => {
    const nextAttendance = emp.attendance === 'present' ? 'leave' : 'present';
    const updated = await employeeService.updateAttendance(emp.id, nextAttendance);
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? updated : e)));
  };

  const filtered = employees.filter((e) =>
    deptFilter === 'all' ? true : e.department === deptFilter
  );

  return (
    <div className="space-y-8">
      {/* Title & Department Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Internal Directory</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Team & Attendance</h1>
          <p className="text-xs text-grey mt-1">Staff roster, operational allocation, and leave balances.</p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'operations', 'sales', 'support', 'finance'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                deptFilter === dept ? 'bg-plum text-white font-medium' : 'bg-canvas-pure hairline-border text-grey hover:text-ink'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div key={emp.id} className="p-6 bg-canvas-pure rounded-card hairline-border shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-canvas-subtle hairline-border flex items-center justify-center font-serif text-sm font-semibold text-ink">
                  {emp.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif text-base text-ink font-medium">{emp.name}</h3>
                  <p className="text-[11px] text-grey capitalize">{emp.department} &bull; {emp.role}</p>
                </div>
              </div>

              <button
                onClick={() => handleToggleAttendance(emp)}
                className={`text-[10px] px-2.5 py-1 rounded-full font-medium capitalize transition-colors ${
                  emp.attendance === 'present'
                    ? 'bg-status-success/10 text-status-success'
                    : 'bg-status-warning/10 text-status-warning'
                }`}
              >
                {emp.attendance}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 hairline-t">
              <div className="p-2 rounded-lg bg-canvas hairline-border">
                <span className="text-[9px] uppercase tracking-wider text-grey block">Tasks</span>
                <span className="font-serif text-ink font-medium mt-0.5 block">{emp.activeTasks}</span>
              </div>
              <div className="p-2 rounded-lg bg-canvas hairline-border">
                <span className="text-[9px] uppercase tracking-wider text-grey block">Leave Bal</span>
                <span className="font-serif text-ink font-medium mt-0.5 block">{emp.leaveBalance}d</span>
              </div>
              <div className="p-2 rounded-lg bg-canvas hairline-border">
                <span className="text-[9px] uppercase tracking-wider text-grey block">Rating</span>
                <span className="font-serif text-gold font-medium mt-0.5 block">{emp.rating}</span>
              </div>
            </div>

            <div className="text-[11px] text-grey space-y-0.5 pt-1">
              <p>{emp.email}</p>
              <p>{emp.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
