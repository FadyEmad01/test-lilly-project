// src/components/quiz/CareerQuiz.tsx
'use client';

import { useState, useCallback } from 'react';
import { Question, QuizConfig, UserAnswer } from '@/types/quiz';
import { QuizModeSelector } from './QuizModeSelector';
import { CareerQuizModal } from './CareerQuizModal';
import { CareerResults } from './CareerResults';

interface CareerQuizProps {
  questions: Question[];
  timeLimit?: number;
  title?: string;
}

interface QuizResultData {
  answers: Map<number, UserAnswer>;
  totalTime: number;
}

export function CareerQuiz({ questions, timeLimit = 600, title = 'Career Quiz' }: CareerQuizProps) {
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [resultData, setResultData] = useState<QuizResultData | null>(null);

  const handleSelectMode = useCallback((selectedConfig: QuizConfig) => {
    setConfig(selectedConfig);
    setIsQuizOpen(true);
  }, []);

  const handleQuizClose = useCallback(() => {
    setIsQuizOpen(false);
    setTimeout(() => {
      setConfig(null);
    }, 300);
  }, []);

  const handleQuizComplete = useCallback((data: QuizResultData) => {
    setResultData(data);
    setIsQuizOpen(false);
    setTimeout(() => {
      setIsResultsOpen(true);
    }, 350);
  }, []);

  const handleResultsClose = useCallback(() => {
    setIsResultsOpen(false);
    setTimeout(() => {
      setResultData(null);
      setConfig(null);
    }, 300);
  }, []);

  const handleRestart = useCallback(() => {
    setIsResultsOpen(false);
    setResultData(null);
    setTimeout(() => {
      setConfig(null);
    }, 300);
  }, []);

  return (
    <>
      <QuizModeSelector
        onSelectMode={handleSelectMode}
        title={title}
        questionCount={questions.length}
        timeLimit={timeLimit}
        quizType="personality"
      />

      {config && (
        <CareerQuizModal
          questions={questions}
          config={config}
          timeLimit={timeLimit}
          isOpen={isQuizOpen}
          onClose={handleQuizClose}
          onComplete={handleQuizComplete}
        />
      )}

      {config && resultData && (
        <CareerResults
          answers={resultData.answers}
          totalTime={resultData.totalTime}
          config={config}
          isOpen={isResultsOpen}
          onClose={handleResultsClose}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}