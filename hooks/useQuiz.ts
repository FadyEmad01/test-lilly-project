// 'use client';

// import { useState, useCallback, useEffect, useRef } from 'react';
// import { Question, QuizMode, UserAnswer, QuizState } from '@/types/quiz';

// interface UseQuizProps {
//   questions: Question[];
//   mode: QuizMode;
//   timeLimit: number;
// }

// export function useQuiz({ questions, mode, timeLimit }: UseQuizProps) {
//   const [state, setState] = useState<QuizState>(() => ({
//     currentQuestionIndex: 0,
//     answers: new Map(),
//     isCompleted: false,
//     startTime: Date.now(),
//     timeRemaining: timeLimit,
//   }));

//   const timerRef = useRef<NodeJS.Timeout | null>(null);
//   const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

//   // Timer logic
//   useEffect(() => {
//     if (state.isCompleted || timeLimit <= 0) return;

//     timerRef.current = setInterval(() => {
//       setState((prev) => {
//         if (prev.isCompleted) return prev;
        
//         const newTimeRemaining = prev.timeRemaining - 1;
        
//         if (newTimeRemaining <= 0) {
//           if (timerRef.current) clearInterval(timerRef.current);
//           return {
//             ...prev,
//             timeRemaining: 0,
//             isCompleted: true,
//             endTime: Date.now(),
//           };
//         }
        
//         return { ...prev, timeRemaining: newTimeRemaining };
//       });
//     }, 1000);

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//     };
//   }, [state.isCompleted, timeLimit]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
//     };
//   }, []);

//   const currentQuestion = questions[state.currentQuestionIndex];

//   const goToNext = useCallback(() => {
//     setState((prev) => {
//       const nextIndex = prev.currentQuestionIndex + 1;
//       if (nextIndex >= questions.length) return prev;
//       return { ...prev, currentQuestionIndex: nextIndex };
//     });
//   }, [questions.length]);

//   const answerQuestion = useCallback((questionId: number, selectedAnswer: number) => {
//     const question = questions.find((q) => q.id === questionId);
//     if (!question) return;

//     const isCorrect = question.correctAnswer === selectedAnswer;
//     const userAnswer: UserAnswer = {
//       questionId,
//       selectedAnswer,
//       isCorrect,
//       answeredAt: Date.now(),
//     };

//     setState((prev) => {
//       const newAnswers = new Map(prev.answers);
//       newAnswers.set(questionId, userAnswer);
//       return { ...prev, answers: newAnswers };
//     });

//     if (mode === 'instant-feedback') {
//       if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
//       autoAdvanceRef.current = setTimeout(() => {
//         goToNext();
//       }, 2000);
//     }
//   }, [questions, mode, goToNext]);

//   const goToQuestion = useCallback((index: number) => {
//     if (index >= 0 && index < questions.length) {
//       if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
//       setState((prev) => ({ ...prev, currentQuestionIndex: index }));
//     }
//   }, [questions.length]);

//   const goToPrevious = useCallback(() => {
//     if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
//     setState((prev) => {
//       const prevIndex = prev.currentQuestionIndex - 1;
//       if (prevIndex < 0) return prev;
//       return { ...prev, currentQuestionIndex: prevIndex };
//     });
//   }, []);

//   const submitQuiz = useCallback(() => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//     if (autoAdvanceRef.current) {
//       clearTimeout(autoAdvanceRef.current);
//       autoAdvanceRef.current = null;
//     }
    
//     setState((prev) => ({
//       ...prev,
//       isCompleted: true,
//       endTime: Date.now(),
//     }));
//   }, []);

//   const resetQuiz = useCallback(() => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//     if (autoAdvanceRef.current) {
//       clearTimeout(autoAdvanceRef.current);
//       autoAdvanceRef.current = null;
//     }
    
//     setState({
//       currentQuestionIndex: 0,
//       answers: new Map(),
//       isCompleted: false,
//       startTime: Date.now(),
//       timeRemaining: timeLimit,
//     });
//   }, [timeLimit]);

