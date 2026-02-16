'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Question, QuizMode } from '@/types/quiz';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswer: (answerIndex: number) => void;
  mode: QuizMode;
}

const optionLabels = ['A', 'B', 'C', 'D'];

const containerVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

export function QuizQuestion({
  question,
  questionNumber,
  selectedAnswer,
  showResult,
  onAnswer,
  mode,
}: QuizQuestionProps) {
  const getOptionStyle = (index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = index === question.correctAnswer;
    
    if (!showResult) {
      if (isSelected) {
        return "border-primary bg-primary/5 ring-2 ring-primary/20";
      }
      return "border-border bg-card hover:bg-accent hover:border-accent-foreground/20";
    }

    if (isCorrect) {
      return "border-success bg-success/50 ring-2 ring-success/20";
    }
    if (isSelected && !isCorrect) {
      return "border-destructive bg-destructive/10 ring-2 ring-destructive/20";
    }
    return "border-border bg-card opacity-50";
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      {/* Category */}
      {question.category && (
        <motion.div variants={itemVariants}>
          <Badge variant="outline" className="text-xs">
            {question.category}
          </Badge>
        </motion.div>
      )}

      {/* Question */}
      <motion.h2
        variants={itemVariants}
        className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed"
      >
        <span className="text-muted-foreground font-normal">
          {questionNumber}.
        </span>{' '}
        {question.question}
      </motion.h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          
          return (
            <motion.button
              key={index}
              variants={itemVariants}
              whileHover={!showResult ? { scale: 1.01, x: 4 } : {}}
              whileTap={!showResult ? { scale: 0.99 } : {}}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={() => !showResult && onAnswer(index)}
              disabled={showResult && mode === 'instant-feedback'}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all duration-200",
                "flex items-center gap-4 text-left group",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                getOptionStyle(index)
              )}
            >
              <span 
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold",
                  "transition-colors duration-200",
                  showResult && isCorrect
                    ? "bg-success text-success-foreground"
                    : showResult && isSelected && !isCorrect
                      ? "bg-destructive text-destructive-foreground"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground group-hover:bg-accent"
                )}
              >
                {optionLabels[index]}
              </span>
              
              <span className="flex-1 text-foreground">{option}</span>
              
              <AnimatePresence>
                {showResult && isCorrect && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </motion.div>
                )}
                {showResult && isSelected && !isCorrect && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <XCircle className="w-5 h-5 text-destructive" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 p-4 rounded-xl bg-chart-1/10 border border-chart-1/20">
              <Info className="w-5 h-5 text-chart-1 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-chart-1 mb-1">Explanation</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}