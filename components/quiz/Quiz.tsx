// // 'use client';

// // import { useState } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { Question, QuizMode } from '@/types/quiz';
// // import { useQuiz } from '@/hooks/useQuiz';
// // import { QuizQuestion } from './QuizQuestion';
// // import { QuizTimer } from './QuizTimer';
// // import { QuizProgress } from './QuizProgress';
// // import { QuizNavigation } from './QuizNavigation';
// // import { QuizResults } from './QuizResults';
// // import { QuizModeSelector } from './QuizModeSelector';
// // import { Button } from '@/components/ui/button';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { ChevronLeft, ChevronRight, Send, CheckCircle2 } from 'lucide-react';

// // interface QuizProps {
// //   questions: Question[];
// //   timeLimit?: number;
// //   title?: string;
// // }

// // export function Quiz({ questions, timeLimit = 300, title = "Quiz" }: QuizProps) {
// //   const [mode, setMode] = useState<QuizMode | null>(null);

// //   if (!mode) {
// //     return (
// //       <QuizModeSelector
// //         onSelectMode={setMode}
// //         title={title}
// //         questionCount={questions.length}
// //         timeLimit={timeLimit}
// //       />
// //     );
// //   }

// //   return (
// //     <QuizContent
// //       questions={questions}
// //       mode={mode}
// //       timeLimit={timeLimit}
// //       title={title}
// //       onReset={() => setMode(null)}
// //     />
// //   );
// // }

// // interface QuizContentProps {
// //   questions: Question[];
// //   mode: QuizMode;
// //   timeLimit: number;
// //   title: string;
// //   onReset: () => void;
// // }

// // function QuizContent({ questions, mode, timeLimit, title, onReset }: QuizContentProps) {
// //   const {
// //     currentQuestion,
// //     currentQuestionIndex,
// //     totalQuestions,
// //     progress,
// //     answeredCount,
// //     timeRemaining,
// //     isCompleted,
// //     answers,
// //     answerQuestion,
// //     goToQuestion,
// //     goToNext,
// //     goToPrevious,
// //     submitQuiz,
// //     resetQuiz,
// //     getAnswer,
// //   } = useQuiz({
// //     questions,
// //     mode,
// //     timeLimit,
// //   });

// //   const handleReset = () => {
// //     resetQuiz();
// //     onReset();
// //   };

// //   if (isCompleted) {
// //     return (
// //       <QuizResults
// //         questions={questions}
// //         answers={answers}
// //         totalTime={timeLimit - timeRemaining}
// //         onRestart={handleReset}
// //       />
// //     );
// //   }

// //   const currentAnswer = getAnswer(currentQuestion.id);
// //   const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
// //   const allAnswered = answeredCount === totalQuestions;

// //   return (
// //     <div className="min-h-screen bg-background p-4 md:p-8">
// //       <motion.div
// //         initial={{ opacity: 0 }}
// //         animate={{ opacity: 1 }}
// //         className="max-w-3xl mx-auto space-y-6"
// //       >
// //         {/* Header */}
// //         <Card>
// //           <CardContent className="p-6 space-y-6">
// //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //               <div>
// //                 <h1 className="text-xl font-semibold text-foreground">{title}</h1>
// //                 <div className="flex items-center gap-2 mt-1">
// //                   <Badge variant="outline" className="text-xs">
// //                     {mode === 'instant-feedback' ? 'Learn Mode' : 'Test Mode'}
// //                   </Badge>
// //                 </div>
// //               </div>
// //               <QuizTimer timeRemaining={timeRemaining} totalTime={timeLimit} />
// //             </div>
            
// //             <QuizProgress
// //               current={currentQuestionIndex + 1}
// //               total={totalQuestions}
// //               answered={answeredCount}
// //               progress={progress}
// //             />
// //           </CardContent>
// //         </Card>

// //         {/* Navigation Pills */}
// //         <QuizNavigation
// //           questions={questions}
// //           currentIndex={currentQuestionIndex}
// //           answers={answers}
// //           mode={mode}
// //           onNavigate={goToQuestion}
// //         />

// //         {/* Question Card */}
// //         <Card>
// //           <CardContent className="p-6">
// //             <AnimatePresence mode="wait">
// //               <QuizQuestion
// //                 key={currentQuestion.id}
// //                 question={currentQuestion}
// //                 questionNumber={currentQuestionIndex + 1}
// //                 selectedAnswer={currentAnswer?.selectedAnswer ?? null}
// //                 showResult={mode === 'instant-feedback' && currentAnswer !== undefined}
// //                 onAnswer={(answer) => answerQuestion(currentQuestion.id, answer)}
// //                 mode={mode}
// //               />
// //             </AnimatePresence>
// //           </CardContent>
// //         </Card>

// //         {/* Navigation */}
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.2 }}
// //           className="flex justify-between items-center"
// //         >
// //           <Button
// //             variant="outline"
// //             onClick={goToPrevious}
// //             disabled={currentQuestionIndex === 0}
// //             className="gap-2"
// //           >
// //             <ChevronLeft className="w-4 h-4" />
// //             Previous
// //           </Button>

