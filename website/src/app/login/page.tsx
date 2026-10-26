'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '@/services/auth';
import { User } from '@/types';

const PLACEHOLDERS = ['you@veyuka.com', '98765 43210', 'ops@veyuka.com', 'owner@veyuka.com'];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/console/today';

  // Step state: 1 = Identifier, 2 = OTP, 3 = Success Wipe
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

  // Typewriter effect state
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Resend OTP countdown
  const [resendSeconds, setResendSeconds] = useState(30);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Typewriter animation
  useEffect(() => {
    if (step !== 1 || identifier) return;
    const currentWord = PLACEHOLDERS[placeholderIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting && placeholderText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && placeholderText === '') {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
      } else {
        setPlaceholderText(
          isDeleting
            ? currentWord.substring(0, placeholderText.length - 1)
            : currentWord.substring(0, placeholderText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, placeholderIndex, step, identifier]);

  // Resend timer countdown
  useEffect(() => {
    if (step !== 2 || resendSeconds <= 0) return;
    const interval = setInterval(() => {
      setResendSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendSeconds]);

  // Check if identifier is valid format
  const isValidIdentifier = (val: string) => {
    const clean = val.trim().replace(/\s+/g, '');
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
    const isPhone = /^[0-9]{10}$/.test(clean);
    return isEmail || isPhone;
  };

  const handleIdentifierSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const clean = identifier.trim().replace(/\s+/g, '');
    if (!isValidIdentifier(clean)) {
      setErrorMsg('Please enter a valid work email or 10-digit phone number.');
      return;
    }

    const check = await authService.checkIdentifier(clean);
    if (!check.allowed || !check.user) {
      setErrorMsg(check.errorMessage || 'This console is for Veyuka team members.');
      return;
    }

    setStep(2);
    setResendSeconds(30);
    setTimeout(() => {
      otpInputRef.current?.focus();
    }, 100);
  };

  // Handle OTP changes & auto-submit at 6 digits
  const handleOtpChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    setErrorMsg('');

    if (val.length === 6) {
      const result = await authService.verifyOtp(identifier, val);
      if (result.success && result.user) {
        setAuthenticatedUser(result.user);
        setStep(3);
        setTimeout(() => {
          router.push(from);
        }, 1600);
      } else {
        setErrorMsg(result.error || 'Invalid authentication code.');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-canvas select-none">
      {/* Left: Cinematic Luxury Photo & Editorial Serif Heading */}
      <div className="relative w-full lg:w-1/2 h-64 lg:h-auto min-h-[280px] lg:min-h-screen overflow-hidden">
        <Image
          src="/images/login-host.jpg"
          alt="Veyuka Host"
          fill
          priority
          className="object-cover object-top"
        />
        {/* Dark Vignette Overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/20" />

        <div className="absolute inset-0 p-8 sm:p-16 flex flex-col justify-between text-white z-10">
          <Link href="/showcase" className="font-serif text-2xl font-semibold tracking-wider text-white">
            VEYUKA
          </Link>

          <div className="max-w-md">
            <span className="text-[11px] uppercase tracking-[0.25em] text-white/70 font-medium">Internal Workspace</span>
            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal mt-2 leading-tight">
              Welcome back.
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-3 leading-relaxed">
              Quiet operations, vendor orchestration, and private event curation.
            </p>
          </div>
        </div>
      </div>

      {/* Right: Clean Conversational Panel */}
      <div className="w-full lg:w-1/2 flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-canvas-pure relative">
        <div className="max-w-md w-full mx-auto">
          <AnimatePresence mode="wait">
            {/* STEP 1: Email or Phone Input */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Team Authentication</span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-1">Sign in to console</h2>
                  <p className="text-xs text-grey mt-1">Enter your assigned company email or registered phone number.</p>
                </div>

                <form onSubmit={handleIdentifierSubmit} className="relative pt-4">
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder={placeholderText}
                      className="w-full bg-transparent border-0 border-b border-hairline pb-3 pt-1 text-lg sm:text-xl font-serif text-ink placeholder:text-grey-light focus:outline-none focus:border-plum transition-colors"
                    />

                    {/* Round Arrow Button (Appears only when valid) */}
                    <AnimatePresence>
                      {isValidIdentifier(identifier) && (
                        <motion.button
                          type="submit"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="absolute right-0 bottom-3 w-8 h-8 rounded-full bg-plum text-white flex items-center justify-center text-sm shadow-subtle hover:bg-plum-hover transition-colors"
                          aria-label="Continue to verification code"
                        >
                          &rarr;
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 rounded-xl bg-status-error-bg hairline-border border-status-error/20"
                    >
                      <p className="text-xs text-status-error">{errorMsg}</p>
                      {errorMsg.includes('Veyuka team members') && (
                        <Link href="/showcase" className="text-xs text-ink underline font-medium mt-1 inline-block">
                          Return to Client Showcase &rarr;
                        </Link>
                      )}
                    </motion.div>
                  )}
                </form>

                <div className="pt-8 hairline-t">
                  <p className="text-[11px] text-grey">
                    Mock roles enabled: <code className="text-ink">owner@veyuka.com</code>, <code className="text-ink">ops@veyuka.com</code>, <code className="text-ink">finance@veyuka.com</code>, <code className="text-ink">support@veyuka.com</code>
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: One Line of Serif Digits with Spring */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Step 2 of 2</span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal mt-1">Enter the code we sent you</h2>
                  <p className="text-xs text-grey mt-1">
                    Sent to <span className="font-medium text-ink">{identifier}</span>
                  </p>
                </div>

                {/* Hidden actual input with focus kept */}
                <div className="relative pt-6">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                  />

                  {/* Rendered Single Line of 6 Serif Digits */}
                  <div className="flex items-center justify-between py-2 border-b border-transparent">
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      const digit = otp[index];
                      return (
                        <div key={index} className="flex flex-col items-center justify-center w-10">
                          <motion.span
                            key={digit ? `digit-${index}-${digit}` : `empty-${index}`}
                            initial={{ y: 8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                            className="font-serif text-3xl sm:text-4xl text-ink font-normal tabular-nums"
                          >
                            {digit || '—'}
                          </motion.span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Thin Antique Gold Progress Line below digits */}
                  <div className="w-full h-[2px] bg-hairline mt-3 overflow-hidden rounded-full">
                    <motion.div
                      animate={{ width: `${(otp.length / 6) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                      className="h-full bg-gold"
                    />
                  </div>

                  {/* Error Message */}
                  {errorMsg && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-status-error mt-4">
                      {errorMsg}
                    </motion.p>
                  )}
                </div>

                {/* Resend and Back navigation */}
                <div className="flex items-center justify-between pt-6 text-xs text-grey">
                  <button
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setErrorMsg('');
                    }}
                    className="hover:text-ink underline underline-offset-4"
                  >
                    Change email/phone
                  </button>

                  <div>
                    {resendSeconds > 0 ? (
                      <span>Resend in {resendSeconds}s</span>
                    ) : (
                      <button
                        onClick={() => {
                          setResendSeconds(30);
                          setErrorMsg('');
                        }}
                        className="text-plum hover:underline font-medium"
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success Panel Wipe */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="text-center py-12 space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-status-success/10 text-status-success mx-auto flex items-center justify-center font-serif text-xl">
                  ✓
                </div>
                <h2 className="font-serif text-3xl text-ink font-normal">
                  Welcome, {authenticatedUser?.name.split(' ')[0]}.
                </h2>
                <p className="text-xs text-grey">Opening your {authenticatedUser?.department} console...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <LoginContent />
    </Suspense>
  );
}
