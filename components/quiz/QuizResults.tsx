// src/components/quiz/QuizResults.tsx
'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, CheckCircle, XCircle, Clock, Target, ChevronDown } from 'lucide-react';
import { Question, QuizConfig, UserAnswer } from '@/types/quiz';
import { quizColorsHex } from '@/util/quiz-colors';
import Lenis from 'lenis';

interface QuizResultsProps {
  questions: Question[];
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

// Stat Card Component
const StatCard = ({
  icon: Icon,
  label,
  value,
  type,
  bgColor,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  type: 'correct' | 'incorrect' | 'neutral';
  bgColor: string;
  delay: number;
}) => {
  const getStyles = () => {
    switch (type) {
      case 'correct':
        return {
          backgroundColor: quizColorsHex.correct.bg,
          iconColor: quizColorsHex.correct.solid,
          borderColor: quizColorsHex.correct.border,
        };
      case 'incorrect':
        return {
          backgroundColor: quizColorsHex.incorrect.bg,
          iconColor: quizColorsHex.incorrect.solid,
          borderColor: quizColorsHex.incorrect.border,
        };
      default:
        return {
          backgroundColor: bgColor,
          iconColor: 'black',
          borderColor: 'rgba(0,0,0,0.2)',
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-4 rounded-xl border flex flex-col items-center gap-2"
      style={{ 
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
      }}
    >
      <Icon className="w-5 h-5" style={{ color: styles.iconColor }} />
      <span className="text-xs uppercase text-black/60">{label}</span>
      <span className="text-xl font-bold text-black">{value}</span>
    </motion.div>
  );
};

// Question Review Card
const QuestionReviewCard = ({
  question,
  answer,
  index,
  delay,
}: {
  question: Question;
  answer?: UserAnswer;
  index: number;
  delay: number;
}) => {
  const isCorrect = answer?.isCorrect ?? false;
  const selectedAnswer = answer?.selectedAnswer;
  const optionLabels = ['A', 'B', 'C', 'D'];

  const cardStyles = {
    borderColor: isCorrect ? quizColorsHex.correct.border : quizColorsHex.incorrect.border,
    backgroundColor: isCorrect ? quizColorsHex.correct.bg : quizColorsHex.incorrect.bg,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="p-4 rounded-xl border-2"
      style={cardStyles}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: isCorrect ? quizColorsHex.correct.solid : quizColorsHex.incorrect.solid }}
        >
          {isCorrect ? (
            <CheckCircle className="w-4 h-4 text-white" />
          ) : (
            <XCircle className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-black uppercase text-sm mb-3">
            Q{index + 1}. {question.question}
          </h3>
          <div className="space-y-2 mb-3">
            {question.options.map((option, optIndex) => {
              const isCorrectOption = optIndex === question.correctAnswer;
              const isSelectedWrong = selectedAnswer === optIndex && !isCorrectOption;

              const getOptionStyles = () => {
                if (isCorrectOption) {
                  return {
                    backgroundColor: quizColorsHex.correct.bg,
                    borderColor: quizColorsHex.correct.border,
                  };
                }
                if (isSelectedWrong) {
                  return {
                    backgroundColor: quizColorsHex.incorrect.bg,
                    borderColor: quizColorsHex.incorrect.border,
                  };
                }
                return {
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderColor: 'transparent',
                };
              };

              const optionStyles = getOptionStyles();

              return (
                <div
                  key={optIndex}
                  className="p-2 rounded-lg text-sm flex items-center gap-2 border"
                  style={optionStyles}
                >
                  <span 
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold border"
                    style={{ 
                      borderColor: isCorrectOption 
                        ? quizColorsHex.correct.border 
                        : isSelectedWrong 
                          ? quizColorsHex.incorrect.border 
                          : 'rgba(0,0,0,0.2)',
                      backgroundColor: isCorrectOption 
                        ? quizColorsHex.correct.solid 
                        : isSelectedWrong 
                          ? quizColorsHex.incorrect.solid 
                          : 'transparent',
                      color: (isCorrectOption || isSelectedWrong) ? 'white' : 'black',
                    }}
                  >
                    {optionLabels[optIndex]}
                  </span>
                  <span className="flex-1 uppercase text-xs">{option}</span>
                  {isCorrectOption && (
                    <CheckCircle 
                      className="w-4 h-4" 
                      style={{ color: quizColorsHex.correct.solid }} 
                    />
                  )}
                  {isSelectedWrong && (
                    <XCircle 
                      className="w-4 h-4" 
                      style={{ color: quizColorsHex.incorrect.solid }} 
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div 
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: isCorrect 
                ? `${quizColorsHex.correct.bg}80` 
                : `${quizColorsHex.incorrect.bg}80`,
              borderColor: isCorrect 
                ? quizColorsHex.correct.border 
                : quizColorsHex.incorrect.border,
            }}
          >
            <p className="text-xs font-bold uppercase mb-1">💡 Explanation</p>
            <p className="text-xs text-black/70 leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function QuizResults({
  questions,
  answers,
  totalTime,
  config,
  isOpen,
  onClose,
  onRestart,
}: QuizResultsProps) {
  const modalWrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const correctCount = Array.from(answers.values()).filter((a) => a.isCorrect).length;
  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGradeInfo = () => {
    if (percentage >= 90) return { grade: 'A+', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', message: 'Good Job!' };
    if (percentage >= 60) return { grade: 'C', message: 'Not Bad!' };
    if (percentage >= 50) return { grade: 'D', message: 'Keep Trying!' };
    return { grade: 'F', message: 'Try Again!' };
  };

  const gradeInfo = getGradeInfo();

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
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

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
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    setShowDetails(false);
    onRestart();
  }, [onRestart]);

  const circumference = 2 * Math.PI * 54;

  // Score circle color based on percentage
  const getScoreColor = () => {
    if (percentage >= 70) return quizColorsHex.correct.solid;
    if (percentage >= 50) return '#d97706'; // amber
    return quizColorsHex.incorrect.solid;
  };

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
                duration: 0.6,
              }}
              className="flex flex-col justify-center items-center relative w-auto"
            >
              {/* Results Card */}
              <motion.div
                className="relative w-full max-w-[670px] min-h-[500px] rounded-2xl scroll-mt-64"
                style={{ backgroundColor: config.color }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-3 sm:p-8">
                  {/* Header */}
                  <header className="flex flex-col gap-y-3.5 mb-8">
                    <div className="flex justify-between gap-x-3.5">
                      <motion.h1
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                        className="text-2xl xl:text-4xl font-semibold uppercase text-ellipsis overflow-hidden line-clamp-2 text-black"
                      >
                        Quiz Complete
                      </motion.h1>
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="shrink-0 flex items-center justify-center w-9 h-9"
                        type="button"
                        onClick={handleClose}
                      >
                        <div className="flex items-center justify-center w-9 h-9 border border-black border-solid rounded-full hover:bg-black hover:text-white transition-colors">
                          <X className="w-6 h-6 text-black hover:text-white" />
                        </div>
                      </motion.button>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex gap-x-1"
                    >
                      <span
                        className="text-black border-black border border-solid rounded-full px-3 h-9 
                                   flex justify-center items-center text-xs font-medium uppercase"
                        style={{ backgroundColor: config.color }}
                      >
                        {config.title}
                      </span>
                    </motion.div>
                  </header>

                  {/* Score Circle */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', delay: 0.4 }}
                    className="flex flex-col items-center mb-8"
                  >
                    <div className="relative w-40 h-40">
                      <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="rgba(0,0,0,0.1)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke={getScoreColor()}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
                          transition={{ duration: 1.5, delay: 0.6 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                          className="text-4xl font-bold"
                          style={{ color: getScoreColor() }}
                        >
                          {percentage}%
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.2 }}
                          className="text-sm uppercase font-medium text-black/60"
                        >
                          {gradeInfo.message}
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Stats Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
                  >
                    <StatCard
                      icon={CheckCircle}
                      label="Correct"
                      value={correctCount}
                      type="correct"
                      bgColor={config.color}
                      delay={0.9}
                    />
                    <StatCard
                      icon={XCircle}
                      label="Wrong"
                      value={totalQuestions - correctCount}
                      type="incorrect"
                      bgColor={config.color}
                      delay={1.0}
                    />
                    <StatCard
                      icon={Target}
                      label="Total"
                      value={totalQuestions}
                      type="neutral"
                      bgColor={config.color}
                      delay={1.1}
                    />
                    <StatCard
                      icon={Clock}
                      label="Time"
                      value={formatTime(totalTime)}
                      type="neutral"
                      bgColor={config.color}
                      delay={1.2}
                    />
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-wrap gap-3 justify-center"
                  >
                    <TagButton bgColor={config.color} onClick={() => setShowDetails(!showDetails)}>
                      {showDetails ? 'Hide' : 'View'} Details
                      <motion.span animate={{ rotate: showDetails ? 180 : 0 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.span>
                    </TagButton>
                    <TagButton bgColor={config.color} onClick={handleRestart}>
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </TagButton>
                  </motion.div>
                </div>
              </motion.div>

              {/* Detailed Results */}
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
                    <div className="py-3.5 md:py-7.5">
                      <h4 className="text-lg font-semibold uppercase ml-3.5 md:ml-7.5 mb-3.5">
                        Detailed Review
                      </h4>
                      <div className="px-3.5 md:px-7.5 space-y-4">
                        {questions.map((question, index) => (
                          <QuestionReviewCard
                            key={question.id}
                            question={question}
                            answer={answers.get(question.id)}
                            index={index}
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