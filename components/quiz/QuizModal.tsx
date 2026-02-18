// src/components/quiz/QuizModal.tsx
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Send, Clock, CheckCircle } from 'lucide-react';
import { Question, QuizConfig, UserAnswer } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import { quizColorsHex } from '@/util/quiz-colors';
import Lenis from 'lenis';

interface QuizModalProps {
  questions: Question[];
  config: QuizConfig;
  timeLimit: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: { answers: Map<number, UserAnswer>; totalTime: number }) => void;
}

// --- Sub Components ---

const TagButton = ({
  children,
  bgColor,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
  bgColor: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.05 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`text-black border-black border border-solid rounded-full px-3 h-9 
               transition-all flex justify-center items-center whitespace-nowrap 
               hover:rounded-[8px] duration-300 text-xs font-medium uppercase
               ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    style={{ backgroundColor: bgColor }}
  >
    {children}
  </motion.button>
);

const ActionButton = ({
  icon: Icon,
  onClick,
  disabled = false,
}: {
  icon: React.ElementType;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <motion.button
    whileHover={!disabled ? { scale: 1.1 } : {}}
    whileTap={!disabled ? { scale: 0.95 } : {}}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center w-9 h-9 border border-black border-solid rounded-full
               transition-colors ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
  >
    <Icon className="w-5 h-5" />
  </motion.button>
);

const OptionButton = ({
  label,
  text,
  isSelected,
  isCorrect,
  isWrong,
  showResult,
  bgColor,
  onClick,
  disabled,
  index,
}: {
  label: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  showResult: boolean;
  bgColor: string;
  onClick: () => void;
  disabled: boolean;
  index: number;
}) => {
  const getStyles = () => {
    if (showResult && isCorrect) {
      return {
        border: `2px solid ${quizColorsHex.correct.border}`,
        backgroundColor: quizColorsHex.correct.bg,
      };
    }
    if (showResult && isWrong) {
      return {
        border: `2px solid ${quizColorsHex.incorrect.border}`,
        backgroundColor: quizColorsHex.incorrect.bg,
      };
    }
    if (isSelected) {
      return {
        border: '2px solid black',
        backgroundColor: bgColor,
      };
    }
    return {
      border: '1px solid black',
      backgroundColor: bgColor,
    };
  };

  const styles = getStyles();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      whileHover={!disabled ? { scale: 1.02, x: 4 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl transition-all duration-300
                 flex items-center gap-4 text-left group
                 ${disabled && !showResult ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      style={styles}
    >
      <span
        className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold uppercase
                   border transition-colors`}
        style={{
          borderColor: showResult && isCorrect
            ? quizColorsHex.correct.border
            : showResult && isWrong
              ? quizColorsHex.incorrect.border
              : 'black',
          backgroundColor: isSelected ? 'black' : 'transparent',
          color: isSelected ? 'white' : 'black',
        }}
      >
        {label}
      </span>
      <span className="flex-1 text-black uppercase text-sm font-medium">{text}</span>
      {showResult && isCorrect && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: quizColorsHex.correct.solid }}
        >
          <CheckCircle className="w-4 h-4 text-white" />
        </motion.span>
      )}
      {showResult && isWrong && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: quizColorsHex.incorrect.solid }}
        >
          <X className="w-4 h-4 text-white" />
        </motion.span>
      )}
    </motion.button>
  );
};

const Timer = ({ timeRemaining, bgColor }: { timeRemaining: number; bgColor: string }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = timeRemaining <= 60;
  const isCritical = timeRemaining <= 30;

  const getTimerStyles = () => {
    if (isCritical) {
      return {
        backgroundColor: quizColorsHex.incorrect.bg,
        color: quizColorsHex.incorrect.text,
      };
    }
    if (isWarning) {
      return {
        backgroundColor: '#fef3c7', // amber-100
        color: '#92400e', // amber-800
      };
    }
    return {
      backgroundColor: bgColor,
      color: 'black',
    };
  };

  const timerStyles = getTimerStyles();

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: isCritical ? Infinity : 0, duration: 0.5 }}
      className="flex items-center gap-2 px-3 h-9 rounded-full border border-black"
      style={{ backgroundColor: timerStyles.backgroundColor }}
    >
      <Clock className="w-4 h-4" style={{ color: timerStyles.color }} />
      <span
        className="text-sm font-mono font-bold uppercase"
        style={{ color: timerStyles.color }}
      >
        {formatTime(timeRemaining)}
      </span>
    </motion.div>
  );
};

