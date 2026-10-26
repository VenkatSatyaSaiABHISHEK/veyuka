'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SmoothScroll } from '@/components/showcase/SmoothScroll';
import { PhoneMockup } from '@/components/showcase/PhoneMockup';
import { TrustStrip } from '@/components/showcase/TrustStrip';
import { ScrollPromises } from '@/components/showcase/ScrollPromise';
import { CategoryMarquee } from '@/components/showcase/CategoryMarquee';
import { HorizontalGallery } from '@/components/showcase/HorizontalGallery';
import { showcaseCategories } from '@/data/categories';
import { enquiryService } from '@/services/enquiries';
import { EventCategoryType } from '@/types';

// Kind words / testimonials data (Client view only, no vendor names)
const mockTestimonials = [
  {
    quote: "Veyuka orchestrated our wedding so effortlessly that we felt like guests at our own celebration. Not once did we have to coordinate with anyone else.",
    author: "Ananya & Siddharth Singhania",
    event: "Imperial Heritage Wedding • Mumbai",
  },
  {
    quote: "The precision in lighting, acoustics, and gourmet banquet was extraordinary. Our guests are still raving about the evening.",
    author: "Vikramaditya Oberoi",
    event: "Golden Anniversary Soiree • Worli",
  },
  {
    quote: "From the ring ceremony stagecraft to the music curation, every detail was handled with quiet perfection. Veyuka is truly in a league of its own.",
    author: "Priyanka & Rahul Mehta",
    event: "Starlight Engagement Gala • Lower Parel",
  },
];

// FAQ items
const mockFaqs = [
  {
    q: "How does booking with Veyuka work?",
    a: "You share your celebration vision through our mobile app or with our concierge. We curate custom blueprints, moodboards, and tastings, and assign our master teams internally. You talk only to Veyuka from first sketch to final farewell.",
  },
  {
    q: "Who handles the decorators, caterers, and photographers?",
    a: "Veyuka's verified in-house and partner teams handle everything. We manage all negotiations, coordination, quality checks, and scheduling. You never have to call or chase multiple vendors.",
  },
  {
    q: "What is your payment structure?",
    a: "We operate on a transparent milestones system: a 30% advance secures your date and commences custom styling, 50% during production sign-off, and the remaining 20% on the eve of your celebration.",
  },
  {
    q: "Can I reschedule or customize my celebration?",
    a: "Yes. Your personal event director accommodates date adjustments with complete flexibility according to venue availability, ensuring seamless transitions without stress.",
  },
];

