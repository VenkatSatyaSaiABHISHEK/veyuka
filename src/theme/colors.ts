/**
 * VEYUKA Quiet Luxury Design System - Colors
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
  meshBlush: 'rgba(244, 226, 222, 0.40)',
  meshLavender: 'rgba(232, 224, 245, 0.35)',
  meshChampagne: 'rgba(247, 240, 226, 0.45)',

  // Status Indicators (small dots only)
  success: '#2E7D32',
  successDot: '#2E7D32',
  successBg: 'rgba(46, 125, 50, 0.08)',
  warning: '#ED6C02',
  warningDot: '#ED6C02',
  warningBg: 'rgba(237, 108, 2, 0.08)',
  error: '#D32F2F',
  errorDot: '#D32F2F',
  errorBg: 'rgba(211, 47, 47, 0.08)',
  info: '#0288D1',
  infoDot: '#0288D1',
  infoBg: 'rgba(2, 136, 209, 0.08)',

  // Pure White
  white: '#FFFFFF',

  // --- Backwards Compatibility Aliases (for untouched screens until their step) ---
  deepPlum: '#FBFAF8',
  surfacePlum: '#FFFFFF',
  surfacePlumLight: '#F7F5F2',
  royal: '#4A2275',
  royalLight: '#4A2275',
  ivory: '#121016',
  champagne: '#2C2932',
  mutedText: '#8B8794',
  subtleText: '#B8B4BF',
  antiqueGold: '#B8924A',
  softGold: '#B8924A',
  brightGold: '#4A2275',
  goldGradientStart: '#4A2275',
  goldGradientEnd: '#3A1860',
  glassFill: '#FFFFFF',
  glassFillSubtle: '#FAFAF8',
  glassFillHeavy: '#FFFFFF',
  glassBorder: '#ECE8E4',
  glassBorderHighlight: '#ECE8E4',
  glassBorderSubtle: '#F4F1ED',
  overlay: 'rgba(18, 16, 22, 0.4)',
  sheetOverlay: 'rgba(18, 16, 22, 0.5)',
};

export const gradients = {
  // Soft ambient mesh gradient for hero areas (feels like light, not color)
  heroMesh: [
    'rgba(247, 240, 226, 0.35)',
    'rgba(232, 224, 245, 0.25)',
    'rgba(244, 226, 222, 0.20)',
    'rgba(251, 250, 248, 0)',
  ] as const,

  // Subtle image overlay vignette
  photoVignette: [
    'rgba(18, 16, 22, 0.02)',
    'rgba(18, 16, 22, 0.25)',
    'rgba(18, 16, 22, 0.75)',
  ] as const,

  // Single plum primary button (replaces gold gradient)
  primaryButton: [colors.plum, colors.plum] as const,

  // Backwards compatibility
  background: ['#FBFAF8', '#FBFAF8', '#FBFAF8'] as const,
  backgroundTop: ['#FBFAF8', '#FBFAF8'] as const,
  goldButton: [colors.plum, colors.plum] as const,
  royalCard: ['#FFFFFF', '#FFFFFF'] as const,
  goldCard: ['#FFFFFF', '#FFFFFF'] as const,
  darkGlass: ['#FFFFFF', '#FFFFFF'] as const,
  heroOverlay: ['transparent', 'rgba(251, 250, 248, 0.6)', '#FBFAF8'] as const,
};
