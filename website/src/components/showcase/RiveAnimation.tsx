'use client';

import React, { useEffect, useState } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveAnimationProps {
  src?: string;
  isInView?: boolean;
  shouldReduceMotion?: boolean;
  className?: string;
}

export function RiveAnimation({
  src = '/rive/octopus_loop.riv',
  isInView = true,
  shouldReduceMotion = false,
  className = 'w-full h-full flex items-center justify-center',
}: RiveAnimationProps) {
  const [hasError, setHasError] = useState(false);

  const { rive, RiveComponent } = useRive({
    src,
    autoplay: !shouldReduceMotion && isInView,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoadError: () => {
      setHasError(true);
    },
  });

  useEffect(() => {
    if (!rive) return;

    if (shouldReduceMotion) {
      rive.pause();
    } else if (isInView) {
      rive.play();
    } else {
      rive.pause();
    }
  }, [rive, isInView, shouldReduceMotion]);

  if (hasError) {
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <div className={className}>
      <RiveComponent className="w-full h-full" />
    </div>
  );
}
