// // export interface Question {
// //   id: number;
// //   question: string;
// //   options: string[];
// //   correctAnswer: number;
// //   explanation: string;
// //   category?: string;
// // }

// // export interface UserAnswer {
// //   questionId: number;
// //   selectedAnswer: number | null;
// //   isCorrect: boolean;
// //   answeredAt?: number;
// // }

// // export type QuizMode = 'submit-all' | 'instant-feedback';

// // export interface QuizState {
// //   currentQuestionIndex: number;
// //   answers: Map<number, UserAnswer>;
// //   isCompleted: boolean;
// //   startTime: number;
// //   endTime?: number;
// //   timeRemaining: number;
// // }

// // src/types/quiz.ts
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

// export type QuizMode = 'instant-feedback' | 'submit-all';

// export interface QuizConfig {
//   mode: QuizMode;
//   color: string;
//   title: string;
// }

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
  correctAnswer: number; // Not used for personality quiz
  explanation: string;
  category?: string;
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: number | null;
  isCorrect: boolean; // Not relevant for personality quiz
  answeredAt?: number;
}

export type QuizMode = 'instant-feedback' | 'submit-all';
export type QuizType = 'knowledge' | 'personality';

export interface QuizConfig {
  mode: QuizMode;
  color: string;
  title: string;
  type: QuizType;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Map<number, UserAnswer>;
  isCompleted: boolean;
  startTime: number;
  endTime?: number;
  timeRemaining: number;
}

// Career/Personality Profile Types
export interface CareerProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  careers: string[];
  majors: string[];
  traits: string[];
}

export interface QuizResult {
  answers: Map<number, UserAnswer>;
  totalTime: number;
  profile?: CareerProfile;
  scores?: Record<string, number>;
}