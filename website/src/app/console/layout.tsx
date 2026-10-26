'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsoleStore } from '@/store/useConsoleStore';
import { authService } from '@/services/auth';
import { CommandPalette } from '@/components/console/CommandPalette';
import { DetailDrawer } from '@/components/console/DetailDrawer';
import { getInitials } from '@/lib/utils';
import { UserRole } from '@/types';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { id: 'today', label: 'Today', href: '/console/today' },
  { id: 'bookings', label: 'Bookings', href: '/console/bookings' },
  { id: 'customers', label: 'Customers', href: '/console/customers' },
  { id: 'vendors', label: 'Vendors', href: '/console/vendors' },
  { id: 'calendar', label: 'Calendar', href: '/console/calendar' },
  { id: 'finance', label: 'Finance', href: '/console/finance' },
  { id: 'operations', label: 'Operations', href: '/console/operations' },
  { id: 'team', label: 'Team', href: '/console/team' },
  { id: 'analytics', label: 'Analytics', href: '/console/analytics' },
  { id: 'marketing', label: 'Marketing', href: '/console/marketing' },
  { id: 'settings', label: 'Settings', href: '/console/settings' },
];

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initUser, setPaletteOpen, shortcutsOpen, setShortcutsOpen, sidebarCollapsed, toggleSidebar } = useConsoleStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Initialize and verify authentication
  useEffect(() => {
    initUser();
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
    } else {
      setReady(true);
    }
  }, [initUser, pathname, router]);

  // Global '?' key for keyboard shortcuts overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setShortcutsOpen(!shortcutsOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutsOpen, setShortcutsOpen]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (!ready || !user) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-hairline border-t-plum animate-spin" />
      </div>
    );
  }

  // Filter navigation items by RBAC
  const permittedNavItems = ALL_NAV_ITEMS.filter((item) =>
    authService.hasAccess(user.role as UserRole, item.id)
  );

  const activeSegment = pathname.split('/')[2] || 'today';
  const pageTitle = ALL_NAV_ITEMS.find((n) => n.id === activeSegment)?.label || 'Console';

  return (
    <div className="min-h-screen bg-canvas flex text-ink select-none overflow-x-hidden">
      {/* Command Palette */}
      <CommandPalette />

      {/* Global Detail Drawer */}
      <DetailDrawer />

      {/* Keyboard Shortcuts Help Modal */}
      <AnimatePresence>
        {shortcutsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-canvas-pure p-8 rounded-2xl hairline-border shadow-palette space-y-4"
            >
              <div className="flex justify-between items-center hairline-b pb-3">
                <h3 className="font-serif text-lg text-ink font-medium">Keyboard Shortcuts</h3>
                <button onClick={() => setShortcutsOpen(false)} className="text-grey hover:text-ink text-xs">&times; Close</button>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-grey">Open Command Palette</span>
                  <span className="font-mono bg-canvas px-2 py-0.5 rounded hairline-border">⌘K or /</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-grey">Close drawer / modal</span>
                  <span className="font-mono bg-canvas px-2 py-0.5 rounded hairline-border">Esc</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-grey">Show shortcuts overlay</span>
                  <span className="font-mono bg-canvas px-2 py-0.5 rounded hairline-border">?</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Slim White Sidebar */}
      <aside
        className={`shrink-0 bg-canvas-pure hairline-r flex flex-col justify-between transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-60'
        }`}
      >
        <div>
          {/* Logo / Brand Wordmark */}
          <div className="h-16 px-6 flex items-center justify-between hairline-b">
            {!sidebarCollapsed && (
              <Link href="/console/today" className="font-serif text-xl font-semibold tracking-wider text-ink">
                VEYUKA
              </Link>
            )}
            <button
              onClick={toggleSidebar}
              className="text-grey hover:text-ink text-xs p-1 rounded"
              title="Toggle sidebar"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>

          {/* Navigation Items with Sliding Indicator */}
          <nav className="p-3 space-y-1">
            {permittedNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative flex items-center px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-grey hover:text-ink hover:bg-canvas-subtle'
                  }`}
                >
                  {/* Sliding Plum Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="absolute inset-0 bg-plum rounded-xl z-0 shadow-subtle"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Role badge & Keyboard hint */}
        <div className="p-4 hairline-t">
          {!sidebarCollapsed ? (
            <div className="text-[11px] text-grey flex items-center justify-between">
              <span className="capitalize">{user.role} role</span>
              <button onClick={() => setShortcutsOpen(true)} className="hover:text-ink underline">
                Press ?
              </button>
            </div>
          ) : (
            <div className="text-center font-serif text-xs text-grey font-semibold">V</div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-canvas-pure hairline-b px-8 flex items-center justify-between sticky top-0 z-20">
          {/* Breadcrumb in Serif */}
          <div className="flex items-center gap-2">
            <span className="font-serif text-xs text-grey">Console</span>
            <span className="text-grey text-xs">/</span>
            <span className="font-serif text-lg text-ink font-medium">{pageTitle}</span>
          </div>

          {/* Search Trigger, Notifications & Profile */}
          <div className="flex items-center gap-5">
            {/* Global Search field opening Command Palette */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-canvas hairline-border text-xs text-grey hover:text-ink transition-colors"
            >
              <span>Search or jump to...</span>
              <span className="font-mono text-[10px] bg-canvas-pure px-1.5 py-0.5 rounded border border-hairline">⌘K</span>
            </button>

            {/* Notification Text Link */}
            <Link
              href="/console/operations"
              className="text-xs text-grey hover:text-ink font-medium tracking-wide transition-colors"
            >
              Alerts (3)
            </Link>

            {/* User Avatar with Initials in Serif */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F4E2DE] via-[#E8E0F5] to-[#F7F0E2] p-0.5 hairline-border flex items-center justify-center"
              >
                <span className="font-serif text-xs font-semibold text-ink">
                  {getInitials(user.name)}
                </span>
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 bg-canvas-pure rounded-xl hairline-border shadow-floating p-2 z-50 text-xs"
                  >
                    <div className="p-3 hairline-b">
                      <p className="font-medium text-ink">{user.name}</p>
                      <p className="text-[11px] text-grey">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-canvas font-medium text-plum">
                        {user.role} &bull; {user.department}
                      </span>
                    </div>
                    <div className="pt-1">
                      <Link
                        href="/console/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-3 py-2 text-grey hover:text-ink hover:bg-canvas-subtle rounded-lg"
                      >
                        Company Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-status-error hover:bg-status-error-bg rounded-lg"
                      >
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
