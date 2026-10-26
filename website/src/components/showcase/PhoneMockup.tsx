'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function PhoneMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center py-6 perspective-[1200px]"
    >
      {/* Soft Ambient Light Glow Behind Phone */}
      <div className="absolute w-[320px] h-[520px] rounded-[60px] bg-gradient-to-tr from-[#F4E2DE]/30 via-[#E8E0F5]/35 to-[#F7F0E2]/40 blur-3xl pointer-events-none -z-10" />

      {/* Floating 3D Phone Chassis */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [-8, 8, -8],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-[280px] sm:w-[310px] h-[580px] sm:h-[630px] rounded-[50px] bg-[#1C1A20] p-3 shadow-[0_32px_80px_-16px_rgba(18,16,22,0.22)] border-[3px] border-[#383342]"
      >
        {/* Subtle Outer Metal Frame Rim Highlights */}
        <div className="absolute inset-0 rounded-[47px] border border-white/10 pointer-events-none" />

        {/* Volume Buttons & Power Button (Simulated on frame edges) */}
        <div className="absolute -left-[6px] top-28 w-[3px] h-10 bg-[#383342] rounded-l" />
        <div className="absolute -left-[6px] top-42 w-[3px] h-12 bg-[#383342] rounded-l" />
        <div className="absolute -right-[6px] top-32 w-[3px] h-16 bg-[#383342] rounded-r" />

        {/* Phone Display Screen Area */}
        <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-canvas mesh-ambient flex flex-col items-center justify-between p-6 select-none border border-black/5">
          {/* Dynamic Island / Speaker Notch */}
          <div className="w-24 h-5 bg-[#121016] rounded-full flex items-center justify-end px-2.5 space-x-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#1F1C25]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#2A2633]" />
          </div>

          {/* Screen Content: ONLY the VEYUKA wordmark on the soft gradient background, nothing else */}
          <div className="flex flex-col items-center justify-center my-auto">
            <span
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              className="text-3xl sm:text-4xl font-semibold tracking-[0.24em] text-ink text-center pl-2"
            >
              VEYUKA
            </span>
            <div className="w-12 h-[1px] bg-gold opacity-50 mt-3" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-grey font-medium mt-2">
              Quiet Luxury
            </span>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="w-32 h-1 bg-[#121016]/20 rounded-full" />
        </div>
      </motion.div>
    </div>
  );
}
