'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

const galleryMoments = [
  {
    id: 'm1',
    title: 'Sovereign Heritage Mandap',
    location: 'Palatial Courtyard • Udaipur',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'm2',
    title: 'Ring Ceremony Under The Stars',
    location: 'Private Villa Waterfront • Alibaug',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'm3',
    title: 'Gourmet Candlelight Banquet',
    location: 'Worli Sea Face Terrace • Mumbai',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'm4',
    title: 'Milestone Golden Gala',
    location: 'Heritage Ballroom • New Delhi',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'm5',
    title: 'Executive Keynote Stagecraft',
    location: 'Convention Pavilion • Bangalore',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'm6',
    title: 'Chamber Strings at Twilight',
    location: 'Royal Lakeside Pavilion • Jaipur',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
  },
];

export function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Bind vertical scroll progress of this 300vh section to horizontal translation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const x = useTransform(scrollYProgress, [0.05, 0.95], ['2%', '-65%']);
  const progressWidth = useTransform(scrollYProgress, [0.05, 0.95], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative h-[260vh] sm:h-[300vh] bg-canvas-pure">
      {/* Pinned Sticky Window (Stays centered while user scrolls down vertically) */}
      <div className="sticky top-0 h-screen flex flex-col justify-between py-12 sm:py-16 overflow-hidden">
        {/* Header Title */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 select-none">
          <div>
            <span className="text-[11px] uppercase tracking-[0.24em] text-gold font-medium block">
              Visual Archive
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink mt-2">Moments of Grandeur</h2>
          </div>
          <p className="text-xs sm:text-sm text-grey max-w-sm">
            Scroll down to journey across our curated archive of sovereign celebrations.
          </p>
        </div>

        {/* Horizontal Translation Track */}
        <div className="w-full overflow-hidden my-auto py-4">
          <motion.div
            style={shouldReduceMotion ? { x: 0 } : { x }}
            className="flex gap-6 sm:gap-8 w-max pl-6 sm:pl-12 pr-12"
          >
            {galleryMoments.map((moment, idx) => (
              <div
                key={moment.id}
                className="relative w-[300px] sm:w-[440px] md:w-[520px] aspect-[16/10] rounded-[24px] sm:rounded-[28px] overflow-hidden hairline-border shadow-card shrink-0 group select-none"
              >
                <Image
                  src={moment.image}
                  alt={moment.title}
                  fill
                  sizes="(max-width: 640px) 300px, (max-width: 768px) 440px, 520px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Vignette gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent pointer-events-none" />

                {/* Editorial text card overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-white/70 font-medium block">
                    Moment 0{idx + 1} &bull; {moment.location}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl mt-1 text-white font-medium">
                    {moment.title}
                  </h3>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Journey Progress Indicator */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-12 flex items-center justify-between gap-6 select-none">
          <span className="text-[11px] text-grey uppercase tracking-widest font-mono">01 Archive</span>
          <div className="h-[2px] flex-1 bg-hairline rounded-full overflow-hidden">
            <motion.div
              style={shouldReduceMotion ? { width: '100%' } : { width: progressWidth }}
              className="h-full bg-gold rounded-full"
            />
          </div>
          <span className="text-[11px] text-grey uppercase tracking-widest font-mono">06 Finale</span>
        </div>
      </div>
    </div>
  );
}
