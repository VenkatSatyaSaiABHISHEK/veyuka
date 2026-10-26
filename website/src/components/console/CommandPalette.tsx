'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsoleStore } from '@/store/useConsoleStore';
import { mockBookings } from '@/data/bookings';
import { mockCustomers } from '@/data/customers';
import { mockVendors } from '@/data/vendors';

export function CommandPalette() {
  const router = useRouter();
  const { paletteOpen, setPaletteOpen, openDrawer } = useConsoleStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [paletteOpen, setPaletteOpen]);

  if (!paletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-ink/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="w-full max-w-xl bg-canvas-pure rounded-2xl hairline-border shadow-palette overflow-hidden"
        >
          <Command
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setPaletteOpen(false);
              }
            }}
          >
            <div className="flex items-center px-4 hairline-b">
              <span className="text-xs text-grey mr-2 font-mono">⌘K</span>
              <Command.Input
                autoFocus
                placeholder="Search bookings, customers, vendors, or run actions..."
                className="w-full py-4 bg-transparent text-sm text-ink placeholder:text-grey-light focus:outline-none"
              />
              <button
                onClick={() => setPaletteOpen(false)}
                className="text-xs text-grey hover:text-ink px-1.5 py-0.5 rounded bg-canvas hairline-border"
              >
                Esc
              </button>
            </div>

            <Command.List className="max-h-80 overflow-y-auto p-2 divide-y divide-hairline">
              <Command.Empty className="py-8 text-center text-xs text-grey">
                No matching results found.
              </Command.Empty>

              {/* Navigation Group */}
              <Command.Group heading="Console Modules" className="text-[10px] uppercase tracking-wider text-grey px-2 py-1.5 font-medium">
                <Command.Item
                  onSelect={() => {
                    router.push('/console/today');
                    setPaletteOpen(false);
                  }}
                  className="px-3 py-2 text-xs text-ink hover:bg-canvas-subtle rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <span>Today &bull; Executive Focus</span>
                  <span className="text-[10px] text-grey">Jump</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    router.push('/console/bookings');
                    setPaletteOpen(false);
                  }}
                  className="px-3 py-2 text-xs text-ink hover:bg-canvas-subtle rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <span>Bookings &bull; Pipeline & Staging</span>
                  <span className="text-[10px] text-grey">Jump</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    router.push('/console/customers');
                    setPaletteOpen(false);
                  }}
                  className="px-3 py-2 text-xs text-ink hover:bg-canvas-subtle rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <span>Customers & Enquiries</span>
                  <span className="text-[10px] text-grey">Jump</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    router.push('/console/vendors');
                    setPaletteOpen(false);
                  }}
                  className="px-3 py-2 text-xs text-ink hover:bg-canvas-subtle rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <span>Vendors & Performance</span>
                  <span className="text-[10px] text-grey">Jump</span>
                </Command.Item>
                <Command.Item
                  onSelect={() => {
                    router.push('/console/finance');
                    setPaletteOpen(false);
                  }}
                  className="px-3 py-2 text-xs text-ink hover:bg-canvas-subtle rounded-lg cursor-pointer flex items-center justify-between"
                >
                  <span>Finance & Ledger</span>
                  <span className="text-[10px] text-grey">Jump</span>
                </Command.Item>
              </Command.Group>

              {/* Bookings Group */}
              <Command.Group heading="Active Bookings" className="text-[10px] uppercase tracking-wider text-grey px-2 py-1.5 font-medium mt-2">
                {mockBookings.slice(0, 4).map((b) => (
                  <Command.Item
                    key={b.id}
                    onSelect={() => {
                      openDrawer('booking', b.id);
                      setPaletteOpen(false);
                    }}
                    className="px-3 py-2 text-xs text-ink hover:bg-canvas-subtle rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-medium">{b.customerName}</span>
                      <span className="text-grey ml-2">({b.eventType} &bull; {b.city})</span>
                    </div>
                    <span className="text-[10px] text-gold uppercase">{b.id}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              {/* Customers Group */}
              <Command.Group heading="VIP Clients" className="text-[10px] uppercase tracking-wider text-grey px-2 py-1.5 font-medium mt-2">
                {mockCustomers.slice(0, 3).map((c) => (
                  <Command.Item
                    key={c.id}
                    onSelect={() => {
                      openDrawer('customer', c.id);
                      setPaletteOpen(false);
                    }}
                    className="px-3 py-2 text-xs text-ink hover:bg-canvas-subtle rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-grey">{c.city}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              {/* Vendors Group */}
              <Command.Group heading="Assigned Vendors" className="text-[10px] uppercase tracking-wider text-grey px-2 py-1.5 font-medium mt-2">
                {mockVendors.slice(0, 3).map((v) => (
                  <Command.Item
                    key={v.id}
                    onSelect={() => {
                      openDrawer('vendor', v.id);
                      setPaletteOpen(false);
                    }}
                    className="px-3 py-2 text-xs text-ink hover:bg-canvas-subtle rounded-lg cursor-pointer flex items-center justify-between"
                  >
                    <span>{v.name}</span>
                    <span className="text-[10px] text-grey">{v.category}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
