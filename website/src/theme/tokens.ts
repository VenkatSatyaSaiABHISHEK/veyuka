/**
 * VEYUKA Quiet Luxury Design System - Web Console Tokens
 * Reused from Expo mobile application (src/theme) for 100% brand consistency.
 * Direction: White canvas (#FFFFFF / #FBFAF8), ink (#121016), grey (#8B8794),
 * hairline (#ECE8E4), one accent plum (#4A2275), touch of antique gold (#B8924A).
 */

export const colors = {
  // Canvases
  canvas: '#FBFAF8',       // Warm ivory base
  canvasPure: '#FFFFFF',   // Pure editorial white
  canvasSubtle: '#F7F5F2', // Soft neutral section fill
  canvasCard: '#FFFFFF',   // Clean card surface

  // Typography & Inks
  ink: '#121016',          // Primary text - deep obsidian ink
  inkSecondary: '#4A4553', // Medium contrast text
  grey: '#8B8794',         // Secondary text, captions, hints
  greyLight: '#B8B4BF',    // Subtle placeholder / disabled text

  // Borders & Structural Hairlines
  hairline: '#ECE8E4',      // 1px editorial hairlines
  hairlineLight: '#F4F1ED', // Ultra-faint separators

  // Single Accent: Deep Plum
  plum: '#4A2275',         // THE single primary button and key highlight
  plumHover: '#3A1860',    // Pressed state
  plumSubtle: 'rgba(74, 34, 117, 0.08)', // Soft tint background

  // Minimal Accent: Antique Gold (thin lines and small numerals only)
  gold: '#B8924A',         // Antique gold
  goldSubtle: 'rgba(184, 146, 74, 0.16)', // Hairline gold rules

  // Ethereal Gradient Mesh (Blush, Lavender, Champagne at 10-20% opacity)
  meshBlush: 'rgba(244, 226, 222, 0.20)',
  meshLavender: 'rgba(232, 224, 245, 0.18)',
  meshChampagne: 'rgba(247, 240, 226, 0.22)',

  // Status Indicators (small dots only)
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#D32F2F',
  info: '#0288D1',

  white: '#FFFFFF',
} as const;

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
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,       // Standard button & input radius
  lg: 18,       // Small cards
  xl: 22,       // Floating bars & sheets
  xxl: 28,      // Big rounded photos
  photo: 28,    // Editorial photos
  card: 24,     // Console cards
  full: 9999,   // Pill buttons
} as const;

export const shadows = {
  floating: '0 12px 36px -4px rgba(18, 16, 22, 0.08), 0 4px 12px -2px rgba(18, 16, 22, 0.03)',
  card: '0 4px 20px -2px rgba(18, 16, 22, 0.04)',
  subtle: '0 2px 8px -1px rgba(18, 16, 22, 0.03)',
  drawer: '-16px 0 48px -8px rgba(18, 16, 22, 0.12)',
  palette: '0 24px 64px -12px rgba(18, 16, 22, 0.14)',
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  shadows,
} as const;

export default theme;
