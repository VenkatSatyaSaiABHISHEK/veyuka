'use client';

import React, { useRef, useEffect } from 'react';
import { Lottie, type LottieHandle } from 'lottie-react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export function TrustStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<LottieHandle>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();

  // Control Lottie playback according to viewport and reduced-motion preferences
  useEffect(() => {
    if (!lottieRef.current) return;

    if (shouldReduceMotion) {
      lottieRef.current.stop();
    } else if (isInView) {
      lottieRef.current.play();
    } else {
      lottieRef.current.pause();
    }
  }, [isInView, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className="mt-16 sm:mt-20 w-full rounded-[24px] sm:rounded-[28px] bg-[#F6EEF4] px-6 sm:px-10 md:px-12 lg:px-14 py-8 sm:py-10 md:py-6 lg:py-8 md:min-h-[280px] lg:min-h-[300px] flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-8 lg:gap-10 overflow-hidden select-none"
    >
      {/* LEFT HALF: Bold text, left-aligned, vertically centered */}
      <div className="w-full md:w-[52%] lg:w-[50%] flex flex-col justify-center text-left">
        {/* Small line in plum, Inter medium */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1, filter: 'none' } : { opacity: 0, filter: 'blur(4px)' }}
          animate={
            isInView || shouldReduceMotion
              ? { opacity: 1, filter: 'blur(0px)' }
              : { opacity: 0, filter: 'blur(4px)' }
          }
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-xs sm:text-sm font-medium text-[#4A2275] tracking-normal mb-1.5 sm:mb-2 font-sans"
        >
          Why trust Veyuka?
        </motion.p>

        {/* Headline in Playfair Display Bold: Line-by-line masked reveal */}
        <h2 className="font-serif font-bold text-2xl sm:text-3xl md:text-[34px] lg:text-[42px] xl:text-[46px] text-[#121016] leading-[1.12] tracking-tight">
          <span className="block overflow-hidden py-0.5">
            <motion.span
              className="block"
              initial={shouldReduceMotion ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
              animate={
                isInView || shouldReduceMotion
                  ? { y: 0, opacity: 1 }
                  : { y: '100%', opacity: 0 }
              }
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              Leave the stress to us.
            </motion.span>
          </span>
        </h2>

        {/* Short supporting text in grey Inter below */}
        <motion.p
          initial={shouldReduceMotion ? { opacity: 1, filter: 'none' } : { opacity: 0, filter: 'blur(4px)' }}
          animate={
            isInView || shouldReduceMotion
              ? { opacity: 1, filter: 'blur(0px)' }
              : { opacity: 0, filter: 'blur(4px)' }
          }
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.28 }}
          className="text-xs sm:text-sm md:text-[14px] lg:text-[15px] xl:text-[16px] text-[#6E6A75] font-sans mt-2.5 sm:mt-3 max-w-xl leading-relaxed"
        >
          You focus on the fun, the laughter, and making memories. We’ll take care of every
          detail, so you can relax and enjoy your special day.
        </motion.p>
      </div>

      {/* RIGHT HALF: Significantly enlarged Lottie animation with generous responsive frame */}
      <div className="w-full md:w-[48%] lg:w-[50%] flex items-center justify-center md:justify-end shrink-0">
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px] xl:max-w-[520px] h-[170px] sm:h-[210px] md:h-[230px] lg:h-[250px] flex items-center justify-center">
          <Lottie
            src="/lottie/trust.json"
            lottieRef={lottieRef}
            loop={!shouldReduceMotion}
            autoplay={!shouldReduceMotion && isInView}
            className="w-full h-full bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
