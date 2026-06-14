import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';

export function AnimatedTestimonials({ testimonials = [], autoplay = false }) {
  const [active, setActive] = useState(0);
  const [rotations, setRotations] = useState([]);

  useEffect(() => {
    // Generate static random tilts once to prevent hydration mismatch/infinite recalculations
    setRotations(testimonials.map(() => Math.floor(Math.random() * 16) - 8)); // random between -8 and 8
  }, [testimonials]);

  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [active, autoplay, testimonials]);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (testimonials.length === 0) return null;

  const activeTestimonial = testimonials[active];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left Side: 3D Stacked Image Showcase */}
        <div className="relative h-72 sm:h-80 w-full max-w-sm mx-auto md:max-w-none md:h-96">
          <AnimatePresence>
            {testimonials.map((test, index) => {
              const isActive = index === active;
              const rotation = rotations[index] || 0;
              
              // Only render active card and next cards on top of each other
              // We hide cards that are too far behind to optimize performance
              const isVisible = Math.abs(index - active) <= 1 || (active === testimonials.length - 1 && index === 0) || (active === 0 && index === testimonials.length - 1);
              
              if (!isVisible) return null;

              return (
                <motion.div
                  key={index}
                  style={{
                    transformOrigin: 'bottom center',
                    zIndex: isActive ? 10 : 5 - Math.abs(index - active),
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: rotation,
                    y: 10,
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1 : 0.93,
                    rotate: isActive ? 0 : rotation,
                    y: isActive ? 0 : -5,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    rotate: rotation,
                    y: -10,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 15,
                  }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={test.src || test.image}
                    alt={test.name}
                    draggable={false}
                    className="w-full h-full object-cover rounded-3xl border border-theme-border shadow-2xl transition-colors duration-300"
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Side: Staggered Content Reveals */}
        <div className="flex flex-col justify-between h-full py-4 space-y-6 md:space-y-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {/* Quote Mark */}
              <div className="text-[var(--text-serif)] opacity-40">
                <Quote className="h-10 w-10 transform -scale-x-100" />
              </div>

              {/* Quote Statement */}
              <p className="text-theme-desc font-serif text-lg md:text-xl font-light italic leading-relaxed">
                "{activeTestimonial.quote || activeTestimonial.review}"
              </p>

              {/* Author Info */}
              <div className="space-y-1">
                <h4 className="font-serif text-xl font-bold text-theme-card-title">
                  {activeTestimonial.name}
                </h4>
                <p className="text-xs uppercase tracking-widest text-theme-title font-semibold">
                  {activeTestimonial.designation || activeTestimonial.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 pt-6 md:pt-10">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-theme-border bg-theme-card text-theme-title hover:border-[var(--text-serif)] hover:text-[var(--text-serif)] hover:shadow-[0_0_15px_rgba(197,168,128,0.15)] transition-all duration-300 group"
              title="Previous Review"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-theme-border bg-theme-card text-theme-title hover:border-[var(--text-serif)] hover:text-[var(--text-serif)] hover:shadow-[0_0_15px_rgba(197,168,128,0.15)] transition-all duration-300 group"
              title="Next Review"
            >
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Slide Index Indicators */}
            <span className="text-xs font-semibold text-theme-muted tracking-wider uppercase ml-2 select-none">
              {active + 1} / {testimonials.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
