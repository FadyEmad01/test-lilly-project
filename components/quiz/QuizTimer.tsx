'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  timeRemaining: number;
  totalTime: number;
}

export function QuizTimer({ timeRemaining, totalTime }: QuizTimerProps) {
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    setIsWarning(timeRemaining <= 60 && timeRemaining > 30);
    setIsCritical(timeRemaining <= 30);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeRemaining / totalTime) * 100;
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      animate={isCritical ? { scale: [1, 1.02, 1] } : {}}
      transition={{ repeat: isCritical ? Infinity : 0, duration: 0.8 }}
      className={cn(
        "flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors duration-300",
        isCritical 
          ? "bg-destructive/10 border-destructive/30" 
          : isWarning 
            ? "bg-warning/10 border-warning/30" 
            : "bg-secondary border-border"
      )}
    >
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={cn(
              isCritical 
                ? "stroke-destructive" 
                : isWarning 
                  ? "stroke-warning" 
                  : "stroke-primary"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className={cn(
              "w-4 h-4",
              isCritical ? "text-destructive" : isWarning ? "text-warning" : "text-muted-foreground"
            )} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Time Left
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={timeRemaining}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "text-lg font-mono font-semibold tabular-nums",
              isCritical 
                ? "text-destructive" 
                : isWarning 
                  ? "text-warning" 
                  : "text-foreground"
            )}
          >
            {formatTime(timeRemaining)}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}