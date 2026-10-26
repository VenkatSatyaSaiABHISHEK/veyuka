import { create } from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/auth';

interface ConsoleState {
  user: User | null;
  setUser: (user: User | null) => void;
  initUser: () => void;
  
  // Drawer state
  drawerOpen: boolean;
  drawerType: 'booking' | 'customer' | 'vendor' | null;
  selectedEntityId: string | null;
  openDrawer: (type: 'booking' | 'customer' | 'vendor', id: string) => void;
  closeDrawer: () => void;

  // Command palette
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;

  // Keyboard shortcut help
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;

  // Sidebar collapsed
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useConsoleStore = create<ConsoleState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  initUser: () => {
    const current = authService.getCurrentUser();
    if (current) {
      set({ user: current });
    }
  },

  drawerOpen: false,
  drawerType: null,
  selectedEntityId: null,
  openDrawer: (type, id) => set({ drawerOpen: true, drawerType: type, selectedEntityId: id }),
  closeDrawer: () => set({ drawerOpen: false, drawerType: null, selectedEntityId: null }),

  paletteOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen }),

  shortcutsOpen: false,
  setShortcutsOpen: (shortcutsOpen) => set({ shortcutsOpen }),

  sidebarCollapsed: false,
  toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
}));
