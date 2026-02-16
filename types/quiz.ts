// export interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   explanation: string;
//   category?: string;
// }

// export interface UserAnswer {
//   questionId: number;
//   selectedAnswer: number | null;
//   isCorrect: boolean;
//   answeredAt?: number;
// }

// export type QuizMode = 'submit-all' | 'instant-feedback';

// export interface QuizState {
//   currentQuestionIndex: number;
//   answers: Map<number, UserAnswer>;
//   isCompleted: boolean;
//   startTime: number;
//   endTime?: number;
//   timeRemaining: number;
// }

// src/types/quiz.ts
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: number | null;
  isCorrect: boolean;
  answeredAt?: number;
}

export type QuizMode = 'instant-feedback' | 'submit-all';

export interface QuizConfig {
  mode: QuizMode;
  color: string;
  title: string;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Map<number, UserAnswer>;
  isCompleted: boolean;
  startTime: number;
  endTime?: number;
  timeRemaining: number;
}