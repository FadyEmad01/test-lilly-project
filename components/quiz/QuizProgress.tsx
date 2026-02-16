'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
  current: number;
  total: number;
  answered: number;
  progress: number;
}

export function QuizProgress({ current, total, answered, progress }: QuizProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          Question{' '}
          <span className="text-foreground font-medium">{current}</span>
          {' '}of{' '}
          <span className="text-foreground font-medium">{total}</span>
        </span>
        <motion.span 
          key={answered}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="text-muted-foreground"
        >
          <span className="text-primary font-medium">{answered}</span> answered
        </motion.span>
      </div>
      
      <Progress value={progress} max={100} />
    </div>
  );
}