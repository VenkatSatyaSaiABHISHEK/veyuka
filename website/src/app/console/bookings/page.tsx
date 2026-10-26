'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, DragEndEvent, useDroppable, useDraggable } from '@dnd-kit/core';
import { useConsoleStore } from '@/store/useConsoleStore';
import { bookingService } from '@/services/bookings';
import { Booking, BookingStatus, EventCategoryType } from '@/types';
import { formatINR, formatEditorialDate } from '@/lib/utils';

const PIPELINE_STAGES: { id: BookingStatus; label: string }[] = [
  { id: 'new', label: 'New' },
  { id: 'reviewing', label: 'Reviewing' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'planning', label: 'Planning' },
  { id: 'preparation', label: 'Preparation' },
  { id: 'ready', label: 'Event Ready' },
  { id: 'completed', label: 'Completed' },
];

function DraggableCard({ booking, onOpen }: { booking: Booking; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: booking.id,
    data: booking,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-xl bg-canvas-pure hairline-border shadow-card hover:border-plum transition-all cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-40 scale-105' : ''
      }`}
    >
      <div className="flex items-center justify-between" {...listeners} {...attributes}>
        <span className="text-[10px] uppercase tracking-wider text-gold font-medium">{booking.id}</span>
        <span className="text-[10px] text-grey">{booking.eventType}</span>
      </div>

      <div onClick={onOpen} className="mt-2 cursor-pointer">
        <h4 className="font-serif text-sm text-ink font-medium">{booking.customerName}</h4>
        <p className="text-[11px] text-grey line-clamp-1 mt-0.5">{booking.address}</p>
        <div className="mt-3 flex items-center justify-between text-xs pt-2 hairline-t">
          <span className="font-serif text-ink font-medium tabular-nums">{formatINR(booking.totalAmount)}</span>
          <span className="text-[10px] text-grey">{formatEditorialDate(booking.date)}</span>
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({
  stage,
  bookings,
  onOpen,
}: {
  stage: { id: BookingStatus; label: string };
  bookings: Booking[];
  onOpen: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`shrink-0 w-72 rounded-2xl p-3 flex flex-col gap-3 min-h-[600px] transition-colors ${
        isOver ? 'bg-canvas-subtle hairline-border border-plum/40' : 'bg-canvas hairline-border'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1">
        <div className="flex items-center gap-2">
          <span className="font-serif text-xs text-ink font-medium">{stage.label}</span>
          <span className="text-[10px] text-grey tabular-nums bg-canvas-pure px-2 py-0.5 rounded-full hairline-border">
            {bookings.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {bookings.map((b) => (
          <DraggableCard key={b.id} booking={b} onOpen={() => onOpen(b.id)} />
        ))}
        {bookings.length === 0 && (
          <div className="h-28 rounded-xl border border-dashed border-hairline flex items-center justify-center text-[11px] text-grey">
            No events in {stage.label}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingsPage() {
  const { openDrawer } = useConsoleStore();
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadData = () => {
    bookingService.getBookings().then(setBookings);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const bookingId = active.id as string;
    const newStage = over.id as BookingStatus;

    // Optimistic UI update
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStage } : b))
    );

    await bookingService.updateStage(bookingId, newStage);
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (categoryFilter !== 'all' && b.eventType !== categoryFilter) return false;
    if (cityFilter !== 'all' && b.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (search && !b.customerName.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls: Title, View Switcher & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 hairline-b">
        <div>
          <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Staging Pipeline</span>
          <h1 className="font-serif text-3xl text-ink font-normal mt-1">Bookings & Celebrations</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking or client..."
            className="px-3.5 py-1.5 rounded-full bg-canvas-pure hairline-border text-xs text-ink placeholder:text-grey-light focus:outline-none focus:border-plum"
          />

          {/* Filter by Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-canvas-pure hairline-border text-xs text-ink focus:outline-none"
          >
            <option value="all">All Events</option>
            <option value="Wedding">Weddings</option>
            <option value="Birthday">Birthdays</option>
            <option value="Engagement">Engagements</option>
            <option value="Corporate">Corporate</option>
          </select>

          {/* View Switcher */}
          <div className="flex p-0.5 rounded-full bg-canvas hairline-border">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'pipeline' ? 'bg-canvas-pure text-ink shadow-subtle' : 'text-grey hover:text-ink'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-canvas-pure text-ink shadow-subtle' : 'text-grey hover:text-ink'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* PIPELINE VIEW (Drag & Drop with @dnd-kit) */}
      {viewMode === 'pipeline' && (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-none">
            {PIPELINE_STAGES.map((stage) => {
              const stageBookings = filteredBookings.filter((b) => b.status === stage.id);
              return (
                <DroppableColumn
                  key={stage.id}
                  stage={stage}
                  bookings={stageBookings}
                  onOpen={(id) => openDrawer('booking', id)}
                />
              );
            })}
          </div>
        </DndContext>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-canvas-pure rounded-card hairline-border shadow-card overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-hairline">
            <thead className="bg-canvas/50 text-grey uppercase tracking-wider text-[10px] font-medium">
              <tr>
                <th className="py-4 px-6">ID & Date</th>
                <th className="py-4 px-6">Client</th>
                <th className="py-4 px-6">Event & Venue</th>
                <th className="py-4 px-6">Stage</th>
                <th className="py-4 px-6">Total Value</th>
                <th className="py-4 px-6">Advance</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => openDrawer('booking', b.id)}
                  className="hover:bg-canvas-subtle cursor-pointer transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium text-gold">{b.id}</p>
                    <p className="text-[11px] text-grey">{formatEditorialDate(b.date)}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-ink">{b.customerName}</p>
                    <p className="text-[11px] text-grey">{b.customerPhone}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-ink">{b.eventType}</p>
                    <p className="text-[11px] text-grey line-clamp-1">{b.address}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-canvas hairline-border text-ink capitalize font-medium">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-serif text-sm font-medium tabular-nums">{formatINR(b.totalAmount)}</td>
                  <td className="py-4 px-6 font-serif text-sm text-grey tabular-nums">{formatINR(b.advancePaid)}</td>
                  <td className="py-4 px-6 text-right text-plum font-medium">View &rarr;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