// Navigation Pill Component
const NavigationPill = ({
  index,
  questionId,
  isCurrent,
  answer,
  mode,
  onClick,
  bgColor,
}: {
  index: number;
  questionId: number;
  isCurrent: boolean;
  answer?: UserAnswer;
  mode: 'instant-feedback' | 'submit-all';
  onClick: () => void;
  bgColor: string;
}) => {
  const getStyles = () => {
    if (isCurrent) {
      return { backgroundColor: 'black', color: 'white' };
    }
    if (answer && mode === 'instant-feedback') {
      return {
        backgroundColor: answer.isCorrect
          ? quizColorsHex.answered.correct
          : quizColorsHex.answered.incorrect,
        color: 'black',
      };
    }
    if (answer) {
      return {
        backgroundColor: quizColorsHex.answered.neutral,
        color: 'black'
      };
    }
    return { backgroundColor: bgColor, color: 'black' };
  };

  const styles = getStyles();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.6 + index * 0.03 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="w-9 h-9 rounded-full border border-black text-sm font-bold uppercase transition-all duration-200"
      style={styles}
    >
      {index + 1}
    </motion.button>
  );
};

// --- Main Component ---

export function QuizModal({
  questions,
  config,
  timeLimit,
  isOpen,
  onClose,
  onComplete,
}: QuizModalProps) {
  const modalWrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const completedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answeredCount,
    timeRemaining,
    isCompleted,
    answers,
    answerQuestion,
    goToQuestion,
    goToNext,
    goToPrevious,
    submitQuiz,
    getAnswer,
    resetQuiz,
  } = useQuiz({
    questions,
    mode: config.mode,
    timeLimit,
    type: "personality"
  });

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

  // Handle completion
  useEffect(() => {
    if (isCompleted && !completedRef.current) {
      completedRef.current = true;
      const timer = setTimeout(() => {
        onComplete({
          answers: new Map(answers),
          totalTime: timeLimit - timeRemaining,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  // Reset completedRef when modal opens
  useEffect(() => {
    if (isOpen) {
      completedRef.current = false;
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

  const handleSubmit = useCallback(() => {
    submitQuiz();
  }, [submitQuiz]);

  const handleClose = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    resetQuiz();
    onClose();
  }, [resetQuiz, onClose]);

  if (!currentQuestion) return null;

  const currentAnswer = getAnswer(currentQuestion.id);
  const showResult = config.mode === 'instant-feedback' && currentAnswer !== undefined;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = answeredCount === totalQuestions;
  const optionLabels = ['A', 'B', 'C', 'D'];

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
              {/* Main Quiz Card */}
              <motion.div
                className="relative w-full max-w-[670px] min-h-[670px] rounded-2xl scroll-mt-64"
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
                        {config.title}
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

                    {/* Tags Row */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex gap-x-1 flex-wrap gap-y-2"
                    >
                      <Timer timeRemaining={timeRemaining} bgColor={config.color} />

                      <span
                        className="text-black border-black border border-solid rounded-full px-3 h-9 
                                   flex justify-center items-center text-xs font-medium uppercase"
                        style={{ backgroundColor: config.color }}
                      >
                        {currentQuestionIndex + 1} / {totalQuestions}
                      </span>

                      <span
                        className="text-black border-black border border-solid rounded-full px-3 h-9 
                                   flex justify-center items-center text-xs font-medium uppercase"
                        style={{ backgroundColor: config.color }}
                      >
                        {answeredCount} Answered
                      </span>
                    </motion.div>

                    {/* Question Navigation Pills */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex gap-1.5 flex-wrap"
                    >
                      {questions.map((q, index) => (
                        <NavigationPill
                          key={q.id}
                          index={index}
                          questionId={q.id}
                          isCurrent={index === currentQuestionIndex}
                          answer={answers.get(q.id)}
                          mode={config.mode}
                          onClick={() => goToQuestion(index)}
                          bgColor={config.color}
                        />
                      ))}
                    </motion.div>
                  </header>

                  {/* Question Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="space-y-6"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Category Badge */}
                        {currentQuestion.category && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center text-black border-black border border-solid rounded-full px-3 h-7 text-xs font-medium uppercase"
                            style={{ backgroundColor: config.color }}
                          >
                            {currentQuestion.category}
                          </motion.span>
                        )}

                        {/* Question Text */}
                        <motion.h2
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xl md:text-2xl font-semibold uppercase leading-relaxed text-black"
                        >
                          <span className="text-black/50">Q{currentQuestionIndex + 1}.</span>{' '}
                          {currentQuestion.question}
                        </motion.h2>

                        {/* Options */}
                        <div className="space-y-3">
                          {currentQuestion.options.map((option, index) => (
                            <OptionButton
                              key={index}
                              label={optionLabels[index]}
                              text={option}
                              isSelected={currentAnswer?.selectedAnswer === index}
                              isCorrect={showResult && index === currentQuestion.correctAnswer}
                              isWrong={showResult && currentAnswer?.selectedAnswer === index && index !== currentQuestion.correctAnswer}
                              showResult={showResult}
                              bgColor={config.color}
                              onClick={() => !showResult && answerQuestion(currentQuestion.id, index)}
                              disabled={showResult}
                              index={index}
                            />
                          ))}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                          {showResult && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div
                                className="p-4 rounded-xl border"
                                style={{
                                  backgroundColor: currentAnswer?.isCorrect
                                    ? `${quizColorsHex.correct.bg}80`
                                    : `${quizColorsHex.incorrect.bg}80`,
                                  borderColor: currentAnswer?.isCorrect
                                    ? quizColorsHex.correct.border
                                    : quizColorsHex.incorrect.border,
                                }}
                              >
                                <p
                                  className="text-sm font-bold uppercase mb-2"
                                  style={{
                                    color: currentAnswer?.isCorrect
                                      ? quizColorsHex.correct.text
                                      : quizColorsHex.incorrect.text,
                                  }}
                                >
                                  {currentAnswer?.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                                </p>
                                <p className="text-sm text-black/80 leading-relaxed">
                                  💡 {currentQuestion.explanation}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  {/* Navigation Footer */}
                  <motion.footer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-between items-center mt-8 pt-6 border-t border-black/20"
                  >
                    <div className="flex gap-2">
                      <ActionButton
                        icon={ChevronLeft}
                        onClick={goToPrevious}
                        disabled={currentQuestionIndex === 0}
                      />
                      <TagButton
                        bgColor={config.color}
                        onClick={goToPrevious}
                        disabled={currentQuestionIndex === 0}
                      >
                        Previous
                      </TagButton>
                    </div>

                    <div className="flex gap-2">
                      {isLastQuestion && config.mode === 'submit-all' ? (
                        <TagButton bgColor={config.color} onClick={handleSubmit}>
                          <Send className="w-4 h-4 mr-1" />
                          Submit
                        </TagButton>
                      ) : (
                        <>
                          <TagButton
                            bgColor={config.color}
                            onClick={goToNext}
                            disabled={isLastQuestion}
                          >
                            Next
                          </TagButton>
                          <ActionButton
                            icon={ChevronRight}
                            onClick={goToNext}
                            disabled={isLastQuestion}
                          />
                        </>
                      )}
                    </div>
                  </motion.footer>

                  {/* Submit for instant feedback when all answered */}
                  {config.mode === 'instant-feedback' && allAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex justify-center"
                    >
                      <TagButton bgColor={config.color} onClick={handleSubmit}>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        View Results
                      </TagButton>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <div className="mb-8" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}