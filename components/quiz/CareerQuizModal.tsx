// src/components/quiz/CareerQuizModal.tsx
'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Send, Clock, Check } from 'lucide-react';
import { Question, QuizConfig, UserAnswer } from '@/types/quiz';
import { useQuiz } from '@/hooks/useQuiz';
import Lenis from 'lenis';

interface CareerQuizModalProps {
    questions: Question[];
    config: QuizConfig;
    timeLimit: number;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (results: { answers: Map<number, UserAnswer>; totalTime: number }) => void;
}

// Sub Components
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

// Personality Option Button - No right/wrong, just selection
const PersonalityOptionButton = ({
    label,
    text,
    isSelected,
    bgColor,
    onClick,
    index,
}: {
    label: string;
    text: string;
    isSelected: boolean;
    bgColor: string;
    onClick: () => void;
    index: number;
}) => {
    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.08 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full p-4 rounded-xl transition-all duration-300
                 flex items-center gap-4 text-left group cursor-pointer"
            style={{
                border: isSelected ? '2px solid black' : '1px solid black',
                backgroundColor: bgColor,
            }}
        >
            <span
                className="flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold uppercase
                   border border-black transition-colors"
                style={{
                    backgroundColor: isSelected ? 'black' : 'transparent',
                    color: isSelected ? 'white' : 'black',
                }}
            >
                {label}
            </span>
            <span className="flex-1 text-black uppercase text-sm font-medium">{text}</span>
            {isSelected && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-black flex items-center justify-center"
                >
                    <Check className="w-4 h-4 text-white" />
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

    return (
        <motion.div
            animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: isCritical ? Infinity : 0, duration: 0.5 }}
            className="flex items-center gap-2 px-3 h-9 rounded-full border border-black"
            style={{
                backgroundColor: isCritical ? '#fecaca' : isWarning ? '#fef3c7' : bgColor,
                color: isCritical ? '#b91c1c' : isWarning ? '#92400e' : 'black',
            }}
        >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono font-bold uppercase">
                {formatTime(timeRemaining)}
            </span>
        </motion.div>
    );
};

// Progress Bar Component
const ProgressBar = ({
    current,
    total,
    bgColor
}: {
    current: number;
    total: number;
    bgColor: string;
}) => {
    const percentage = ((current) / total) * 100;

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs text-black/60 mb-2">
                <span>{current} of {total} questions</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'black' }}
                />
            </div>
        </div>
    );
};

// Main Component
export function CareerQuizModal({
    questions,
    config,
    timeLimit,
    isOpen,
    onClose,
    onComplete,
}: CareerQuizModalProps) {
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
        type: config.type,
        timeLimit,
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

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = '';
            };
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
                                className="relative w-full max-w-[670px] min-h-[600px] rounded-2xl scroll-mt-64"
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
                                                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                                                className="text-2xl xl:text-4xl font-semibold uppercase text-ellipsis overflow-hidden line-clamp-2 text-black"
                                            >
                                                {config.title}
                                            </motion.h1>
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                transition={{ duration: 0.4, delay: 0.4 }}
                                                className="shrink-0 flex items-center justify-center w-9 h-9"
                                                onClick={handleClose}
                                            >
                                                <div className="flex items-center justify-center w-9 h-9 border border-black border-solid rounded-full hover:bg-black hover:text-white transition-colors">
                                                    <X className="w-6 h-6 text-black hover:text-white" />
                                                </div>
                                            </motion.button>
                                        </div>

                                        {/* Progress Section */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex gap-2 flex-wrap">
                                                <Timer timeRemaining={timeRemaining} bgColor={config.color} />
                                                <span
                                                    className="text-black border-black border border-solid rounded-full px-3 h-9 
                                     flex justify-center items-center text-xs font-medium uppercase"
                                                    style={{ backgroundColor: config.color }}
                                                >
                                                    {answeredCount} / {totalQuestions} Answered
                                                </span>
                                            </div>

                                            <ProgressBar
                                                current={answeredCount}
                                                total={totalQuestions}
                                                bgColor={config.color}
                                            />
                                        </motion.div>

                                        {/* Question Navigation Pills */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                            className="flex gap-1.5 flex-wrap"
                                        >
                                            {questions.map((q, index) => {
                                                const answer = answers.get(q.id);
                                                const isCurrent = index === currentQuestionIndex;
                                                const isAnswered = answer !== undefined;

                                                return (
                                                    <motion.button
                                                        key={q.id}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ duration: 0.3, delay: 0.6 + index * 0.02 }}
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => goToQuestion(index)}
                                                        className="w-8 h-8 rounded-full border border-black text-xs font-bold uppercase transition-all duration-200"
                                                        style={{
                                                            backgroundColor: isCurrent ? 'black' : isAnswered ? 'rgba(0,0,0,0.2)' : config.color,
                                                            color: isCurrent ? 'white' : 'black',
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </motion.button>
                                                );
                                            })}
                                        </motion.div>
                                    </header>

                                    {/* Question Content */}
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
                                                transition={{ delay: 0.1 }}
                                                className="text-xl md:text-2xl font-semibold uppercase leading-relaxed text-black"
                                            >
                                                <span className="text-black/50">Q{currentQuestionIndex + 1}.</span>{' '}
                                                {currentQuestion.question}
                                            </motion.h2>

                                            {/* Options */}
                                            <div className="space-y-3">
                                                {currentQuestion.options.map((option, index) => (
                                                    <PersonalityOptionButton
                                                        key={index}
                                                        label={optionLabels[index]}
                                                        text={option}
                                                        isSelected={currentAnswer?.selectedAnswer === index}
                                                        bgColor={config.color}
                                                        onClick={() => answerQuestion(currentQuestion.id, index)}
                                                        index={index}
                                                    />
                                                ))}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

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
                                            {allAnswered ? (
                                                <TagButton bgColor={config.color} onClick={handleSubmit}>
                                                    <Send className="w-4 h-4 mr-1" />
                                                    See Results
                                                </TagButton>
                                            ) : isLastQuestion ? (
                                                <TagButton bgColor={config.color} disabled>
                                                    Answer All Questions
                                                </TagButton>
                                            ) : (
                                                <>
                                                    <TagButton
                                                        bgColor={config.color}
                                                        onClick={goToNext}
                                                    >
                                                        Next
                                                    </TagButton>
                                                    <ActionButton
                                                        icon={ChevronRight}
                                                        onClick={goToNext}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </motion.footer>
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