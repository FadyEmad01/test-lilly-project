'use client';

import { motion } from 'framer-motion';
import { Question, QuizMode, UserAnswer } from '@/types/quiz';
import { cn } from '@/lib/utils';

interface QuizNavigationProps {
  questions: Question[];
  currentIndex: number;
  answers: Map<number, UserAnswer>;
  mode: QuizMode;
  onNavigate: (index: number) => void;
}

export function QuizNavigation({
  questions,
  currentIndex,
  answers,
  mode,
  onNavigate,
}: QuizNavigationProps) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {questions.map((question, index) => {
        const answer = answers.get(question.id);
        const isCurrent = index === currentIndex;
        const isAnswered = answer !== undefined;
        
        return (
          <motion.button
            key={question.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={() => onNavigate(index)}
            className={cn(
              "relative w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200",
              "border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              isCurrent 
                ? "bg-primary text-primary-foreground border-primary" 
                : isAnswered
                  ? mode === 'instant-feedback'
                    ? answer.isCorrect
                      ? "bg-success/20 border-success/40 text-success"
                      : "bg-destructive/20 border-destructive/40 text-destructive"
                    : "bg-chart-1/20 border-chart-1/40 text-chart-1"
                  : "bg-secondary border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {index + 1}
            
            {isAnswered && !isCurrent && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={cn(
                  "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                  mode === 'instant-feedback'
                    ? answer.isCorrect
                      ? "bg-success"
                      : "bg-destructive"
                    : "bg-chart-1"
                )}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}