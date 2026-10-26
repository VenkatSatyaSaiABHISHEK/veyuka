'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VeyukaIntroProps {
  onComplete?: () => void;
  autoDismissMs?: number;
}

export function VeyukaIntro({ onComplete, autoDismissMs = 3200 }: VeyukaIntroProps) {
  const [phase, setPhase] = useState<'drawing' | 'filled' | 'lift' | 'done'>('drawing');

  useEffect(() => {
    // Phase 1: Stroke drawing for 1.4s
    const fillTimer = setTimeout(() => {
      setPhase('filled');
    }, 1400);

    // Phase 2: Lift and scale into position at 2.4s
    const liftTimer = setTimeout(() => {
      setPhase('lift');
    }, 2400);

    // Phase 3: Done and reveal content
    const completeTimer = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, autoDismissMs);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(liftTimer);
      clearTimeout(completeTimer);
    };
  }, [autoDismissMs, onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="veyuka-intro-curtain"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas mesh-ambient"
        >
          {/* Main Wordmark SVG */}
          <motion.div
            animate={
              phase === 'lift'
                ? {
                    y: -140,
                    scale: 0.75,
                    opacity: 0.9,
                    transition: { type: 'spring', stiffness: 140, damping: 20 },
                  }
                : { y: 0, scale: 1 }
            }
            className="flex flex-col items-center select-none"
          >
            {/* SVG Wordmark with animated stroke and fill */}
            <svg
              viewBox="0 0 540 120"
              className="w-[300px] sm:w-[460px] md:w-[540px] h-auto overflow-visible"
              aria-label="VEYUKA"
            >
              <defs>
                <linearGradient id="goldStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4A2275" />
                  <stop offset="50%" stopColor="#B8924A" />
                  <stop offset="100%" stopColor="#4A2275" />
                </linearGradient>
              </defs>

              {/* The VEYUKA wordmark rendered in elegant Playfair Display curves */}
              <motion.text
                x="50%"
                y="55%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: '76px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                }}
                initial={{
                  stroke: '#4A2275',
                  strokeWidth: 1.5,
                  strokeDasharray: 600,
                  strokeDashoffset: 600,
                  fill: 'rgba(18, 16, 22, 0)',
                }}
                animate={{
                  strokeDashoffset: 0,
                  fill: phase === 'drawing' ? 'rgba(18, 16, 22, 0)' : '#121016',
                  stroke: phase === 'drawing' ? '#4A2275' : 'rgba(18, 16, 22, 0)',
                }}
                transition={{
                  strokeDashoffset: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1] },
                  fill: { duration: 0.8, delay: 1.3, ease: 'easeOut' },
                  stroke: { duration: 0.5, delay: 1.4 },
                }}
              >
                VEYUKA
              </motion.text>
            </svg>

            {/* Antique gold hairline rule and subtitle */}
            <div className="relative mt-2 flex flex-col items-center">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: phase === 'drawing' ? '0%' : '140px' }}
                transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] bg-gold opacity-60"
              />

              <motion.p
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={
                  phase !== 'drawing'
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 8, filter: 'blur(4px)' }
                }
                transition={{ duration: 0.6, delay: 1.6, ease: 'easeOut' }}
                className="mt-3 text-[11px] uppercase tracking-[0.28em] text-grey font-medium text-center"
              >
                Managed Celebrations &bull; Operations Console
              </motion.p>
            </div>
          </motion.div>

          {/* Quick Skip Link for keyboard / fast access */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
            onClick={() => {
              setPhase('done');
              if (onComplete) onComplete();
            }}
            className="absolute bottom-8 text-xs text-grey hover:text-ink underline underline-offset-4 tracking-wider transition-colors"
          >
            Skip to console
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
