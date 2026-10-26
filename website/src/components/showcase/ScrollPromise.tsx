'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

interface PromiseRowProps {
  number: string;
  headline: string;
  detail: string;
  isLast?: boolean;
}

export function ScrollPromiseRow({ number, headline, detail, isLast = false }: PromiseRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start 0.88', 'center 0.5'],
  });

  // Scroll scrubbed properties: title lights up from muted to full ink
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 1]);
  const headlineY = useTransform(scrollYProgress, [0, 0.6], [24, 0]);

  // Detail text lights up slightly after the headline
  const detailOpacity = useTransform(scrollYProgress, [0.3, 0.9], [0.25, 0.85]);
  const detailY = useTransform(scrollYProgress, [0.3, 0.9], [20, 0]);

  // Number badge slide & line expand
  const badgeX = useTransform(scrollYProgress, [0, 0.5], [-20, 0]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const lineScaleX = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <div ref={rowRef} className="space-y-12 sm:space-y-16">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 sm:gap-10">
        {/* Number Badge */}
        <motion.div
          style={shouldReduceMotion ? {} : { x: badgeX, opacity: badgeOpacity }}
          className="shrink-0"
        >
          <span className="font-serif text-xs text-gold uppercase tracking-[0.25em] font-medium block">
            {number}
          </span>
        </motion.div>

        {/* Scroll Scrubbed Headline and Detail */}
        <div className="max-w-3xl flex-1">
          <motion.p
            style={shouldReduceMotion ? {} : { opacity: headlineOpacity, y: headlineY }}
            className="font-serif text-2xl sm:text-4xl md:text-5xl text-ink leading-tight tracking-tight"
          >
            {headline}{' '}
            <motion.span
              style={shouldReduceMotion ? {} : { opacity: detailOpacity, y: detailY }}
              className="text-[#6E6A75] font-normal block sm:inline mt-2 sm:mt-0"
            >
              {detail}
            </motion.span>
          </motion.p>
        </div>
      </div>

      {!isLast && (
        <div className="h-[1px] w-full bg-hairline overflow-hidden">
          <motion.div
            style={shouldReduceMotion ? { scaleX: 1 } : { scaleX: lineScaleX, transformOrigin: 'left' }}
            className="h-full w-full bg-gradient-to-r from-gold/40 via-hairline to-transparent"
          />
        </div>
      )}
    </div>
  );
}

export function ScrollPromises() {
  const promises = [
    {
      number: 'Promise 01',
      headline: 'One team to talk to.',
      detail: 'No middlemen, no vendor calls, zero friction.',
    },
    {
      number: 'Promise 02',
      headline: 'Every detail handled.',
      detail: 'From architectural florals to private acoustic ensembles.',
    },
    {
      number: 'Promise 03',
      headline: 'Quality guaranteed.',
      detail: 'Rigorous benchmarks, flawless timing, and peace of mind.',
    },
  ];

  return (
    <section className="w-full bg-canvas-pure py-24 sm:py-36 hairline-t hairline-b px-6 sm:px-12">
      <div className="max-w-5xl mx-auto space-y-16 sm:space-y-24">
        {promises.map((p, idx) => (
          <ScrollPromiseRow
            key={p.number}
            number={p.number}
            headline={p.headline}
            detail={p.detail}
            isLast={idx === promises.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