export default function ShowcasePage() {
  const [introPhase, setIntroPhase] = useState<'drawing' | 'filled' | 'lift' | 'done'>('drawing');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    eventType: 'Wedding' as EventCategoryType,
    eventDate: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Intro animation sequence
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase('filled'), 1200);
    const t2 = setTimeout(() => setIntroPhase('lift'), 2200);
    const t3 = setTimeout(() => setIntroPhase('done'), 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Auto-rotating testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % mockTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) return;
    setIsSubmitting(true);
    try {
      await enquiryService.submitEnquiry({
        name: enquiryForm.name,
        phone: enquiryForm.phone,
        eventType: enquiryForm.eventType,
        eventDate: enquiryForm.eventDate,
        message: enquiryForm.message,
      });
      setSubmitted(true);
    } catch {
      // Graceful fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-canvas text-ink selection:bg-plum selection:text-white">
        {/* ============================================================== */}
        {/* 1. INTRO: SVG STROKE DRAW & LIFT CURTAIN                      */}
        {/* ============================================================== */}
        <AnimatePresence>
          {introPhase !== 'done' && (
            <motion.div
              key="intro-screen"
              exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas mesh-ambient"
            >
              <motion.div
                animate={
                  introPhase === 'lift'
                    ? { y: -160, scale: 0.75, opacity: 0.85, transition: { type: 'spring', stiffness: 140, damping: 20 } }
                    : { y: 0, scale: 1 }
                }
                className="flex flex-col items-center"
              >
                <svg viewBox="0 0 540 120" className="w-[300px] sm:w-[480px] h-auto overflow-visible" aria-label="VEYUKA">
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
                      fill: introPhase === 'drawing' ? 'rgba(18, 16, 22, 0)' : '#121016',
                      stroke: introPhase === 'drawing' ? '#4A2275' : 'rgba(18, 16, 22, 0)',
                    }}
                    transition={{
                      strokeDashoffset: { duration: 1.3, ease: [0.25, 0.1, 0.25, 1] },
                      fill: { duration: 0.8, delay: 1.2 },
                    }}
                  >
                    VEYUKA
                  </motion.text>
                </svg>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: introPhase === 'drawing' ? 0 : '140px' }}
                  transition={{ duration: 0.8, delay: 1.3 }}
                  className="h-[1px] bg-gold opacity-60 mt-2"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* MINIMAL HEADER (Wordmark left, Copy link & Contact right)      */}
        {/* ============================================================== */}
        <header className="sticky top-0 z-40 w-full h-16 bg-canvas/80 backdrop-blur-md hairline-b px-6 sm:px-12 flex items-center justify-between">
          <Link href="/showcase" className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-ink">
            VEYUKA
          </Link>
          <div className="flex items-center gap-6">
            <button
              onClick={handleCopyLink}
              className="text-xs text-grey hover:text-ink underline underline-offset-4 tracking-wider transition-colors"
            >
              {copiedLink ? 'Link copied' : 'Copy link'}
            </button>
            <button
              onClick={() => scrollToSection('contact-section')}
              className="text-xs text-ink hover:text-plum font-medium tracking-wide transition-colors"
            >
              Contact
            </button>
          </div>
        </header>

        {/* ============================================================== */}
        {/* 2. HERO SECTION ("Your event. Our care.")                      */}
        {/* ============================================================== */}
        <section className="relative px-6 sm:px-12 pt-16 sm:pt-28 pb-20 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="absolute top-12 w-[600px] h-[300px] bg-gradient-to-tr from-[#F4E2DE]/20 via-[#E8E0F5]/25 to-[#F7F0E2]/30 blur-3xl pointer-events-none -z-10" />

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ type: 'spring', stiffness: 140, damping: 22, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[1.08] tracking-tight text-ink max-w-5xl"
          >
            Your event. <span className="italic font-normal">Our care.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 24, delay: 0.4 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-grey max-w-2xl leading-relaxed"
          >
            Tell Veyuka what you imagine. We take care of everything else, so you never have to deal with anyone but us.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.6 }}
            className="mt-10"
          >
            <button
              onClick={() => scrollToSection('download-app')}
              className="px-8 py-3.5 rounded-full bg-plum text-white text-sm font-medium tracking-wide hover:bg-plum-hover active:scale-[0.97] transition-all shadow-subtle inline-flex items-center gap-2"
            >
              <span>Plan my event</span>
              <span className="text-base">&rarr;</span>
            </button>
          </motion.div>

          {/* Slim Why Trust Us Strip */}
          <TrustStrip />
        </section>

        {/* ============================================================== */}
        {/* 3. PROMISE (Scroll-linked text animation)                     */}
        {/* ============================================================== */}
        <ScrollPromises />

        {/* ============================================================== */}
        {/* 4. CELEBRATIONS (Continuous Auto-Scrolling Marquee)           */}
        {/* ============================================================== */}
        <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Bespoke Categories</span>
              <h2 className="font-serif text-3xl sm:text-5xl text-ink mt-2">Celebrations We Curate</h2>
            </div>
            <p className="text-sm text-grey max-w-md">
              From intimate beachside anniversaries to sovereign weddings of a thousand guests.
            </p>
          </div>

          <CategoryMarquee />
        </section>

        {/* ============================================================== */}
        {/* 5. HOW IT WORKS (01 - 04 numbered steps with gold rule)       */}
        {/* ============================================================== */}
        <section className="bg-canvas-pure py-24 sm:py-36 hairline-t hairline-b px-6 sm:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-20">
              <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">The Veyuka Journey</span>
              <h2 className="font-serif text-3xl sm:text-5xl text-ink mt-2">How It Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              {/* Connecting gold line across desktop */}
              <div className="hidden md:block absolute top-6 left-12 right-12 h-[1px] bg-gold opacity-30 -z-0" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col">
                <span className="font-serif text-4xl sm:text-5xl text-gold font-normal tabular-nums bg-canvas-pure inline-block pr-4">01</span>
                <h3 className="font-serif text-xl text-ink font-medium mt-6">Tell us your vision</h3>
                <p className="text-xs text-grey mt-2 leading-relaxed">
                  Share your date, location, guest count, and aesthetic dreams on the Veyuka mobile app.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col">
                <span className="font-serif text-4xl sm:text-5xl text-gold font-normal tabular-nums bg-canvas-pure inline-block pr-4">02</span>
                <h3 className="font-serif text-xl text-ink font-medium mt-6">We plan everything</h3>
                <p className="text-xs text-grey mt-2 leading-relaxed">
                  Our directors build your custom blueprint, floral CAD renders, and gourmet tasting menu.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col">
                <span className="font-serif text-4xl sm:text-5xl text-gold font-normal tabular-nums bg-canvas-pure inline-block pr-4">03</span>
                <h3 className="font-serif text-xl text-ink font-medium mt-6">We coordinate every detail</h3>
                <p className="text-xs text-grey mt-2 leading-relaxed">
                  From stage carpentry to synchronized acoustic rehearsal, we direct all logistics seamlessly.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 flex flex-col">
                <span className="font-serif text-4xl sm:text-5xl text-gold font-normal tabular-nums bg-canvas-pure inline-block pr-4">04</span>
                <h3 className="font-serif text-xl text-ink font-medium mt-6">You simply celebrate</h3>
                <p className="text-xs text-grey mt-2 leading-relaxed">
                  Arrive at your magnificent celebration with absolute composure, surrounded by your loved ones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 6. SIGNATURE PACKAGES (Editorial Cards, No Vendor Names)       */}
        {/* ============================================================== */}
        <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Curated Tiers</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink mt-2">Signature Packages</h2>
            <p className="text-sm text-grey mt-3">Bespoke mastery. Comprehensive orchestration. Tailored to your vision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1: Classic */}
            <div className="bg-canvas-pure p-8 sm:p-10 rounded-[28px] hairline-border shadow-card flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-grey font-medium">Tier I • Classic</span>
                <h3 className="font-serif text-2xl text-ink font-medium mt-2">Intimate Romance</h3>
                <p className="mt-3 text-xs sm:text-sm font-medium text-plum/90">Bespoke Curation • Classic Scale</p>
                <div className="h-[1px] w-full bg-hairline my-6" />
                <ul className="space-y-3 text-xs text-grey leading-relaxed">
                  <li>&bull; Designer fresh floral mandap or cocktail stage</li>
                  <li>&bull; Curated 4-course gourmet dining banquet</li>
                  <li>&bull; Editorial portrait photography & 4K teaser film</li>
                  <li>&bull; Ambient mood lighting & acoustic sound rig</li>
                  <li>&bull; Dedicated on-site event coordinator</li>
                </ul>
              </div>
              <button
                onClick={() => scrollToSection('download-app')}
                className="mt-8 w-full py-3 rounded-full hairline-border text-xs text-ink font-medium hover:bg-canvas-subtle transition-colors"
              >
                Inquire on app
              </button>
            </div>

            {/* Tier 2: Premium */}
            <div className="bg-canvas-pure p-8 sm:p-10 rounded-[28px] hairline-border shadow-card flex flex-col justify-between relative border-plum/30">
              <span className="absolute -top-3 left-8 px-3 py-0.5 rounded-full bg-plum text-white text-[10px] uppercase tracking-widest font-medium">
                Most Celebrated
              </span>
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-plum font-medium">Tier II • Signature</span>
                <h3 className="font-serif text-2xl text-ink font-medium mt-2">Grandeur Celebration</h3>
                <p className="mt-3 text-xs sm:text-sm font-medium text-plum">Master Orchestration • Signature Scale</p>
                <div className="h-[1px] w-full bg-hairline my-6" />
                <ul className="space-y-3 text-xs text-grey leading-relaxed">
                  <li>&bull; Couture architectural florals & red carpet welcome</li>
                  <li>&bull; Master chef multi-regional culinary live counters</li>
                  <li>&bull; 6-camera cinematic coverage & aerial drone film</li>
                  <li>&bull; Live Santoor and European chamber trio</li>
                  <li>&bull; Dedicated personal bridal concierge team (6 staff)</li>
                </ul>
              </div>
              <button
                onClick={() => scrollToSection('download-app')}
                className="mt-8 w-full py-3 rounded-full bg-plum text-white text-xs font-medium hover:bg-plum-hover transition-colors shadow-subtle"
              >
                Inquire on app
              </button>
            </div>

            {/* Tier 3: Royal */}
            <div className="bg-canvas-pure p-8 sm:p-10 rounded-[28px] hairline-border shadow-card flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold font-medium">Tier III • Sovereign</span>
                <h3 className="font-serif text-2xl text-ink font-medium mt-2">Imperial Heritage</h3>
                <p className="mt-3 text-xs sm:text-sm font-medium text-gold">Sovereign Protocol • Palatial Scale</p>
                <div className="h-[1px] w-full bg-hairline my-6" />
                <ul className="space-y-3 text-xs text-grey leading-relaxed">
                  <li>&bull; Palatial hand-carved heritage mandap build</li>
                  <li>&bull; Michelin-standard 7-course imperial feast dining</li>
                  <li>&bull; 8K cinema master, drone fleet & heirloom velvet book</li>
                  <li>&bull; Full symphony string & brass orchestral ensemble</li>
                  <li>&bull; Executive event director & full protocol team (12 staff)</li>
                </ul>
              </div>
              <button
                onClick={() => scrollToSection('download-app')}
                className="mt-8 w-full py-3 rounded-full hairline-border text-xs text-ink font-medium hover:bg-canvas-subtle transition-colors"
              >
                Inquire on app
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 7. MOMENTS (Pinned Horizontal Scroll Driven by Vertical Scroll)*/}
        {/* ============================================================== */}
        <HorizontalGallery />

        {/* ============================================================== */}
        {/* 8. NUMBERS (Count-up figures, placeholder mock figures)       */}
        {/* ============================================================== */}
        <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto">
          {/* Note: Placeholder mock metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-serif text-4xl sm:text-6xl text-ink font-normal tabular-nums">1,240+</p>
              <p className="text-xs text-grey uppercase tracking-widest mt-2 font-medium">Events Delivered</p>
            </div>
            <div>
              <p className="font-serif text-4xl sm:text-6xl text-ink font-normal tabular-nums">14</p>
              <p className="text-xs text-grey uppercase tracking-widest mt-2 font-medium">Cities Across India</p>
            </div>
            <div>
              <p className="font-serif text-4xl sm:text-6xl text-ink font-normal tabular-nums">99.8%</p>
              <p className="text-xs text-grey uppercase tracking-widest mt-2 font-medium">Punctuality Score</p>
            </div>
            <div>
              <p className="font-serif text-4xl sm:text-6xl text-ink font-normal tabular-nums">8</p>
              <p className="text-xs text-grey uppercase tracking-widest mt-2 font-medium">Years of Mastery</p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 9. KIND WORDS (Testimonials Carousel)                          */}
        {/* ============================================================== */}
        <section className="py-24 sm:py-32 px-6 sm:px-12 bg-canvas-pure hairline-t hairline-b">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Kind Words</span>

            <div className="mt-12 min-h-[180px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-serif text-xl sm:text-3xl text-ink leading-relaxed font-normal italic">
                    &ldquo;{mockTestimonials[activeTestimonial].quote}&rdquo;
                  </p>
                  <p className="font-serif text-sm sm:text-base text-ink font-semibold mt-6">
                    {mockTestimonials[activeTestimonial].author}
                  </p>
                  <p className="text-xs text-grey mt-1">
                    {mockTestimonials[activeTestimonial].event}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Testimonial dot controls */}
            <div className="flex justify-center gap-2 mt-8">
              {mockTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeTestimonial === idx ? 'w-6 bg-plum' : 'w-2 bg-hairline'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 10. QUESTIONS (FAQ Accordion)                                  */}
        {/* ============================================================== */}
        <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Inquiries</span>
            <h2 className="font-serif text-3xl sm:text-5xl text-ink mt-2">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-hairline">
            {mockFaqs.map((faq, idx) => (
              <div key={idx} className="py-6">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="font-serif text-lg sm:text-xl text-ink font-medium">{faq.q}</span>
                  <span className="text-grey text-xl font-light">{openFaq === idx ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-sm text-grey leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 11. CONTACT & ENQUIRY FORM                                     */}
        {/* ============================================================== */}
        <section id="contact-section" className="py-24 sm:py-32 px-6 sm:px-12 bg-canvas-pure hairline-t hairline-b">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Contact Info */}
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Concierge Desk</span>
              <h2 className="font-serif text-3xl sm:text-5xl text-ink">We would love to hear your vision.</h2>
              <p className="text-sm text-grey leading-relaxed max-w-md">
                Our directors are available for confidential consultations at our Mumbai flagship office or via video concierge.
              </p>

              <div className="space-y-4 pt-6 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-grey">Telephone</p>
                  <p className="font-serif text-ink text-base mt-0.5">+91 22 4918 2000</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-grey">WhatsApp Concierge</p>
                  <a
                    href="https://wa.me/919999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-serif text-plum hover:underline text-base mt-0.5 inline-block"
                  >
                    +91 99999 99999 (Chat with Veyuka)
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-grey">Direct Inquiries</p>
                  <p className="font-serif text-ink text-base mt-0.5">concierge@veyuka.com</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-grey">Flagship Address</p>
                  <p className="text-xs text-grey leading-relaxed mt-0.5">
                    Level 14, The Capital, G Block, Bandra Kurla Complex (BKC), Mumbai 400051
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Short Enquiry Form */}
            <div className="bg-canvas p-8 sm:p-10 rounded-[28px] hairline-border shadow-card">
              <h3 className="font-serif text-2xl text-ink font-medium">Request a Consultation</h3>
              <p className="text-xs text-grey mt-1">Our team will call you within 2 business hours.</p>

              {submitted ? (
                <div className="mt-8 p-6 rounded-2xl bg-canvas-pure hairline-border text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-status-success/10 text-status-success mx-auto flex items-center justify-center font-serif text-lg">
                    ✓
                  </div>
                  <h4 className="font-serif text-lg text-ink font-medium">Thank you.</h4>
                  <p className="text-xs text-grey">Our team has received your details and will call you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="Ananya Singhania"
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas-pure hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      placeholder="+91 98200 12345"
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas-pure hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">Event Type</label>
                      <select
                        value={enquiryForm.eventType}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, eventType: e.target.value as EventCategoryType })}
                        className="w-full px-4 py-2.5 rounded-xl bg-canvas-pure hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Baby Shower">Baby Shower</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">Tentative Date</label>
                      <input
                        type="date"
                        value={enquiryForm.eventDate}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, eventDate: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-canvas-pure hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-grey block mb-1">Message / Vision</label>
                    <textarea
                      rows={3}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder="Share your preferred venue, theme or guest count..."
                      className="w-full px-4 py-2.5 rounded-xl bg-canvas-pure hairline-border text-xs text-ink focus:outline-none focus:border-plum"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-3 rounded-full bg-plum text-white text-xs font-medium tracking-wide hover:bg-plum-hover active:scale-[0.98] transition-all shadow-subtle disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Consultation Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 12. DOWNLOAD THE APP (Finale with CSS/SVG Phone Mockup)        */}
        {/* ============================================================== */}
        <section id="download-app" className="py-24 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto">
          <div className="bg-canvas-pure rounded-[32px] hairline-border shadow-card p-8 sm:p-16 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline & App Store Buttons */}
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.24em] text-grey font-medium">Your Celebration Portal</span>
              <h2 className="font-serif text-3xl sm:text-5xl text-ink leading-tight">
                Ready to book? <br />
                <span className="italic font-normal">Download the Veyuka app.</span>
              </h2>
              <p className="text-sm text-grey leading-relaxed max-w-md">
                Experience quiet luxury planning on iOS and Android. Track every milestone, sign off moodboards, and chat directly with your event director.
              </p>

              {/* Store Badges (Placeholders) */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#app-store"
                  onClick={(e) => e.preventDefault()}
                  className="px-6 py-3 rounded-full bg-ink text-white text-xs font-medium tracking-wide hover:bg-black transition-colors flex items-center gap-2"
                >
                  <span>App Store</span>
                </a>
                <a
                  href="#google-play"
                  onClick={(e) => e.preventDefault()}
                  className="px-6 py-3 rounded-full hairline-border text-ink text-xs font-medium tracking-wide hover:bg-canvas-subtle transition-colors flex items-center gap-2"
                >
                  <span>Google Play</span>
                </a>
              </div>

              {/* QR Code Placeholder */}
              <div className="pt-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-canvas hairline-border p-2 flex flex-col items-center justify-center">
                  <div className="grid grid-cols-3 gap-0.5 w-full h-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                      <div key={i} className={`rounded-[1px] ${i % 2 === 0 ? 'bg-ink' : 'bg-grey-light'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-grey">
                  <p className="font-medium text-ink">Scan to download</p>
                  <p>Point camera to open on phone</p>
                </div>
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="flex justify-center">
              <PhoneMockup />
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 13. FOOTER (Wordmark, Team login, Copyright)                   */}
        {/* ============================================================== */}
        <footer className="w-full bg-canvas-pure hairline-t py-12 px-6 sm:px-12 text-xs text-grey">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="font-serif text-lg font-semibold tracking-wide text-ink">VEYUKA</span>
              <span className="h-3 w-[1px] bg-hairline" />
              <span>Managed celebrations across India</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/login" className="text-grey hover:text-ink underline underline-offset-4 tracking-wider transition-colors">
                Team login
              </Link>
              <span>&bull;</span>
              <span>&copy; {new Date().getFullYear()} Veyuka Private Limited</span>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
