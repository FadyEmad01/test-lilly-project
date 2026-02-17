// src/components/quiz/CareerResults.tsx
'use client';

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Briefcase, GraduationCap, Sparkles, ChevronDown } from 'lucide-react';
import { QuizConfig, UserAnswer } from '@/types/quiz';
import { calculateCareerProfile, careerProfiles } from '@/constants/CAREER-PROFILES';
import Lenis from 'lenis';

interface CareerResultsProps {
  answers: Map<number, UserAnswer>;
  totalTime: number;
  config: QuizConfig;
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

const TagButton = ({
  children,
  bgColor,
  onClick,
}: {
  children: React.ReactNode;
  bgColor: string;
  onClick?: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="text-black border-black border border-solid rounded-full px-4 h-9 
               transition-all flex justify-center items-center whitespace-nowrap 
               hover:rounded-[8px] duration-300 text-xs font-medium uppercase gap-1.5"
    style={{ backgroundColor: bgColor }}
  >
    {children}
  </motion.button>
);

// Profile Score Bar
const ProfileScoreBar = ({
  profile,
  percentage,
  isTop,
  delay,
}: {
  profile: typeof careerProfiles[keyof typeof careerProfiles];
  percentage: number;
  isTop: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className={`p-4 rounded-xl border ${isTop ? 'border-2 border-black' : 'border-black/20'}`}
    style={{ backgroundColor: isTop ? profile.color : `${profile.color}40` }}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{profile.icon}</span>
        <span className="font-bold uppercase text-sm">{profile.name}</span>
      </div>
      <span className="font-bold text-lg">{percentage}%</span>
    </div>
    <div className="h-2 bg-black/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
        className="h-full rounded-full bg-black"
      />
    </div>
  </motion.div>
);

export function CareerResults({
  answers,
  totalTime,
  config,
  isOpen,
  onClose,
  onRestart,
}: CareerResultsProps) {
  const modalWrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const { profile, percentages } = calculateCareerProfile(answers);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Sort profiles by percentage
  const sortedProfiles = Object.entries(careerProfiles)
    .map(([id, p]) => ({ ...p, percentage: percentages[id] || 0 }))
    .sort((a, b) => b.percentage - a.percentage);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Lenis smooth scroll setup
  useEffect(() => {
    if (isOpen && modalWrapperRef.current) {
      const lenis = new Lenis({
        wrapper: modalWrapperRef.current,
        content: modalWrapperRef.current.children[0] as HTMLElement,
      });
      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      }
      rafIdRef.current = requestAnimationFrame(raf);

      return () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        lenis.destroy();
        lenisRef.current = null;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleClose = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setShowDetails(false);
    onClose();
  }, [onClose]);

  const handleRestart = useCallback(() => {
    setShowDetails(false);
    onRestart();
  }, [onRestart]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          ref={modalWrapperRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 w-full overflow-y-auto min-h-screen z-50 pt-24 md:pt-32 backdrop-blur-3xl"
          onClick={handleClose}
        >
          <div className="relative w-full max-w-full mx-auto px-6 xl:px-8 text-black">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className="flex flex-col justify-center items-center relative w-auto"
            >
              {/* Results Card */}
              <motion.div
                className="relative w-full max-w-[670px] rounded-2xl"
                style={{ backgroundColor: profile.color }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 sm:p-8">
                  {/* Header */}
                  <header className="flex justify-between items-start gap-x-3.5 mb-6">
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-2xl xl:text-4xl font-bold uppercase text-black"
                    >
                      Your Result
                    </motion.h1>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="shrink-0 w-9 h-9"
                      onClick={handleClose}
                    >
                      <div className="w-9 h-9 border border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                      </div>
                    </motion.button>
                  </header>

                  {/* Main Profile Result */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-center mb-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                      className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-black/10 flex items-center justify-center"
                    >
                      <span className="text-5xl">{profile.icon}</span>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-3xl md:text-4xl font-bold uppercase mb-2"
                    >
                      {profile.name}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-sm md:text-base text-black/70 max-w-md mx-auto leading-relaxed"
                    >
                      {profile.description}
                    </motion.p>
                  </motion.div>

                  {/* Traits */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-8"
                  >
                    <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Your Key Traits
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.traits.map((trait, index) => (
                        <motion.span
                          key={trait}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.05 }}
                          className="px-3 py-1.5 rounded-full border border-black text-xs font-medium uppercase"
                          style={{ backgroundColor: profile.color }}
                        >
                          {trait}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recommended Careers */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mb-8"
                  >
                    <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Recommended Careers
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.careers.map((career, index) => (
                        <motion.span
                          key={career}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.0 + index * 0.03 }}
                          className="px-3 py-1.5 rounded-full bg-black/10 border border-black/20 text-xs font-medium uppercase"
                        >
                          {career}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recommended Majors */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="mb-8"
                  >
                    <h3 className="text-sm font-bold uppercase mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Recommended Majors
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.majors.map((major, index) => (
                        <motion.span
                          key={major}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.03 }}
                          className="px-3 py-1.5 rounded-full bg-black/10 border border-black/20 text-xs font-medium uppercase"
                        >
                          {major}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  {/* Time Taken */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="text-center text-xs text-black/50 mb-6"
                  >
                    Completed in {formatTime(totalTime)}
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    className="flex flex-wrap gap-3 justify-center"
                  >
                    <TagButton bgColor={profile.color} onClick={() => setShowDetails(!showDetails)}>
                      {showDetails ? 'Hide' : 'View'} All Profiles
                      <motion.span animate={{ rotate: showDetails ? 180 : 0 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </TagButton>
                    <TagButton bgColor={profile.color} onClick={handleRestart}>
                      <RotateCcw className="w-4 h-4" />
                      Take Again
                    </TagButton>
                  </motion.div>
                </div>
              </motion.div>

              {/* All Profiles Breakdown */}
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-[670px] rounded-2xl mt-7 overflow-hidden"
                    style={{ backgroundColor: config.color }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <h4 className="text-lg font-bold uppercase mb-4">
                        Your Profile Breakdown
                      </h4>
                      <div className="space-y-3">
                        {sortedProfiles.map((p, index) => (
                          <ProfileScoreBar
                            key={p.id}
                            profile={p}
                            percentage={p.percentage}
                            isTop={index === 0}
                            delay={index * 0.1}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mb-8" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}