// //           <div className="flex gap-3">
// //             {isLastQuestion && mode === 'submit-all' ? (
// //               <Button 
// //                 onClick={submitQuiz} 
// //                 variant="success"
// //                 className="gap-2"
// //               >
// //                 <Send className="w-4 h-4" />
// //                 Submit Quiz
// //               </Button>
// //             ) : (
// //               <Button
// //                 onClick={goToNext}
// //                 disabled={isLastQuestion}
// //                 className="gap-2"
// //               >
// //                 Next
// //                 <ChevronRight className="w-4 h-4" />
// //               </Button>
// //             )}
// //           </div>
// //         </motion.div>

// //         {/* Submit for instant feedback when all answered */}
// //         {mode === 'instant-feedback' && allAnswered && (
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="flex justify-center"
// //           >
// //             <Button onClick={submitQuiz} size="lg" className="gap-2">
// //               <CheckCircle2 className="w-5 h-5" />
// //               View Final Results
// //             </Button>
// //           </motion.div>
// //         )}
// //       </motion.div>
// //     </div>
// //   );
// // }


// // src/components/quiz/Quiz.tsx
// 'use client';

// import { useState } from 'react';
// import { Question, QuizConfig, UserAnswer } from '@/types/quiz';
// import { QuizModeSelector } from './QuizModeSelector';
// import { QuizModal } from './QuizModal';
// import { QuizResults } from './QuizResults';

// interface QuizProps {
//   questions: Question[];
//   timeLimit?: number;
//   title?: string;
// }

// interface QuizResultData {
//   answers: Map<number, UserAnswer>;
//   totalTime: number;
// }

// export function Quiz({ questions, timeLimit = 300, title = 'Quiz' }: QuizProps) {
//   const [config, setConfig] = useState<QuizConfig | null>(null);
//   const [isQuizOpen, setIsQuizOpen] = useState(false);
//   const [isResultsOpen, setIsResultsOpen] = useState(false);
//   const [resultData, setResultData] = useState<QuizResultData | null>(null);

//   const handleSelectMode = (selectedConfig: QuizConfig) => {
//     setConfig(selectedConfig);
//     setIsQuizOpen(true);
//   };

//   const handleQuizClose = () => {
//     setIsQuizOpen(false);
//   };

//   const handleQuizComplete = (data: QuizResultData) => {
//     setResultData(data);
//     setIsQuizOpen(false);
//     setTimeout(() => {
//       setIsResultsOpen(true);
//     }, 300);
//   };

//   const handleResultsClose = () => {
//     setIsResultsOpen(false);
//   };

//   const handleRestart = () => {
//     setIsResultsOpen(false);
//     setResultData(null);
//     setConfig(null);
//   };

//   return (
//     <>
//       {/* Mode Selector - Always visible as the base */}
//       <QuizModeSelector
//         onSelectMode={handleSelectMode}
//         title={title}
//         questionCount={questions.length}
//         timeLimit={timeLimit}
//       />

//       {/* Quiz Modal */}
//       {config && (
//         <QuizModal
//           questions={questions}
//           config={config}
//           timeLimit={timeLimit}
//           isOpen={isQuizOpen}
//           onClose={handleQuizClose}
//           onComplete={handleQuizComplete}
//         />
//       )}

//       {/* Results Modal */}
//       {config && resultData && (
//         <QuizResults
//           questions={questions}
//           answers={resultData.answers}
//           totalTime={resultData.totalTime}
//           config={config}
//           isOpen={isResultsOpen}
//           onClose={handleResultsClose}
//           onRestart={handleRestart}
//         />
//       )}
//     </>
//   );
// }

// src/components/quiz/Quiz.tsx
'use client';

import { useState, useCallback } from 'react';
import { Question, QuizConfig, UserAnswer } from '@/types/quiz';
import { QuizModeSelector } from './QuizModeSelector';
import { QuizModal } from './QuizModal';
import { QuizResults } from './QuizResults';

interface QuizProps {
  questions: Question[];
  timeLimit?: number;
  title?: string;
}

interface QuizResultData {
  answers: Map<number, UserAnswer>;
  totalTime: number;
}

export function Quiz({ questions, timeLimit = 300, title = 'Quiz' }: QuizProps) {
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
    // Reset to mode selector
    setTimeout(() => {
      setConfig(null);
    }, 300);
  }, []);

  const handleQuizComplete = useCallback((data: QuizResultData) => {
    setResultData(data);
    setIsQuizOpen(false);
    // Open results after quiz closes
    setTimeout(() => {
      setIsResultsOpen(true);
    }, 350);
  }, []);

  const handleResultsClose = useCallback(() => {
    setIsResultsOpen(false);
    // Reset everything
    setTimeout(() => {
      setResultData(null);
      setConfig(null);
    }, 300);
  }, []);

  const handleRestart = useCallback(() => {
    setIsResultsOpen(false);
    setResultData(null);
    // Reset to mode selector
    setTimeout(() => {
      setConfig(null);
    }, 300);
  }, []);

  return (
    <>
      {/* Mode Selector - Always visible as the base */}
      <QuizModeSelector
        onSelectMode={handleSelectMode}
        title={title}
        questionCount={questions.length}
        timeLimit={timeLimit}
      />

      {/* Quiz Modal */}
      {config && (
        <QuizModal
          questions={questions}
          config={config}
          timeLimit={timeLimit}
          isOpen={isQuizOpen}
          onClose={handleQuizClose}
          onComplete={handleQuizComplete}
        />
      )}

      {/* Results Modal */}
      {config && resultData && (
        <QuizResults
          questions={questions}
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