//   const getAnswer = useCallback((questionId: number) => {
//     return state.answers.get(questionId);
//   }, [state.answers]);

//   const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;
//   const answeredCount = state.answers.size;
//   const correctCount = Array.from(state.answers.values()).filter((a) => a.isCorrect).length;

//   return {
//     state,
//     currentQuestion,
//     currentQuestionIndex: state.currentQuestionIndex,
//     totalQuestions: questions.length,
//     progress,
//     answeredCount,
//     correctCount,
//     timeRemaining: state.timeRemaining,
//     isCompleted: state.isCompleted,
//     answers: state.answers,
//     answerQuestion,
//     goToQuestion,
//     goToNext,
//     goToPrevious,
//     submitQuiz,
//     resetQuiz,
//     getAnswer,
//   };
// }

// src/hooks/useQuiz.ts
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Question, QuizMode, QuizType, UserAnswer, QuizState } from '@/types/quiz';

interface UseQuizProps {
  questions: Question[];
  mode: QuizMode;
  type: QuizType;
  timeLimit: number;
}

export function useQuiz({ questions, mode, type, timeLimit }: UseQuizProps) {
  const [state, setState] = useState<QuizState>(() => ({
    currentQuestionIndex: 0,
    answers: new Map(),
    isCompleted: false,
    startTime: Date.now(),
    timeRemaining: timeLimit,
  }));

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (state.isCompleted || timeLimit <= 0) return;

    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.isCompleted) return prev;
        
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          return {
            ...prev,
            timeRemaining: 0,
            isCompleted: true,
            endTime: Date.now(),
          };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isCompleted, timeLimit]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  const currentQuestion = questions[state.currentQuestionIndex];

  const goToNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentQuestionIndex + 1;
      if (nextIndex >= questions.length) return prev;
      return { ...prev, currentQuestionIndex: nextIndex };
    });
  }, [questions.length]);

  const answerQuestion = useCallback((questionId: number, selectedAnswer: number) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    // For personality quiz, there's no "correct" answer
    const isCorrect = type === 'personality' ? true : question.correctAnswer === selectedAnswer;
    
    const userAnswer: UserAnswer = {
      questionId,
      selectedAnswer,
      isCorrect,
      answeredAt: Date.now(),
    };

    setState((prev) => {
      const newAnswers = new Map(prev.answers);
      newAnswers.set(questionId, userAnswer);
      return { ...prev, answers: newAnswers };
    });

    // For personality quiz, auto-advance after selection
    if (type === 'personality') {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        goToNext();
      }, 500);
    } else if (mode === 'instant-feedback') {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = setTimeout(() => {
        goToNext();
      }, 2000);
    }
  }, [questions, mode, type, goToNext]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
      setState((prev) => ({ ...prev, currentQuestionIndex: index }));
    }
  }, [questions.length]);

  const goToPrevious = useCallback(() => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setState((prev) => {
      const prevIndex = prev.currentQuestionIndex - 1;
      if (prevIndex < 0) return prev;
      return { ...prev, currentQuestionIndex: prevIndex };
    });
  }, []);

  const submitQuiz = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    
    setState((prev) => ({
      ...prev,
      isCompleted: true,
      endTime: Date.now(),
    }));
  }, []);

  const resetQuiz = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    
    setState({
      currentQuestionIndex: 0,
      answers: new Map(),
      isCompleted: false,
      startTime: Date.now(),
      timeRemaining: timeLimit,
    });
  }, [timeLimit]);

  const getAnswer = useCallback((questionId: number) => {
    return state.answers.get(questionId);
  }, [state.answers]);

  const progress = ((state.currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = state.answers.size;
  const correctCount = Array.from(state.answers.values()).filter((a) => a.isCorrect).length;

  return {
    state,
    currentQuestion,
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: questions.length,
    progress,
    answeredCount,
    correctCount,
    timeRemaining: state.timeRemaining,
    isCompleted: state.isCompleted,
    answers: state.answers,
    answerQuestion,
    goToQuestion,
    goToNext,
    goToPrevious,
    submitQuiz,
    resetQuiz,
    getAnswer,
  };
}