import { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const floatSoft: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const glowPulse: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.2 },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const shimmer: Variants = {
  hidden: { backgroundPosition: '200% 0' },
  visible: {
    backgroundPosition: '-200% 0',
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};







