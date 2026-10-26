import { Transition, Variants } from 'framer-motion';

// Veyuka Quiet Luxury Springs (physics only, no linear transitions)
export const springs = {
  // Editorial soft snap for cards and drawers
  calm: {
    type: 'spring',
    stiffness: 260,
    damping: 32,
    mass: 1,
  } as Transition,

  // Responsive button tap
  tap: {
    type: 'spring',
    stiffness: 500,
    damping: 28,
  } as Transition,

  // Gentle floating layer lift
  float: {
    type: 'spring',
    stiffness: 180,
    damping: 24,
  } as Transition,

  // Dramatic editorial reveal
  editorial: {
    type: 'spring',
    stiffness: 120,
    damping: 20,
    mass: 1.2,
  } as Transition,

  // Snappy quick micro-interaction
  snappy: {
    type: 'spring',
    stiffness: 420,
    damping: 30,
  } as Transition,
};

// Masked line-by-line heading reveal
export const headingMaskVariants: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: (i = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 140,
      damping: 22,
      delay: i * 0.08,
    },
  }),
};

// Blur-to-sharp body text entrance
export const blurFadeVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
    y: 12,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 28,
      delay,
    },
  }),
};

// Staggered list container
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// Staggered list item
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: springs.calm,
  },
};

// Drawer slide in from right
export const drawerVariants: Variants = {
  hidden: {
    x: '100%',
    boxShadow: 'none',
  },
  visible: {
    x: 0,
    boxShadow: '-16px 0 48px -8px rgba(18, 16, 22, 0.12)',
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 32,
    },
  },
  exit: {
    x: '100%',
    transition: {
      type: 'spring',
      stiffness: 320,
      damping: 36,
    },
  },
};

// Overlay backdrop
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};
