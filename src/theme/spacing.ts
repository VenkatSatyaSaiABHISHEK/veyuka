export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,       // Primary 24px side padding & standard margin
  xxl: 32,      // Generous section gap
  xxxl: 48,     // Big editorial vertical rhythm
  huge: 64,     // Hero vertical spacing
  massive: 80,  // Major section transition
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,       // Standard button & input radius
  lg: 18,       // Small cards
  xl: 22,       // Floating bars & sheets
  xxl: 28,      // Big rounded photos (radius 28)
  photo: 28,    // Editorial photos
  full: 9999,   // Pill buttons
};

export const shadows = {
  // Ultra-soft floating bar shadow
  floating: {
    shadowColor: '#121016',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 6,
  },

  // Soft card lift
  card: {
    shadowColor: '#121016',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },

  // Subtle bottom border shadow
  subtle: {
    shadowColor: '#121016',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },

  // None
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Backwards compatibility aliases
  glass: {
    shadowColor: '#121016',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  goldGlow: {
    shadowColor: '#B8924A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  purpleGlow: {
    shadowColor: '#4A2275',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 3,
  },
};
