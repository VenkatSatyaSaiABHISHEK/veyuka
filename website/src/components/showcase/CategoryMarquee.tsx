'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { showcaseCategories } from '@/data/categories';

export function CategoryMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Duplicate items for infinite seamless scroll
  const marqueeItems = [...showcaseCategories, ...showcaseCategories];

  return (
    <div
      className="relative w-full overflow-hidden py-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Subtle edge vignette fades */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-canvas via-canvas/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-canvas via-canvas/60 to-transparent z-10 pointer-events-none" />

      {/* Auto-scrolling track */}
      <div
        className="animate-marquee flex gap-6"
        style={{
          animationPlayState: isPaused ? 'paused' : undefined,
        }}
      >
        {marqueeItems.map((cat, idx) => (
          <div
            key={`${cat.id}-${idx}`}
            className="shrink-0 w-[290px] sm:w-[350px] rounded-[24px] overflow-hidden bg-canvas-pure hairline-border shadow-card group transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 290px, 350px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
              <span className="absolute bottom-4 left-4 font-serif text-2xl text-white font-medium drop-shadow-sm">
                {cat.title}
              </span>
            </div>
            <div className="p-6">
              <p className="text-xs text-ink font-semibold tracking-wide">{cat.subtitle}</p>
              <p className="text-xs text-grey mt-2 line-clamp-2 leading-relaxed">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
